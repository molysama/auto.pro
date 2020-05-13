'use strict';

import { Plugin, isRoot, scale, width, height, pauseable, getPrototype } from '@auto.pro/core'
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
const Bezier = require('bezier-js')

/**
 * 根据坐标进行点击，若坐标不存在则啥都不做
 * @param {number} x 要点击的横坐标
 * @param {number} y 要点击的纵坐标
 * @param {[number, number]} delay 点击后的等待延迟，默认是[600, 800]，600-800毫秒
 * @param { number } randomOffsetX 随机x轴偏差，默认0
 * @param { number } randomOffsetY 随机y轴偏差，默认0
 */
export let click: (x: number, y: number, delay?: [number, number] | [600, 800], randomOffsetX?: number, randomOffsetY?: number) => any

/**
 * 根据坐标进行点击，并按设置的标准分辨率进行适配
 */
export let clickRes: (x: number, y: number, delay?: [number, number] | [600, 800], randomOffsetX?: number, randomOffsetY?: number) => any

export let clickOP: (x: number, y: number, delay?: [number, number] | [600, 800], randomOffsetX?: number, randomOffsetY?: number) => (source) => Observable<[number, number]>

/**
 * 根据给定的两个点进行滑动，root模式直接使用两点滑动，无障碍模式下使用贝塞尔曲线
 * @param {[number, number]} startPoint 起点
 * @param {[number, number]} endPoint 终点
 * @param {number} duration 滑动时间，默认随机800-1000毫秒，并根据两点距离进行调整
 */
export let swipe: (startPoint: [number, number], endPoint: [number, number], duration?: number) => any

function setAction() {

    swipe = (startPoint: [number, number], endPoint: [number, number], duration?: number) => {
        const x1 = startPoint[0]
        const y1 = startPoint[1]
        const x2 = endPoint[0]
        const y2 = endPoint[1]
        const xMax = Math.max(x1, x2)
        const xMin = Math.min(x1, x2)
        const yMax = Math.max(y1, y2)
        const yMin = Math.min(y1, y2)

        // duration 距离成正比，每100px加100毫秒
        duration = duration || random(800, 1000)
        duration += Math.max(xMax - xMin, yMax - yMin)

        if (isRoot) {
            Swipe(x1, y1, x2, y2, duration)
            sleep(duration)
            return
        }

        const c1 = [
            Math.floor((xMax - xMin) / 3 + xMin) - random(5, 10),
            Math.floor((yMax - yMin) / 3 + yMin) + random(5, 10)
        ]
        const c2 = [
            Math.floor((xMax - xMin) / 3 * 2 + xMin) + random(5, 10),
            Math.floor((yMax - yMin) / 3 * 2 + yMin) - random(5, 10)
        ]

        const curve = new Bezier(...startPoint, ...endPoint, ...c1, ...c2)
        const points = curve.getLUT(16).map(p => [Math.floor(p['x']), Math.floor(p['y'])])
        gesture(duration, ...points)
    }
    click = (x: number, y: number, delay: [number, number] = [600, 800], randomOffsetX: number = 0, randomOffsetY: number = 0) => {
        if (x == null || y == null) {
            return
        }
        let currentX = x + randomOffsetX * Math.random()
        let currentY = y + randomOffsetY * Math.random()

        // 保留一位小数
        currentX = Math.round(Math.max(0, Math.min(currentX, width)) * 10) / 10
        currentY = Math.round(Math.max(0, Math.min(currentY, height)) * 10) / 10

        if (isRoot) {
            Tap(currentX, currentY)
            sleep(300)
        } else {
            press(currentX, currentY, random(...delay))
        }
    }
    clickRes = (x: number, y: number, delay: [number, number] = [600, 800], randomOffsetX: number = 0, randomOffsetY: number = 0) => {
        click(x * scale, y * scale, delay, randomOffsetX, randomOffsetY)
    }
    clickOP = (x: number | Array<any>, y: number, delay: [number, number] = [600, 800], randomOffsetX: number = 0, randomOffsetY: number = 0) => {
        return source => source.pipe(
            pauseable(),
            map((pt) => {
                if (x == null && getPrototype(pt) === 'Array') {
                    click(...(pt as [number, number, [number, number], number, number]))
                    return pt
                } else if (getPrototype(x) === 'Array') {
                    click(...(x as [number, number, [number, number], number, number]))
                    return [x, y, delay, randomOffsetX, randomOffsetY]
                } else if (x != null) {
                    click(x as number, y, delay, randomOffsetX, randomOffsetY)
                    return [x, y, delay, randomOffsetX, randomOffsetY]
                } else {
                    return of(null)
                }
            })
        )
    }
}

const Action: Plugin = {
    install(option = {}) {
        setAction()
    }
}

export default Action
