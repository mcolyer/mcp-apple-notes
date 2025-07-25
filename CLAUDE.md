# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Apple Notes MCP (Model Context Protocol) server that enables AI assistants to interact with Apple Notes on macOS through AppleScript automation. The project supports both traditional MCP server deployment and Desktop Extension (DXT) packaging for single-click installation.

## Architecture

### Core Components

- **MCP Server** (`src/index.ts`): Main server implementation using @modelcontextprotocol/sdk with stdio transport
- **AppleNotesManager** (`src/services/appleNotesManager.ts`): Handles all Apple Notes operations via AppleScript
- **AppleScript Executor** (`src/utils/applescript.ts`): Secure AppleScript execution with timeout and error handling
- **Type Definitions** (`src/types.ts`): TypeScript interfaces for notes and AppleScript results

### Dual Distribution Model

The project supports two deployment modes:

1. **Traditional MCP Server**: Built JavaScript files in `build/` directory, configured in Claude Desktop's MCP settings
2. **Desktop Extension (DXT)**: Self-contained package in `server/` directory with bundled dependencies and enhanced security

### AppleScript Integration

All Apple Notes operations use AppleScript automation targeting the "iCloud" account. The system includes:
- Content sanitization to prevent AppleScript injection
- 10-second timeout for all operations  
- Comprehensive error handling and logging
- Quote escaping for safe script execution

## Development Commands

### Building and Running
```bash
# Install dependencies (preferred)
pnpm install

# Build TypeScript to JavaScript
pnpm exec tsc

# Start MCP server for development
node build/index.js

# Build DXT extension package
pnpm run build:dxt
```

### TypeScript Configuration
- Uses ES2022 target with NodeNext modules
- Path alias `@/*` maps to `src/*`
- Builds to `build/` directory
- Requires `tsc-alias` for path resolution in built files

## Tool Implementation Patterns

### MCP Tools Structure
Each tool follows this pattern:
1. Zod schema validation for inputs
2. AppleNotesManager method call
3. Standardized error handling with `isError: true`
4. User-friendly success/error messages

### Available Tools
- `create-note`: Creates notes with title, content, and optional tags
- `search-notes`: Searches notes by title substring matching
- `get-note-content`: Retrieves full content by exact title match

### Security Considerations
- All user inputs are sanitized before AppleScript execution
- Quote characters are escaped to prevent script injection
- Input length limits enforced in DXT version
- Timeout protection prevents hanging operations

## DXT Extension Features

The DXT branch includes production-ready enhancements:
- Enhanced input validation with configurable limits
- Structured JSON logging for monitoring
- Timeout management (30-second default)
- Process-level exception handling
- Bundled dependencies in `server/` directory
- Complete manifest.json following DXT v0.1 specification

## Platform Requirements

- **macOS only** (uses AppleScript and Apple Notes app)
- **Node.js 20.0.0+** (specified in package.json engines)
- **Apple Notes app** configured with iCloud account
- **User permissions** for AppleScript to access Apple Notes (granted on first use)

## Release Workflow

### Automated Releases

The project uses GitHub Actions for automated DXT extension releases:

**Creating a Release:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

**Release Process:**
1. TypeScript compilation and validation
2. Server directory creation with bundled dependencies  
3. DXT structure validation (manifest, dependencies, server loading)
4. Extension packaging using `@anthropic/dxt` CLI
5. GitHub release creation with comprehensive release notes
6. Artifact upload for debugging (30-day retention)

**Manual Release Trigger:**
- Available via GitHub Actions workflow dispatch
- Supports custom version tags
- Same validation and packaging process

### Continuous Integration

**Test Workflow** (`.github/workflows/test.yml`):
- Triggered on pushes and PRs to main/dxt-extension branches
- Validates TypeScript build and server loading
- Tests DXT structure when manifest exists
- Ensures dependency bundling works correctly

**Release Workflow** (`.github/workflows/release.yml`):
- Triggered on version tags (`v*`) or manual dispatch
- Comprehensive validation and packaging pipeline
- Automated release notes generation
- Support for prerelease versions (beta, alpha, rc)

## Testing and Validation

- Server can be tested by loading built JavaScript files
- Manifest validation through JSON parsing
- AppleScript execution requires actual Apple Notes access
- Automated CI testing for build and structure validation
- No unit test suite currently implemented