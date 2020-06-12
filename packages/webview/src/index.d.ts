import { Plugin } from "@auto.pro/core";
declare function on(eventName: string, callback: Function): void;
declare function off(eventName: string): void;
export declare function run(url: string): {
    on: typeof on;
    off: typeof off;
    /**
     * 执行webview中网页的函数
     * @param fnName 要执行的方法
     * @param value 要传递的参数
     */
    runHtmlFunction(fnName: string, ...value: any[]): Promise<any>;
    /**
     * 在webview中执行一个js语句
     * @param js
     */
    runHtmlJS(js: any): Promise<any>;
    webview: any;
};
declare const WebViewPlugin: Plugin;
export default WebViewPlugin;
