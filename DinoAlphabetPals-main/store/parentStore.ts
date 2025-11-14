import { create } from "zustand";

type LetterProgress = "not-practiced" | "in-progress" | "mastered";
type ProgressData = Record<string, LetterProgress>;

interface LearningAnalytics {
  totalPlayTime: number;
  sessionsCompleted: number;
  averageSessionLength: number;
  strongestLetters: string[];
  challengingLetters: string[];
  learningStreak: number;
  lastPlayDate: string;
  weeklyProgress: Record<string, number>;
}

interface ParentState {
  timeLimit: number;
  progressData: ProgressData;
  analytics: LearningAnalytics;
  fetchProgress: () => Promise<void>;
  persistProgress: () => Promise<void>;
  setTimeLimit: (minutes: number) => void;
  setLetterProgress: (letter: string, progress: LetterProgress) => void;
  updateAnalytics: (update: Partial<LearningAnalytics>) => void;
  exportProgress: () => string;
  resetProgress: () => void;
}

const initialProgress: ProgressData = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(
  (l) => (initialProgress[l] = "not-practiced")
);

const initialAnalytics: LearningAnalytics = {
  totalPlayTime: 0,
  sessionsCompleted: 0,
  averageSessionLength: 0,
  strongestLetters: [],
  challengingLetters: [],
  learningStreak: 0,
  lastPlayDate: "",
  weeklyProgress: {}
};

export const useParentStore = create<ParentState>((set, get) => ({
  timeLimit: 30,
  progressData: initialProgress,
  analytics: initialAnalytics,
  
  async fetchProgress() {
    try {
      // In production, fetch from API
      // For now, load from localStorage
      const saved = localStorage.getItem("dinoalphabet-progress");
      if (saved) {
        const data = JSON.parse(saved);
        set({
          progressData: data.progress || initialProgress,
          timeLimit: data.timeLimit || 30,
          analytics: data.analytics || initialAnalytics,
        });
      }
    } catch (error) {
      console.log("Could not load progress:", error);
    }
  },
  
  async persistProgress() {
    try {
      // In production, save to API
      // For now, save to localStorage
      const data = {
        progress: get().progressData,
        timeLimit: get().timeLimit,
        analytics: get().analytics,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("dinoalphabet-progress", JSON.stringify(data));
    } catch (error) {
      console.log("Could not save progress:", error);
    }
  },
  
  setTimeLimit(minutes) {
    set({ timeLimit: minutes });
    get().persistProgress();
  },
  
  setLetterProgress(letter, progress) {
    set((state) => ({
      progressData: { ...state.progressData, [letter]: progress },
    }));
    
    // Update analytics
    const currentProgress = get().progressData;
    const mastered = Object.values(currentProgress).filter(p => p === "mastered").length;
    const challenging = Object.entries(currentProgress)
      .filter(([_, p]) => p === "not-practiced")
      .map(([letter, _]) => letter);
    
    get().updateAnalytics({
      strongestLetters: Object.entries(currentProgress)
        .filter(([_, p]) => p === "mastered")
        .map(([letter, _]) => letter),
      challengingLetters: challenging.slice(0, 5)
    });
    
    get().persistProgress();
  },
  
  updateAnalytics(update) {
    set((state) => ({
      analytics: { ...state.analytics, ...update }
    }));
    get().persistProgress();
  },
  
  exportProgress() {
    const data = {
      progressData: get().progressData,
      analytics: get().analytics,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },
  
  resetProgress() {
    set({
      progressData: initialProgress,
      analytics: initialAnalytics
    });
    get().persistProgress();
  }
}));