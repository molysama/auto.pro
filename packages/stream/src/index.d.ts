export { concat } from 'rxjs';
export declare const tag: (text: string, showValue?: boolean, fn?: Function | undefined) => void;
export declare const clickImg: (path: string, region?: RegionType, threshold?: number) => import("rxjs").Observable<any>;
export declare const clickImgWithCheck: (path: any, region?: RegionType, threshold?: number, checkDelay?: number, useCache?: boolean) => import("rxjs").Observable<any>;
