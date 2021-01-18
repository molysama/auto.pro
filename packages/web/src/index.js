(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.repl = mod.exports;
    }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.default = void 0;
    var emit = prompt;
    var _default = {
        setMode: function setMode(mode) {
            emit = window[mode] || prompt;
        },
        devicelly: function devicelly(deviceFn, ngFn, self) {
            var _this = this;

            var once = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            window[deviceFn] = function () {
                for (var _len = arguments.length, option = new Array(_len), _key = 0; _key < _len; _key++) {
                    option[_key] = arguments[_key];
                }

                var result = ngFn.apply(self || _this, option);

                if (once) {
                    delete window[deviceFn];
                }

                return result;
            };
        },
        removeDevicelly: function removeDevicelly(deviceFn) {
            delete window[deviceFn];
        },
        auto: function auto(eventname, params, callback) {
            if (callback) {
                var EVENT_ID = eventname + Date.now().toString();
                this.devicelly(EVENT_ID, callback, this, true);
                return emit(eventname, JSON.stringify({
                    params: params,
                    PROMPT_CALLBACK: EVENT_ID
                }));
            } else {
                return emit(eventname, JSON.stringify(params));
            }
        }
    };
    _exports.default = _default;
});