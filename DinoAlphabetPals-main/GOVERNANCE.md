# Project Governance

> **⚠️ PROJECT STATUS: Lower priority - not actively maintained.**
> 
> This project is currently a lower priority as I'm focused on more pressing work in the regtech space. While the structure below describes the intended governance model, in practice, reviews and decisions may be significantly delayed or may not occur. The maintainer checks in regularly but is not actively managing the project.

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

**This project is a lower priority but not decommissioned.** It is available for public use with limited maintenance as focus is on other work commitments. Users and contributors should fork if ongoing active development or immediate support is needed.
