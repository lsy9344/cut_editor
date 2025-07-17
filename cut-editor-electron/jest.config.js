module.exports = {
  // Use the 'ts-jest' preset to allow Jest to understand and execute TypeScript code.
  preset: 'ts-jest',

  // Set the test environment to 'jsdom' to run tests in a browser-like environment (DOM).
  testEnvironment: 'jsdom',

  // Set the root directory where test files are located.
  roots: ['<rootDir>/src'],

  // Specify the file patterns that Jest will recognize as test files.
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)',
  ],

  // Configure how to transform specific file types. .ts and .tsx files are transformed using 'ts-jest'.
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Set up module path aliases to use instead of long relative paths.
  moduleNameMapper: {
    '^@main/(.*)$': '<rootDir>/src/main/$1',
    '^@renderer/(.*)$': '<rootDir>/src/renderer/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    // Mock static files like images and fonts in tests.
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock for CSS modules
    '\\.(ttf|woff|woff2|eot|svg|png|jpg|jpeg|gif)$': '<rootDir>/src/test/__mocks__/fileMock.js',
  },

  // Specify a setup file to run before each test.
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],

  // Specify the file range from which to collect code coverage.
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts', // Exclude .d.ts type definition files
    '!src/test/**/*',   // Exclude test-related files
  ],

  // Specify the directory where coverage reports will be generated.
  coverageDirectory: 'coverage',

  // Specify the types of coverage reporters to generate (text, lcov, html).
  coverageReporters: ['text', 'lcov', 'html'],
};
