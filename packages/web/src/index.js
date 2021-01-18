(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var emit = prompt;
    // module.exports = {
    exports.default = {
        setMode: function (mode) {
            emit = window[mode] || prompt;
        },
        devicelly: function (deviceFn, ngFn, self, once) {
            var _this = this;
            if (once === void 0) { once = false; }
            window[deviceFn] = function () {
                var option = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    option[_i] = arguments[_i];
                }
                var result = ngFn.call(self || _this, option);
                if (once) {
                    delete window[deviceFn];
                }
                return result;
            };
        },
        removeDevicelly: function (deviceFn) {
            delete window[deviceFn];
        },
        auto: function (eventname, params, callback) {
            if (callback) {
                var EVENT_ID = eventname + Date.now().toString();
                this.devicelly(EVENT_ID, callback, this, true);
                return emit(eventname, JSON.stringify({
                    params: params,
                    PROMPT_CALLBACK: EVENT_ID
                }));
            }
            else {
                return emit(eventname, JSON.stringify(params));
            }
        }
    };
});
