# Releasing

This project follows Semantic Versioning and Keep a Changelog.

- Versioning: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)
- Tags: Annotated tags in the form `vX.Y.Z`
- Changelog: `CHANGELOG.md` (Unreleased → dated release section)

## Prerequisites
- Clean `main` (or your default branch)
- Node 20+, `npm ci` passes, build succeeds
- CI green on the target commit

## Release Steps

1) Create a release branch
```bash
version=0.1.0
branch="release/v$version"
git checkout -b "$branch"
```

2) Update versions and changelog
- Edit `package.json` `version` to `$version`
- Move items from `[Unreleased]` to a new `[$version] - YYYY-MM-DD` in `CHANGELOG.md`
- Ensure links at the bottom of `CHANGELOG.md` include `[$version]`

3) Verify locally
```bash
npm ci
npm run lint
npm run build
npm audit --audit-level=high
```

4) Commit and open PR
```bash
git add package.json CHANGELOG.md
git commit -m "chore(release): v$version"
git push -u origin "$branch"
```

5) Merge the PR
- Wait for CI (lint/build/audit/SBOM/CodeQL) to pass
- Merge using a merge commit (recommended for traceability)

6) Tag the release
```bash
git checkout main && git pull
git tag -a "v$version" -m "Release v$version"
git push origin "v$version"
```

7) Publish GitHub Release
- Create a new Release from tag `v$version`
- Title: `v$version`
- Notes: copy the `CHANGELOG.md` section for `[$version]`
- SBOM: CI generates and uploads an artifact; attach if desired

8) Post-release housekeeping
- Bump `package.json` to the next development version (e.g., `0.1.1-dev`)
- Add back an `[Unreleased]` section at the top of `CHANGELOG.md`

## Security Notes
- If a release fixes a vulnerability, reference the private advisory number
- Never include sensitive information in release notes

## Checklist
- [ ] CHANGELOG updated and dated
- [ ] `package.json` version bumped
- [ ] CI green (lint/build/audit/SBOM/CodeQL)
- [ ] Tag pushed and Release published
- [ ] Next dev version set and `[Unreleased]` restored
