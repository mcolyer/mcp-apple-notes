# 📝 Apple Notes MCP Server

**Apple Notes MCP Server** is a Model Context Protocol server that enables seamless interaction with Apple Notes through natural language. Create, search, and retrieve notes effortlessly using Claude or other AI assistants! 🎉

Available as both a **Desktop Extension (DXT)** for single-click installation and a traditional MCP server for manual configuration.

**🚀 [Download Latest DXT Release](https://github.com/mcolyer/mcp-apple-notes/releases/latest)** | **📚 [View All Releases](https://github.com/mcolyer/mcp-apple-notes/releases)**

<a href="https://glama.ai/mcp/servers/ayr26szokg">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/ayr26szokg/badge" alt="Apple Notes Server MCP server" />
</a>

## 🎯 Features

- **Create Notes:** Quickly create new notes with titles, content, and tags 📝
- **Search Notes:** Find notes using powerful search capabilities 🔍
- **Retrieve Content:** Get the full content of any note by its title 📖
- **iCloud Integration:** Works directly with your iCloud Notes account ☁️
- **Production Security:** Enhanced input validation and timeout protection
- **Single-Click Install:** Available as Desktop Extension (DXT) for compatible AI apps

## 🚀 Getting Started

### Prerequisites

- **macOS** with Apple Notes app configured
- **Node.js** 20.0.0 or higher
- Compatible AI desktop application supporting DXT or MCP

## 📦 Installation Methods

### Option 1: Desktop Extension (DXT) - Recommended

**Single-click installation** for compatible AI desktop applications:

1. **Download the latest DXT release:**
   - [📦 Download latest DXT](https://github.com/mcolyer/mcp-apple-notes/releases/latest) 
   - Look for the `apple-notes.dxt` file in the release assets

2. **Install through your AI desktop application's extension manager**
3. **The extension will be automatically configured and ready to use**

**Benefits:**
- ✅ One-click installation
- ✅ Enhanced security and validation
- ✅ Automatic dependency management
- ✅ Production-ready configuration
- ✅ Structured logging and monitoring

### Option 2: Traditional MCP Server

**Manual configuration** for custom setups:

1. Clone the repository:
   ```bash
   git clone https://github.com/mcolyer/mcp-apple-notes.git
   cd mcp-apple-notes
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the project:
   ```bash
   pnpm exec tsc
   ```

4. Configure Claude Desktop by updating your `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "apple-notes": {
         "command": "node",
         "args": ["build/index.js"],
         "cwd": "/path/to/mcp-apple-notes"
       }
     }
   }
   ```

   > **Note:** Replace `/path/to/mcp-apple-notes` with the actual path to your cloned repository.

### First-Time Setup

You may need to authorize the extension to access Apple Notes when first running commands. macOS will prompt you to grant permission for AppleScript automation.

## 🛠️ Usage

### Available Tools

1. **Create Note**

   - Description: Creates a new note in Apple Notes
   - Parameters:
     ```typescript
     {
       title: string;      // The title of the note
       content: string;    // The content of the note
       tags?: string[];    // Optional tags for the note
     }
     ```
   - Example Response:
     ```
     Note created: My New Note
     ```

2. **Search Notes**

   - Description: Search for notes by title
   - Parameters:
     ```typescript
     {
       query: string; // The search query
     }
     ```
   - Example Response:
     ```
     Meeting Notes
     Shopping List
     Ideas for Project
     ```

3. **Get Note Content**
   - Description: Retrieve the full content of a specific note
   - Parameters:
     ```typescript
     {
       title: string; // The exact title of the note
     }
     ```
   - Example Response:
     ```
     [Full content of the note]
     ```

## 📚 Example Use Cases

### 1. Quick Note Taking

Create notes during meetings or brainstorming sessions:

```ts
{
"title": "Team Meeting Notes",
"content": "Discussion points:\n1. Project timeline\n2. Resource allocation",
"tags": ["meetings", "work"]
}
```

### 2. Information Retrieval

Search for specific notes when you need them:

```ts
{
"query": "meeting"
}
```

### 3. Content Review

Get the full content of a specific note:

```ts
{
"title": "Team Meeting Notes"
}
```

## ⚡ Tips for Best Results

- Ensure your Apple Notes app is properly configured with iCloud
- Use descriptive titles for better searchability
- Include relevant tags when creating notes for better organization

## 🔧 Development

### Architecture Overview

The project uses TypeScript with modern ES modules and supports dual distribution:

- **Traditional MCP Server**: Built JavaScript files in `build/` directory
- **Desktop Extension (DXT)**: Self-contained package in `server/` directory with enhanced security

### Key Components

- `src/index.ts`: Main MCP server implementation with tool registration
- `src/services/appleNotesManager.ts`: Apple Notes operations via AppleScript
- `src/utils/applescript.ts`: Secure AppleScript execution with timeout handling
- `src/types.ts`: TypeScript interfaces and type definitions

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/mcolyer/mcp-apple-notes.git
   cd mcp-apple-notes
   pnpm install
   ```

