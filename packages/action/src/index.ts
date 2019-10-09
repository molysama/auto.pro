'use strict';

import { App, Plugin, InjectionKey, inject } from '@auto.pro/core'
import bezier from './bezier'

type ClickFunction = (x: number, y: number, delay?: [number, number] | [600, 800]) => any
type SwipeFunction = (startPoint: [number, number], endPoint: [number, number], duration?: number) => any
type CapFunction = (path?: string) => any

function click (isRoot: boolean): ClickFunction {
    return (x: number, y: number, delay: [number, number] = [600, 800]) => {
        if (isRoot) {
            Tap(x, y)
            sleep(300)
        } else {
            press(x, y, random(...delay))
        }
    }
}
function swipe (isRoot: boolean): SwipeFunction {
    return (startPoint: [number, number], endPoint: [number, number], duration: number | undefined) => {
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

        const points = bezier.getBezierPoints(50, startPoint, c1, c2, endPoint)
        // 根据方向来排序坐标
        gesture(duration, ...points)
    }
}
function cap (): CapFunction {
    return (path?: string) => {
        if (path) {
            return captureScreen(path)
        } else {
            return captureScreen()
        }
    }
}

export function useAction () {
    return {
        click: inject(clickKey) as ClickFunction,
        cap: inject(capKey) as CapFunction,
        swipe: inject(swipeKey) as SwipeFunction
    }
}

const clickKey: InjectionKey<ClickFunction> = Symbol()
const capKey: InjectionKey<CapFunction> = Symbol()
const swipeKey: InjectionKey<SwipeFunction> = Symbol()

const Action: Plugin = {
    install (app: App) {
        const isRoot = app.isRoot || false
        app.provide(clickKey, click(isRoot))
        app.provide(capKey, cap())
        app.provide(swipeKey, swipe(isRoot))
    }
}

export default Action
