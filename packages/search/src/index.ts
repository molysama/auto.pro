
import { throwError, of, BehaviorSubject, timer, NEVER, Observable, defer } from 'rxjs'
import { map, filter, take, tap, exhaustMap, finalize, withLatestFrom, switchMap, startWith, delay } from 'rxjs/operators'

import {Plugin, cap, scale, width, height, isPause} from '@auto.pro/core'

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
    } else if (param.length == 2) {
        return [
            Math.min(Math.max(0, param[0]), width),
            Math.min(Math.max(0, param[1]), height)
        ]
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

function readImg (imgPath: Image | string, mode?: number) {
    while (isPause) {}
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
 * @param {number} index 取范围内的第几个结果，值从1开始，设置该值后将转换返回值为该index的坐标或null
 * @param {string|boolean} useCache 缓存名，false则不使用缓存
 * @returns {Observable<[[number, number] | [number, number] | null]>}
 */
export function findImg (param: {
    path: string
    option: any
    index?: number
    useCache?: {
        key: string,
        offset: number,
    },
    eachTime: number
    nextTime?: number
    once?: boolean
    take?: number
    doIfNotFound?: Function
    image?: Image
}): Observable<[[number, number] | [number, number] | null]> {
    return defer(() => {
        const path = param.path || ''
        const option = param.option || {}
        const index = param.index

        const useCache = param.useCache
        const cachePath = useCache && (path + useCache.key || '__cache__') || null
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
            filter(() => isPause !== true),
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
                let result = res.map(p => {
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

                // 如果设置了取第几个
                if (index != undefined) {
                    // 如果从缓存里找，则只判断索引0
                    if (cachePath && cache[cachePath]) {
                        result = result.length > 0 ? [result[0]] : []
                    } else {
                        // 如果还未设置缓存，则取第index-1个，没有则返回空数组
                        result = result.length >= index ? [result[index - 1]] : []
                    }
                }
                return result
            }),
            tap(res => {
                // 如果有结果，且确认要缓存
                if (res && res.length > 0 && useCache && cachePath && !cache[cachePath]) {

                    const xArray = res.map(e => e[0])
                    const yArray = res.map(e => e[1])

                    cache[cachePath] = region([
                        Math.min(...xArray) - cacheOffset,
                        Math.min(...yArray) - cacheOffset,
                        Math.max(...xArray) + template.width + cacheOffset * 2,
                        Math.max(...yArray) + template.height + cacheOffset * 2
                    ])
                    queryOption.region = cache[cachePath]
                }
                if (nextTime) {
                    pass$ && pass$.next(false)
                }
            }),
            map(res => {
                let result
                // 如果设置了取第几个，则对最后结果进行处理，有结果则直接返回索引0的值，无结果则返回null
                if (index != undefined) {
                    result = res.length > 0 ? res[0] : null
                } else {
                    result = res
                }
                return result
            }),
            // 如果没有设置ONCE，且设置了index，则对最终结果进行过滤
            filter(v => {
                if (!ONCE && index != undefined) {
                    return v
                } else {
                    return true
                }
            }),
            finalize(() => {
                template.recycle()
                pass$ && pass$.complete()
            })
        )
    })

}

/**
 * (精确查找)
 * 判断区域内是否不含有colors中的任意一个，不含有则返回true，含有则返回false
 * 
 * @param {Image} image     图源
 * @param {Array} region    查找范围
 * @param {Array} colors    待查颜色数组 
 */
export function noAnyColors (image: Image, region: [] = [], colors: [] = []) {
    let src = readImg(image)
    let result = !colors.some(c => {
        if (images.findColorInRegion(src, c, ...region)) {
            return true
        } else {
            return false
        }
    })
    if (getPrototype(image) === 'String') {
        src.recycle()
    }
    return result
}

/**
 * (精确查找)
 * 区域内含有colors中的全部颜色时，返回true，否则返回false
 * 
 * @param image 图源
 * @param region 范围
 * @param colors 待查颜色数组
 */
export function hasMulColors(image: Image | string, region: [] = [], colors: [] = []) {
    let src = readImg(image)
    let result = colors.every(c => {
        if (images.findColorEquals(src, c, ...region)) {
            return true
        } else {
            return false
        }
    })
    if (getPrototype(image) === 'String') {
        src.recycle()
    }
    return result
}

/**
 * 存在任意颜色，则返回颜色坐标，否则返回false
 * 
 * @param image 
 * @param colors 
 * @param option 
 * @returns {[number, number] | false}
 */
export function hasAnyColors(image: Image | string, colors: [] = [], option = {
    threshold: 10
}): ([number, number] | false) {
    let result: [number, number] | false = false
    let src = readImg(image)
    colors.some(c => {
        let has = images.findColor(src, c, option)
        if (has) {
            result = [has['x'], has['y']]
            return true
        } else {
            return false
        }
    })
    if (getPrototype(image) === 'String') {
        src.recycle()
    }
    return result
}


const SearchPlugin: Plugin = {
    install (option: any) {
    } 
}

export default SearchPlugin