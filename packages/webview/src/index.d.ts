import { Plugin } from "@auto.pro/core";
declare function on(eventName: string, callback: Function): void;
declare function off(eventName: string): void;
/**
 *
 * @param {string} url html路径
 * @param {object} option 自定义选项
 * @param {string} option.xmlString 自定义界面
 * @param {string} option.webviewId 自定义界面的webviewId，使用自定义时必填，且要与字符串内的webview的id一致
 */
export declare function run(url: string, { xmlString, webviewId, }?: {
    xmlString?: string | undefined;
    webviewId?: string | undefined;
}): {
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
