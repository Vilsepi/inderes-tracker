// eslint-disable-next-line no-undef
module.exports = {
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!dist/*',
  ],
  preset: 'ts-jest',
  roots: [
    '<rootDir>/__tests__',
    '<rootDir>/src'
  ],
  testEnvironment: 'node',
  testMatch: [
    '**/*.test.ts'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
