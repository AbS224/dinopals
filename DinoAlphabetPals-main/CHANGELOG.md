# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

## [Unreleased]
### Changed
- **Project Status**: Updated all documentation to reflect lower priority status
- Added prominent notices in README, CONTRIBUTING, SUPPORT, SECURITY, and GOVERNANCE
- Clarified that project is lower priority due to regtech work, not abandoned
- Maintainer checks in regularly but responses may be significantly delayed
- Emphasized "as-is" nature with recommendation to fork for urgent needs
- Removed redundant 2.4MB zip file from repository
- Added *.zip to .gitignore

### Removed
- DinoAlphabetPals-main.zip (2.4MB redundant file)

## [Future Plans]
- Add more games and lessons (community contributions welcome)
- Improve accessibility modes and multi-language support

## [0.1.0] - 2025-11-14
### Added
- Government-grade documentation set: SECURITY policy, CODE_OF_CONDUCT, GOVERNANCE, product overview
- Architecture diagrams (Mermaid): system context, modules, data flow, deployment
- Threat model (STRIDE) and C4 diagrams (Context, Container)
- CI workflow (lint/build/audit/SBOM/CodeQL) and PR/issue templates
- Deployment hardening guide with CSP and security headers

### Changed
- Neutralized personal references across UI, scripts, and docs
- README: local-only mode, links to docs, badges, maintainer’s note
- Demo login wired to env vars and disabled by default

### Security
- Consolidated SECURITY.md with private advisory process, SLA, and guidance
- Ensured no secrets in source; client-only fallbacks when externals absent

[Unreleased]: https://github.com/AbS224/dinopals/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/AbS224/dinopals/releases/tag/v0.1.0

