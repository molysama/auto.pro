let emit = prompt;

// 非时间种子的随机数
const uuid = () => {
    const tempUrl = URL.createObjectURL(new Blob());
    const tempId = tempUrl.toString()
    URL.revokeObjectURL(tempUrl)
    return tempId.substring(tempId.lastIndexOf("/") + 1)
}

export default {
    setMode(mode) {
        emit = window[mode] || prompt;
    },
    devicelly(deviceFn, ngFn, self, once = false) {
        window[deviceFn] = (...option) => {
            const result = ngFn.apply(self || this, option);
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
            const EVENT_ID = eventname + uuid()
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
