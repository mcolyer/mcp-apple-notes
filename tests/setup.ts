/**
 * Test setup file for Vitest
 * Configures mocks and global test utilities
 */

import { vi } from "vitest";

// Mock Node.js child_process for AppleScript testing
vi.mock("node:child_process", () => ({
  execSync: vi.fn(),
}));

// Global test utilities
global.createMockAppleScriptResult = (success: boolean, output: string, error?: string) => ({
  success,
  output,
  ...(error && { error }),
});

// Environment detection for macOS-specific tests
global.isMacOS = process.platform === "darwin";

// Console mock to reduce noise in tests
global.consoleMock = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
};

// Replace console methods during tests
beforeEach(() => {
  vi.clearAllMocks();
  console.error = global.consoleMock.error;
  console.log = global.consoleMock.log;
  console.warn = global.consoleMock.warn;
});