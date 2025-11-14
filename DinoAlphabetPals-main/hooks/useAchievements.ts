import { useState, useCallback } from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  condition: (stats: GameStats) => boolean;
}

interface GameStats {
  correctAnswers: number;
  lettersLearned: number;
  streak: number;
  timeSpent?: number;
  gamesPlayed?: number;
}

const achievements: Achievement[] = [
  {
    id: "first_letter",
    title: "Letter Detective",
    description: "Found your first letter!",
    icon: "🔍",
    unlocked: false,
    condition: (stats) => stats.correctAnswers >= 1
  },
  {
    id: "five_streak",
    title: "On Fire!",
    description: "Got 5 letters in a row!",
    icon: "🔥",
    unlocked: false,
    condition: (stats) => stats.streak >= 5
  },
  {
    id: "ten_letters",
    title: "Alphabet Explorer",
    description: "Learned 10 letters!",
    icon: "🗺️",
    unlocked: false,
    condition: (stats) => stats.lettersLearned >= 10
  },
  {
    id: "all_letters",
    title: "Alphabet Master",
    description: "Mastered all 26 letters!",
    icon: "👑",
    unlocked: false,
    condition: (stats) => stats.lettersLearned >= 26
  },
  {
    id: "speed_demon",
    title: "Lightning Fast",
    description: "Found 10 letters in under 2 minutes!",
    icon: "⚡",
    unlocked: false,
    condition: (stats) => stats.correctAnswers >= 10 && (stats.timeSpent || 0) < 120
  },
  {
    id: "persistent",
    title: "Never Give Up",
    description: "Played 5 games in one session!",
    icon: "💪",
    unlocked: false,
    condition: (stats) => (stats.gamesPlayed || 0) >= 5
  },
  {
    id: "pronunciation_pro",
    title: "Speaking Star",
    description: "Practiced pronunciation 20 times!",
    icon: "🎤",
    unlocked: false,
    condition: (stats) => stats.correctAnswers >= 20
  }
];

export function useAchievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);

  const checkAchievements = useCallback((stats: GameStats): Achievement[] => {
    const newlyUnlocked: Achievement[] = [];
    
    achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition(stats)) {
        achievement.unlocked = true;
        newlyUnlocked.push(achievement);
      }
    });

    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
    }

    return newlyUnlocked;
  }, []);

  const getAllAchievements = useCallback(() => achievements, []);

  const getUnlockedCount = useCallback(() => 
    achievements.filter(a => a.unlocked).length, []);

  return {
    checkAchievements,
    getAllAchievements,
    getUnlockedCount,
    unlockedAchievements
  };
}