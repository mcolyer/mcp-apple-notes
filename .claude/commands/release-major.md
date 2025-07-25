# Create Major Release

You are helping create a major release for the Apple Notes MCP Server. A major release indicates breaking changes or significant new features.

## Steps to execute:

1. **Verify current state:**
   - Check that you're on the `dxt-extension` branch
   - Ensure all tests pass
   - Verify the build is clean
   - Check that all changes are committed

2. **Update version numbers:**
   - In `package.json`, increment the major version (e.g., 1.2.3 → 2.0.0)
   - In `manifest.json`, update the version to match
   - Update any version references in documentation

3. **Update CHANGELOG.md:**
   - Add a new section for the new version
   - List all breaking changes prominently
   - Include new features and improvements
   - Note any migration steps for users

4. **Create and push the release:**
   ```bash
   # Commit version changes
   git add package.json manifest.json CHANGELOG.md
   git commit -m "chore: bump version to v$(node -p "require('./package.json').version")"
   
   # Create and push tag
   VERSION=$(node -p "require('./package.json').version")
   git tag -a "v$VERSION" -m "Release v$VERSION"
   git push origin dxt-extension
   git push origin "v$VERSION"
   ```

5. **Verify the release:**
   - Check that GitHub Actions triggered the release workflow
   - Verify the DXT artifact was created and attached to the release
   - Test the release notes are properly formatted

## Important notes:
- Major releases should include comprehensive release notes
- Consider announcing breaking changes to users in advance
- Ensure backwards compatibility documentation is updated