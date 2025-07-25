import { vi } from "vitest";
import type { Note, CreateNoteParams, SearchParams, GetNoteParams } from "@/types.js";

/**
 * Helper to create a mock Note object with optional overrides
 */
export const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: "test-id",
  title: "Test Note",
  content: "Test content",
  tags: ["test"],
  created: new Date("2024-01-01T00:00:00Z"),
  modified: new Date("2024-01-01T00:00:00Z"),
  ...overrides,
});

/**
 * Helper to create mock MCP tool parameters
 */
export const createMockParams = {
  createNote: (overrides: Partial<CreateNoteParams> = {}): CreateNoteParams => ({
    title: "Test Note",
    content: "Test content",
    tags: ["test"],
    ...overrides,
  }),
  
  searchNotes: (overrides: Partial<SearchParams> = {}): SearchParams => ({
    query: "test",
    ...overrides,
  }),
  
  getNoteContent: (overrides: Partial<GetNoteParams> = {}): GetNoteParams => ({
    title: "Test Note",
    ...overrides,
  }),
};

/**
 * Helper to mock Date.now() and Date constructor for consistent timestamps in tests
 */
export const mockDateNow = (timestamp: number = 1640995200000) => {
  const RealDate = Date;
  const MockDate = vi.fn(() => new RealDate(timestamp)) as any;
  MockDate.now = vi.fn(() => timestamp);
  
  // Copy static methods from Date
  Object.setPrototypeOf(MockDate.prototype, RealDate.prototype);
  Object.defineProperty(MockDate, 'prototype', {
    value: RealDate.prototype,
    writable: false
  });
  
  vi.stubGlobal("Date", MockDate);
  return timestamp;
};

/**
 * Helper to restore Date.now() mock
 */
export const restoreDateNow = () => {
  vi.unstubAllGlobals();
};

/**
 * Helper to create MCP tool response structure
 */
export const createMockToolResponse = (text: string, isError = false) => ({
  content: [
    {
      type: "text" as const,
      text,
    },
  ],
  ...(isError && { isError: true }),
});

/**
 * Helper to validate MCP tool response structure
 */
export const validateToolResponse = (response: any) => {
  expect(response).toHaveProperty("content");
  expect(Array.isArray(response.content)).toBe(true);
  expect(response.content.length).toBeGreaterThan(0);
  expect(response.content[0]).toHaveProperty("type", "text");
  expect(response.content[0]).toHaveProperty("text");
};

/**
 * Helper to create environment-aware test descriptions
 */
export const testOnMacOS = global.isMacOS ? test : test.skip;
export const testSkipOnMacOS = global.isMacOS ? test.skip : test;