2. **Build TypeScript:**
   ```bash
   pnpm exec tsc
   ```

3. **Test the server:**
   ```bash
   node build/index.js
   ```

### Testing

This project includes comprehensive tests to ensure reliability and maintainability:

#### Running Tests

```bash
# Run all tests
pnpm test

# Run tests once (CI mode)
pnpm run test:run

# Run tests with coverage report
pnpm run test:coverage

# Run only unit tests
pnpm run test:unit

# Run only integration tests
pnpm run test:integration

# Run tests in watch mode (for development)
pnpm run test:watch
```

#### Test Structure

- **Unit Tests** (`tests/unit/`): Test individual components in isolation
  - AppleScript utility functions (`tests/unit/utils/applescript.test.ts`)
  - Apple Notes manager class (`tests/unit/services/appleNotesManager.test.ts`)

- **Integration Tests** (`tests/integration/`): Test complete workflows
  - MCP tool handlers (`tests/integration/mcp-tools.test.ts`)

- **Test Helpers** (`tests/helpers/`): Shared utilities for testing
  - Mock creation and validation helpers
  - Date mocking utilities
  - Test response validators

#### Coverage Requirements

- **Lines**: 85% minimum
- **Functions**: 90% minimum  
- **Branches**: 80% minimum
- **Statements**: 85% minimum

Current coverage typically exceeds these thresholds with 100% line coverage on core business logic.

#### Testing Environment

Tests are designed to work in both macOS and CI environments:

- **macOS**: Full integration testing with actual AppleScript mocking
- **CI/Linux**: Unit tests run with comprehensive mocking of macOS-specific features
- **GitHub Actions**: Automated testing on multiple Node.js versions (18, 20, 22)

The test suite uses [Vitest](https://vitest.dev) for fast, modern testing with TypeScript support.

### Building Desktop Extension (DXT)

The DXT branch contains production-ready enhancements with security validation, structured logging, and bundled dependencies.

1. **Switch to DXT branch:**
   ```bash
   git checkout dxt-extension
   ```

2. **Build the extension:**
   ```bash
   # Build TypeScript source
   pnpm exec tsc
   
   # Create server directory with bundled dependencies
   mkdir -p server
   cp -r build/* server/
   cp -r node_modules server/
   ```

3. **Automated build script:**
   ```bash
   pnpm exec tsc:dxt
   ```

4. **Package as DXT (requires dxt CLI tool):**
   ```bash
   dxt pack .
   ```

### Key Development Files

- `manifest.json`: DXT extension manifest following v0.1 specification
- `server/`: Complete DXT package with bundled dependencies
- `build-dxt.js`: Automated build script for creating DXT packages
- `DXT_README.md`: Production deployment documentation
- `CLAUDE.md`: Development guide for Claude Code instances

### Security Considerations

- All AppleScript inputs are sanitized to prevent injection attacks
- Quote characters are escaped for safe script execution
- DXT version includes input length limits and timeout management
- Comprehensive error handling prevents system exposure

### Testing

- Manual testing requires Apple Notes app access on macOS
- Server validation through manifest parsing and dependency loading
- No automated test suite currently implemented

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ for Apple Notes users