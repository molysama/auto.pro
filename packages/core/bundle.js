'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isFunction = function (val) { return typeof val === 'function'; };

function createApp() {
    var app = {
        use: function (plugin) {
            if (isFunction(plugin)) {
                plugin(app);
            }
            else if (isFunction(plugin.install)) {
                plugin.install(app);
            }
            return app;
        }
    };
    return app;
}

exports.createApp = createApp;
