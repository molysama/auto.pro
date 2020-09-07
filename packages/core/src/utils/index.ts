import { effectEvent } from ".."
import uuidjs from 'uuid-js'
import { fromEvent } from "rxjs"
import { share } from "rxjs/operators"

export function converToArray(list: any, start?: number): Array<any> {
    start = start || 0
    let i = list.length - start
    const ret: Array<any> = new Array(i)
    while (i--) {
        ret[i] = list[i + start]
    }
    return ret
}

export const isFunction = (val: any): val is Function => typeof val === 'function'

export function getTime() {
    return android.os.SystemClock.uptimeMillis()
}

/**
 * 将ui事件转化成作业线程事件
 * @param target 
 * @param eventName 
 */
export function fromUiEvent(target: any, eventName) {
    const eventId = uuidjs.create(4).toString()
    target.on(eventName, (...params) => {
        effectEvent.emit(eventId, ...params)
    })

    return fromEvent(effectEvent, eventId).pipe(
        share()
    )
}

/**
 * 获取对象的原型
 * Java对象直接返回Java类名，如'Image'、'Point'
 * JS对象返回对应的原型，如 'Null' 'Undefined' 'String' 'Number' 'Function' 'Boolean' 'Array'
 * @param obj 要获取原型的对象
 * @returns {string}
 */
export function getPrototype(obj: any): string {
    const prototype = Object.prototype.toString.call(obj)
    if (prototype == '[object JavaObject]') {
        return obj.getClass().getSimpleName()
    } else {
        return prototype.substring(prototype.indexOf(' ') + 1, prototype.indexOf(']'))
    }
}