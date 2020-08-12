
console.log($settings.isEnabled('stable_mode'))
$settings.setEnabled('stable_mode', true)
console.log($settings.isEnabled('stable_mode'))

console.log($settings.isEnabled('enable_accessibility_service_by_root'))
$settings.setEnabled('enable_accessibility_service_by_root', true)
console.log($settings.isEnabled('enable_accessibility_service_by_root'))

$settings.setEnabled('foreground_service', true)
setTimeout(() => {
    $settings.setEnabled('foreground_service', false)
}, 5000)