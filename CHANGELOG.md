# Changelog

All notable changes to the Apple Notes MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.2] - 2024-07-25

### Fixed
- **CI/CD Performance**: Switch all GitHub Actions workflows to ubuntu-latest runners for better performance and consistency
- **Build Reliability**: Remove dependency on macOS-specific tooling in build process
- **Workflow Consistency**: Align all workflows (lint, test, release) to use same runner type

## [2.0.1] - 2024-07-25

### Fixed
- **Release Workflow**: Fixed GitHub Actions release workflow to use proper build:dxt script and correct file paths
- **DXT Packaging**: Updated workflow to package from dxt-build directory instead of root
- **Validation Paths**: Corrected file path validation to check dxt-build/server/ structure

## [2.0.0] - 2024-07-25

### 🚀 MAJOR RELEASE: Desktop Extension (DXT) Support

This is a major release that introduces Desktop Extension (DXT) support alongside the existing traditional MCP server, enabling single-click installation and production-ready deployment.

#### ⚠️ Breaking Changes
- **Dual Distribution Model**: Project now supports both traditional MCP server and DXT extension deployment
- **Enhanced Security Requirements**: DXT version includes stricter input validation and length limits
- **Updated Installation Process**: DXT is now the recommended installation method

#### 🎯 New Features
- **Desktop Extension (DXT) Support**: Complete DXT v0.1 specification compliance for single-click installation
- **Production Security Layer**: Enhanced input sanitization, length validation, and AppleScript injection prevention
- **Structured JSON Logging**: Comprehensive logging system for monitoring and debugging
- **Automated Release Pipeline**: GitHub Actions workflows for automated DXT packaging and releases
- **Enhanced Error Handling**: Process-level exception handling with graceful failures and user-friendly messages
- **Comprehensive Testing Suite**: 61 tests with 100% line coverage using Vitest framework
- **User Configuration**: Support for custom iCloud account selection
- **Build Automation**: Complete DXT packaging and validation pipeline

#### 🔒 Security Enhancements
- **Input Validation**: Configurable limits (titles: 1000 chars, content: 50000 chars, tags: 20 max)
- **Script Injection Prevention**: Comprehensive AppleScript input sanitization and quote escaping
- **Timeout Management**: 30-second operation timeouts to prevent hanging processes
- **Null Character Filtering**: Protection against control character injection attacks

#### 📚 Documentation & Development
- **Comprehensive Documentation**: DXT_README.md, RELEASE.md, and updated developer guides
- **Developer Workflows**: Complete CI/CD pipeline with automated testing and validation
- **Migration Guide**: Clear instructions for both DXT and traditional MCP server deployment

#### 🔄 Migration Notes
- **Existing Users**: Traditional MCP server configuration remains fully supported with no breaking changes
- **New Users**: DXT extension is now the recommended installation method
- **Developers**: New build processes and testing framework for contributors

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