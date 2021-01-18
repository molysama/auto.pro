let emit = prompt;
export default {
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
