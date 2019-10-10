import { Plugin } from '@auto.pro/core';
declare type ClickFunction = (x: number, y: number, delay?: [number, number] | [600, 800]) => any;
declare type SwipeFunction = (startPoint: [number, number], endPoint: [number, number], duration?: number) => any;
declare type CapFunction = (path?: string) => any;
export declare function useAction(): {
    click: ClickFunction;
    cap: CapFunction;
    swipe: SwipeFunction;
};
declare const Action: Plugin;
export default Action;
