# 📝 Apple Notes Desktop Extension (DXT)

A production-ready Desktop Extension for seamless Apple Notes integration with AI assistants through the Model Context Protocol (MCP).

## 🎯 Overview

This DXT package provides three core tools for Apple Notes management:
- **Create Notes**: Add new notes with title, content, and optional tags
- **Search Notes**: Find existing notes by title using query strings  
- **Retrieve Content**: Get the full content of specific notes

## 🚀 Installation

### Prerequisites
- **macOS** (Darwin platform only)
- **Node.js** 20.0.0 or higher
- **Apple Notes** app configured with iCloud
- Compatible AI desktop application supporting DXT

### Quick Install
1. Download the `.dxt` extension file
2. Install through your compatible AI desktop application
3. The extension will be automatically configured and ready to use

### Manual Installation
If building from source:
```bash
# Clone the repository
git clone <repository-url>
cd mcp-apple-notes

# Switch to DXT branch
git checkout dxt-extension

# Install dependencies
pnpm install

# Build the extension
pnpm run build

# Package as DXT (requires dxt CLI tool)
dxt pack .
```

## 🛠️ Usage

### Available Tools

#### 1. Create Note
Creates a new note in Apple Notes with enhanced security validation.

**Parameters:**
- `title` (string, required): Note title (max 1,000 characters)
- `content` (string, required): Note content (max 50,000 characters)  
- `tags` (array, optional): Up to 20 tags, each max 100 characters

**Example:**
```json
{
  "title": "Meeting Notes - Q4 Planning",
  "content": "Key discussion points:\n1. Budget allocation\n2. Team restructuring\n3. New product launch timeline",
  "tags": ["meetings", "q4", "planning"]
}
```

#### 2. Search Notes
Search for notes by title with query string matching.

**Parameters:**
- `query` (string, required): Search query (max 500 characters)

**Example:**
```json
{
  "query": "meeting"
}
```

**Response:**
```
Found 3 notes:
• Meeting Notes - Q4 Planning  
• Weekly Team Meeting
• Client Meeting Summary
```

#### 3. Get Note Content
Retrieve the full content of a specific note by exact title match.

**Parameters:**
- `title` (string, required): Exact note title (max 1,000 characters)

**Example:**
```json
{
  "title": "Meeting Notes - Q4 Planning"
}
```

## 🔒 Security Features

### Input Validation
- **Length Limits**: All inputs have strict character limits to prevent abuse
- **Content Sanitization**: Removes null characters and validates input types
- **Tag Restrictions**: Maximum 20 tags with individual length limits

### AppleScript Protection  
- **Injection Prevention**: All user input is properly escaped for AppleScript execution
- **Timeout Management**: 30-second timeout for all operations to prevent hanging
- **Error Isolation**: Comprehensive error handling prevents system exposure

### Production Safeguards
- **Structured Logging**: JSON-formatted logs for monitoring and debugging
- **Graceful Failures**: Operations fail safely with user-friendly error messages
- **Resource Limits**: Built-in limits prevent resource exhaustion

## ⚙️ Configuration

### User Settings
The extension supports optional configuration through the DXT user settings:

- `icloud_account` (string): Name of iCloud account to use (default: "iCloud")

### System Requirements
- **Platform**: macOS only (Darwin)
- **Runtime**: Node.js 20.0.0+
- **Memory**: Minimal footprint with bundled dependencies
- **Permissions**: Requires Apple Notes access authorization on first use

## 🔧 Troubleshooting

### Common Issues

#### "Failed to create note"
- **Cause**: Apple Notes not accessible or iCloud not configured
- **Solution**: Ensure Apple Notes is running and iCloud is signed in

#### "Operation timed out"
- **Cause**: Apple Notes taking too long to respond (>30 seconds)
- **Solution**: Restart Apple Notes app or check system performance

#### "Note not found"  
- **Cause**: Exact title match required for retrieval
- **Solution**: Use search tool first to find exact note titles

#### Permission Denied
- **Cause**: First-time AppleScript execution requires user authorization
- **Solution**: Grant permission when macOS prompts for script access

### Debug Mode
The extension logs all operations in structured JSON format. To enable debug logging in compatible applications, check the application's logging configuration.

### Performance Optimization
- **Bundled Dependencies**: All Node.js dependencies included for optimal performance
- **Efficient Operations**: Direct AppleScript integration minimizes overhead
- **Resource Management**: Automatic cleanup and timeout handling

## 📊 Monitoring

### Logging Structure
All log entries include:
- `timestamp`: ISO 8601 timestamp
- `level`: info, warn, or error
- `message`: Human-readable description
- `operation`: Specific tool being executed
- Additional context data for debugging

### Error Tracking
Comprehensive error handling with:
- Stack traces for debugging
- Sanitized error messages for users
- Operation context preservation
- Graceful degradation

## 🏗️ Technical Architecture

### File Structure
```
├── manifest.json          # DXT extension manifest
├── server/                # Bundled server directory
│   ├── index.js          # Main server entry point
│   ├── package.json      # Server dependencies
│   ├── node_modules/     # Bundled dependencies
│   ├── services/         # Apple Notes integration
│   └── utils/            # AppleScript utilities
└── DXT_README.md         # This documentation
```

### Dependencies
- `@modelcontextprotocol/sdk`: MCP protocol implementation
- `zod`: Runtime type validation and schema enforcement
- No external system dependencies beyond Node.js runtime

### Integration Points
- **MCP Protocol**: Standard stdio transport for AI application communication
- **AppleScript**: Native macOS automation for Apple Notes access
- **DXT Framework**: Compliant with Desktop Extension specification v0.1

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Support

For issues and support:
1. Check troubleshooting section above
2. Review application logs for error details
3. Ensure system requirements are met
4. File issues in the project repository

---

**Built for the open MCP ecosystem** 🌟