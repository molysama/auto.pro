export declare const AutoWeb: {
    setMode(mode: 'console' | 'prompt'): void;
    devicelly(deviceFn: string, ngFn: Function, self?: any, once?: boolean): void;
    removeDevicelly(deviceFn: string): void;
    auto(eventname: string, params?: any, callback?: Function): any;
};
