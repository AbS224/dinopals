# Product Overview

This repository contains a simple, child-friendly alphabet learning game built with Next.js and React. It demonstrates clear UI structure, basic state management, robust error handling, and optional integrations for AI-assisted difficulty and premium text-to-speech.

## Goals
- Provide a safe, positive learning experience for early readers
- Keep the frontend small, accessible, and easy to extend
- Demonstrate clean code and strong documentation practices

## Core Features (Local-Only)
- Interactive letter-finding and pronunciation prompts
- Parent dashboard with progress snapshot and configurable screen time
- Accessible UI with high contrast/large text options
- Robust error boundary and local error log viewer

## Optional Integrations (Disabled by Default)
- AI adaptive difficulty (Google Gemini) controlled by `NEXT_PUBLIC_GEMINI_API_KEY`
- Premium TTS (ElevenLabs) controlled by `NEXT_PUBLIC_ELEVENLABS_API_KEY`

Without keys, the app:
- Uses deterministic, rule-based difficulty fallback (see `lib/geminiAI.ts`)
- Falls back to browser Web Speech API for speech output (see `hooks/useEnhancedVoice.ts`)

## Architecture at a Glance
- Next.js App Router, TypeScript, Tailwind CSS
- Zustand for lightweight state
- Modular features under `features/`, shared UI in `components/`
- See `docs/architecture.md` and C4 diagrams for details

## How to Try It Locally
```bash
npm ci
npm run dev
```
Then open http://localhost:3000

Optional demo login (local only):
```bash
# Enables simple client-side demo login (disabled by default)
echo 'NEXT_PUBLIC_DEMO_LOGIN_USER=demo' >> .env.local
echo 'NEXT_PUBLIC_DEMO_LOGIN_PASS=demo123' >> .env.local
```

## Configuration
- `NEXT_PUBLIC_GEMINI_API_KEY` (optional): enables AI adaptive difficulty
- `NEXT_PUBLIC_ELEVENLABS_API_KEY` (optional): enables premium voice
- `NEXT_PUBLIC_ELEVENLABS_VOICE_ID` (optional): pick a specific TTS voice
- `NEXT_PUBLIC_DEMO_LOGIN_USER/PASS` (optional): demo-only login placeholder

## What’s Not Included
- No server-side authentication or data storage
- No personal data collection; local-only progress snapshot
- No external services required to run locally

## Roadmap Ideas
- Add number/shapes games, multi-lesson flows
- Backend sync for progress (opt-in)
- Additional accessibility modes and multi-language support

## Status
This is a learning-focused, community-maintained project. See `GOVERNANCE.md`, `CONTRIBUTING.md`, and `SECURITY.md` for process and policies.
