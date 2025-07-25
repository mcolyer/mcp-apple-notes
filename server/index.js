import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { AppleNotesManager } from "./services/appleNotesManager.js";

// DXT Configuration and Constants
const DXT_CONFIG = {
  MAX_TITLE_LENGTH: 1000,
  MAX_CONTENT_LENGTH: 50000,
  MAX_QUERY_LENGTH: 500,
  MAX_TAGS: 20,
  MAX_TAG_LENGTH: 100,
  OPERATION_TIMEOUT: 30000
};

// Enhanced logging for DXT environment
const log = {
  info: (message, data = {}) => console.log(JSON.stringify({ level: 'info', message, timestamp: new Date().toISOString(), ...data })),
  error: (message, error = null, data = {}) => console.error(JSON.stringify({ 
    level: 'error', 
    message, 
    error: error?.message || error, 
    stack: error?.stack,
    timestamp: new Date().toISOString(),
    ...data 
  })),
  warn: (message, data = {}) => console.warn(JSON.stringify({ level: 'warn', message, timestamp: new Date().toISOString(), ...data }))
};

// Input sanitization helper
const sanitizeInput = (input, maxLength = 1000) => {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxLength).trim();
};

// Initialize the MCP server with DXT configuration
const server = new McpServer({
    name: "apple-notes-dxt",
    version: "1.0.0",
    description: "DXT-enabled MCP server for interacting with Apple Notes"
});

// Initialize the notes manager
const notesManager = new AppleNotesManager();

log.info("Apple Notes DXT server initializing", { version: "1.0.0" });

// Enhanced tool schemas with security validation
const createNoteSchema = {
    title: z.string()
        .min(1, "Title is required")
        .max(DXT_CONFIG.MAX_TITLE_LENGTH, `Title must be less than ${DXT_CONFIG.MAX_TITLE_LENGTH} characters`)
        .refine(title => !title.includes('\0'), "Title contains invalid characters"),
    content: z.string()
        .min(1, "Content is required")
        .max(DXT_CONFIG.MAX_CONTENT_LENGTH, `Content must be less than ${DXT_CONFIG.MAX_CONTENT_LENGTH} characters`)
        .refine(content => !content.includes('\0'), "Content contains invalid characters"),
    tags: z.array(
        z.string()
            .max(DXT_CONFIG.MAX_TAG_LENGTH, `Tag must be less than ${DXT_CONFIG.MAX_TAG_LENGTH} characters`)
            .refine(tag => !tag.includes('\0'), "Tag contains invalid characters")
    )
        .max(DXT_CONFIG.MAX_TAGS, `Maximum ${DXT_CONFIG.MAX_TAGS} tags allowed`)
        .optional()
};

const searchSchema = {
    query: z.string()
        .min(1, "Search query is required")
        .max(DXT_CONFIG.MAX_QUERY_LENGTH, `Query must be less than ${DXT_CONFIG.MAX_QUERY_LENGTH} characters`)
        .refine(query => !query.includes('\0'), "Query contains invalid characters")
};

const getNoteSchema = {
    title: z.string()
        .min(1, "Note title is required")
        .max(DXT_CONFIG.MAX_TITLE_LENGTH, `Title must be less than ${DXT_CONFIG.MAX_TITLE_LENGTH} characters`)
        .refine(title => !title.includes('\0'), "Title contains invalid characters")
};

// Enhanced timeout wrapper for operations
const withTimeout = (operation, timeoutMs = DXT_CONFIG.OPERATION_TIMEOUT) => {
    return Promise.race([
        operation,
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
        )
    ]);
};

// Register tools with enhanced error handling and security
server.tool("create-note", createNoteSchema, async ({ title, content, tags = [] }) => {
    const sanitizedTitle = sanitizeInput(title, DXT_CONFIG.MAX_TITLE_LENGTH);
    const sanitizedContent = sanitizeInput(content, DXT_CONFIG.MAX_CONTENT_LENGTH);
    const sanitizedTags = tags.map(tag => sanitizeInput(tag, DXT_CONFIG.MAX_TAG_LENGTH));
    
    log.info("Creating note", { title: sanitizedTitle, contentLength: sanitizedContent.length, tagsCount: sanitizedTags.length });
    
    try {
        const note = await withTimeout(
            Promise.resolve(notesManager.createNote(sanitizedTitle, sanitizedContent, sanitizedTags))
        );
        
        if (!note) {
            log.warn("Note creation failed", { title: sanitizedTitle });
            return {
                content: [{
                    type: "text",
                    text: "Failed to create note. Please ensure Apple Notes is accessible and configured properly."
                }],
                isError: true
            };
        }
        
        log.info("Note created successfully", { title: note.title, id: note.id });
        return {
            content: [{
                type: "text",
                text: `✅ Note created successfully: "${note.title}"`
            }]
        };
    }
    catch (error) {
        log.error("Error creating note", error, { title: sanitizedTitle });
        return {
            content: [{
                type: "text",
                text: `Error creating note: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
            }],
            isError: true
        };
    }
});

server.tool("search-notes", searchSchema, async ({ query }) => {
    const sanitizedQuery = sanitizeInput(query, DXT_CONFIG.MAX_QUERY_LENGTH);
    
    log.info("Searching notes", { query: sanitizedQuery });
    
    try {
        const notes = await withTimeout(
            Promise.resolve(notesManager.searchNotes(sanitizedQuery))
        );
        
        const message = notes.length
            ? `Found ${notes.length} notes:\n${notes.map(note => `• ${note.title}`).join('\n')}`
            : "No notes found matching your query";
            
        log.info("Search completed", { query: sanitizedQuery, resultsCount: notes.length });
        
        return {
            content: [{
                type: "text",
                text: message
            }]
        };
    }
    catch (error) {
        log.error("Error searching notes", error, { query: sanitizedQuery });
        return {
            content: [{
                type: "text",
                text: `Error searching notes: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
            }],
            isError: true
        };
    }
});

server.tool("get-note-content", getNoteSchema, async ({ title }) => {
    const sanitizedTitle = sanitizeInput(title, DXT_CONFIG.MAX_TITLE_LENGTH);
    
    log.info("Retrieving note content", { title: sanitizedTitle });
    
    try {
        const content = await withTimeout(
            Promise.resolve(notesManager.getNoteContent(sanitizedTitle))
        );
        
        const result = content || "Note not found";
        
        log.info("Note content retrieved", { 
            title: sanitizedTitle, 
            contentLength: content?.length || 0,
            found: !!content
        });
        
        return {
            content: [{
                type: "text",
                text: result
            }]
        };
    }
    catch (error) {
        log.error("Error retrieving note content", error, { title: sanitizedTitle });
        return {
            content: [{
                type: "text",
                text: `Error retrieving note content: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
            }],
            isError: true
        };
    }
});

// Enhanced server startup with error handling
process.on('uncaughtException', (error) => {
    log.error('Uncaught exception', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    log.error('Unhandled rejection', reason, { promise: promise.toString() });
    process.exit(1);
});

// Start the server with proper error handling
try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    log.info("Apple Notes DXT server connected successfully");
} catch (error) {
    log.error("Failed to start Apple Notes DXT server", error);
    process.exit(1);
}