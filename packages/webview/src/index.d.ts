interface WebViewOption {
    xmlString: string;
    webviewId: string;
    webviewClientOption?: any;
    afterLayout: Function;
}
import { Observable } from "rxjs";
declare type CreateWebviewResult = Observable<{
    on(eventName: string): Observable<[any, Function]>;
    off(): void;
    runHtmlFunction(fnName: string, ...value: any[]): Observable<any>;
    runHtmlJS(js: string): Observable<any>;
}>;
export declare function run(url: any, option?: WebViewOption): CreateWebviewResult;
export {};
