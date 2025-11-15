"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import JungleBackground from "./JungleBackground";
import DinoCharacter from "./DinoCharacter";
import LetterObject from "./LetterObject";
import PronunciationGame from "./PronunciationGame";
import ParticleEffect from "./ParticleEffect";
import AchievementBadge from "./AchievementBadge";
import { useGameStore } from "@/store/gameStore";
import { useParentStore } from "@/store/parentStore";
import { useAchievements } from "@/hooks/useAchievements";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useAdaptiveDifficulty } from "@/hooks/useAdaptiveDifficulty";
import { useEnhancedVoice } from "@/hooks/useEnhancedVoice";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Enhanced positive encouragement phrases
const correctPhrases = [
  "Yay! You found it!",
  "Awesome job!",
  "You're a superstar!",
  "Dino-mite!",
  "Fantastic!",
  "You did it!",
  "Amazing work!",
  "Great job, buddy!",
  "Incredible!",
  "You're brilliant!",
  "Outstanding!",
  "Magnificent!",
  "Spectacular!",
  "Wonderful!",
  "Excellent!",
  "Marvelous!",
  "Terrific!",
  "Phenomenal!"
];

const tryAgainPhrases = [
  "Almost! Try again!",
  "So close! Let's try again!",
  "Good try! Pick another!",
  "Keep going, you've got this!",
  "Nice attempt! Try once more!",
  "You're learning! Try again!",
  "Great effort! One more time!",
  "Almost there! Keep trying!"
];

const streakPhrases = [
  "You're on fire!",
  "Amazing streak!",
  "Unstoppable!",
  "You're a letter champion!",
  "Incredible run!",
  "Letter master!"
];

function getRandomLetters(target: string, difficulty: "easy" | "medium" | "hard") {
  const counts = { easy: 3, medium: 4, hard: 6 };
  const n = counts[difficulty];
  
  const others = allLetters.filter(l => l !== target);
  const picks = [target];
  
  while (picks.length < n) {
    const idx = Math.floor(Math.random() * others.length);
    picks.push(others[idx]);
    others.splice(idx, 1);
  }
  
  // Shuffle
  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }
  return picks;
}

const getLetterPositions = (count: number) => {
  const positions = [
    { x: 180, y: 420 },
    { x: 700, y: 500 },
    { x: 320, y: 250 },
    { x: 950, y: 380 },
    { x: 500, y: 300 },
    { x: 800, y: 250 },
  ];
  return positions.slice(0, count);
};

const getRandomLetter = () => allLetters[Math.floor(Math.random() * allLetters.length)];
const getRandomPhrase = (phrases: string[]) => phrases[Math.floor(Math.random() * phrases.length)];

