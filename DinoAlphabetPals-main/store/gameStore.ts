import { create } from "zustand";

type GameStateType = "intro" | "naming" | "playing" | "paused";
type DifficultyLevel = "easy" | "medium" | "hard";
type DinoAccessory = "none" | "hat" | "bow" | "glasses";

interface GameState {
  dinoName: string | null;
  currentLetter: string | null;
  gameState: GameStateType;
  difficulty: DifficultyLevel;
  dinoColor: string;
  dinoAccessory: DinoAccessory;
  sessionStats: {
    correctAnswers: number;
    totalAttempts: number;
    timeSpent: number;
    lettersLearned: string[];
    currentStreak: number;
    bestStreak: number;
    gamesPlayed: number;
  };
  setDinoName: (name: string) => void;
  setGameState: (state: GameStateType) => void;
  setDifficulty: (level: DifficultyLevel) => void;
  setDinoColor: (color: string) => void;
  setDinoAccessory: (accessory: DinoAccessory) => void;
  updateStats: (update: Partial<GameState['sessionStats']>) => void;
  resetSession: () => void;
}

const initialStats = {
  correctAnswers: 0,
  totalAttempts: 0,
  timeSpent: 0,
  lettersLearned: [],
  currentStreak: 0,
  bestStreak: 0,
  gamesPlayed: 0,
};

export const useGameStore = create<GameState>((set, get) => ({
  dinoName: null,
  currentLetter: null,
  gameState: "intro",
  difficulty: "medium",
  dinoColor: "#82d4f7",
  dinoAccessory: "none",
  sessionStats: initialStats,
  
  setDinoName: (name) => set({ dinoName: name, gameState: "playing" }),
  setGameState: (gameState) => set({ gameState }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setDinoColor: (dinoColor) => set({ dinoColor }),
  setDinoAccessory: (dinoAccessory) => set({ dinoAccessory }),
  
  updateStats: (update) => set((state) => ({
    sessionStats: { ...state.sessionStats, ...update }
  })),
  
  resetSession: () => set({ sessionStats: initialStats }),
}));