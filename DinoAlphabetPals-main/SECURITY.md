# Security Policy

> **⚠️ PROJECT STATUS: This is an abandoned project available for public use.**
> 
> Security issues are addressed on a **best-effort basis only**. The maintainer checks in regularly but cannot guarantee timely responses or fixes. For critical security needs, please fork and maintain your own version.
>
> **Known vulnerabilities exist in dependencies.** See [SECURITY_NOTICE.md](SECURITY_NOTICE.md) for current status and recommendations.

This project aims for clear, professional, and secure practices suitable for government/enterprise contributors and users.

## Supported Versions

We support the latest minor release on `main`. Security fixes land on `main` and are included in the next release.

| Version | Supported |
|--------:|:---------:|
| 1.x.x   |    ✅     |

## Report a Vulnerability

Please use private channels. Do not open public issues for security matters.

- Preferred: GitHub Private Advisory → https://github.com/AbS224/dinopals/security/advisories/new

Include:
- Affected commit/ref and environment
- Reproduction steps and impact
- Proof-of-concept, if available
- Suggested fix/mitigation, if known

Acknowledgement: best‑effort only. We cannot guarantee response times. Responsible disclosure coordination is also on a best‑effort basis. **Given the abandoned status of this project, security fixes may be significantly delayed or may not come at all. Users should evaluate their own risk tolerance.**

## Scope and Data Handling

Client-first web app with optional third-party APIs.
- No PII collection by default
- No backend secrets in repo
- `NEXT_PUBLIC_*` variables must be non-sensitive

If adding a backend:
- Manage secrets via a secure store (not env-checked-in files)
- Redact sensitive data from logs
- Enforce least privilege and audit access

## Secure Development Guidelines

- Reproducible builds: `npm ci` with lockfile
- CI checks: lint, type-check, build, `npm audit` (address high/critical)
- Keep dependencies current; remove unused packages
- Enforce HTTPS; prefer POST for sensitive actions
- Validate/sanitize inputs; escape outputs
- Do not store secrets in localStorage or source code

## Incident Response

If exploitation is suspected:
- Open/Update a private advisory with indicators of compromise
- Prepare a hotfix branch and patch release
- Publish an advisory with root cause and mitigations post-fix

## Government/Enterprise Considerations

- No analytics/tracking; local-only storage by default
- Error boundaries present; child-friendly failure modes
- Recommend: CSP/security headers at the reverse proxy/CDN
- Optional APIs (Gemini/ElevenLabs) over HTTPS only; keys must be scoped and rotated

For deployment hardening, see README and docs/architecture.md and docs/threat-model.md.