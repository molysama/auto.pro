
const c1: Color = ''
const c2: Color = ''
const image: Image = {
    width: 123,
    height: 456,
    getWidth() {
        return this.width
    },
    getHeight() {
        return this.height
    },
    saveTo(path) { },
    pixel(x, y) {
        return 0xFFFFFF
    },
    recycle() { },
    mat: {}
}

colors.isSimilar(c1, c2)
images.findColorEquals(image, '', 123, 456)