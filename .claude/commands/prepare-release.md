# Prepare Release

You are helping prepare for a release of the Apple Notes MCP Server. This command helps you get ready before creating the actual release.

## Pre-release preparation steps:

1. **Review current state:**
   - Check git status and ensure working directory is clean
   - Review recent commits and pull requests
   - Verify you're on the correct branch (`dxt-extension`)

2. **Run comprehensive tests:**
   ```bash
   # Full test suite with coverage
   npm run test:coverage
   
   # Linting check
   npm run lint
   
   # Build verification
   npm run build
   
   # DXT build test
   npm run build:dxt
   ```

3. **Review and update documentation:**
   - Check that README.md is up to date
   - Verify all new features are documented
   - Review API documentation in the README
   - Ensure installation instructions are current

4. **Check version consistency:**
   - Verify `package.json` version
   - Check `manifest.json` version matches
   - Ensure `server/package.json` is aligned
   - Review any version references in documentation

5. **Review CHANGELOG.md:**
   - Ensure all recent changes are documented
   - Check formatting is consistent
   - Verify dates and version numbers
   - Add "Unreleased" section if not present

6. **Validate release workflow:**
   - Check `.github/workflows/release.yml` is up to date
   - Verify the workflow will trigger on tag push
   - Ensure DXT build process is working

## Questions to consider:

- **What type of release is this?**
  - Major (breaking changes)
  - Minor (new features)
  - Patch (bug fixes)

- **What are the key changes?**
  - New features added
  - Bugs fixed
  - Breaking changes (if any)
  - Performance improvements

- **Are there any migration steps?**
  - Configuration changes needed
  - API changes that affect users
  - Dependency updates

## Next steps:
After preparation is complete, use one of:
- `/release-major` - For breaking changes or major features
- `/release-minor` - For new features (backwards compatible)
- `/release-patch` - For bug fixes and small improvements

## Release readiness checklist:
- [ ] All tests passing
- [ ] Linting clean
- [ ] Build successful
- [ ] Documentation updated
- [ ] CHANGELOG.md current
- [ ] Version numbers consistent
- [ ] No uncommitted changes