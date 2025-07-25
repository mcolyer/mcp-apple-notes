import type { AppleScriptResult } from "@/types.js";

export const mockSuccessResult: AppleScriptResult = {
  success: true,
  output: "note created successfully",
};

export const mockFailureResult: AppleScriptResult = {
  success: false,
  output: "",
  error: "Apple Notes is not running",
};

export const mockSearchResults: AppleScriptResult = {
  success: true,
  output: "Meeting Notes, Shopping List, Project Ideas",
};

export const mockEmptySearchResults: AppleScriptResult = {
  success: true,
  output: "",
};

export const mockNoteContent: AppleScriptResult = {
  success: true,
  output: "This is the content of the note with some details.",
};

export const mockTimeoutError: AppleScriptResult = {
  success: false,
  output: "",
  error: "Command timed out after 10000ms",
};

export const mockPermissionError: AppleScriptResult = {
  success: false,
  output: "",
  error: "AppleScript is not allowed assistive access",
};