# Deployment & Hardening

This guide outlines recommended deployment approaches and basic hardening steps for production-like environments.

## Platforms
- Vercel / Netlify: Simplest for static/SSR Next.js.
- Cloud Run / App Engine: Containerized deployments with HTTPS by default.
- Nginx + Node: Traditional VM/container deployment.

## Security Headers (Reverse Proxy)
Add these headers at the CDN/Edge or reverse proxy (e.g., Nginx):

```
# Example Nginx snippet
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

Content-Security-Policy (CSP) should be tailored to your asset/CDN domains and any third-party APIs:

```
# Start conservative and iterate
add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.elevenlabs.io https://generativelanguage.googleapis.com; frame-ancestors 'self';" always;
```

Note: Tighten `script-src` by removing `'unsafe-inline'` if you’ve eliminated inline styles/scripts.

## Environment Configuration
- Do not commit `.env*` files with secrets
- Use platform secret stores for any non-public config
- Public Next.js variables must be prefixed `NEXT_PUBLIC_`

## Optional Integrations
- Gemini AI and ElevenLabs are optional; without keys, the app uses fallbacks.
- Scope API keys to minimum permissions, and rotate periodically.

## Logging & Monitoring
- Client-only: Local error logs visible in the parent dashboard
- Production: Consider adding a backend for structured logging if needed

## Rate Limiting
- If exposing a login route, apply rate limiting at the proxy level:
```
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
location /login { limit_req zone=login; }
```

## Build & CI
- CI runs `npm ci`, `npm run lint`, `npm run build`, `npm audit --audit-level=high`
- SBOM artifact is generated and CodeQL analysis is enabled

## Browser Support
- Modern evergreen browsers. Web Speech API fallback is best-effort and varies by platform.

## Accessibility
- Provide high-contrast and large-text toggles by default
- Test with keyboard navigation and reduced motion settings
