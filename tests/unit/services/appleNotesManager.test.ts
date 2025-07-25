import { AppleNotesManager } from "@/services/appleNotesManager.js";
import * as appleScriptModule from "@/utils/applescript.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  mockEmptySearchResults,
  mockFailureResult,
  mockNoteContent,
  mockSearchResults,
  mockSuccessResult,
} from "../../fixtures/mockAppleScriptResults.js";
import { createMockNote, mockDateNow, restoreDateNow } from "../../helpers/testHelpers.js";

// Mock the applescript module
vi.mock("@/utils/applescript.js");
const mockRunAppleScript = vi.mocked(appleScriptModule.runAppleScript);

describe("AppleNotesManager", () => {
  let manager: AppleNotesManager;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new AppleNotesManager();
  });

  describe("createNote", () => {
    it("should create a note successfully", () => {
      const timestamp = mockDateNow();
      mockRunAppleScript.mockReturnValue(mockSuccessResult);

      const result = manager.createNote("Test Note", "Test content", ["tag1", "tag2"]);

      expect(result).toEqual({
        id: timestamp.toString(),
        title: "Test Note",
        content: "Test content",
        tags: ["tag1", "tag2"],
        created: new Date(timestamp),
        modified: new Date(timestamp),
      });

      restoreDateNow();
    });

    it("should format content for AppleScript", () => {
      mockRunAppleScript.mockReturnValue(mockSuccessResult);

      manager.createNote("Test", 'Line 1\nLine 2\tTab\n"Quotes"');

      const expectedScript = expect.stringContaining(
        'body:"Line 1<br>Line 2<br>Tab<br>\\"Quotes\\""'
      );
      expect(mockRunAppleScript).toHaveBeenCalledWith(expectedScript);
    });

    it("should handle empty content", () => {
      mockRunAppleScript.mockReturnValue(mockSuccessResult);

      const result = manager.createNote("Test", "");

      expect(result).not.toBeNull();
      expect(mockRunAppleScript).toHaveBeenCalledWith(expect.stringContaining('body:""'));
    });

    it("should handle empty tags array", () => {
      const timestamp = mockDateNow();
      mockRunAppleScript.mockReturnValue(mockSuccessResult);

      const result = manager.createNote("Test", "Content");

      expect(result).toEqual({
        id: timestamp.toString(),
        title: "Test",
        content: "Content",
        tags: [],
        created: new Date(timestamp),
        modified: new Date(timestamp),
      });

      restoreDateNow();
    });

    it("should return null on AppleScript failure", () => {
      mockRunAppleScript.mockReturnValue(mockFailureResult);

      const result = manager.createNote("Test", "Content");

      expect(result).toBeNull();
      expect(global.consoleMock.error).toHaveBeenCalledWith(
        "Failed to create note:",
        mockFailureResult.error
      );
    });

    it("should generate correct AppleScript command", () => {
      mockRunAppleScript.mockReturnValue(mockSuccessResult);

      manager.createNote("My Note", "My Content");

      const expectedScript = `
      tell application "Notes"
        tell account "iCloud"
          make new note with properties {name:"My Note", body:"My Content"}
        end tell
      end tell
    `;

      expect(mockRunAppleScript).toHaveBeenCalledWith(expectedScript);
    });

    it("should escape quotes in content but not title", () => {
      mockRunAppleScript.mockReturnValue(mockSuccessResult);

      manager.createNote('Title with "quotes"', 'Content with "quotes"');

      // Check that the script was called (title quotes are not escaped in the current implementation)
      expect(mockRunAppleScript).toHaveBeenCalledWith(
        expect.stringContaining('name:"Title with "quotes""')
      );
      // Content quotes should be escaped
      expect(mockRunAppleScript).toHaveBeenCalledWith(
        expect.stringContaining('body:"Content with \\"quotes\\""')
      );
    });
  });

  describe("searchNotes", () => {
    it("should return array of notes on successful search", () => {
      const timestamp = mockDateNow();
      mockRunAppleScript.mockReturnValue(mockSearchResults);

      const result = manager.searchNotes("meeting");

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        id: timestamp.toString(),
        title: "Meeting Notes",
        content: "",
        tags: [],
        created: new Date(timestamp),
        modified: new Date(timestamp),
      });
      expect(result[1].title).toBe("Shopping List");
      expect(result[2].title).toBe("Project Ideas");

      restoreDateNow();
    });

    it("should return empty array when no notes found", () => {
      mockRunAppleScript.mockReturnValue(mockEmptySearchResults);

      const result = manager.searchNotes("nonexistent");

      expect(result).toEqual([]);
    });

    it("should return empty array on AppleScript failure", () => {
      mockRunAppleScript.mockReturnValue(mockFailureResult);

      const result = manager.searchNotes("test");

      expect(result).toEqual([]);
      expect(global.consoleMock.error).toHaveBeenCalledWith(
        "Failed to search notes:",
        mockFailureResult.error
      );
    });

    it("should sanitize search query", () => {
      mockRunAppleScript.mockReturnValue(mockEmptySearchResults);

      manager.searchNotes('search "with quotes"');

      const expectedScript = `
      tell application "Notes"
        tell account "iCloud"
          get name of notes where name contains "search \\"with quotes\\""
        end tell
      end tell
    `;

      expect(mockRunAppleScript).toHaveBeenCalledWith(expectedScript);
    });

    it("should generate correct AppleScript command", () => {
      mockRunAppleScript.mockReturnValue(mockEmptySearchResults);

      manager.searchNotes("test query");

      const expectedScript = `
      tell application "Notes"
        tell account "iCloud"
          get name of notes where name contains "test query"
        end tell
      end tell
    `;

      expect(mockRunAppleScript).toHaveBeenCalledWith(expectedScript);
    });

    it("should handle comma-separated results correctly", () => {
      mockRunAppleScript.mockReturnValue({
        success: true,
        output: "Note 1, Note 2,Note 3 ,  Note 4  ",
      });

      const result = manager.searchNotes("test");

      expect(result).toHaveLength(4);
      expect(result[0].title).toBe("Note 1");
      expect(result[1].title).toBe("Note 2");
      expect(result[2].title).toBe("Note 3");
      expect(result[3].title).toBe("Note 4");
    });

    it("should filter out empty results", () => {
      mockRunAppleScript.mockReturnValue({
        success: true,
        output: "Note 1,,Note 2,",
      });

      const result = manager.searchNotes("test");

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Note 1");
      expect(result[1].title).toBe("Note 2");
    });
  });

  describe("getNoteContent", () => {
    it("should return note content on success", () => {
      mockRunAppleScript.mockReturnValue(mockNoteContent);

      const result = manager.getNoteContent("Test Note");

      expect(result).toBe(mockNoteContent.output);
    });

    it("should return empty string on AppleScript failure", () => {
      mockRunAppleScript.mockReturnValue(mockFailureResult);

      const result = manager.getNoteContent("Test Note");

      expect(result).toBe("");
      expect(global.consoleMock.error).toHaveBeenCalledWith(
        "Failed to get note content:",
        mockFailureResult.error
      );
    });

    it("should sanitize note title", () => {
      mockRunAppleScript.mockReturnValue(mockNoteContent);

      manager.getNoteContent('Note with "quotes"');

      const expectedScript = `
      tell application "Notes"
        tell account "iCloud"
          get body of note "Note with \\"quotes\\""
        end tell
      end tell
    `;

      expect(mockRunAppleScript).toHaveBeenCalledWith(expectedScript);
    });

    it("should generate correct AppleScript command", () => {
      mockRunAppleScript.mockReturnValue(mockNoteContent);

      manager.getNoteContent("My Note");

      const expectedScript = `
      tell application "Notes"
        tell account "iCloud"
          get body of note "My Note"
        end tell
      end tell
    `;

      expect(mockRunAppleScript).toHaveBeenCalledWith(expectedScript);
    });

    it("should handle empty content", () => {
      mockRunAppleScript.mockReturnValue({
        success: true,
        output: "",
      });

      const result = manager.getNoteContent("Empty Note");

      expect(result).toBe("");
    });

    it("should preserve whitespace in content", () => {
      const contentWithWhitespace = "  Content with  \n  whitespace  \t  ";
      mockRunAppleScript.mockReturnValue({
        success: true,
        output: contentWithWhitespace,
      });

      const result = manager.getNoteContent("Test Note");

      expect(result).toBe(contentWithWhitespace);
    });
  });

  describe("formatContent helper", () => {
    it("should be tested indirectly through createNote", () => {
      mockRunAppleScript.mockReturnValue(mockSuccessResult);

      // Test various content formatting scenarios
      const testCases = [
        { input: "Simple text", expected: "Simple text" },
        { input: "Line 1\nLine 2", expected: "Line 1<br>Line 2" },
        { input: "Tab\there", expected: "Tab<br>here" },
        { input: 'Quote "test"', expected: 'Quote \\"test\\"' },
        { input: "", expected: "" },
      ];

      for (const testCase of testCases) {
        vi.clearAllMocks();
        manager.createNote("Test", testCase.input);
        expect(mockRunAppleScript).toHaveBeenCalledWith(
          expect.stringContaining(`body:"${testCase.expected}"`)
        );
      }
    });
  });

  describe("iCloud account configuration", () => {
    it("should use iCloud account in all AppleScript commands", () => {
      mockRunAppleScript.mockReturnValue(mockSuccessResult);

      manager.createNote("Test", "Content");
      manager.searchNotes("query");
      manager.getNoteContent("Note");

      expect(mockRunAppleScript).toHaveBeenCalledTimes(3);

      // Check that all calls include the iCloud account reference
      for (const call of mockRunAppleScript.mock.calls) {
        expect(call[0]).toContain('tell account "iCloud"');
      }
    });
  });
});
