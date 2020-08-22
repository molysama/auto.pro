import { storage } from "@auto.pro/core";
export function checkUpdate(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.validFunction, validFunction = _c === void 0 ? function () { return false; } : _c, _d = _b.updateFunction, updateFunction = _d === void 0 ? function () { } : _d, _e = _b.shopUrl, shopUrl = _e === void 0 ? '' : _e;
    var KEY_CHECK_UPDATE_PASS = 'xYDqPDF9ZI4jbYS';
    var pass = storage.get(KEY_CHECK_UPDATE_PASS);
    if (pass) {
        return;
    }
    if (!validFunction()) {
        return;
    }
    dialogs.build({
        //对话框标题
        title: "发现新版本",
        //对话框内容
        content: "更新日志: 新增了若干了BUG",
        //确定键内容
        positive: "下载",
        //取消键内容
        negative: "取消",
        //中性键内容
        neutral: "到浏览器下载",
        //勾选框内容
        checkBoxPrompt: "不再提示",
        // 在对话框外点击时不关闭
        canceledOnTouchOutside: false
    }).on("positive", function () {
        //监听确定键
        toast("开始下载....");
    }).on("neutral", function () {
        //监听中性键
        app.openUrl(shopUrl);
    }).on("check", function (checked) {
        //监听勾选框
        storage.put(KEY_CHECK_UPDATE_PASS, checked);
    }).show();
}
