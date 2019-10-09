/**
 * @desc 贝塞尔曲线算法，包含了3阶贝塞尔
 */
declare class Bezier {
    /**
     * @desc 获取点，这里可以设置点的个数
     * @param {number} num 点个数
     * @param {Array} p1 点坐标
     * @param {Array} p2 点坐标
     * @param {Array} p3 点坐标
     * @param {Array} p4 点坐标
     * 如果参数是 num, p1, p2 为一阶贝塞尔
     * 如果参数是 num, p1, c1, p2 为二阶贝塞尔
     * 如果参数是 num, p1, c1, c2, p2 为三阶贝塞尔
     */
    getBezierPoints(num: number | undefined, p1: any, p2: any, p3: any, p4: any): any[];
    /**
     * @desc 一阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     */
    oneBezier(t: any, p1: any, p2: any): number[];
    /**
     * @desc 二阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp 控制点
     */
    twoBezier(t: any, p1: any, cp: any, p2: any): number[];
    /**
     * @desc 三阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp1 控制点1
     * @param {Array} cp2 控制点2
     */
    threeBezier(t: any, p1: any, cp1: any, cp2: any, p2: any): number[];
}
declare const _default: Bezier;
export default _default;
