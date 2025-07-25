# Changelog

All notable changes to the Apple Notes MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Desktop Extension (DXT) support for single-click installation
- Enhanced security validation with input sanitization and length limits
- Structured JSON logging for monitoring and debugging
- Comprehensive timeout management (30-second default for DXT)
- Process-level exception handling with graceful failures
- GitHub Actions workflows for automated releases and testing
- Production-ready server bundle with enhanced error handling
- User configuration support for iCloud account selection
- Automated DXT packaging and validation pipeline

### Enhanced
- AppleScript injection prevention through comprehensive input validation
- Error handling with user-friendly messages and structured logging
- Build process with automated dependency bundling
- Documentation with installation guides and developer workflows

### Security
- Null character filtering to prevent script injection
- Quote escaping for safe AppleScript execution
- Input length validation (titles: 1000 chars, content: 50000 chars)
- Tag limits (maximum 20 tags, 100 chars each)
- Operation timeouts to prevent hanging processes

## [1.0.0] - 2024-01-XX

### Added
- Initial release of Apple Notes MCP Server
- Three core tools for Apple Notes interaction:
  - `create-note`: Create notes with title, content, and optional tags
  - `search-notes`: Search notes by title using query strings
  - `get-note-content`: Retrieve full content of specific notes
- AppleScript integration for native macOS Apple Notes access
- iCloud Notes account integration
- TypeScript implementation with modern ES modules
- Zod schema validation for all tool inputs
- Basic error handling and user feedback
- Development container configuration for VS Code

### Technical Details
- Node.js 20.0.0+ requirement
- macOS-only platform support (Darwin)
- MCP (Model Context Protocol) compliance
- Stdio transport for AI assistant communication
- 10-second timeout for AppleScript operations

---

## Release Types

- **Added** for new features
- **Changed** for changes in existing functionality  
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
- **Enhanced** for improvements to existing features