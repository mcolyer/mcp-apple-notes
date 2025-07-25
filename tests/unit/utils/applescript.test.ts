import { describe, it, expect, vi, beforeEach } from "vitest";
import { execSync } from "node:child_process";
import { runAppleScript } from "@/utils/applescript.js";
import type { AppleScriptResult } from "@/types.js";

// Mock execSync
vi.mock("node:child_process");
const mockExecSync = vi.mocked(execSync);

describe("runAppleScript", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("successful execution", () => {
    it("should return success result with trimmed output", () => {
      const expectedOutput = "note created successfully";
      mockExecSync.mockReturnValue(`  ${expectedOutput}  \n`);

      const script = 'tell application "Notes" to make new note';
      const result = runAppleScript(script);

      expect(result).toEqual({
        success: true,
        output: expectedOutput,
      });
    });

    it("should sanitize script by removing newlines", () => {
      mockExecSync.mockReturnValue("success");

      const script = `tell application "Notes"
        to make new note
        with properties {name:"test"}`;

      runAppleScript(script);

      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining(`osascript -e 'tell application "Notes"         to make new note         with properties {name:"test"}'`),
        {
          encoding: "utf8",
          timeout: 10000,
        }
      );
    });

    it("should handle empty output", () => {
      mockExecSync.mockReturnValue("");

      const result = runAppleScript("test script");

      expect(result).toEqual({
        success: true,
        output: "",
      });
    });

    it("should trim whitespace from script", () => {
      mockExecSync.mockReturnValue("success");

      runAppleScript("   test script   ");

      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining("osascript -e 'test script'"),
        expect.any(Object)
      );
    });
  });

  describe("error handling", () => {
    it("should handle execution errors", () => {
      const errorMessage = "Apple Notes is not running";
      const error = new Error(errorMessage);
      mockExecSync.mockImplementation(() => {
        throw error;
      });

      const result = runAppleScript("test script");

      expect(result).toEqual({
        success: false,
        output: "",
        error: errorMessage,
      });
    });

    it("should handle timeout errors", () => {
      const timeoutError = new Error("Command timed out after 10000ms");
      timeoutError.name = "TIMEOUT";
      mockExecSync.mockImplementation(() => {
        throw timeoutError;
      });

      const result = runAppleScript("long running script");

      expect(result).toEqual({
        success: false,
        output: "",
        error: "Command timed out after 10000ms",
      });
    });

    it("should handle non-Error exceptions", () => {
      mockExecSync.mockImplementation(() => {
        throw "String error";
      });

      const result = runAppleScript("test script");

      expect(result).toEqual({
        success: false,
        output: "",
        error: "Unknown error occurred while executing AppleScript",
      });
    });

    it("should log errors to console", () => {
      const error = new Error("Test error");
      mockExecSync.mockImplementation(() => {
        throw error;
      });

      runAppleScript("test script");

      expect(global.consoleMock.error).toHaveBeenCalledWith(
        "AppleScript execution failed:",
        error
      );
    });
  });

  describe("script execution parameters", () => {
    it("should use correct encoding and timeout", () => {
      mockExecSync.mockReturnValue("success");

      runAppleScript("test script");

      expect(mockExecSync).toHaveBeenCalledWith(
        expect.any(String),
        {
          encoding: "utf8",
          timeout: 10000,
        }
      );
    });

    it("should construct proper osascript command", () => {
      mockExecSync.mockReturnValue("success");
      const script = 'tell application "Notes" to get name of notes';

      runAppleScript(script);

      expect(mockExecSync).toHaveBeenCalledWith(
        `osascript -e '${script}'`,
        expect.any(Object)
      );
    });
  });

  describe("script sanitization", () => {
    it("should handle carriage returns", () => {
      mockExecSync.mockReturnValue("success");

      runAppleScript("line1\r\nline2\rline3");

      expect(mockExecSync).toHaveBeenCalledWith(
        "osascript -e 'line1 line2 line3'",
        expect.any(Object)
      );
    });

    it("should handle multiple consecutive newlines", () => {
      mockExecSync.mockReturnValue("success");

      runAppleScript("line1\n\n\nline2");

      expect(mockExecSync).toHaveBeenCalledWith(
        "osascript -e 'line1 line2'",
        expect.any(Object)
      );
    });

    it("should preserve single quotes in script", () => {
      mockExecSync.mockReturnValue("success");
      const script = "tell application 'Notes' to get notes";

      runAppleScript(script);

      expect(mockExecSync).toHaveBeenCalledWith(
        `osascript -e '${script}'`,
        expect.any(Object)
      );
    });
  });

  describe("return type validation", () => {
    it("should return AppleScriptResult type on success", () => {
      mockExecSync.mockReturnValue("test output");

      const result = runAppleScript("test");

      // Type assertion to ensure proper typing
      const typedResult: AppleScriptResult = result;
      expect(typedResult.success).toBe(true);
      expect(typedResult.output).toBe("test output");
      expect(typedResult.error).toBeUndefined();
    });

    it("should return AppleScriptResult type on failure", () => {
      mockExecSync.mockImplementation(() => {
        throw new Error("test error");
      });

      const result = runAppleScript("test");

      // Type assertion to ensure proper typing
      const typedResult: AppleScriptResult = result;
      expect(typedResult.success).toBe(false);
      expect(typedResult.output).toBe("");
      expect(typedResult.error).toBe("test error");
    });
  });
});