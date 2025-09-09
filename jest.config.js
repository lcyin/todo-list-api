module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/**/**/*.int-spec.ts',  // Integration tests
    '**/?(*.)+(spec|test).ts'  // Unit tests
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.int-spec.ts',  // Exclude integration test files from coverage
  ],
    // Add these configurations for your testing strategy
  testTimeout: 15000,           // Increase timeout for API tests
  forceExit: true,              // Fix the hanging issue
  detectOpenHandles: true,      // Help debug open handles
  maxWorkers: 1,                // Run tests sequentially to avoid port conflicts
  verbose: true,                // Show individual test results
};
