module.exports = {
  preset: 'ts-jest',
  globals: {
    "__TEST_GLOBAL__": 'test',
    sleep: (low, up) => 1,
    "$shell": {
      "checkAccess": function (param) {
        return true
      }
    },
    threads: {
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
    random: () => 1,
    swipe: () => 1,
    gesture: () => 1,
    captureScreen: () => {}
  },
  // collectCoverage: true,
  collectCoverageFrom: ['packages/*/src/**/*.ts'],
  watchPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@auto\.pro/(.*?)$': '<rootDir>/packages/$1/src'
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.ts?(x)']
}