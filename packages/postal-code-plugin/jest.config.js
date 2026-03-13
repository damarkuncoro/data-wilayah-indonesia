module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@damarkuncoro/postal-code-plugin/(.*)$': '<rootDir>/src/$1',
    '^@damarkuncoro/data-wilayah-indonesia$': '<rootDir>/../data-wilayah-indonesia/src/index.ts',
    '^@damarkuncoro/data-wilayah-indonesia/(.*)$': '<rootDir>/../data-wilayah-indonesia/src/$1'
  },
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
