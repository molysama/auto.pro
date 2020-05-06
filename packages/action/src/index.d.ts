import { Plugin } from '@auto.pro/core';
/**
 * 根据坐标进行点击，若坐标不存在则啥都不做
 * @param {number} x 要点击的横坐标
 * @param {number} y 要点击的纵坐标
 * @param {[number, number]} delay 点击后的等待延迟，默认是[600, 800]，600-800毫秒
 * @param { number } randomOffsetX 随机x轴偏差，默认0
 * @param { number } randomOffsetY 随机y轴偏差，默认0
 */
export declare let click: (x: number, y: number, delay?: [number, number] | [600, 800], randomOffsetX?: number, randomOffsetY?: number) => any;
/**
 * 根据坐标进行点击，并按设置的标准分辨率进行适配
 */
export declare let clickRes: (x: number, y: number, delay?: [number, number] | [600, 800], randomOffsetX?: number, randomOffsetY?: number) => any;
/**
 * 根据给定的两个点进行滑动，root模式直接使用两点滑动，无障碍模式下使用贝塞尔曲线
 * @param {[number, number]} startPoint 起点
 * @param {[number, number]} endPoint 终点
 * @param {number} duration 滑动时间，默认随机800-1000毫秒，并根据两点距离进行调整
 */
export declare let swipe: (startPoint: [number, number], endPoint: [number, number], duration?: number) => any;
declare const Action: Plugin;
export default Action;
