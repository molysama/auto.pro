module.exports = {
  preset: 'ts-jest',
  globals: {
    sleep: (low, up) => 1,
    $shell: undefined,
    Tap: () => 1,
    press: () => 1,
    random: () => 1,
    swipe: () => 1,
    gesture: () => 1,
    captureScreen: () => {}
  },
  coverageDirectory: 'coverage',
//   coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: ['packages/*/src/**/*.ts'],
  watchPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@auto\.pro/(.*?)$': '<rootDir>/packages/$1/src'
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)']
}