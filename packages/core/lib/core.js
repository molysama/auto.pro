'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rxjs = require('rxjs');
var operators = require('rxjs/operators');

var isFunction = function (val) { return typeof val === 'function'; };

/**
 * 设备是否Root
 */

/**
 * 是否需要截图
 */
var needCap;
/**
 * 是否需要无障碍服务
 */
var needService;
/**
 * 基准宽度
 */
var baseWidth = 1280;
/**
 * 基准高度
 */
var baseHeight = 720;
/**
 * 当前设备宽度
 */

/**
 * 当前设备高度
 */

/**
 * 当前设备高宽与基准高宽的缩放比
 */

/**
 * 当前设备的屏幕类型，'w'代表横屏，'h'代表竖屏，若高宽相等则判定为横屏
 */

/**
 * 截图，仅当needCap设为true时可用
 * @param path 要保存的图片路径
 * @returns {Image} 返回得到的截图
 */
function cap(path) {
    if (!needCap) {
        throw 'cap仅当needCap为真值时可用';
    }
    if (path) {
        return captureScreen(path);
    }
    else {
        return captureScreen();
    }
}
var plugins = [];
/**
 * 加载插件
 * @param plugin 要加载的插件
 * @param option 插件需要的参数
 */
function use(plugin, option) {
    if (plugins.indexOf(plugin) !== -1) {
        return;
    }
    else if (isFunction(plugin)) {
        plugin(option);
    }
    else if (isFunction(plugin.install)) {
        plugin.install(option);
    }
    return plugins.push(plugin);
}
//################################################################################
//                                   暂停功能
/**
 *
 *
 * 程序是否处于暂停状态
 */
var pauseState$ = new rxjs.BehaviorSubject(false);
/**
 * 操作符，使流可暂停，可设ispausable为false来强制关闭暂停效果
 * @param {boolean} isPausable 是否强制取消暂停效果
 * @param {boolean} wait wait为true时将阻塞并存储所有输入，为false时忽略暂停期间的输入
 */
var pausable = function (isPausable, wait) {
    if (isPausable === void 0) { isPausable = true; }
    if (wait === void 0) { wait = true; }
    return function (source) {
        if (isPausable) {
            if (wait) {
                return source.pipe(operators.concatMap(function (value) {
                    return pauseState$.pipe(operators.filter(function (v) { return !v; }), operators.take(1), operators.map(function () { return value; }));
                }));
            }
            else {
                return source.pipe(operators.exhaustMap(function (value) { return pauseState$.pipe(operators.filter(function (v) { return !v; }), operators.take(1), operators.map(function () { return value; })); }));
            }
        }
        else {
            return source;
        }
    };
};
/**
 * 将程序暂停
 */
function pause() {
    pauseState$.next(true);
}
/**
 * 将程序恢复运行
 */
function resume() {
    pauseState$.next(false);
}
/**
 * 可暂停的interval
 * @param t 时间间隔
 */
function pausableInterval(t, isWait) {
    if (t === void 0) { t = 0; }
    if (isWait === void 0) { isWait = true; }
    return pausableTimer(0, t, isWait);
}
/**
 * 可暂停的timer
 * @param t 首次延迟
 * @param each 之后的每次输出间隔
 */
function pausableTimer(t, each, isWait) {
    if (isWait === void 0) { isWait = true; }
    return rxjs.timer(t, each).pipe(pausable(true, isWait));
}
/**
 * 可暂停的TimeoutWith
 * @param t
 * @param ob
 */
function pausableTimeoutWith(t, ob) {
    return function (source) {
        var begin = Date.now();
        var total = t;
        var source$ = source.pipe(operators.share());
        return rxjs.merge(source$, 
        // 只允许默认和【非暂停->暂停】状态通过的流
        pauseState$.pipe(operators.scan(function (_a, now) {
            var result = _a[0], prev = _a[1];
            if (prev === undefined) {
                result = true;
            }
            else if (prev === false && now === true) {
                result = true;
            }
            else {
                result = false;
            }
            return [result, now];
        }, [true, undefined]), operators.filter(function (v) { return v[0]; }), operators.map(function (v) { return v[1]; }))
            .pipe(operators.switchMap(function (vp) {
            // 如果是暂停，则延迟时间为：剩余时间 - (当前时间 - 起始时间)
            if (vp) {
                total = total - (Date.now() - begin);
                return pauseState$.pipe(operators.filter(function (v) { return !v; }), operators.concatMap(function () {
                    begin = Date.now();
                    return rxjs.timer(total);
                }));
            }
            else {
                // 如果是非暂停，则延迟t毫秒，并初始化起始时间
                begin = Date.now();
                return rxjs.timer(t);
            }
        }), operators.takeUntil(source$.pipe(operators.tap(function () {
            begin = Date.now();
            total = t;
        }))), operators.repeat(), operators.takeUntil(source$.pipe(operators.toArray())), operators.switchMap(function () { return rxjs.throwError(new rxjs.TimeoutError()); }))).pipe(operators.catchError(function (err) {
            if (err instanceof rxjs.TimeoutError) {
                return ob;
            }
            else {
                return rxjs.throwError(err);
            }
        }));
    };
}
/**
 * 可暂停的timeout
 * @param t
 */
