# Project Governance

## Roles
- Maintainers: Oversee direction, review PRs, cut releases, manage security advisories.
- Contributors: Propose changes via PRs and issues.
- Users: Report bugs and request features.

## Decision Making
- Day-to-day decisions are made via PR reviews and issue discussions.
- Significant changes require an RFC (issue label `rfc`) and consensus among maintainers.
- Ties are resolved by a simple majority of active maintainers.

## Releases
- Releases are tagged from `main` after CI passes.
- Changelogs summarize user-facing changes, fixes, and security updates.

## Security
- Follow `SECURITY.md` for reporting and coordinated disclosure.
- Maintainers may embargo details until a fix is available.

## Code Quality
- All PRs must pass lint, type-check, build, and tests (where applicable).
- New features should include documentation updates and basic test coverage.

## Decommissioning
- If the project becomes unmaintained, a notice will be posted in the README.
