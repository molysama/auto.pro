import { concat, iif, of, ReplaySubject, timer } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { isOpenForeground, isOpenStableMode, openForeground, openStableMode, requestFloatyPermission, requestServicePermission } from './permission';
import { height, initScreenSet, width } from './screen';
export * from './pausable';
export * from './permission';
export * from './screen';
export * from './store';
export * from './utils';
/**
 * 作业用
 */
export var effect$ = new ReplaySubject(1);
/**
 * ui线程
 */
export var uiThread = threads.currentThread();
/**
 * 作业线程
 */
export var effectThread;
/**
 * @param {object} param
 * @param {number | 1280} param.baseWidth 基准宽度
 * @param {number | 720} param.baseHeight 基准高度
 * @param {boolean | false} param.needCap 是否需要截图功能
 * @param {boolean | false} param.needService 是否需要无障碍服务，默认为false
 * @param {boolean | false} param.needFloaty 是否需要悬浮窗权限，默认为false
 * @param {boolean | false} param.needForeground 是否需要自动打开前台服务，默认为false
 */
export default function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.baseWidth, baseWidth = _c === void 0 ? 1280 : _c, _d = _b.baseHeight, baseHeight = _d === void 0 ? 720 : _d, _e = _b.needCap, needCap = _e === void 0 ? false : _e, _f = _b.needService, needService = _f === void 0 ? false : _f, _g = _b.needFloaty, needFloaty = _g === void 0 ? false : _g, _h = _b.needForeground, needForeground = _h === void 0 ? false : _h, _j = _b.needStableMode, needStableMode = _j === void 0 ? true : _j;
    initScreenSet(baseWidth, baseHeight);
    effectThread = threads.start(function () {
        var effectThread = threads.currentThread();
        var requestService$ = iif(function () { return needService; }, requestServicePermission(), of(true));
        var requestFloaty$ = iif(function () { return needFloaty; }, requestFloatyPermission(), of(true));
        var requestScreenCapture$ = timer(0);
        if (needCap) {
            if (images.requestScreenCapture(width, height)) {
                requestScreenCapture$ = timer(500);
            }
            else {
                toastLog('请求截图权限失败');
                exit();
            }
        }
        if (needForeground && !isOpenForeground()) {
            openForeground();
        }
        if (needStableMode && !isOpenStableMode()) {
            openStableMode();
        }
        concat(requestFloaty$, requestService$, requestScreenCapture$).pipe(toArray()).subscribe({
            next: function () {
                effect$.next(effectThread);
            },
            error: function (err) {
                toastLog(err);
                exit();
            }
        });
        setInterval(function () { }, 10000);
    });
}
