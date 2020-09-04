import { defer, iif, of, timer, fromEvent } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
/**
 * 是否具有root权限
 */
export var isRoot = $shell.checkAccess('root');
/**
 * 请求无障碍权限
 */
export function requestServicePermission() {
    return defer(function () {
        // 有root权限则使用root开启
        if (isRoot && !isOpenAccessibilityByRoot()) {
            openAccessibilityByRoot();
            return timer(0, 200).pipe(map(function () { return isOpenAccessibilityByRoot(); }), filter(function (v) { return v; }), take(1));
            // 无root权限则要跳到无障碍服务页面，并等待返回
        }
        else if (!isRoot && auto.service === null) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
            });
            return timer(0, 200).pipe(map(function () { return auto.service !== null; }), filter(function (v) { return v; }), take(1), switchMap(waitBack));
        }
        else {
            return of(true);
        }
    });
}
export function waitBack() {
    return iif(function () { return typeof activity === 'undefined'; }, of(true), fromEvent(ui.emitter, 'resume').pipe(take(1)));
}
export function checkFloatyPermission() {
    return context.getSystemService("appops").checkOpNoThrow(24, android.os.Process.myUid(), context.getPackageName()) === 0;
}
/**
 * 请求悬浮窗权限
 */
export function requestFloatyPermission() {
    return iif(checkFloatyPermission, of(true), defer(function () {
        floaty.requestPermission();
        return timer(0, 200).pipe(map(checkFloatyPermission), filter(function (v) { return v; }), take(1), switchMap(waitBack));
    }));
}
/**
 * 通过root开启无障碍服务
 */
export function openAccessibilityByRoot() {
    $settings.setEnabled('enable_accessibility_service_by_root', true);
}
export function isOpenAccessibilityByRoot() {
    return $settings.isEnabled('enable_accessibility_service_by_root');
}
/**
 * 开启前台服务
 */
export function openForeground() {
    $settings.setEnabled('foreground_service', true);
}
/**
 * 关闭前台服务
 */
export function closeForeground() {
    $settings.setEnabled('foreground_service', false);
}
export function isOpenForeground() {
    return $settings.isEnabled('foreground_service');
}
export function isOpenStableMode() {
    return $settings.isEnabled('stable_mode');
}
/**
 * 开启稳定模式
 */
export function openStableMode() {
    $settings.setEnabled('stable_mode', true);
}
/**
 * 关闭稳定模式
 */
export function closeStableMode() {
    $settings.setEnabled('stable_mode', false);
}
