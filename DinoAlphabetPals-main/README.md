# DinoAlphabet Pals

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

## 🚀 Quick Setup

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

## 🤖 AI & Voice Setup

### Google Gemini AI (Adaptive Difficulty)
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add `NEXT_PUBLIC_GEMINI_API_KEY=your_key_here` to `.env.local`
3. Restart the app

**AI Features:**
- 🎯 Automatically adjusts difficulty based on Jeffrey's performance
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
- **Progress Tracking**: See which letters Jeffrey has mastered
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
Ready to share with the world?

```bash
# Build the project
npm run build

# Deploy to Vercel (recommended)
npx vercel --prod

# Or deploy to Netlify
npm run build && npx netlify deploy --prod --dir=out
```

## 🤝 Contributing
We welcome contributions! This project is open source and maintained on a best-effort basis. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with 💚 for early childhood education**