# Release Process

This document describes how to create releases for the Apple Notes DXT extension.

## Automated Release Process

### Via Git Tags (Recommended)

1. **Create and push a version tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions will automatically:**
   - Build the TypeScript source
   - Create the DXT server directory with bundled dependencies
   - Validate the DXT structure and manifest
   - Package the extension using `@anthropic/dxt` CLI
   - Generate comprehensive release notes
   - Create a GitHub release with the `.dxt` file
   - Upload build artifacts for debugging

### Via Manual Workflow Dispatch

1. **Go to GitHub Actions tab in the repository**
2. **Select "Release DXT Extension" workflow**
3. **Click "Run workflow"**
4. **Enter the desired tag (e.g., v1.0.1)**
5. **Click "Run workflow" to start the process**

## Release Artifacts

Each release includes:

- **`apple-notes-dxt-{version}.dxt`**: Main extension package for installation
- **`DXT_README.md`**: Production deployment documentation
- **`CLAUDE.md`**: Development guide for contributors

## Version Naming

Use semantic versioning:
- **`v1.0.0`**: Major release
- **`v1.0.1`**: Patch release
- **`v1.1.0`**: Minor release
- **`v2.0.0-beta.1`**: Pre-release (marked as prerelease)

## Validation Process

The automated workflow performs these validations:

### Build Validation
- TypeScript compilation succeeds
- All required files are generated in `build/` directory
- Server components are properly structured

### DXT Structure Validation  
- `manifest.json` exists and is valid JSON
- Server directory contains all required files
- MCP SDK dependencies are bundled
- Server can load without errors

### Package Validation
- DXT package creation succeeds
- Package size is reasonable
- All metadata is correctly embedded

## Manual Release (If Needed)

If automated release fails, you can create a release manually:

1. **Build the extension:**
   ```bash
   # Ensure you're on dxt-extension branch
   git checkout dxt-extension
   
   # Install dependencies
   pnpm install
   
   # Build TypeScript
   pnpm exec tsc
   
   # Create server directory
   mkdir -p server
   cp -r build/* server/
   cp -r node_modules server/
   ```

2. **Install DXT CLI and package:**
   ```bash
   npm install -g @anthropic/dxt
   dxt pack . --output apple-notes-dxt-v1.0.0.dxt
   ```

3. **Create GitHub release manually:**
   - Go to GitHub repository releases
   - Click "Create a new release"
   - Choose tag and upload the `.dxt` file
   - Add release notes based on recent commits

## Troubleshooting

### Common Issues

**Build fails with TypeScript errors:**
- Ensure all source files are valid TypeScript
- Check that all imports resolve correctly
- Verify `tsconfig.json` configuration

**DXT packaging fails:**
- Ensure `manifest.json` is valid JSON
- Check that all required files exist in expected locations
- Verify `@anthropic/dxt` CLI is properly installed

**Server validation fails:**
- Ensure MCP SDK is bundled in `server/node_modules`
- Check that server entry point matches manifest
- Verify no missing dependencies in the server bundle

**Release upload fails:**
- Check GitHub token permissions
- Ensure tag doesn't already exist
- Verify artifact files were created successfully

### Debug Information

Build artifacts are uploaded to GitHub Actions for 30 days and include:
- Generated DXT package
- Server directory structure
- Build output
- Manifest file

Access these through the GitHub Actions interface for debugging failed releases.