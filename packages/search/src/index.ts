
import { throwError, of, BehaviorSubject, timer, NEVER, Observable } from 'rxjs'
import { map, filter, take, tap, exhaustMap, finalize, withLatestFrom, switchMap, startWith, delay } from 'rxjs/operators'

import {CapFunction, inject, Plugin, Core} from '@auto.pro/core'

let width: number
let height: number
let scale: number
let cap: CapFunction

const cache: Record<string, any> = {}

/**
 * 将坐标转换成region类型，即[x1, y1, x2, y2] -> [x, y, w, h]，并做好边界处理
 * @param param 
 */
function region (param: any) {
    if (param.length == 4) {
        const x = Math.max(0, param[0])
        const y = Math.max(0, param[1])
        let w = param[2] - x
        let h = param[3] - y
        w = x + w >= width ? width - x : w
        h = y + h >= height ? height - y : h
        return [x, y, w, h]
    } else {
        return param
    }
}


function getPrototype (obj: any) {
    if (obj == undefined) {
        return null
    }

    const prototype = Object.prototype.toString.call(obj)
    if (prototype == '[object JavaObject]') {
        return obj.getClass().getSimpleName()
    } else {
        return prototype.substring(prototype.indexOf(' ') + 1, prototype.indexOf(']'))
    }
}

function readImg (imgPath: string, mode?: number) {
    if (!imgPath) {
        return null
    }

    let result
    if (getPrototype(imgPath) != 'String') {
        result = imgPath
    } else {
        result = images.read(imgPath)
    }

    if (mode === 0) {
        result = images.grayscale(result)
    }

    return result
}


/**
 * 
 * @param {string} path 待查图片路径
 * @param {object} option 查询参数
 * @param {string|boolean} useCache 缓存名，false则不使用缓存
 */
export function findImg (param: {
    path: string
    option: any
    useCache?: {
        key: string,
        offset: number,
        index: number | 'all'
    },
    eachTime: number
    nextTime?: number
    once?: boolean
    take?: number
    doIfNotFound?: Function
    image?: Image
}): Observable<[[number, number]]> {
    const path = param.path || ''
    const option = param.option || {}

    const useCache = param.useCache
    const cachePath = useCache && (useCache.key || '__cache__') || null
    const cacheOffset = useCache && useCache.offset || 2

    const eachTime = param.eachTime || 100
    const nextTime = param.nextTime
    const DO_IF_NOT_FOUND = param.doIfNotFound
    const image = param.image || null

    // 是否只找一次，无论是否找到都返回结果，默认false
    // 如果提供了截图cap，则只找一次
    const ONCE = image ? true : param.once
    const TAKE_NUM = ONCE ? 1 : param.take === undefined ? 1 : param.take || 99999999

    let template = readImg(path)
    if (!template) {
        return throwError('template path is null')
    }

    template = images.scale(template, scale, scale)

    let queryOption = { ...option }
    queryOption.threshold = queryOption.threshold || 0.8

    // 如果确认使用缓存，且缓存里已经设置有region的话，直接赋值
    if (cachePath && cache[cachePath]) {
        queryOption.region = cache[cachePath]
    } else if (queryOption.region) {
        let region = queryOption.region
        if (region[0] < 0) {
            region[0] = 0
        }
        if (region[1] < 0) {
            region[1] = 0
        }
        if (region.length == 4) {
            let x = region[0] + region[2]
            let y = region[1] + region[3]
            if (x > width) {
                region[2] = width - region[0]
            }
            if (y > height) {
                region[3] = height - region[1]
            }
        }
        queryOption.region = region
    }

    let pass$ = image ? null : new BehaviorSubject(true)

    const image$ = image ? of(image) : timer(0, eachTime).pipe(
        withLatestFrom(pass$ && pass$.pipe(
            switchMap(v => {
                if (v) {
                    return of(v)
                } else {
                    return of(true).pipe(
                        delay(nextTime || 500),
                        startWith(false)
                    )
                }
            })
        ) || of(true)),
        filter((v: any) => v[1]),
        map(() => cap())
    )

    return image$.pipe(
        exhaustMap(src => {
            let match = images.matchTemplate(src, template, queryOption).matches
            if (match.length == 0 && DO_IF_NOT_FOUND) {
                DO_IF_NOT_FOUND()
            }
            return of(match)
        }),
        take(ONCE ? 1 : 99999999),
        filter(v => ONCE ? true : v.length > 0),
        take(TAKE_NUM),
        map(res => {
            return res.map(p => {
                return [
                    Math.floor(p.point['x']),
                    Math.floor(p.point['y'])
                ]
            }).sort((a, b) => {
                let absY = Math.abs(a[1] - b[1])
                let absX = Math.abs(a[0] - b[0])
                if (absY > 4 && a[1] > b[1]) {
                    return true
                }
                else if (absY < 4) {
                    return absX > 4 && a[0] > b[0]
                } else {
                    return false
                }
            })
        }),
        tap(res => {
            // 如果有结果，且确认要缓存
            // 若指定了index为数字，则将对应的结果存入缓存
            // 若指定了index为'all'，则将所有结果范围内的边界作为缓存
            // 若指定了useCache，但没指定index，则index为0
            if (res && res.length > 0 && useCache && cachePath && !cache[cachePath]) {

                useCache.index = useCache.index || 0

                let cacheRegion

                if (typeof useCache.index == 'number' && res.length > useCache.index) {
                    cacheRegion = region([
                        res[useCache.index][0] - cacheOffset,
                        res[useCache.index][1] - cacheOffset,
                        res[useCache.index][0] + template.width + cacheOffset * 2,
                        res[useCache.index][1] + template.height + cacheOffset * 2
                    ])

                } else if (useCache.index === 'all') {

                    if (res.length == 0) {
                        cacheRegion = region([
                            res[0][0] - cacheOffset,
                            res[0][1] - cacheOffset,
                            res[0][1] + template.width + cacheOffset * 2,
                            res[0][1] + template.height + cacheOffset * 2
                        ])
                    } else {
                        const xArray = res.map(e => e[0])
                        const yArray = res.map(e => e[1])
                        cacheRegion = region([
                            Math.min(...xArray) - cacheOffset,
                            Math.min(...yArray) - cacheOffset,
                            Math.max(...xArray) + template.width + cacheOffset * 2,
                            Math.max(...yArray) + template.height + cacheOffset * 2
                        ])
                    }

                }
                cache[cachePath] = cacheRegion
                queryOption.region = cache[cachePath]
            }
            if (nextTime) {
                pass$ && pass$.next(false)
            }
        }),
        finalize(() => {
            template.recycle()
            pass$ && pass$.complete()
        })
    )


}

export function useSearch () {
    return {
        readImg,
        findImg
    }
}


const SearchPlugin: Plugin = {
    install (core: Core, option: any = {
        baseWidth: 1280,
        baseHeight: 720
    }) {
        const baseWidth = option.baseWidth || 1280
        const baseHeight = option.baseHeight || 720

        width = core.width
        height = core.height
        scale = Math.min(core.width / baseWidth, core.height / baseHeight)
        cap = core.cap
    } 
}

export default SearchPlugin