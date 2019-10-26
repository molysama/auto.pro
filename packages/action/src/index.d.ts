import { Plugin } from '@auto.pro/core';
export declare let click: (x: number, y: number, delay?: [number, number] | [600, 800]) => any;
export declare let swipe: (startPoint: [number, number], endPoint: [number, number], duration?: number) => any;
declare const Action: Plugin;
export default Action;
