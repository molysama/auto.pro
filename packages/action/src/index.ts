'use strict';

import { Plugin, isRoot, isPause} from '@auto.pro/core'
const Bezier = require('bezier-js')

export let click: (x: number, y: number, delay?: [number, number] | [600, 800]) => any
export let swipe: (startPoint: [number, number], endPoint: [number, number], duration?: number) => any

function setAction () {

    swipe = (startPoint: [number, number], endPoint: [number, number], duration: number | undefined) => {
        while (isPause) {}
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
    click = (x: number, y: number, delay: [number, number] = [600, 800]) => {
        while (isPause) {}
        if (x == null || y == null) {
            return
        }
        if (isRoot) {
            Tap(x, y)
            sleep(300)
        } else {
            press(x, y, random(...delay))
        }
    }
}

const Action: Plugin = {
    install (option={}) {
        setAction()
    }
}

export default Action
