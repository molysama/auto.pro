import { Observable } from 'rxjs';
export declare const clickPt: (x: any, y: any) => void;
/**
 * 根据给定的两个点进行滑动，root模式直接使用两点滑动，无障碍模式下使用贝塞尔曲线
 * @param {[number, number]} startPoint 起点
 * @param {[number, number]} endPoint 终点
 * @param {number} duration 滑动时间，默认随机800-1000毫秒，并根据两点距离进行调整
 */
export declare const swipe: (duration?: number | undefined, startPoint?: [number, number] | undefined, endPoint?: [number, number] | undefined, isPausable?: boolean) => (source: Observable<any>) => Observable<any>;
/**
 * 根据坐标进行点击，若坐标不存在则啥都不做
 * @param {number} x 要点击的横坐标，缺省的话将点击流的值
 * @param {number} y 要点击的纵坐标，缺省的话将点击流的值
 * @param {[number, number]} delay 点击后的等待延迟，默认是[600, 800]，600-800毫秒
 * @param { number } randomOffsetX 随机x轴偏差，默认0
 * @param { number } randomOffsetY 随机y轴偏差，默认0
 */
export declare const click: (randomOffsetX?: number, randomOffsetY?: number, x?: number | undefined, y?: number | undefined, useScale?: boolean, isPausable?: boolean) => (source: Observable<any>) => Observable<any>;
