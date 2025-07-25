import type { AppleScriptResult } from "@/types.js";
import { vi } from "vitest";
import {
  mockEmptySearchResults,
  mockFailureResult,
  mockNoteContent,
  mockPermissionError,
  mockSearchResults,
  mockSuccessResult,
  mockTimeoutError,
} from "../fixtures/mockAppleScriptResults.js";

/**
 * Mock implementation of the AppleScript execution function
 */
export const createMockAppleScript = () => {
  const mockExecSync = vi.fn();

  return {
    mockExecSync,

    /**
     * Configure mock to return success for any script
     */
    mockSuccess: (output = "success") => {
      mockExecSync.mockReturnValue(output);
    },

    /**
     * Configure mock to throw an error (simulating AppleScript failure)
     */
    mockFailure: (errorMessage = "AppleScript failed") => {
      const error = new Error(errorMessage);
      mockExecSync.mockImplementation(() => {
        throw error;
      });
    },

    /**
     * Configure mock to timeout
     */
    mockTimeout: () => {
      const error = new Error("Command timed out after 10000ms");
      error.name = "TIMEOUT";
      mockExecSync.mockImplementation(() => {
        throw error;
      });
    },

    /**
     * Configure mock based on script content
     */
    mockConditional: (responses: Record<string, string | Error>) => {
      mockExecSync.mockImplementation((command: string) => {
        for (const [pattern, response] of Object.entries(responses)) {
          if (command.includes(pattern)) {
            if (response instanceof Error) {
              throw response;
            }
            return response;
          }
        }
        return "default response";
      });
    },

    /**
     * Reset all mocks
     */
    reset: () => {
      mockExecSync.mockReset();
    },
  };
};

/**
 * Predefined mock scenarios for common test cases
 */
export const mockScenarios = {
  createNoteSuccess: () => mockSuccessResult,
  createNoteFailure: () => mockFailureResult,
  searchNotesWithResults: () => mockSearchResults,
  searchNotesEmpty: () => mockEmptySearchResults,
  getNoteContent: () => mockNoteContent,
  timeout: () => mockTimeoutError,
  permissionDenied: () => mockPermissionError,
};

/**
 * Helper to mock the runAppleScript function directly
 */
export const mockRunAppleScript = (result: AppleScriptResult) => {
  return vi.fn().mockResolvedValue(result);
};
