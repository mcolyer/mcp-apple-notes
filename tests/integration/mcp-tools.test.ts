import { describe, it, expect, vi, beforeEach } from "vitest";
import { createNote, searchNotes, getNoteContent } from "@/tools/handlers.js";
import { AppleNotesManager } from "@/services/appleNotesManager.js";
import { createMockParams, createMockNote, validateToolResponse } from "../helpers/testHelpers.js";
import { sampleNote1, sampleNote2, sampleNote3, allSampleNotes } from "../fixtures/sampleNotes.js";

// Mock the AppleNotesManager
vi.mock("@/services/appleNotesManager.js");
const MockAppleNotesManager = vi.mocked(AppleNotesManager);

describe("MCP Tools Integration", () => {
  let mockManager: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockManager = {
      createNote: vi.fn(),
      searchNotes: vi.fn(),
      getNoteContent: vi.fn(),
    };
    MockAppleNotesManager.mockImplementation(() => mockManager);
  });

  describe("createNote tool", () => {
    it("should create a note successfully and return proper MCP response", async () => {
      const mockNote = createMockNote({
        title: "New Note",
        content: "New content",
        tags: ["test", "integration"],
      });
      mockManager.createNote.mockReturnValue(mockNote);

      const params = createMockParams.createNote({
        title: "New Note",
        content: "New content",
        tags: ["test", "integration"],
      });

      const result = await createNote({ name: "create-note", arguments: params });

      expect(mockManager.createNote).toHaveBeenCalledWith(
        "New Note",
        "New content",
        ["test", "integration"]
      );

      validateToolResponse(result);
      expect(result.content[0].text).toContain("Created note successfully");
      expect(result.content[0].text).toContain("New Note");
      expect(result.content[0].text).toContain("test-id");
    });

    it("should handle note creation failure", async () => {
      mockManager.createNote.mockReturnValue(null);

      const params = createMockParams.createNote();
      const result = await createNote({ name: "create-note", arguments: params });

      validateToolResponse(result);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Failed to create note");
    });

    it("should handle missing title parameter", async () => {
      const params = { content: "Content without title" };
      const result = await createNote({ name: "create-note", arguments: params });

      validateToolResponse(result);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Title is required");
    });

    it("should handle missing content parameter", async () => {
      const params = { title: "Title without content" };
      const result = await createNote({ name: "create-note", arguments: params });

      validateToolResponse(result);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Content is required");
    });

    it("should handle optional parameters correctly", async () => {
      const mockNote = createMockNote();
      mockManager.createNote.mockReturnValue(mockNote);

      // Test with only title and content (no tags)
      const params = { title: "Test", content: "Content" };
      await createNote({ name: "create-note", arguments: params });

      expect(mockManager.createNote).toHaveBeenCalledWith("Test", "Content", []);
    });

    it("should format the response with note details", async () => {
      const timestamp = new Date("2024-01-01T12:00:00Z");
      const mockNote = createMockNote({
        id: "note-123",
        title: "Important Note",
        content: "This is important content",
        tags: ["important", "work"],
        created: timestamp,
        modified: timestamp,
      });
      mockManager.createNote.mockReturnValue(mockNote);

      const params = createMockParams.createNote({
        title: "Important Note",
        content: "This is important content",
        tags: ["important", "work"],
      });

      const result = await createNote({ name: "create-note", arguments: params });

      const responseText = result.content[0].text;
      expect(responseText).toContain("Created note successfully");
      expect(responseText).toContain("ID: note-123");
      expect(responseText).toContain("Title: Important Note");
      expect(responseText).toContain("Tags: important, work");
      expect(responseText).toContain("Created: 2024-01-01T12:00:00.000Z");
    });
  });

  describe("searchNotes tool", () => {
    it("should search notes successfully and return formatted results", async () => {
      mockManager.searchNotes.mockReturnValue([sampleNote1, sampleNote2, sampleNote3]);

      const params = createMockParams.searchNotes({ query: "meeting" });
      const result = await searchNotes({ name: "search-notes", arguments: params });

      expect(mockManager.searchNotes).toHaveBeenCalledWith("meeting");

      validateToolResponse(result);
      const responseText = result.content[0].text;
      expect(responseText).toContain("Found 3 notes");
      expect(responseText).toContain("Meeting Notes");
      expect(responseText).toContain("Shopping List");
      expect(responseText).toContain("Project Ideas");
    });

    it("should handle empty search results", async () => {
      mockManager.searchNotes.mockReturnValue([]);

      const params = createMockParams.searchNotes({ query: "nonexistent" });
      const result = await searchNotes({ name: "search-notes", arguments: params });

      validateToolResponse(result);
      expect(result.content[0].text).toContain("No notes found");
      expect(result.content[0].text).toContain("nonexistent");
    });

    it("should handle missing query parameter", async () => {
      const params = {};
      const result = await searchNotes({ name: "search-notes", arguments: params });

      validateToolResponse(result);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Query is required");
    });

    it("should format search results with proper details", async () => {
      const notes = [
        createMockNote({
          id: "1",
          title: "Work Meeting",
          tags: ["work", "meeting"],
          created: new Date("2024-01-15T10:00:00Z"),
          modified: new Date("2024-01-15T10:30:00Z"),
        }),
        createMockNote({
          id: "2",
          title: "Personal Note",
          tags: ["personal"],
          created: new Date("2024-01-16T08:00:00Z"),
          modified: new Date("2024-01-16T08:00:00Z"),
        }),
      ];
      mockManager.searchNotes.mockReturnValue(notes);

      const params = createMockParams.searchNotes({ query: "note" });
      const result = await searchNotes({ name: "search-notes", arguments: params });

      const responseText = result.content[0].text;
      expect(responseText).toContain("Found 2 notes");
      expect(responseText).toContain("1. Work Meeting (ID: 1)");
      expect(responseText).toContain("2. Personal Note (ID: 2)");
      expect(responseText).toContain("Tags: work, meeting");
      expect(responseText).toContain("Tags: personal");
    });

    it("should handle notes without tags", async () => {
      const noteWithoutTags = createMockNote({
        title: "Untagged Note",
        tags: [],
      });
      mockManager.searchNotes.mockReturnValue([noteWithoutTags]);

      const params = createMockParams.searchNotes({ query: "untagged" });
      const result = await searchNotes({ name: "search-notes", arguments: params });

      const responseText = result.content[0].text;
      expect(responseText).toContain("Tags: (none)");
    });
  });

  describe("getNoteContent tool", () => {
    it("should get note content successfully", async () => {
      const expectedContent = "This is the full content of the note with multiple lines.\n\nSecond paragraph here.";
      mockManager.getNoteContent.mockReturnValue(expectedContent);

      const params = createMockParams.getNoteContent({ title: "My Note" });
      const result = await getNoteContent({ name: "get-note-content", arguments: params });

      expect(mockManager.getNoteContent).toHaveBeenCalledWith("My Note");

      validateToolResponse(result);
      const responseText = result.content[0].text;
      expect(responseText).toContain("Content of note 'My Note':");
      expect(responseText).toContain(expectedContent);
    });

    it("should handle empty content", async () => {
      mockManager.getNoteContent.mockReturnValue("");

      const params = createMockParams.getNoteContent({ title: "Empty Note" });
      const result = await getNoteContent({ name: "get-note-content", arguments: params });

      validateToolResponse(result);
      const responseText = result.content[0].text;
      expect(responseText).toContain("Content of note 'Empty Note':");
      expect(responseText).toContain("(Note is empty)");
    });

    it("should handle missing title parameter", async () => {
      const params = {};
      const result = await getNoteContent({ name: "get-note-content", arguments: params });

      validateToolResponse(result);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Title is required");
    });

    it("should handle note not found scenario", async () => {
      mockManager.getNoteContent.mockReturnValue("");

      const params = createMockParams.getNoteContent({ title: "Nonexistent Note" });
      const result = await getNoteContent({ name: "get-note-content", arguments: params });

      validateToolResponse(result);
      const responseText = result.content[0].text;
      expect(responseText).toContain("Content of note 'Nonexistent Note':");
      expect(responseText).toContain("(Note is empty)");
    });

    it("should preserve formatting in note content", async () => {
      const formattedContent = `Title: My Important Note

Key Points:
• Point 1
• Point 2
  - Sub-point A
  - Sub-point B

Summary:
This note contains various formatting elements including:
- Bullet points
- Indentation
- Multiple paragraphs

End of note.`;

      mockManager.getNoteContent.mockReturnValue(formattedContent);

      const params = createMockParams.getNoteContent({ title: "Formatted Note" });
      const result = await getNoteContent({ name: "get-note-content", arguments: params });

      const responseText = result.content[0].text;
      expect(responseText).toContain("Content of note 'Formatted Note':");
      expect(responseText).toContain(formattedContent);
    });
  });

  describe("error handling across all tools", () => {
    it("should handle AppleNotesManager instantiation errors in createNote", async () => {
      MockAppleNotesManager.mockImplementation(() => {
        throw new Error("Failed to initialize Apple Notes manager");
      });

      const params = createMockParams.createNote();
      const result = await createNote({ name: "create-note", arguments: params });

      validateToolResponse(result);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error creating note");
      expect(result.content[0].text).toContain("Failed to initialize Apple Notes manager");
    });

    it("should handle AppleNotesManager instantiation errors in searchNotes", async () => {
      MockAppleNotesManager.mockImplementation(() => {
        throw new Error("Failed to initialize Apple Notes manager");
      });

      const params = createMockParams.searchNotes();
      const result = await searchNotes({ name: "search-notes", arguments: params });

      validateToolResponse(result);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error searching notes");
      expect(result.content[0].text).toContain("Failed to initialize Apple Notes manager");
    });

    it("should handle AppleNotesManager instantiation errors in getNoteContent", async () => {
      MockAppleNotesManager.mockImplementation(() => {
        throw new Error("Failed to initialize Apple Notes manager");
      });

      const params = createMockParams.getNoteContent();
      const result = await getNoteContent({ name: "get-note-content", arguments: params });

      validateToolResponse(result);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error retrieving note content");
      expect(result.content[0].text).toContain("Failed to initialize Apple Notes manager");
    });

    it("should handle unexpected errors gracefully in createNote", async () => {
      mockManager.createNote.mockImplementation(() => {
        throw new Error("Unexpected AppleScript error");
      });

      const params = createMockParams.createNote();
      const result = await createNote({ name: "create-note", arguments: params });

      validateToolResponse(result);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error creating note");
      expect(result.content[0].text).toContain("Unexpected AppleScript error");
    });

    it("should handle non-Error exceptions", async () => {
      mockManager.searchNotes.mockImplementation(() => {
        throw "String error";
      });

      const params = createMockParams.searchNotes();
      const result = await searchNotes({ name: "search-notes", arguments: params });

      validateToolResponse(result);
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error searching notes");
      expect(result.content[0].text).toContain("Unknown error");
    });
  });

  describe("parameter validation", () => {
    it("should validate string parameters", async () => {
      const invalidParams = { title: 123, content: "valid content" };
      const result = await createNote({ name: "create-note", arguments: invalidParams });

      validateToolResponse(result);
      expect(result.isError).toBe(true);
    });

    it("should validate array parameters", async () => {
      const mockNote = createMockNote();
      mockManager.createNote.mockReturnValue(mockNote);

      const invalidParams = { title: "Valid Title", content: "Valid content", tags: "not-an-array" };
      const result = await createNote({ name: "create-note", arguments: invalidParams });

      // Should still work but treat tags as empty array
      expect(mockManager.createNote).toHaveBeenCalledWith("Valid Title", "Valid content", []);
    });
  });

  describe("MCP response structure compliance", () => {
    it("should return valid MCP response structure for all tools", async () => {
      const mockNote = createMockNote();
      mockManager.createNote.mockReturnValue(mockNote);
      mockManager.searchNotes.mockReturnValue([mockNote]);
      mockManager.getNoteContent.mockReturnValue("content");

      const tools = [
        { tool: createNote, params: createMockParams.createNote() },
        { tool: searchNotes, params: createMockParams.searchNotes() },
        { tool: getNoteContent, params: createMockParams.getNoteContent() },
      ];

      for (const { tool, params } of tools) {
        const result = await tool({ name: "tool-name", arguments: params });
        
        validateToolResponse(result);
        expect(typeof result.content[0].text).toBe("string");
        expect(result.content[0].text.length).toBeGreaterThan(0);
      }
    });
  });
});