'use strict';

import { height, isRoot, pausable, scale, width, getPrototype } from '@auto.pro/core';
import { tap, switchMap, delay } from 'rxjs/operators';
import { Observable, timer, of } from 'rxjs';
const Bezier = require('bezier-js')

export const clickPt = isRoot ?
    (x, y) => Tap(x, y) :
    (x, y) => press(x, y, Math.floor(Math.random() * 150) + 250)

/**
 * 根据给定的两个点进行滑动，root模式直接使用两点滑动，无障碍模式下使用贝塞尔曲线
 * @param {[number, number]} startPoint 起点
 * @param {[number, number]} endPoint 终点
 * @param {number} duration 滑动时间，默认随机800-1000毫秒，并根据两点距离进行调整
 */
export const swipe = (duration?: number, startPoint?: [number, number], endPoint?: [number, number], isPausable = true) => (source: Observable<any>) => source.pipe(
    pausable(isPausable, true),
    switchMap((v: any) => {

        startPoint = startPoint || v[0] as [number, number]
        endPoint = endPoint || v[1] as [number, number]

        const x1 = startPoint[0]
        const y1 = startPoint[1]
        const x2 = endPoint[0]
        const y2 = endPoint[1]
        const xMax = Math.max(x1, x2)
        const xMin = Math.min(x1, x2)
        const yMax = Math.max(y1, y2)
        const yMin = Math.min(y1, y2)

        duration = duration || random(400, 500)
        duration += Math.max(xMax - xMin, yMax - yMin)

        if (isRoot) {
            Swipe(x1, y1, x2, y2, duration)
            return of(v).pipe(
                delay(duration)
            )
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
        return of(v)
    })
)


/**
 * 根据坐标进行点击，若坐标不存在则啥都不做
 * @param {number} x 要点击的横坐标，缺省的话将点击流的值
 * @param {number} y 要点击的纵坐标，缺省的话将点击流的值
 * @param {[number, number]} delay 点击后的等待延迟，默认是[600, 800]，600-800毫秒
 * @param { number } randomOffsetX 随机x轴偏差，默认0
 * @param { number } randomOffsetY 随机y轴偏差，默认0
 */
export const click = (randomOffsetX: number = 0, randomOffsetY: number = 0, x?: number, y?: number, useScale = false, isPausable = true) => (source: Observable<any>) => source.pipe(
    pausable(isPausable, true),
    switchMap((pt: any) => {

        if (!x && !y && !pt) {
            return of(pt)
        }

        let currentX = x || pt[0]
        let currentY = y || pt[1]

        if (currentX && currentY) {
            currentX = Math.round(Math.max(0, Math.min(currentX + Math.random() * randomOffsetX, width)) * 10) / 10
            currentY = Math.round(Math.max(0, Math.min(currentY + Math.random() * randomOffsetY, height)) * 10) / 10
            useScale ? clickPt(currentX * scale, currentY * scale) : clickPt(currentX, currentY)
        }

        if (isRoot) {
            return of(pt).pipe(
                delay(500)
            )
        } else {
            return of(pt)
        }
    })
)