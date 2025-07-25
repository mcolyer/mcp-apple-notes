# Create Minor Release

You are helping create a minor release for the Apple Notes MCP Server. A minor release adds new features while maintaining backwards compatibility.

## Steps to execute:

1. **Verify current state:**
   - Check that you're on the `dxt-extension` branch
   - Ensure all tests pass with `npm run test:coverage`
   - Verify linting passes with `npm run lint`
   - Check that all changes are committed and pushed

2. **Update version numbers:**
   - In `package.json`, increment the minor version (e.g., 1.2.3 → 1.3.0)
   - In `manifest.json`, update the version to match
   - Ensure server package.json also reflects the new version

3. **Update CHANGELOG.md:**
   - Add a new section for the new version with today's date
   - List new features and enhancements under "Added"
   - Include any bug fixes under "Fixed"
   - Note any improvements under "Changed"

4. **Run pre-release checks:**
   ```bash
   # Build and test everything
   npm run build
   npm run test:coverage
   npm run lint
   
   # Test DXT build
   npm run build:dxt
   ```

5. **Create and push the release:**
   ```bash
   # Commit version changes
   git add package.json manifest.json CHANGELOG.md server/package.json
   git commit -m "chore: bump version to v$(node -p "require('./package.json').version")"
   
   # Create and push tag
   VERSION=$(node -p "require('./package.json').version")
   git tag -a "v$VERSION" -m "Release v$VERSION

   Features and improvements in this release:
   - [List key features here]
   
   See CHANGELOG.md for full details."
   
   git push origin dxt-extension
   git push origin "v$VERSION"
   ```

6. **Verify the release:**
   - Monitor GitHub Actions for successful workflow completion
   - Check that the DXT artifact is properly generated
   - Verify release notes include all features

## Quality checklist:
- [ ] All tests passing
- [ ] Linting clean
- [ ] Build successful
- [ ] CHANGELOG.md updated
- [ ] Version numbers consistent across files