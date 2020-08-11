"use strict";
var c1 = '';
var c2 = '';
var image = {
    width: 123,
    height: 456,
    getWidth: function () {
        return this.width;
    },
    getHeight: function () {
        return this.height;
    },
    saveTo: function (path) { },
    pixel: function (x, y) {
        return 0xFFFFFF;
    },
    recycle: function () { },
    mat: {}
};
colors.isSimilar(c1, c2);
images.findColorEquals(image, '', 123, 456);
