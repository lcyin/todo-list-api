/**
 * Jest setup file for database cleanup and other test utilities
 */

// Increase timeout for tests that involve database operations
jest.setTimeout(15000);

// Global cleanup tracking
const globalCleanupTasks: (() => Promise<void>)[] = [];

// Add a cleanup task to be executed after all tests
export function addGlobalCleanupTask(task: () => Promise<void>): void {
  globalCleanupTasks.push(task);
}

// Execute cleanup tasks after all tests are done
afterAll(async () => {
  for (const task of globalCleanupTasks) {
    try {
      await task();
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  }
  globalCleanupTasks.length = 0;
});

// Suppress console.log in tests to reduce noise (but keep errors)
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = (...args: unknown[]) => {
    // Only log if it's a test-related message or in verbose mode
    if (
      process.env.JEST_VERBOSE === "true" ||
      args.some(arg => typeof arg === "string" && arg.includes("test"))
    ) {
      originalConsoleLog(...args);
    }
  };
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});
