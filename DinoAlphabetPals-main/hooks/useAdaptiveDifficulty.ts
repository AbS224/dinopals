import { useState, useCallback, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useParentStore } from '@/store/parentStore';
import GeminiAI from '@/lib/geminiAI';
import { useErrorHandler } from './useErrorHandler';

interface LearningMetrics {
  responseTime: number;
  accuracy: number;
  streakCount: number;
  strugglingLetters: string[];
  sessionDuration: number;
}

export function useAdaptiveDifficulty() {
  const { sessionStats, difficulty, setDifficulty, dinoName } = useGameStore();
  const { progressData } = useParentStore();
  const { handleError, handleInfo } = useErrorHandler({ component: 'useAdaptiveDifficulty' });
  
  const [geminiAI, setGeminiAI] = useState<GeminiAI | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);

  // Initialize Gemini AI when API key is available
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      setGeminiAI(new GeminiAI(apiKey));
      handleInfo('Gemini AI initialized for adaptive difficulty');
    } else {
      handleInfo('Gemini API key not found, using fallback difficulty logic');
    }
  }, [handleInfo]);

  const analyzeDifficulty = useCallback(async () => {
    if (!geminiAI || isAnalyzing) return;

    setIsAnalyzing(true);
    
    try {
      const masteredLetters = Object.entries(progressData)
        .filter(([_, status]) => status === 'mastered')
        .map(([letter, _]) => letter);
      
      const strugglingLetters = Object.entries(progressData)
        .filter(([_, status]) => status === 'not-practiced')
        .map(([letter, _]) => letter);

      const pattern = {
        correctAnswers: sessionStats.correctAnswers,
        incorrectAnswers: sessionStats.totalAttempts - sessionStats.correctAnswers,
        averageResponseTime: 5, // Would track this in real implementation
        strugglingLetters,
        masteredLetters,
        sessionLength: sessionStats.timeSpent / 60, // Convert to minutes
        streakCount: sessionStats.currentStreak
      };

      const analysis = await geminiAI.analyzeLearningPattern(pattern);
      setLastAnalysis(analysis);
      
      // Apply the recommended difficulty
      if (analysis.recommendedDifficulty !== difficulty) {
        setDifficulty(analysis.recommendedDifficulty);
        handleInfo(`Difficulty adjusted to ${analysis.recommendedDifficulty}: ${analysis.reasoning}`);
      }

      return analysis;
    } catch (error) {
      handleError(error as Error, 'difficulty_analysis_failed');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [geminiAI, isAnalyzing, progressData, sessionStats, difficulty, setDifficulty, handleError, handleInfo]);

  const generatePersonalizedEncouragement = useCallback(async (achievement: string) => {
    if (!geminiAI || !dinoName) return null;

    try {
      const encouragement = await geminiAI.generateEncouragement({
        childName: dinoName,
        achievement,
        difficulty
      });
      
      handleInfo(`Generated personalized encouragement: ${encouragement}`);
      return encouragement;
    } catch (error) {
      handleError(error as Error, 'encouragement_generation_failed');
      return null;
    }
  }, [geminiAI, dinoName, difficulty, handleError, handleInfo]);

  // Auto-analyze difficulty every 10 correct answers
  useEffect(() => {
    if (sessionStats.correctAnswers > 0 && sessionStats.correctAnswers % 10 === 0) {
      analyzeDifficulty();
    }
  }, [sessionStats.correctAnswers, analyzeDifficulty]);

  return {
    analyzeDifficulty,
    generatePersonalizedEncouragement,
    isAnalyzing,
    lastAnalysis,
    hasAI: !!geminiAI
  };
}