import { concat, fromEvent, iif, interval, of } from 'rxjs';
import { filter, map, shareReplay, take, toArray } from 'rxjs/operators';
import { isOpenForeground, isOpenStableMode, openForeground, openStableMode, requestFloatyPermission, requestServicePermission } from './permission';
import { enableScreenListener, initScreenSet } from './screen';
import { disableVolumeExit } from './utils';
export * from './pausable';
export * from './permission';
export * from './screen';
export * from './store';
export * from './utils';
/**
 * 作业流
 */
export var effect$;
/**
 * 作业线程
 */
export var effectThread;
/**
 * 作业线程事件
 */
export var effectEvent;
/**
 * @param {CoreOption} param 初始化参数
 * @param {number | 1280} param.baseWidth 基准宽度，默认为1280
 * @param {number | 720} param.baseHeight 基准高度，默认为720
 * @param { false | '横屏' | '竖屏' | '自动'} param.needCap 是否需要截图功能，默认为false
 * @param { '异步' | '同步' } param.capType 截图模式，默认为异步
 * @param {boolean | false} param.needService 是否需要无障碍服务，默认为false
 * @param {boolean | false} param.needFloaty 是否需要悬浮窗权限，默认为false
 * @param {boolean | false} param.needForeground 是否需要自动打开前台服务，默认为false
 * @param {boolean | false} param.needVolExit 是否需要音量上键退出程序，默认为true
 * @param {boolean | false} param.needScreenListener 是否需要监听屏幕旋转状态，默认为false
 */
export default function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.baseWidth, baseWidth = _c === void 0 ? 1280 : _c, _d = _b.baseHeight, baseHeight = _d === void 0 ? 720 : _d, _e = _b.needCap, needCap = _e === void 0 ? false : _e, _f = _b.capType, capType = _f === void 0 ? '异步' : _f, _g = _b.needService, needService = _g === void 0 ? false : _g, _h = _b.needFloaty, needFloaty = _h === void 0 ? false : _h, _j = _b.needForeground, needForeground = _j === void 0 ? false : _j, _k = _b.needStableMode, needStableMode = _k === void 0 ? false : _k, _l = _b.needVolExit, needVolExit = _l === void 0 ? true : _l, _m = _b.needScreenListener, needScreenListener = _m === void 0 ? false : _m;
    if (!needVolExit) {
        disableVolumeExit();
    }
    initScreenSet(baseWidth, baseHeight);
    if (needScreenListener) {
        enableScreenListener();
    }
    effectThread = threads.start(function () {
        var requestService$ = iif(function () { return needService; }, requestServicePermission(), of(true));
        var requestFloaty$ = iif(function () { return needFloaty; }, requestFloatyPermission(), of(true));
        if (needCap) {
            if (!images.requestScreenCapture({
                async: capType === '异步',
                orientation: {
                    '横屏': 1,
                    '竖屏': 2,
                    '自动': 3,
                    'true': 3
                }[needCap]
            })) {
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
        concat(requestService$, requestFloaty$).pipe(toArray()).subscribe({
            next: function () {
                interval(10).pipe(filter(function () { return effectEvent && effectEvent.listenerCount('effect$') > 0; }), take(1)).subscribe(function () {
                    effectEvent.emit('effect$');
                });
            },
            error: function (err) {
                toastLog(err);
            }
        });
        setInterval(function () { }, 10000);
    });
    effectThread.waitFor();
    effectEvent = events.emitter(effectThread);
    effect$ = fromEvent(effectEvent, 'effect$').pipe(map(function () { return [effectThread, effectEvent]; }), shareReplay(1));
}
