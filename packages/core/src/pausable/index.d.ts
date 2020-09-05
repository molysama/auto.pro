import { BehaviorSubject, Observable } from 'rxjs';
/**
 * 程序暂停状态值
 * true为正在暂停，false为非暂停
 */
export declare const pauseState$: BehaviorSubject<boolean>;
/**
 * 操作符，使流可暂停，可设ispausable为false来强制关闭暂停效果
 * @param {boolean} isPausable 是否强制取消暂停效果
 * @param {boolean} wait wait为true时将阻塞并存储所有输入，为false时忽略暂停期间的输入
 */
export declare const pausable: <T>(isPausable?: boolean, wait?: boolean) => (source: Observable<T>) => Observable<T>;
/**
 * 将程序暂停
 */
export declare function pause(): void;
/**
 * 将程序恢复运行
 */
export declare function resume(): void;
/**
 * 可暂停的interval
 * @param t 时间间隔
 */
export declare function pausableInterval(t?: number, isWait?: boolean): Observable<number>;
/**
 * 可暂停的timer
 * @param t 首次延迟
 * @param each 之后的每次输出间隔
 */
export declare function pausableTimer(t: number, each?: number, isWait?: boolean): Observable<number>;
/**
 * 可暂停的timeoutWith
 * @param t
 * @param ob
 */
export declare function pausableTimeoutWith(t: number, ob: Observable<any>): (source: any) => Observable<any>;
/**
 * 可暂停的timeout
 * @param t
 */
export declare function pausableTimeout(t: number): (source: any) => Observable<any>;
