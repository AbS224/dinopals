# Contributing to DinoAlphabet Pals

> **⚠️ PROJECT STATUS: This is an abandoned project available for public use.**
> 
> While contributions are welcome, please note that this project is no longer actively maintained. The maintainer checks in regularly but cannot guarantee timely reviews or responses. For urgent needs or active development, please consider forking the repository.

Thank you for your interest in contributing! This project is open source and welcomes contributions from the community.

## Note on Maintenance

**This project is provided "as-is" with limited maintenance:**
- Issues and PRs are reviewed when time permits (may be significantly delayed)
- No guaranteed response times or merge timelines
- Security issues addressed on best-effort basis
- No active feature development by the original maintainer
- Community-driven development encouraged through forks

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Guidelines

- Ensure your code follows the existing style
- Add tests for new features
- Update documentation as needed
- Be respectful and constructive in discussions

## Note on Maintenance

**This project is provided "as-is" with limited maintenance:**
- Issues and PRs are reviewed when time permits (may be significantly delayed)
- No guaranteed response times or merge timelines
- Security issues addressed on best-effort basis
- No active feature development by the original maintainer
- Community-driven development encouraged through forks

For critical needs, please fork the repository and maintain your own version.

## Reporting Issues

If you find a bug or have a suggestion, please open an issue on GitHub.

## Questions and Discussion

For general questions, ideas, or discussions about the project, please use [GitHub Discussions](https://github.com/AbS224/dinopals/discussions).

Thank you for helping make DinoAlphabet Pals better!
# Contributing

Thank you for your interest in improving this project! Please follow the process below to help us review changes efficiently and safely.

## Development Workflow
1. Fork the repository and create a feature branch: `git checkout -b feat/short-description`
2. Install dependencies: `npm ci`
3. Lint and build locally: `npm run lint && npm run build`
4. Commit with conventional commits (e.g., `feat: add X`, `fix: correct Y`)
5. Push and open a Pull Request using the template

## Pull Request Requirements
- CI must pass (lint, build, audit)
- Include tests or manual verification notes
- Update docs/README as needed
- Avoid introducing secrets or sensitive data

## Coding Guidelines
- TypeScript preferred; keep types strict
- Keep components small and composable
- Favor accessibility and performance
- Follow existing patterns for state (Zustand) and hooks

## Security and Compliance
- Read `SECURITY.md` before contributing
- Do not commit secrets; use environment variables and secret stores
- Avoid collecting PII or storing sensitive data client-side

## Reporting Issues
Open a GitHub issue and fill out the appropriate template (bug or feature). For security issues, use the private advisory workflow.

## Governance
See `GOVERNANCE.md` for decision-making and releases.

We appreciate your contributions!

For general questions, ideas, or discussions about the project, please use [GitHub Discussions](https://github.com/AbS224/dinopals/discussions).

Thank you for helping make DinoAlphabet Pals better!