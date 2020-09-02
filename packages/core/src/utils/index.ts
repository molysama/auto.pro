
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