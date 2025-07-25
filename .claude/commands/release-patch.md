# Create Patch Release

You are helping create a patch release for the Apple Notes MCP Server. A patch release contains bug fixes and small improvements without adding new features.

## Steps to execute:

1. **Verify current state:**
   - Check that you're on the `dxt-extension` branch
   - Ensure all tests pass with `npm run test:coverage`
   - Verify linting passes with `npm run lint`
   - Confirm all bug fixes are committed

2. **Update version numbers:**
   - In `package.json`, increment the patch version (e.g., 1.2.3 → 1.2.4)
   - In `manifest.json`, update the version to match
   - Update server/package.json version

3. **Update CHANGELOG.md:**
   - Add a new section for the patch version with today's date
   - List bug fixes under "Fixed"
   - Include any small improvements under "Changed"
   - Keep entries concise and user-focused

4. **Run quick validation:**
   ```bash
   # Quick build and test
   npm run build
   npm run test:run
   npm run lint
   ```

5. **Create and push the release:**
   ```bash
   # Commit version changes
   git add package.json manifest.json CHANGELOG.md server/package.json
   git commit -m "chore: bump version to v$(node -p "require('./package.json').version")"
   
   # Create and push tag
   VERSION=$(node -p "require('./package.json').version")
   git tag -a "v$VERSION" -m "Release v$VERSION

   Bug fixes and improvements:
   - [List key fixes here]
   
   See CHANGELOG.md for details."
   
   git push origin dxt-extension
   git push origin "v$VERSION"
   ```

6. **Verify the release:**
   - Check GitHub Actions workflow completes successfully
   - Ensure DXT artifact is generated
   - Verify release appears in GitHub releases page

## Pre-release checklist:
- [ ] Bug fixes tested
- [ ] No new features introduced
- [ ] Version incremented correctly
- [ ] CHANGELOG.md updated with fixes
- [ ] All tests passing

## Common patch release scenarios:
- Security fixes
- Bug fixes
- Performance improvements
- Documentation corrections
- Dependency updates