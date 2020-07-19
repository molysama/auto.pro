'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@auto.pro/core');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');

/**
 * 创建一个悬浮窗
 * @param {string} logo logo图片地址
 * @param {number} logoSize 按钮尺寸
 * @param {number} duration 悬浮窗开关的过渡时间
 * @param {number} radius 子菜单距离logo的长度（包含子菜单的直径），默认120
 * @param {number} angle 子菜单形成的最大角度，默认120，建议大于90小于180
 * @param {number} initX 初始X坐标，默认为-2
 * @param {number} initY 初始Y坐标，默认为高度的一半
 * @param {{id: string, color: string, icon: string, callback: Function}[]} items 子菜单数组
 */
function createFloaty(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.logo, logo = _c === void 0 ? 'https://pro.autojs.org/images/logo.png' : _c, _d = _b.logoSize, logoSize = _d === void 0 ? 44 : _d, _e = _b.duration, duration = _e === void 0 ? 200 : _e, _f = _b.radius, radius = _f === void 0 ? 120 : _f, _g = _b.angle, angle = _g === void 0 ? 120 : _g, _h = _b.items, items = _h === void 0 ? [
        {
            id: 'id_0',
            color: '#047BC3',
            icon: 'ic_play_arrow_black_48dp',
            callback: function () { }
        },
        {
            id: 'id_1',
            color: '#08BC92',
            icon: 'ic_pause_circle_outline_black_48dp',
            callback: function () { }
        },
        {
            id: 'id_2',
            color: '#08BC92',
            icon: 'ic_play_circle_outline_black_48dp',
            callback: function () { }
        },
        {
            id: 'id_3',
            color: '#DC1C2C',
            icon: 'ic_clear_black_48dp',
            callback: function () { }
        },
        {
            id: 'id_4',
            color: '#bfc1c0',
            icon: 'ic_settings_black_48dp',
            callback: function () { }
        },
    ] : _h, _j = _b.initX, initX = _j === void 0 ? -2 : _j, _k = _b.initY, initY = _k === void 0 ? core.height / 2 : _k;
    var size = Math.floor(logoSize);
    var ICON_SIZE = Math.floor(32 / 44 * size);
    var FLOATY = floaty.rawWindow("\n        <frame w=\"" + 2 * radius + "\" h=\"" + 2 * radius + "\">\n            " + items.map(function (item) {
        return "\n                <frame id=\"" + item.id + "\" w=\"" + size + "\" h=\"" + size + "\" alpha=\"0\" layout_gravity=\"center\">\n                    <img w=\"" + size + "\" h=\"" + size + "\" src=\"" + item.color + "\" circle=\"true\" />\n                    <img w=\"" + ICON_SIZE + "\" h=\"" + ICON_SIZE + "\" src=\"@drawable/" + item.icon + "\" tint=\"#ffffff\" gravity=\"center\" layout_gravity=\"center\" />\n                </frame>\n                    ";
    }).join('') + "\n            <frame id=\"logo\" w=\"" + size + "\" h=\"" + size + "\" alpha=\"0.4\" layout_gravity=\"center\">\n                <img id=\"img_logo\" w=\"*\" h=\"*\" src=\"" + logo + "\" gravity=\"center\" layout_gravity=\"center\" />\n            </frame>\n        </frame>\n    ");
    // 创建一个替身，让子菜单在关闭时不接受点击事件
    var STAND = floaty.rawWindow("\n        <frame id=\"btn\" w=\"" + size + "\" h=\"" + size + "\" alpha=\"0\">\n            <img id=\"stand_logo\" w=\"*\" h=\"*\" src=\"" + logo + "\" gravity=\"center\" layout_gravity=\"center\" />\n        </frame>\n    ");
    // 两个悬浮窗的偏移量，在计算位置时 FLOATY的坐标 = STAND的坐标 - 偏移量
    var FLOATY_STAND_OFFSET_X = FLOATY.logo.getX();
    var FLOATY_STAND_OFFSET_Y = FLOATY.logo.getY();
    // 设置悬浮窗的初始位置
    FLOATY.setTouchable(false);
    FLOATY.setPosition(initX - FLOATY_STAND_OFFSET_X, initY - FLOATY_STAND_OFFSET_Y);
    STAND.setPosition(initX, initY);
    // 悬浮窗的开关状态及动画
    var toggleFloaty$ = new rxjs.Subject();
    var isFloatyOpen$ = toggleFloaty$.asObservable().pipe(operators.exhaustMap(function () {
        return rxjs.from(animation());
    }), operators.startWith(false), operators.map(function (v) { return Boolean(v); }), operators.shareReplay(1));
    isFloatyOpen$.subscribe(function (isOpen) { return FLOATY.setTouchable(isOpen); });
    function toggleFloaty() {
        toggleFloaty$.next(true);
    }
    function animation() {
        return new Promise(function (resolve, reject) {
            var logo = FLOATY['logo'];
            var firstElement = items && items.length > 0 && FLOATY[items[0].id];
            if (!firstElement) {
                return resolve(true);
            }
            var isOpen = firstElement.getX() === logo.getX();
            var direction = FLOATY.getX() < core.width / 2 ? 1 : -1;
            var base = Math.floor(angle / (items.length - 1));
            var r = radius - Math.floor(size / 2 + 2);
            var animationItems = [];
            var α = 180 - angle;
            items.forEach(function (item) {
                var element = FLOATY[item.id];
                var offsetX = Math.floor(r * Math.cos(Math.PI * α / 180)) * direction;
                var offsetY = Math.floor(r * Math.sin(Math.PI * α / 180)) * -1;
                // 偏移的x = cos α * r, y = -1 * sin α * r
                if (isOpen) {
                    animationItems.push(ObjectAnimator.ofFloat(element, "translationX", 0, offsetX), ObjectAnimator.ofFloat(element, "translationY", 0, offsetY), ObjectAnimator.ofFloat(element, "scaleX", 0, 1), ObjectAnimator.ofFloat(element, "scaleY", 0, 1), ObjectAnimator.ofFloat(element, "alpha", 0, 1));
                }
                else {
                    animationItems.push(ObjectAnimator.ofFloat(element, "translationX", offsetX, 0), ObjectAnimator.ofFloat(element, "translationY", offsetY, 0), ObjectAnimator.ofFloat(element, "scaleX", 1, 0), ObjectAnimator.ofFloat(element, "scaleY", 1, 0), ObjectAnimator.ofFloat(element, "alpha", 1, 0));
                }
                α -= base;
            });
            var set = new AnimatorSet();
            set.playTogether.apply(set, animationItems);
            set.setDuration(duration);
            // logo变亮的按钮效果在前
            if (isOpen) {
                logo.attr('alpha', 1);
            }
            set.start();
            set.addListener(new JavaAdapter(Animator.AnimatorListener, {
                onAnimationEnd: function () {
                    if (!isOpen) {
                        logo.attr('alpha', 0.4);
                    }
                    resolve(isOpen);
                }
            }));
        });
    }
    // 派发触摸事件
    var logoTouch$ = new rxjs.Subject();
    var down$ = logoTouch$.pipe(operators.filter(function (e) { return e.getAction() === e.ACTION_DOWN; }));
    // 悬浮窗仅当关闭时可以移动
    var move$ = logoTouch$.pipe(operators.withLatestFrom(isFloatyOpen$), operators.filter(function (_a) {
        var e = _a[0], isOpen = _a[1];
        return !isOpen && e.getAction() === e.ACTION_MOVE;
    }), operators.map(function (_a) {
        var e = _a[0], isOpen = _a[1];
        return e;
    }));
    var up$ = logoTouch$.pipe(operators.filter(function (e) { return e.getAction() === e.ACTION_UP; }));
    down$.pipe(operators.map(function (e) { return ({ dx: e.getRawX(), dy: e.getRawY(), sx: STAND.getX(), sy: STAND.getY() }); }), operators.switchMap(function (_a) {
        var dx = _a.dx, dy = _a.dy, sx = _a.sx, sy = _a.sy;
        return rxjs.merge(
        // 按下后无移动，则弹起时视为点击
        up$.pipe(operators.takeUntil(move$), operators.tap(function () {
            toggleFloaty();
        })), move$.pipe(operators.tap(function (e_move) {
            var rawX = e_move.getRawX() - dx;
            var rawY = e_move.getRawY() - dy;
            STAND.setPosition(sx + rawX, sy + rawY);
            FLOATY.setPosition(sx + rawX - FLOATY_STAND_OFFSET_X, sy + rawY - FLOATY_STAND_OFFSET_Y);
        }), operators.takeUntil(up$)), 
        // 按下后有移动，则弹起时视为移动结束
        up$.pipe(operators.skipUntil(move$), operators.tap(function (e_up) {
            var upX = e_up.getRawX();
            var nowY = STAND.getY();
            // 吸附左右边界
            if (upX < 100) {
                STAND.setPosition(-2, nowY);
                FLOATY.setPosition(-2 - FLOATY_STAND_OFFSET_X, nowY - FLOATY_STAND_OFFSET_Y);
            }
            else if (upX > core.width - 100) {
                STAND.setPosition(core.width - size + 2, nowY);
                FLOATY.setPosition(core.width - FLOATY_STAND_OFFSET_X - size + 2, nowY - FLOATY_STAND_OFFSET_Y);
            }
        })));
    })).subscribe();
    STAND.btn.setOnTouchListener(function (v, e) {
        logoTouch$.next(e);
        return true;
    });
    var t = setInterval(function () { }, 10000);
    items.forEach(function (item) {
        FLOATY[item.id].on('click', function () {
            toggleFloaty();
            item.callback && item.callback();
        });
    });
    return {
        FLOATY: FLOATY,
        isOpen$: isFloatyOpen$,
        close: function () {
            FLOATY.close();
            STAND.close();
            clearInterval(t);
        }
    };
}
var FloatyPlugin = {
    install: function (option) {
        importClass(java.lang.Runnable);
        importClass(android.animation.ObjectAnimator);
        importClass(android.animation.PropertyValuesHolder);
        importClass(android.animation.ValueAnimator);
        importClass(android.animation.Animator);
        importClass(android.animation.AnimatorSet);
        importClass(android.animation.AnimatorListenerAdapter);
        importClass(android.view.animation.AccelerateInterpolator);
        importClass(android.view.animation.TranslateAnimation);
        importClass(android.animation.ObjectAnimator);
        importClass(android.animation.TimeInterpolator);
        importClass(android.os.Bundle);
        importClass(android.view.View);
        importClass(android.view.Window);
        importClass(android.view.animation.AccelerateDecelerateInterpolator);
        importClass(android.view.animation.AccelerateInterpolator);
        importClass(android.view.animation.AnticipateInterpolator);
        importClass(android.view.animation.AnticipateOvershootInterpolator);
        importClass(android.view.animation.BounceInterpolator);
        importClass(android.view.animation.CycleInterpolator);
        importClass(android.view.animation.DecelerateInterpolator);
        importClass(android.view.animation.LinearInterpolator);
        importClass(android.view.animation.OvershootInterpolator);
        importClass(android.view.animation.PathInterpolator);
        importClass(android.widget.Button);
        importClass(android.widget.ImageView);
        importClass(android.widget.TextView);
    }
};

exports.createFloaty = createFloaty;
exports.default = FloatyPlugin;
