'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@auto.pro/core');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');

/**
 * 创建一个悬浮窗
 * @param {string} logo logo图片地址
 * @param {number} duration 悬浮窗开关的过渡时间
 * @param {number} radius 子菜单距离logo的长度（包含子菜单的直径），默认120
 * @param {number} angle 子菜单形成的最大角度，默认120，建议大于90小于180
 * @param {{id: string, color: string, icon: string, callback: Function}[]} items 子菜单数组
 */
function createFloaty(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.logo, logo = _c === void 0 ? 'https://pro.autojs.org/images/logo.png' : _c, _d = _b.duration, duration = _d === void 0 ? 200 : _d, _e = _b.radius, radius = _e === void 0 ? 120 : _e, _f = _b.angle, angle = _f === void 0 ? 120 : _f, _g = _b.items, items = _g === void 0 ? [
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
    ] : _g;
    var FLOATY = floaty.rawWindow("\n        <frame w=\"" + 2 * radius + "\" h=\"" + 2 * radius + "\">\n            " + items.map(function (item) {
        return "\n                <frame id=\"" + item.id + "\" w=\"44\" h=\"44\" alpha=\"0\" layout_gravity=\"center\">\n                    <img w=\"44\" h=\"44\" src=\"" + item.color + "\" circle=\"true\" />\n                    <img w=\"28\" h=\"28\" src=\"@drawable/" + item.icon + "\" tint=\"#ffffff\" gravity=\"center\" layout_gravity=\"center\" />\n                </frame>\n                    ";
    }).join('') + "\n            <frame id=\"logo\" w=\"44\" h=\"44\" alpha=\"0.4\" layout_gravity=\"center\">\n                <img w=\"44\" h=\"44\" src=\"#ffffff\" circle=\"true\" alpha=\"0.8\" />\n                <img id=\"img_logo\" w=\"32\" h=\"32\" src=\"" + logo + "\" gravity=\"center\" layout_gravity=\"center\" />\n            </frame>\n        </frame>\n    ");
    FLOATY.setPosition(-1 * radius + 20, core.height / 2);
    var toggleFloaty$ = new rxjs.Subject();
    var isFloatyOpen$ = toggleFloaty$.asObservable().pipe(operators.exhaustMap(function () {
        return rxjs.from(animation());
    }), operators.startWith(false), operators.map(function (v) { return Boolean(v); }), operators.shareReplay(1));
    isFloatyOpen$.subscribe();
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
            var α = 180 - angle;
            var r = radius - 24;
            var animationItems = [];
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
            // logo变亮的按钮在前
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
    var logoTouch$ = new rxjs.Subject();
    var down$ = logoTouch$.pipe(operators.filter(function (e) { return e.getAction() === e.ACTION_DOWN; }));
    var move$ = logoTouch$.pipe(operators.filter(function (e) { return e.getAction() === e.ACTION_MOVE; }));
    var up$ = logoTouch$.pipe(operators.filter(function (e) { return e.getAction() === e.ACTION_UP; }));
    down$.pipe(operators.map(function (e) { return ({ fx: FLOATY.getX(), fy: FLOATY.getY(), dx: e.getRawX(), dy: e.getRawY() }); }), operators.switchMap(function (_a) {
        var fx = _a.fx, fy = _a.fy, dx = _a.dx, dy = _a.dy;
        return rxjs.merge(up$.pipe(operators.takeUntil(move$), operators.tap(function () {
            toggleFloaty();
        })), move$.pipe(operators.tap(function (e_move) {
            FLOATY.setPosition(fx + e_move.getRawX() - dx, fy + e_move.getRawY() - dy);
        }), operators.takeUntil(up$)), up$.pipe(operators.skipUntil(move$), operators.tap(function () {
            // 在边界时吸附边界
            if (FLOATY.getX() < 50) {
                FLOATY.setPosition(-1 * radius + 20, FLOATY.getY());
            }
            else if (FLOATY.getX() > device.width - 50) {
                FLOATY.setPosition(device.width - radius - 20, FLOATY.getY());
            }
        })));
    })).subscribe();
    FLOATY.logo.setOnTouchListener(function (v, e) {
        logoTouch$.next(e);
        return true;
    });
    var t = setInterval(function () {
    }, 10000);
    items.forEach(function (item) {
        FLOATY[item.id].on('click', function () {
            toggleFloaty();
            item.callback();
        });
    });
    return {
        FLOATY: FLOATY,
        isOpen$: isFloatyOpen$,
        close: function () {
            FLOATY.close();
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
