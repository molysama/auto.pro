"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestFloatyPermission = exports.checkFloatyPermission = exports.closeStableMode = exports.openStableMode = exports.isOpenStableMode = exports.isOpenForeground = exports.closeForeground = exports.openForeground = exports.isOpenAccessibilityByRoot = exports.openAccessibilityByRoot = void 0;
/**
 * 通过root开启无障碍服务
 */
function openAccessibilityByRoot() {
    $settings.setEnabled('enable_accessibility_service_by_root', true);
}
exports.openAccessibilityByRoot = openAccessibilityByRoot;
function isOpenAccessibilityByRoot() {
    return $settings.isEnabled('enable_accessibility_service_by_root');
}
exports.isOpenAccessibilityByRoot = isOpenAccessibilityByRoot;
/**
 * 开启前台服务
 */
function openForeground() {
    $settings.setEnabled('foreground_service', true);
}
exports.openForeground = openForeground;
/**
 * 关闭前台服务
 */
function closeForeground() {
    $settings.setEnabled('foreground_service', false);
}
exports.closeForeground = closeForeground;
function isOpenForeground() {
    return $settings.isEnabled('foreground_service');
}
exports.isOpenForeground = isOpenForeground;
function isOpenStableMode() {
    return $settings.isEnabled('stable_mode');
}
exports.isOpenStableMode = isOpenStableMode;
/**
 * 开启稳定模式
 */
function openStableMode() {
    $settings.setEnabled('stable_mode', true);
}
exports.openStableMode = openStableMode;
/**
 * 关闭稳定模式
 */
function closeStableMode() {
    $settings.setEnabled('stable_mode', false);
}
exports.closeStableMode = closeStableMode;
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
exports.checkFloatyPermission = checkFloatyPermission;
function requestFloatyPermission() {
    app.startActivity({
        action: Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        data: Uri.parse("package:" + context.getPackageName())
    });
}
exports.requestFloatyPermission = requestFloatyPermission;
//                                 悬浮窗权限结束
//##################################################################################
