# Release Process

## Overview

This document describes the release process for PhysioGest API, including version management, testing, and deployment procedures.

## Version Management

### Semantic Versioning

We follow [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., 1.0.0)
  - **MAJOR**: Incompatible API changes (breaking changes)
  - **MINOR**: New functionality in a backward-compatible manner
  - **PATCH**: Backward-compatible bug fixes

### Version Files

Version information is maintained in:

1. **package.json** - npm package version
2. **VERSION** - Single source of truth for application version

Both files must be kept in sync.

## Release Workflow

### 1. Pre-Release Checklist

Before releasing a new version:

- [ ] All tests passing (`npm run test`)
- [ ] Code review completed
- [ ] TypeScript compilation successful (`npm run build`)
- [ ] No outstanding breaking changes documentation needed
- [ ] CHANGELOG.md updated with all changes
- [ ] Dependencies security audit passed (`npm audit`)

### 2. Update Version

#### For PATCH release (bug fixes):
```bash
# Update 1.0.0 → 1.0.1
npm version patch
```

#### For MINOR release (new features):
```bash
# Update 1.0.0 → 1.1.0
npm version minor
```

#### For MAJOR release (breaking changes):
```bash
# Update 1.0.0 → 2.0.0
npm version major
```

This automatically:
- Updates `package.json` version
- Creates a git tag
- Creates a commit

### 3. Update VERSION File

Update `VERSION` file with the new version:

```
1.0.1
```

### 4. Update CHANGELOG

Add entry to CHANGELOG.md in this format:

```markdown
## [1.0.1] - 2026-03-21

### Fixed
- Fixed bug in category filtering

### Changed
- Improved error messages for user feedback
```

### 5. Commit Changes

```bash
git add VERSION CHANGELOG.md
git commit -m "chore: release v1.0.1"
git push origin main
```

### 6. Create Release Tag

```bash
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin v1.0.1
```

### 7. Build and Test

```bash
npm run build
npm run test
```

### 8. Deploy

Deploy to appropriate environment:

```bash
npm run build
# Then deploy dist/ to production server
```

## API Versioning

### Creating a New API Version

When introducing breaking changes to the API:

1. Create new route structure:
   ```
   src/presentation/
   ├── auth/          → /v1/auth (old)
   ├── auth-v2/       → /v2/auth (new)
   └── ...
   ```

2. Update `src/index.ts`:
   ```typescript
   const v1Router = express.Router();
   v1Router.use("/auth", authRoutesV1);
   app.use("/v1", v1Router);

   const v2Router = express.Router();
   v2Router.use("/auth", authRoutesV2);
   app.use("/v2", v2Router);
   ```

3. Update Swagger configuration to include both versions

4. Document deprecation timeline for v1

5. Release as MAJOR version (e.g., 2.0.0)

## Release Branching Strategy

### Branch Naming

- `main` - Production releases
- `develop` - Development/staging releases
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `release/*` - Release prepare branches

### Release Branch Process

1. Create release branch from `develop`:
   ```bash
   git checkout -b release/1.0.1 develop
   ```

2. Update version files:
   ```bash
   npm version patch
   ```

3. Update CHANGELOG.md

4. Commit:
   ```bash
   git commit -am "chore: bump version to 1.0.1"
   ```

5. Merge to `main` and `develop`:
   ```bash
   git checkout main
   git merge --no-ff release/1.0.1
   git tag -a v1.0.1 -m "Release 1.0.1"
   git checkout develop
   git merge --no-ff release/1.0.1
   ```

6. Delete release branch:
   ```bash
   git branch -d release/1.0.1
   ```

## Deployment

### Development Environment

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Watch mode with auto-reload
npm run dev
```

### Production Environment

```bash
# Install production dependencies only
npm ci --production

# Build TypeScript
npm run build

# Start production server
npm start

# Or use process manager (e.g., PM2)
pm2 start dist/index.js --name "physiogest-api"
```

### Docker Deployment

```bash
# Build image
docker build -t physiogest-api:1.0.1 .

# Run container
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name physiogest-api \
  physiogest-api:1.0.1

# Using docker-compose
docker-compose up -d
```

## Monitoring Releases

### Health Checks

After deployment, verify:

```bash
# Check if service is running
curl http://localhost:3000/health

# Response should include version info
curl http://localhost:3000/swagger.json | jq .info.version
```

### Log Monitoring

```bash
# Check application logs
tail -f logs/application.log

# Filter by version
grep "v1.0.1" logs/application.log
```

## Rollback Procedure

If issues occur after release:

```bash
# Revert to previous version
git revert <commit-hash>
git push origin main

# Or checkout previous tag
git checkout tags/v1.0.0
npm install
npm run build
npm start
```

## Communication

### Release Notes Template

```markdown
# PhysioGest API v1.0.1 Released

## Highlights
- Bug fix descriptions
- New feature summaries
- Performance improvements

## Breaking Changes
- None | List breaking changes

## Migration Guide
- Step-by-step upgrade instructions

## Download
- [v1.0.1 on GitHub](link)
```

### Deprecation Notices

Announce deprecations at least 6 months before removal:

```markdown
⚠️ DEPRECATED: /v1/old-endpoint will be removed in v2.0.0 (2026-09-20)
Use /v1/new-endpoint instead. See [migration guide](link)
```

## Troubleshooting

### Package Version Mismatch

If `package.json` and `VERSION` files are out of sync:

```bash
# Check current version
cat VERSION
npm pkg get version

# Manually update if needed
npm version 1.0.1 --force
echo "1.0.1" > VERSION
git add package.json VERSION package-lock.json
git commit -m "fix: sync version files"
```

### Failed Tests on Release

If tests fail during release:

1. Fix the issue on develop branch
2. Create new PR and merge
3. Start release process again
4. Do not force merge or skip tests

## Resources

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Keep a Changelog](https://keepachangelog.com/)
