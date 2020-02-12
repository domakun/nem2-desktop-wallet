const path = require('path')
module.exports = {
  rootDir: path.join(__dirname),
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue',
    'ts',
    'tsx',
    'node'
  ],
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],
  transform: {
    "^.+\\.js$": "babel-jest",
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    "^.+\\.ts$": "ts-jest",
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@MOCKS/(.*)$": "<rootDir>/__mocks__/$1",
    "\\.(css|less)$": "identity-obj-proxy"
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '**/__tests__/components/**/*.(ts)',
    '**/__tests__/core/**/*.(ts)',
    '**/__tests__/store/**/*.(ts)',
    '**/__tests__/views/**/*.(ts)',
  ],
  testURL: 'http://localhost/',
  // watchPlugins: [
  //   'jest-watch-typeahead/filename',
  //   'jest-watch-typeahead/testname'
  // ],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "**/*.ts",
    "**/*.vue",
    "!**/node_modules/**",
    "!**/__mocks__/**",
    "!**/*.png",
    "!**/*.d.ts",
    "!**/*.less",
  ],
}
