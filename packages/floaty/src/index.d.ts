import { Plugin } from "@auto.pro/core";
import { Observable } from 'rxjs';
/**
 * 创建一个悬浮窗
 * @param {string} logo logo图片地址
 * @param {number} duration 悬浮窗开关的过渡时间
 * @param {number} radius 子菜单距离logo的长度（包含子菜单的直径），默认120
 * @param {number} angle 子菜单形成的最大角度，默认120，建议大于90小于180
 * @param {{id: string, color: string, icon: string, callback: Function}[]} items 子菜单数组
 */
export declare function createFloaty({ logo, duration, radius, angle, items }?: {
    logo?: string | undefined;
    duration?: number | undefined;
    radius?: number | undefined;
    angle?: number | undefined;
    items?: {
        id: string;
        color: string;
        icon: string;
        callback(): void;
    }[] | undefined;
}): {
    FLOATY: any;
    isOpen$: Observable<boolean>;
    close: Function;
};
declare const FloatyPlugin: Plugin;
export default FloatyPlugin;
