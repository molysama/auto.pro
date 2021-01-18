'use strict';

declare const window
declare const prompt

let emit = prompt

// module.exports = {
export default {
    setMode(mode: 'console' | 'prompt') {
        emit = window[mode] || prompt
    },
    devicelly(deviceFn: string, ngFn: Function, self?: any, once = false) {
        window[deviceFn] = (...option) => {
            const result = ngFn.call(self || this, option)
            if (once) {
                delete window[deviceFn]
            }
            return result
        }
    },

    removeDevicelly(deviceFn: string) {
        delete window[deviceFn]
    },

    auto(eventname: string, params?: any, callback?: Function) {
        if (callback) {
            const EVENT_ID = eventname + Date.now().toString()
            this.devicelly(EVENT_ID, callback, this, true)
            return emit(eventname, JSON.stringify({
                params,
                PROMPT_CALLBACK: EVENT_ID
            }))
        } else {
            return emit(eventname, JSON.stringify(params))
        }
    }
}