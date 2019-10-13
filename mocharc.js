module.exports = {
    globals: {
        random: (x, y) => x,
        "__TEST_GLOBAL__": 'test',
        sleep: (low, up) => 1,
        "$shell": {
            "checkAccess": function (param) {
                return true
            }
        },
        images: Object,
        device: {
            width: 1280,
            height: 720
        },
        app: {

        },
        Tap: () => 1,
        press: () => 1,
        swipe: () => 1,
        gesture: () => 1,
        captureScreen: () => { }
    }
}