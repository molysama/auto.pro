import { Observable } from "rxjs";
/**
 * @param {string} url  html路径
 * @param {WebViewOption} option  自定义
 * @param {string} option.xmlString 自定义界面
 * @param {string} option.webviewId 自定义界面的webviewId，使用自定义界面时必填，且要与界面字符串内webview的id一致
 * @param {Object} option.webviewClientOption JavaAdapter.WebChromeClient的回调拓展对象，可重写一些事件
 * @param {Function} option.afterLayout 紧接着布局初始化的钩子函数
 */
export declare function run(url: any, { xmlString, webviewId, webviewClientOption, afterLayout }?: {
    xmlString?: string | undefined;
    webviewId?: string | undefined;
    webviewClientOption?: {} | undefined;
    afterLayout?: (() => void) | undefined;
}): CreateWebviewResult;
declare type CreateWebviewResult = {
    webviewObject: any;
    on(eventName: string): Observable<[any, Function]>;
    runHtmlFunction(fnName: string, ...value: any[]): Observable<any>;
    runHtmlJS(js: string): Observable<any>;
};
export {};
