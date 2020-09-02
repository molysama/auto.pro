import { defer, iif, of, timer } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
/**
 * 请求无障碍权限
 */
export function requestServicePermission() {
    var isRoot = $shell.checkAccess('root');
    return of(isRoot).pipe(switchMap(function (v) {
        if (v && !isOpenAccessibilityByRoot()) {
            openAccessibilityByRoot();
            return timer(0, 200).pipe(map(function () { return isOpenAccessibilityByRoot(); }), filter(function (v) { return v; }), take(1));
        }
        else if (!v && auto.service === null) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
            });
            return timer(0, 200).pipe(map(function () { return auto.service !== null; }), filter(function (v) { return v; }), take(1));
        }
        else {
            return of(true);
        }
    }));
}
/**
 * 请求悬浮窗权限
 */
export function requestFloatyPermission() {
    return iif(floaty.checkPermission, of(true), defer(function () {
        floaty.requestPermission();
        return timer(0, 200).pipe(map(function () { return floaty.checkPermission(); }), filter(function (v) { return v; }), take(1));
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
