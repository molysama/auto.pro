
/**
 * 通过root开启无障碍服务
 */
export function openAccessibilityByRoot() {
    $settings.setEnabled('enable_accessibility_service_by_root', true)
}

export function isOpenAccessibilityByRoot() {
    return $settings.isEnabled('enable_accessibility_service_by_root')
}

/**
 * 开启前台服务
 */
export function openForeground() {
    $settings.setEnabled('foreground_service', true)
}

/**
 * 关闭前台服务
 */
export function closeForeground() {
    $settings.setEnabled('foreground_service', false)
}
export function isOpenForeground() {
    return $settings.isEnabled('foreground_service')
}

export function isOpenStableMode() {
    return $settings.isEnabled('stable_mode')
}
/**
 * 开启稳定模式
 */
export function openStableMode() {
    $settings.setEnabled('stable_mode', true)
}

/**
 * 关闭稳定模式
 */
export function closeStableMode() {
    $settings.setEnabled('stable_mode', false)
}

//#################################################################################
//                                   悬浮窗权限


importClass(android.provider.Settings);
importClass(android.net.Uri);

declare const Settings: any
declare const Uri: any
export function checkFloatyPermission() {
    importClass(android.provider.Settings);
    if (!Settings.canDrawOverlays(context.getApplicationContext())) {
        return false
    } else {
        return true
    }
}
export function requestFloatyPermission() {
    app.startActivity({
        action: Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        data: Uri.parse("package:" + context.getPackageName())
    })
}

//                                 悬浮窗权限结束
//##################################################################################