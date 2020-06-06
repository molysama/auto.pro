import { Plugin } from "@auto.pro/core";
declare function runHtmlFunction(fnName: any, value: any): Promise<unknown>;
declare function runHtmlJS(propertyName: any): Promise<unknown>;
declare function on(eventName: string, callback: Function): void;
declare function off(eventName: string): void;
export declare function run(url: string): {
    on: typeof on;
    off: typeof off;
    runHtmlFunction: typeof runHtmlFunction;
    runHtmlJS: typeof runHtmlJS;
    webview: any;
};
declare const WebViewPlugin: Plugin;
export default WebViewPlugin;
