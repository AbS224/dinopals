```mermaid
C4Container
title Container Diagram – DinoAlphabet Pals

Person(user, "Learner/Parent")

Container_Boundary(app, "DinoAlphabet Pals") {
  Container(web, "Web UI (Next.js)", "TypeScript, React, Tailwind", "App Router pages, features, hooks, state")
}

Container_Ext(ai, "Gemini API", "HTTPS", "Optional adaptive difficulty")
Container_Ext(tts, "ElevenLabs API", "HTTPS", "Optional TTS")

Rel(user, web, "Uses", "HTTPS")
Rel(web, ai, "Analyze pattern (optional)", "JSON/HTTPS")
Rel(web, tts, "Synthesize speech (optional)", "JSON/HTTPS")

UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

Implementation locations:
- UI: `app/`, `components/`, `features/`
- State: `store/`
- AI: `lib/geminiAI.ts`, hooks in `hooks/useAdaptiveDifficulty.ts`
- Voice: `lib/elevenLabsVoice.ts`, hooks in `hooks/useEnhancedVoice.ts`