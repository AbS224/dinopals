# Security Notice

> **⚠️ This project is a lower priority. Security updates are provided on a best-effort basis only.**

## Known Vulnerabilities

As of the last update, the following vulnerabilities exist in the project dependencies:

### Next.js (v14.2.30)
**Severity:** Moderate

The project uses Next.js v14.2.30, which has known moderate severity vulnerabilities:

1. **Cache Key Confusion for Image Optimization API Routes**
   - Advisory: [GHSA-g5qg-72qw-gw5v](https://github.com/advisories/GHSA-g5qg-72qw-gw5v)
   
2. **Improper Middleware Redirect Handling Leads to SSRF**
   - Advisory: [GHSA-4342-x723-ch2f](https://github.com/advisories/GHSA-4342-x723-ch2f)
   
3. **Content Injection Vulnerability for Image Optimization**
   - Advisory: [GHSA-xv57-4mr9-wg8v](https://github.com/advisories/GHSA-xv57-4mr9-wg8v)

### Mitigation Options

Given the lower priority status of this project, you have the following options:

1. **Accept the risk** - If you're using this for personal/educational purposes and not exposing it publicly
2. **Update dependencies yourself** - Fork the repository and run `npm audit fix`
3. **Apply workarounds** - Disable affected features (image optimization, middleware redirects)
4. **Use at your own risk** - This project is provided "as-is" with no warranties

### Checking for Vulnerabilities

To check for current vulnerabilities, run:

```bash
npm audit
```

To attempt automatic fixes:

```bash
npm audit fix
```

**Note:** Automatic fixes may break functionality and should be tested thoroughly.

## Recommendations

- **Do not use this project in production** without updating dependencies
- **For educational purposes** - The vulnerabilities are moderate and may be acceptable
- **For public deployment** - Fork and update all dependencies to their latest secure versions
- **Stay informed** - Check [GitHub Security Advisories](https://github.com/advisories) for updates

## Reporting New Vulnerabilities

If you discover new security vulnerabilities in this project:

1. Follow the process in [SECURITY.md](SECURITY.md)
2. Use [GitHub Private Security Advisories](https://github.com/AbS224/dinopals/security/advisories/new)
3. Expect best-effort response only (may be significantly delayed)

**For critical vulnerabilities**, we recommend forking and maintaining your own version rather than waiting for fixes.

---

Last updated: 2025-11-14