const GamePlayScreen: React.FC = () => {
  const { dinoName, difficulty, dinoColor, dinoAccessory } = useGameStore();
  const { setLetterProgress, progressData } = useParentStore();
  const { checkAchievements, unlockedAchievements } = useAchievements();
  const { settings } = useAccessibility();
  const { handleError, handleInfo, safeSync } = useErrorHandler({
    component: 'GamePlayScreen'
  });
  const { 
    analyzeDifficulty, 
    generatePersonalizedEncouragement, 
    isAnalyzing, 
    hasAI 
  } = useAdaptiveDifficulty();
  const { speak, isLoading: voiceLoading, hasElevenLabs } = useEnhancedVoice();
  
  const [currentTarget, setCurrentTarget] = useState(getRandomLetter());
  const [gameMode, setGameMode] = useState<"letters" | "pronunciation" | "words">("letters");
  const [backgroundTheme, setBackgroundTheme] = useState<"day" | "night" | "sunset" | "winter" | "beach" | "volcano">("day");
  
  const letters = useMemo(() => getRandomLetters(currentTarget, difficulty), [currentTarget, difficulty]);
  const letterPositions = useMemo(() => getLetterPositions(letters.length), [letters.length]);
  
  const [feedback, setFeedback] = useState<string | null>(null);
  const [neckTarget, setNeckTarget] = useState<{ x: number; y: number } | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [particlePos, setParticlePos] = useState({ x: 0, y: 0 });
  const [streak, setStreak] = useState(0);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  
  const correctCount = useRef<Record<string, number>>({});
  const streakCount = useRef(0);

  const handleTap = async (letter: string, idx: number) => {
    safeSync(async () => {
      if (letter === currentTarget) {
        // Move neck to letter
        const { x, y } = letterPositions[idx];
        setNeckTarget({ x: x + 32, y: y + 32 });
        setParticlePos({ x: x + 32, y: y + 32 });
        
        // Update streak
        streakCount.current += 1;
        setStreak(streakCount.current);
        
        // Choose appropriate phrase - try AI first, then fallback
        let phrase;
        if (hasAI && streakCount.current >= 3) {
          const aiPhrase = await generatePersonalizedEncouragement(`found the letter ${letter}`);
          phrase = aiPhrase || getRandomPhrase(correctPhrases);
        } else if (streakCount.current >= 5) {
          phrase = getRandomPhrase(streakPhrases);
        } else {
          phrase = getRandomPhrase(correctPhrases);
        }
        
        setFeedback(phrase);
        
        // Use enhanced voice with emotion
        const emotion = streakCount.current >= 5 ? 'excited' : 'happy';
        await speak(`${phrase} That's the letter ${currentTarget}!`, emotion);
        
        // Show particles
        setShowParticles(true);
        
        // Track progress
        correctCount.current[letter] = (correctCount.current[letter] || 0) + 1;
        if (correctCount.current[letter] >= 2) {
          setLetterProgress(letter, "mastered");
        } else {
          setLetterProgress(letter, "in-progress");
        }
        
        // Check for achievements
        const newAchievements = checkAchievements({
          correctAnswers: streakCount.current,
          lettersLearned: Object.keys(progressData).filter(l => progressData[l] === "mastered").length,
          streak: streakCount.current
        });
        
        if (newAchievements.length > 0) {
          setShowAchievement(newAchievements[0].title);
          setTimeout(() => setShowAchievement(null), 3000);
        }
        
        // Play chomp sound effect (if available)
        try {
          new Audio("/sounds/chomp.wav").play().catch(() => {});
        } catch {}
        
        handleInfo(`Correct letter selected: ${letter}`, 'correct_letter_tap', {
          letter,
          streak: streakCount.current,
          difficulty,
          hasAI,
          hasElevenLabs
        });
        
        setTimeout(() => {
          setNeckTarget(null);
          setCurrentTarget(getRandomLetter());
          setFeedback(null);
          setShowParticles(false);
        }, 1700);
      } else {
        // Reset streak on wrong answer
        streakCount.current = 0;
        setStreak(0);
        
        const phrase = getRandomPhrase(tryAgainPhrases);
        setFeedback(phrase);
        await speak(phrase, 'encouraging');
        
        handleInfo(`Incorrect letter selected: ${letter}, target was: ${currentTarget}`, 'incorrect_letter_tap', {
          selectedLetter: letter,
          targetLetter: currentTarget,
          difficulty
        });
        
        setTimeout(() => setFeedback(null), 1200);
      }
    }, undefined, 'letter_tap_handler');
  };

  // Dino prompts for current letter
  useEffect(() => {
    if (gameMode === "letters") {
      const prompt = `${dinoName ? dinoName + " says: " : ""}Can you find the letter ${currentTarget}?`;
      speak(prompt, 'gentle');
      handleInfo(`New letter prompt: ${currentTarget}`, 'letter_prompt', {
        letter: currentTarget,
        gameMode,
        difficulty
      });
    }
    // eslint-disable-next-line
  }, [currentTarget, gameMode]);

  return (
    <main className={`relative w-screen h-screen overflow-hidden flex items-end justify-center bg-cyan-100 ${settings.highContrast ? 'high-contrast' : ''} ${settings.largeText ? 'large-text' : ''}`}>
      <JungleBackground theme={backgroundTheme} />
      
      {/* AI Status Indicator */}
      {(hasAI || hasElevenLabs) && (
        <div className="absolute top-4 left-4 z-30 flex gap-2">
          {hasAI && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              isAnalyzing ? 'bg-blue-200 text-blue-800 animate-pulse' : 'bg-green-200 text-green-800'
            }`}>
              🧠 AI {isAnalyzing ? 'Analyzing...' : 'Active'}
            </div>
          )}
          {hasElevenLabs && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              voiceLoading ? 'bg-purple-200 text-purple-800 animate-pulse' : 'bg-purple-200 text-purple-800'
            }`}>
              🎤 Premium Voice {voiceLoading ? 'Speaking...' : 'Ready'}
            </div>
          )}
        </div>
      )}
      
      {/* Game Mode Toggle */}
      <div className="absolute right-8 top-8 z-30 flex gap-2">
        <button
          onClick={() => setGameMode("letters")}
          className={`px-4 py-2 rounded-full font-bold shadow-lg transition-all ${
            gameMode === "letters" 
              ? "bg-blue-300 border-2 border-blue-500 scale-105" 
              : "bg-white hover:bg-blue-50"
          }`}
        >
          🔍 Find Letters
        </button>
        <button
          onClick={() => setGameMode("pronunciation")}
          className={`px-4 py-2 rounded-full font-bold shadow-lg transition-all ${
            gameMode === "pronunciation" 
              ? "bg-pink-200 border-2 border-pink-400 scale-105" 
              : "bg-white hover:bg-pink-50"
          }`}
        >
          🗣️ Practice Saying
        </button>
        <button
          onClick={() => setGameMode("words")}
          className={`px-4 py-2 rounded-full font-bold shadow-lg transition-all ${
            gameMode === "words" 
              ? "bg-green-200 border-2 border-green-400 scale-105" 
              : "bg-white hover:bg-green-50"
          }`}
        >
          📝 Make Words
        </button>
      </div>
      
      {/* Theme Selector */}
      <div className="absolute left-8 top-16 z-30 flex gap-1">
        {["day", "night", "sunset", "winter", "beach", "volcano"].map((theme) => (
          <button
            key={theme}
            onClick={() => setBackgroundTheme(theme as any)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              backgroundTheme === theme ? "border-yellow-400 scale-110" : "border-white"
            }`}
            style={{
              background: {
                day: "#87ceeb",
                night: "#191970",
                sunset: "#ff6b35",
                winter: "#e6f3ff",
                beach: "#87ceeb",
                volcano: "#8b0000"
              }[theme]
            }}
            title={`${theme} theme`}
          />
        ))}
      </div>
      
      {/* Streak Counter */}
      {streak > 0 && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-20 streak-indicator rounded-full px-6 py-3 text-white font-bold text-xl shadow-lg">
          🔥 {streak} in a row!
        </div>
      )}
      
      {/* Achievement Notification */}
      {showAchievement && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 achievement-badge rounded-2xl px-8 py-4 text-center shadow-2xl animate-bounce">
          <div className="text-2xl mb-2">🏆</div>
          <div className="font-bold text-lg">Achievement Unlocked!</div>
          <div className="text-sm">{showAchievement}</div>
        </div>
      )}
      
      {/* Game Content */}
      {gameMode === "letters" ? (
        <>
          {/* Dino */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 z-10">
            <DinoCharacter 
              animationState={neckTarget ? "reaching" : streak > 3 ? "dancing" : "idle"} 
              neckTarget={neckTarget}
              dinoColor={dinoColor}
              accessoryType={dinoAccessory}
            />
          </div>
          
          {/* Letters */}
          {letters.map((letter, idx) => (
            <LetterObject
              key={letter}
              letter={letter}
              x={letterPositions[idx].x}
              y={letterPositions[idx].y}
              onTap={() => handleTap(letter, idx)}
              highlighted={letter === currentTarget}
              difficulty={difficulty}
            />
          ))}
          
          {/* Prompt */}
          <div className="absolute left-1/2 top-14 -translate-x-1/2 z-20 bg-white/90 rounded-full px-7 py-4 text-xl text-blue-800 shadow-lg border-2 border-blue-200 font-bold">
            {feedback ? (
              <span className="text-green-600">{feedback}</span>
            ) : (
              <>
                Can you find the letter{" "}
                <span className="text-green-600 text-2xl">{currentTarget}</span>?
              </>
            )}
          </div>
        </>
      ) : gameMode === "pronunciation" ? (
        <PronunciationGame />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-white/90 rounded-3xl px-12 py-8 shadow-2xl border-4 border-blue-200">
            <div className="text-2xl font-bold text-center text-blue-800 mb-4">
              Word Building Game
            </div>
            <div className="text-lg text-center text-gray-700">
              Coming Soon! 🚧
            </div>
          </div>
        </div>
      )}
      
      {/* Particle Effects */}
      <ParticleEffect
        x={particlePos.x}
        y={particlePos.y}
        type="confetti"
        active={showParticles}
        onComplete={() => setShowParticles(false)}
      />
    </main>
  );
};

export default GamePlayScreen;