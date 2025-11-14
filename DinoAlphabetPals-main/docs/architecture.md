---
title: Architecture Overview
---

# Architecture Overview

This document describes the high-level architecture of the application.

## System Context

```mermaid
flowchart LR
  user[End User (Learner/Parent)] -->|browser| app[Next.js Frontend]
  parent[Parent/Admin] --> app
  subgraph Optional Integrations
    ai[Google Gemini AI]
    tts[ElevenLabs TTS]
  end
  app -->|HTTPS| ai
  app -->|HTTPS| tts
```

## App Modules

```mermaid
flowchart TB
  A[App Router (app/)] --> B[UI Components (components/)]
  A --> C[Features (features/parent-dashboard)]
  A --> D[Hooks (hooks/)]
  A --> E[State (store/)]
  A --> F[Lib (lib/geminiAI, lib/elevenLabsVoice)]
```

## Data Flow

```mermaid
sequenceDiagram
  participant U as User
  participant FE as Next.js Frontend
  participant AI as Gemini API
  participant TTS as ElevenLabs API

  U->>FE: Interacts with UI
  FE->>FE: Update state (Zustand)
  FE-->>AI: (Optional) Analyze difficulty
  AI-->>FE: Recommendations
  FE-->>TTS: (Optional) Request speech audio
  TTS-->>FE: Audio response
  FE->>U: Render UI / Play audio
```

## Deployment

```mermaid
flowchart LR
  dev[Developer] --> ci[GitHub Actions CI]
  ci --> artifact[Build Artifact]
  artifact --> vercel[Vercel/Cloud Run/Netlify]
  user[Users] --> vercel
```

## Security Considerations
- No secrets in client bundles; use only `NEXT_PUBLIC_*` for public config
- Enforce HTTPS and CSP where deployed
- Handle errors via error boundaries and safe messages
- See `SECURITY.md` and `docs/threat-model.md` for details