function pausableTimeout(t) {
    return pausableTimeoutWith(t, rxjs.throwError(new rxjs.TimeoutError()));
}
//                                 暂停功能结束
//#############################################################################
/**
 * 获取当前设备宽度的分式值，如value = 1/4，则获取宽度的1/4，并向下取整
 * @param value 要获取的宽度百分比
 * @returns 当前设备宽度 * value
 */
function getWidth(value) {
    if (value === void 0) { value = 1; }
    return Math.floor(exports.width * value);
}
/**
 * 获取当前设备高度的分式值，如value = 1/4，则获取高度的1/4，并向下取整
 * @param value 要获取的高度百分比
 * @returns 当前设备高度 * value
 */
function getHeight(value) {
    if (value === void 0) { value = 1; }
    return Math.floor(exports.height * value);
}
function getTime() {
    return android.os.SystemClock.uptimeMillis();
}
/**
 * 获取对象的原型
 * Java对象直接返回Java类名，如'Image'、'Point'
 * JS对象返回对应的原型，如 'Null' 'Undefined' 'String' 'Number' 'Function' 'Boolean' 'Array'
 * @param obj 要获取原型的对象
 * @returns {string}
 */
function getPrototype(obj) {
    var prototype = Object.prototype.toString.call(obj);
    if (prototype == '[object JavaObject]') {
        return obj.getClass().getSimpleName();
    }
    else {
        return prototype.substring(prototype.indexOf(' ') + 1, prototype.indexOf(']'));
    }
}
/**
 *
 * @param {number | 1280} param.baseWidth 基准宽度
 * @param {number | 720} param.baseHeight 基准高度
 * @param {boolean | false} param.needCap 是否需要截图功能
 * @param {boolean | false} param.needService 是否需要无障碍服务，默认为false，但在非root环境下将强制开启
 */
function index (param) {
    if (param === void 0) { param = {}; }
    needCap = param.needCap === true ? true : false;
    needService = param.needService === true ? true : false;
    baseWidth = param.baseWidth || baseWidth;
    baseHeight = param.baseHeight || baseHeight;
    exports.screenType = baseWidth >= baseHeight ? 'w' : 'h';
    exports.isRoot = typeof $shell != 'undefined' && $shell.checkAccess && $shell.checkAccess('root') || false;
    var max = typeof device != 'undefined' ? Math.max(device.width, device.height) : 0;
    var min = typeof device != 'undefined' ? Math.min(device.width, device.height) : 0;
    exports.width = exports.screenType === 'w' ? max : min;
    exports.height = exports.screenType === 'w' ? min : max;
    exports.scale = Math.min(exports.width / baseWidth, exports.height / baseHeight);
    threads && threads.start && threads.start(function () {
        if (needCap) {
            if (!requestScreenCapture(exports.width, exports.height)) {
                toast("请求截图失败");
                exit();
            }
        }
        if ((needService || !exports.isRoot) && auto.service == null) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
            });
        }
        if (param.needFloaty && !checkFloatyPermission()) {
            requestFloatyPermission();
        }
    });
}
//#################################################################################
//                                   悬浮窗权限
importClass(android.provider.Settings);
importClass(android.net.Uri);
function checkFloatyPermission() {
    importClass(android.provider.Settings);
    if (!Settings.canDrawOverlays(context.getApplicationContext())) {
        return false;
    }
    else {
        return true;
    }
}
function requestFloatyPermission() {
    app.startActivity({
        action: Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        data: Uri.parse("package:" + context.getPackageName())
    });
}
//                                 悬浮窗权限结束
//##################################################################################

exports.cap = cap;
exports.default = index;
exports.getHeight = getHeight;
exports.getPrototype = getPrototype;
exports.getTime = getTime;
exports.getWidth = getWidth;
exports.pausable = pausable;
exports.pausableInterval = pausableInterval;
exports.pausableTimeout = pausableTimeout;
exports.pausableTimeoutWith = pausableTimeoutWith;
exports.pausableTimer = pausableTimer;
exports.pause = pause;
exports.pauseState$ = pauseState$;
exports.resume = resume;
exports.use = use;
