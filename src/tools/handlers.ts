import { AppleNotesManager } from "@/services/appleNotesManager.js";
import type { CreateNoteParams, GetNoteParams, SearchParams } from "@/types.js";

/**
 * Tool handler functions for testing purposes
 * These match the exact logic from the main server implementation
 */

export const createNote = async (request: { name: string; arguments: CreateNoteParams }) => {
  const { title, content, tags = [] } = request.arguments;

  if (!title || typeof title !== "string") {
    return {
      content: [
        {
          type: "text" as const,
          text: "Title is required and must be a string",
        },
      ],
      isError: true,
    };
  }

  if (!content || typeof content !== "string") {
    return {
      content: [
        {
          type: "text" as const,
          text: "Content is required and must be a string",
        },
      ],
      isError: true,
    };
  }

  try {
    const notesManager = new AppleNotesManager();
    const note = notesManager.createNote(title, content, Array.isArray(tags) ? tags : []);

    if (!note) {
      return {
        content: [
          {
            type: "text" as const,
            text: "Failed to create note. Please check your Apple Notes configuration.",
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Created note successfully: "${note.title}"\nID: ${note.id}\nTitle: ${note.title}\nTags: ${note.tags.length > 0 ? note.tags.join(", ") : "(none)"}\nCreated: ${note.created.toISOString()}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error creating note: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
};

export const searchNotes = async (request: { name: string; arguments: SearchParams }) => {
  const { query } = request.arguments;

  if (!query || typeof query !== "string") {
    return {
      content: [
        {
          type: "text" as const,
          text: "Query is required and must be a string",
        },
      ],
      isError: true,
    };
  }

  try {
    const notesManager = new AppleNotesManager();
    const notes = notesManager.searchNotes(query);

    if (notes.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `No notes found matching your query: "${query}"`,
          },
        ],
      };
    }

    const notesList = notes
      .map((note, index) => {
        const tagsText = note.tags.length > 0 ? note.tags.join(", ") : "(none)";
        return `${index + 1}. ${note.title} (ID: ${note.id})\n   Tags: ${tagsText}\n   Created: ${note.created.toISOString()}`;
      })
      .join("\n\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${notes.length} notes matching "${query}":\n\n${notesList}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error searching notes: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
};

export const getNoteContent = async (request: { name: string; arguments: GetNoteParams }) => {
  const { title } = request.arguments;

  if (!title || typeof title !== "string") {
    return {
      content: [
        {
          type: "text" as const,
          text: "Title is required and must be a string",
        },
      ],
      isError: true,
    };
  }

  try {
    const notesManager = new AppleNotesManager();
    const content = notesManager.getNoteContent(title);

    const displayContent = content.trim() === "" ? "(Note is empty)" : content;

    return {
      content: [
        {
          type: "text" as const,
          text: `Content of note '${title}':\n\n${displayContent}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error retrieving note content: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
};
