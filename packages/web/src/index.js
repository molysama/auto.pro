(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.AutoWeb = factory());
}(this, (function () { 'use strict';

    let emit = prompt;
    var source = {
        setMode(mode) {
            emit = window[mode] || prompt;
        },
        devicelly(deviceFn, ngFn, self, once = false) {
            window[deviceFn] = (...option) => {
                const result = ngFn.call(self || this, option);
                if (once) {
                    delete window[deviceFn];
                }
                return result;
            };
        },
        removeDevicelly(deviceFn) {
            delete window[deviceFn];
        },
        auto(eventname, params, callback) {
            if (callback) {
                const EVENT_ID = eventname + Date.now().toString();
                this.devicelly(EVENT_ID, callback, this, true);
                return emit(eventname, JSON.stringify({
                    params,
                    PROMPT_CALLBACK: EVENT_ID
                }));
            }
            else {
                return emit(eventname, JSON.stringify(params));
            }
        }
    };

    return source;

})));
