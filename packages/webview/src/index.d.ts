interface WebViewOption {
    xmlString?: string;
    webviewId?: string;
    webviewObject?: any;
    chromeClientOption?: any;
    webviewClientOption?: any;
    afterLayout?: Function;
}
import { Observable } from "rxjs";
/**
 * @param {string} url  html路径
 * @param {WebViewOption} option  自定义
 * @param {string} option.xmlString 自定义界面
 * @param {string} option.webviewId 自定义界面的webviewId，使用自定义界面时必填，且要与界面字符串内webview的id一致
 * @param {Object} option.webviewObject 可以自主传入webview对象，使用此选项时无法再自定义界面
 * @param {Object} option.chromeClientOption JavaAdapter.WebChromeClient的回调拓展对象，可重写其事件
 * @param {Object} option.webviewClientOption JavaAdapter.WebViewClient的回调拓展对象，可重写其事件
 * @param {Function} option.afterLayout 紧接着布局初始化的钩子函数
 */
export declare function run(url: any, { xmlString, webviewId, webviewObject, chromeClientOption, webviewClientOption, afterLayout }?: WebViewOption): CreateWebviewResult;
type CreateWebviewResult = {
    webviewObject: any;
    on(eventName: string): Observable<[any, Function]>;
    runHtmlFunction(fnName: string, ...value: any[]): Observable<any>;
    runHtmlJS(js: string): Observable<any>;
};
export {};
