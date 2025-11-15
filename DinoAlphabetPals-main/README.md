# DinoAlphabet Pals

> **⚠️ PROJECT STATUS: Lower priority - not actively maintained.**
> 
> This project is currently a lower priority as I'm focused on more pressing work in the regtech space. I check in regularly to review issues and pull requests, but I'm not actively developing new features or providing regular support. Response times may be significantly delayed. The repository is publicly available for anyone to use, fork, and adapt under the MIT License.
>
> **🔒 SECURITY:** Dependencies updated - no known vulnerabilities. See [SECURITY_NOTICE.md](SECURITY_NOTICE.md) for details.

[![CI](https://github.com/AbS224/dinopals/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/AbS224/dinopals/actions/workflows/ci.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AbS224/dinopals)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AbS224/dinopals)

## What is this?
A magical, interactive, and safe alphabet learning game for young children! Your dino buddy helps you learn letters with games, voice, and positive encouragement. Parents can check progress and set play limits.

## 🌟 Features
- 🦕 Friendly Brachiosaurus companion in a vibrant jungle world
- 🎮 Interactive letter-finding and pronunciation games
- 🎤 Voice interaction: name your dino and practice letter sounds
- 💚 100% positive feedback - all praise, all the time!
- 🔒 Safe and secure - no ads, no data collection, no negative language
- 👨‍👩‍👧‍👦 Parent dashboard with progress tracking and screen time controls (PIN protected)
- 🧠 **AI-Powered Adaptive Difficulty** (Google Gemini)
- 🎭 **Premium Voice Synthesis** (ElevenLabs)

## 🛠 Tech Stack
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)
![Zustand](https://img.shields.io/badge/Zustand-4.5-orange)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-green)
![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Voice-purple)

## � Quick Setup

### Option 1: Simple Start
1. Unzip this project
2. Open in VSCode, JetBrains, or your IDE of choice
3. Run: `npm install`
4. Run: `npm run dev`
5. Visit http://localhost:3000 to play!

### Option 2: Full Development Setup with AI & Premium Voice
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your API keys to .env.local:
# NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
# NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## Local-Only Mode (No External Services)

All external integrations are optional and disabled by default. The app runs entirely locally:
- AI difficulty falls back to rule-based logic (`lib/geminiAI.ts`)
- Voice output falls back to browser TTS (`hooks/useEnhancedVoice.ts`)

To enable demo login locally (optional):
```bash
echo 'NEXT_PUBLIC_DEMO_LOGIN_USER=demo' >> .env.local
echo 'NEXT_PUBLIC_DEMO_LOGIN_PASS=demo123' >> .env.local
```

## 🤖 AI & Voice Setup

### Google Gemini AI (Adaptive Difficulty)
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add `NEXT_PUBLIC_GEMINI_API_KEY=your_key_here` to `.env.local`
3. Restart the app

**AI Features:**
- 🎯 Automatically adjusts difficulty based on the learner's performance
- 💬 Generates personalized encouragement messages
- 📊 Analyzes learning patterns and suggests improvements
- 🧠 Smart letter selection based on struggling areas

### ElevenLabs Premium Voice
1. Get your API key from [ElevenLabs](https://elevenlabs.io)
2. Add `NEXT_PUBLIC_ELEVENLABS_API_KEY=your_key_here` to `.env.local`
3. Restart the app

**Voice Features:**
- 🎤 High-quality, natural-sounding voice synthesis
- 🎭 Emotional expressions (happy, excited, gentle, encouraging)
- 🗣️ Multiple voice options for variety
- 🔊 Crystal-clear pronunciation for learning

## 🎮 How to Play
1. **Start**: Press "Play" and give your dino a name (by voice!)
2. **Find Letters**: Dino asks, you tap the right letter in the jungle
3. **Say Letters**: Practice pronunciation - dino teaches, you repeat
4. **Parents**: Hold the ⚙️ for 3 seconds (top right) to enter your PIN (default: 1234)

## 👨‍👩‍👧‍👦 For Parents
- **Progress Tracking**: See which letters your learner has mastered
- **Screen Time**: Set daily play limits (15, 30, 45 minutes, or unlimited)
- **AI Insights**: View AI analysis of learning patterns
- **Voice Settings**: Choose from premium voices and test different emotions
- **Always Safe**: No inappropriate content, no data collection
- **PIN Protected**: Kids can't access parent features

## 🛠 For Developers

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **State**: Zustand for simple, effective state management
- **AI**: Google Gemini Pro for adaptive difficulty and personalization
- **Voice**: ElevenLabs for premium TTS + Web Speech API fallback
- **Animations**: CSS + Tailwind for smooth, delightful interactions

### Project Structure
```
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── game/              # Game-specific components
│   └── ui/                # Generic UI elements
├── features/              # Feature-specific components
├── hooks/                 # Custom React hooks
│   ├── useAdaptiveDifficulty.ts  # AI-powered difficulty adjustment
│   ├── useEnhancedVoice.ts       # ElevenLabs voice integration
│   └── useErrorHandler.ts        # Comprehensive error tracking
├── lib/                   # Core libraries
│   ├── geminiAI.ts       # Google Gemini AI integration
│   ├── elevenLabsVoice.ts # ElevenLabs voice synthesis
│   └── errorTracking.ts   # Error monitoring system
├── store/                 # Zustand state stores
└── README.md              # This file!
```

### Safety & Privacy
- All AI responses are pre-scripted and positive
- No audio recordings are stored
- No personal information collected
- Parent controls are PIN-protected
- All interactions are encouraging and educational

### Error Tracking & Monitoring
The app includes comprehensive error tracking:
- **Global Error Handling**: Catches unhandled errors and promise rejections
- **Component Error Boundaries**: Graceful fallbacks for component errors
- **Detailed Logging**: Errors, warnings, and info logs with context
- **Parent Dashboard**: View error logs, export for analysis
- **Safe Fallbacks**: All errors result in child-friendly messages

#### Error Tracking Features:
- Session-based tracking with unique IDs
- Local storage persistence
- Export functionality for debugging
- Context-aware logging (component, action, metadata)
- Browser compatibility detection
- Performance monitoring

#### For Production Monitoring:
To add external error tracking (Sentry, LogRocket, etc.), modify `lib/errorTracking.ts`:

```typescript
// Add to sendToBackend method:
if (typeof window !== 'undefined' && window.Sentry) {
  window.Sentry.captureException(new Error(errorLog.message), {
    contexts: { errorLog }
  });
}
```

### Extending the Game
Want to add more features? Here are some ideas:
- **More Games**: Numbers, shapes, sight words
- **New Characters**: Different dinosaurs for different subjects
- **Advanced AI**: Real speech recognition with Vosk or cloud APIs
- **Multiplayer**: Let siblings play together
- **Progress Reports**: Email summaries for parents

## 🎯 Development Guidelines

### Error Handling
All errors are gracefully handled with child-friendly messages. The error tracking system provides:
- Real-time error monitoring
- Detailed context for debugging
- Safe fallbacks that never break the user experience
- Parent-accessible error logs for troubleshooting

### Voice Integration
Current implementation uses ElevenLabs for premium TTS with Web Speech API fallback. To enhance:
1. Add Vosk for offline processing
2. Consider cloud services (Google, Azure) for advanced features
3. Implement custom wake words or voice commands

### AI Integration
The Gemini AI integration provides:
- Adaptive difficulty based on performance analysis
- Personalized encouragement generation
- Learning pattern recognition
- Smart content recommendation

### Data Persistence
Currently uses localStorage with Zustand. For multi-device sync:
1. Add user authentication
2. Create backend API for progress storage
3. Implement cloud sync functionality

## 📱 Deployment
Ready to share with the world? The app builds successfully and is ready for deployment!

### One-Click Deployments
- **Vercel**: Click the "Deploy to Vercel" button above
- **Netlify**: Click the "Deploy to Netlify" button above

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Vercel (recommended)
npx vercel --prod

# Or deploy to Netlify
npm run build && npx netlify deploy --prod --dir=.next
```

### Build Status
✅ **Build verified**: Successfully builds for production with no errors
✅ **Dependencies updated**: All security vulnerabilities resolved
✅ **Ready for deployment**: Compatible with Vercel, Netlify, and other hosting platforms

## 🤝 Contributing
We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines, [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community standards, and [GOVERNANCE.md](GOVERNANCE.md) for decision-making.

## 🔐 Security & Support

Please review our [Security Policy](SECURITY.md) for how to report vulnerabilities and secure development guidance, and [SUPPORT.md](SUPPORT.md) for our best‑effort support policy.

## 🧭 Architecture & Threat Model

- Architecture overview and diagrams: [docs/architecture.md](docs/architecture.md)
- Threat model (STRIDE): [docs/threat-model.md](docs/threat-model.md)
- C4 diagrams: [docs/c4-context.md](docs/c4-context.md), [docs/c4-container.md](docs/c4-container.md)

## 📘 Product Overview

See [docs/product-overview.md](docs/product-overview.md) for a high-level summary, configuration, and demo tips.

## 🚢 Deployment & Hardening

See [docs/deployment.md](docs/deployment.md) for security headers, CSP examples, and platform notes.

## 📦 Releases & Changelog

- Release process: [docs/releasing.md](docs/releasing.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)

## 📝 License
This project is dual-licensed:
- **Community License:** AGPL-3.0 (see LICENSE-AGPL). This is free to use for any project that also releases its full source code.
- **Commercial License:** Required for use in closed-source applications or hosted services that do not open-source their code. It includes priority support and removes the copyleft requirements of the AGPL.

Please contact support@verifiableproof.systems for commercial licensing terms.

See the [LICENSE](LICENSE) file for details.

## 🧑‍⚖️ Ownership & Support
- Ownership: Copyright © 2024–2025 "DinoAlphabet Pals" authors.
- License: Dual-licensed AGPL-3.0/Commercial — see above for details.
- Maintenance: Community-supported, best‑effort. No response-time guarantees or SLAs.
- Issues/PRs: Reviewed as time permits. For urgent needs, please fork.

---

**Made with 💚 for early childhood education**

## ℹ️ Maintainer’s Note

This repository started as a self-learning project to practice programming fundamentals and documentation quality. It’s intentionally simple, runs fully locally without external services, and may not be actively maintained at all times. Contributions are welcome — please see CONTRIBUTING, follow the Code of Conduct, and propose enhancements via issues/PRs. By using or contributing, you acknowledge that:

- There is no warranty and no guaranteed support timeline.
- Maintainers may be slow to review or respond.
- You are free to use, modify, and redistribute under dual AGPL-3.0/Commercial license, while the project authors retain copyright.
---

## 📢 Project Status Notice

**This project is a lower priority but not abandoned.** I'm currently focused on more pressing work in the regtech space, but I check in regularly to review issues and pull requests. Active feature development is paused, but the project remains functional and available for public use.

### What this means:

- ✅ **Free to use, fork, and modify** under dual AGPL-3.0/Commercial License
- ✅ **Issues and PRs welcome** - reviewed as time permits (may be delayed)
- ⏸️ **Development paused** - prioritizing other work commitments
- ⚠️ **Limited support** - responses may be significantly delayed
- ⚠️ **Security updates** - addressed on best-effort basis
- 💡 **For urgent needs** - please fork and maintain your own version

The project is functional and safe for use. Community contributions and forks are encouraged!
