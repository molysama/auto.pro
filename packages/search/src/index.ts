import 'es6-shim'
import { throwError, of, timer, Observable, defer, from } from 'rxjs'
import { map, filter, take, tap, exhaustMap, finalize, distinct, toArray, switchMap } from 'rxjs/operators'

import {Plugin, cap, scale, width, height, isPause, getPrototype, getTime} from '@auto.pro/core'

declare const FastFeatureDetector
declare const MatOfKeyPoint

importClass(org.opencv.core.MatOfKeyPoint)
importClass(org.opencv.features2d.FastFeatureDetector)

const cache: Record<string, ColorCache> = {}
const colorCache: Record<string, any> = {}

function getMatches (template) {
    var gray = images.grayscale(template)

    var sift = FastFeatureDetector.create()
    var keyPoints = new MatOfKeyPoint()
    sift.detect(gray.mat, keyPoints)

    gray.recycle()

    let result: any[] = []
    const ks: [] = keyPoints.toArray()
    for(let i=0; i<ks.length && i <= 6; i++) {
        result.push(ks[i]['pt'])
    }
    // result = [
    //     ...result,
    //     {x: template.width / 4, y: template.height / 4},
    //     {x: template.width / 2, y: template.height / 4},
    //     {x: template.width * 3 / 4, y: template.height / 4},

    //     {x: template.width / 4, y: template.height / 2},
    //     {x: template.width / 2, y: template.height / 2},
    //     {x: template.width * 3 / 4, y: template.height / 2},

    //     {x: template.width / 4, y: template.height * 3 / 4},
    //     {x: template.width / 2, y: template.height * 3 / 4},
    //     {x: template.width * 3 / 4, y: template.height * 3 / 4}
    // ]

    return result.map(({x, y}) => {
        // 先取色，后对坐标进行伸缩
        let color = images.pixel(template, x, y)
        x = Math.floor(x * scale)
        y = Math.floor(y * scale)
        return {
            x,
            y,
            color
        }

    })
}

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

/**
 * 获取指定路径的Image对象，若已是Image则不重复获取
 * @param {string | Image} imgPath 图片路径
 * @param {number | undefined} mode 获取模式，若为0则返回灰度图像
 * @returns {Image | null}
 */
export function readImg (imgPath: Image | string, mode?: number) {
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

interface ColorCache {
    headColor?: any,
    body?: Array<{
        x: number,
        y: number,
        color: any
    }>,
    region: Array<any>
}

declare const util

function matchByColor (img, option: ColorCache, threshold=10) {

    let headX = option.region[0]
    let headY = option.region[1]
    let headColor = option.headColor

    let body = option.body

    let bitmap = img.getBitmap()
    let w = bitmap.getWidth()
    let h = bitmap.getHeight()
    let pixels = util.java.array("int", w * h)
    bitmap.getPixels(pixels, 0, w, 0, 0, w, h)

    if (colors.isSimilar(headColor, pixels[headX + headY * w], threshold)) {
        let t1 = getTime()
        const found = body && body.every(b => {
            return colors.isSimilar(b.color, pixels[headX + b.x + w * (headY + b.y)], threshold)
        })
        console.log(`found color cost ${getTime() - t1}`)
        if (found) {
            return [
                {
                    point: {
                        x: headX,
                        y: headY
                    }
                }
            ]
        } else {
            return []
        }
    } else {
        return []
    }
}

/**
 * 找图函数，此函数为异步函数！
 * @param {string} path 待查图片路径
 * @param {object} option 查询参数
 * @param {number} index 取范围内的第几个结果，值从1开始，设置该值后将转换返回值为该index的坐标或null
 * @param {object} useCache 缓存配置
 * @param {number} eachTime 找图定时器的间隔，默认为100(ms)
 * @param {number} nextTime 匹配到图片后，下一次匹配的间隔，默认为0(ms)
 * @param {boolean} once 是否只找一次，该值为true时直接返回本次匹配结果
 * @param {number} take 期望匹配到几次结果，默认为1
 * @param {function} doIfNotFound 本次未匹配到图片时将执行的函数
 * @param {Image} image 提供预截图，设置此值后，将只查询1次并返回匹配结果
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
    eachTime?: number
    nextTime?: number
    once?: boolean
    take?: number
    doIfNotFound?: Function
    image?: Image,
}): Observable<any> {
    return defer(() => {
        const path = param.path || ''

        if (!path) {
            return throwError('path为空')
        }

        const option = param.option || {}
        const index = param.index

        const useCache = param.useCache
        const cachePath = useCache && (path + (useCache.key || '__CACHE__')) || null
        const cacheOffset = useCache && useCache.offset || 0

        const eachTime = param.eachTime || 100
        const nextTime = param.nextTime || 0
        const DO_IF_NOT_FOUND = param.doIfNotFound
        const image = param.image || null

        // 是否只找一次，无论是否找到都返回结果，默认false
        // 如果提供了截图cap，则只找一次
        const ONCE = image ? true : param.once
        const TAKE_NUM = ONCE ? 1 : param.take === undefined ? 1 : param.take || 99999999
        const queryOption = { ...option }

        let template, scaleTemplate

        queryOption.threshold = queryOption.threshold || 0.8

        // 如果该图片已经缓存成色点，则不需要再读取图片，并可直接获得缓存的region
        if (cachePath && cache[cachePath]) {
            queryOption.region = cache[cachePath]
        }

        // 若无缓存，则需要读取图片，并校对region参数
        if (!(cachePath && cache[cachePath] && index)) {
            template = readImg(path)
            if (!template) {
                return throwError('template path is null')
            }

            scaleTemplate = images.scale(template, scale, scale)

            if (queryOption.region) {
                let region = queryOption.region || [0, 0]
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
        }

        let isPass = true
        let t: any
        return timer(0, eachTime).pipe(
            filter(() => !isPause && isPass),
            exhaustMap(() => {
                let t1 = getTime()
                let match
                let colorCache = cachePath && cache[cachePath]
                // 如果已经存在缓存，且指定了index，则使用找色
                if (colorCache && index) {
                    match = matchByColor(image || cap(), colorCache)
                // 否则使用模板匹配
                } else {
                    match = images.matchTemplate(image || cap(), scaleTemplate, queryOption).matches
                }
                if (match.length == 0 && DO_IF_NOT_FOUND) {
                    DO_IF_NOT_FOUND()
                }
                let t2 = getTime()
                if (match.length > 0) {
                    console.log(`-------------${colorCache && index ? 'color' : 'image'} match cost ${t2 - t1}`)
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

                    const cacheRegion: [number, number, number, number] = region([
                        Math.min(...xArray) - cacheOffset,
                        Math.min(...yArray) - cacheOffset,
                        Math.max(...xArray) + scaleTemplate.width + 1 + cacheOffset * 2,
                        Math.max(...yArray) + scaleTemplate.height + 1 + cacheOffset * 2
                    ])
                    // 如果指定了index，则将模板转换为特征点，并保存颜色、坐标、区域
                    if (index) {
                        cache[cachePath] = {
                            headColor: images.pixel(template, 0, 0),
                            // 使用的是未经过裁剪的模板图片，因此结果应该进行scale处理
                            body: getMatches(template),
                            region: [...cacheRegion]
                        }
                    // 如果不指定index，则指保存区域
                    } else {
                        cache[cachePath] = {
                            region: [...cacheRegion]
                        }
                    }
                    queryOption.region = [...cacheRegion]
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
            tap(v => {
                if (v && nextTime && isPass) {
                    isPass = false
                    t = setTimeout(function(){
                        isPass = true
                    }, nextTime)
                }
            }),
            finalize(() => {
                if (t) {
                    clearTimeout(t)
                }
                if (template) {
                    template.recycle()
                }
                if (scaleTemplate) {
                    scaleTemplate.recycle()
                }
            })
        )
    })

}

/**
 * (精确查找)
 * 判断区域内是否不含有colors中的任意一个，不含有则返回true，含有则返回false
 * 
 * @param {string | Image} image     图源，若为字符串则自动回收内存
 * @param {Array} region    查找范围
 * @param {Array<Color>} colors    待查颜色数组 
 */
export function noAnyColors (image: Image, region: [] = [], colors: [] = []) {
    let src = readImg(image)
    let result = !colors.some(c => {
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
 * (精确查找)
 * 区域内含有colors中的全部颜色时，返回true，否则返回false
 * 
 * @param {string | Image} image     图源，若为字符串则自动回收内存
 * @param {Array} region 范围
 * @param {Array<Color>} colors 待查颜色数组
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
 * @param {string | Image} image 图源，若为字符串则自动回收内存
 * @param {Array<Color>} colors 待查颜色数组
 * @param {{
 *      threshold: 10,
 *      region: []
 * }} option 查找参数
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