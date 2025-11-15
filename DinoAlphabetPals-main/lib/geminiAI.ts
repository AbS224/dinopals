interface DifficultyAnalysis {
  recommendedDifficulty: "easy" | "medium" | "hard";
  reasoning: string;
  adaptations: {
    letterCount: number;
    timeLimit?: number;
    hints: boolean;
    encouragementLevel: "high" | "medium" | "low";
  };
  nextLetters: string[];
}

interface LearningPattern {
  correctAnswers: number;
  incorrectAnswers: number;
  averageResponseTime: number;
  strugglingLetters: string[];
  masteredLetters: string[];
  sessionLength: number;
  streakCount: number;
}

class GeminiAI {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeLearningPattern(pattern: LearningPattern): Promise<DifficultyAnalysis> {
    const prompt = `
You are an expert child learning specialist analyzing a 4-year-old's alphabet learning progress. 

Current Learning Data:
- Correct answers: ${pattern.correctAnswers}
- Incorrect answers: ${pattern.incorrectAnswers}
- Average response time: ${pattern.averageResponseTime}s
- Struggling letters: ${pattern.strugglingLetters.join(', ') || 'None'}
- Mastered letters: ${pattern.masteredLetters.join(', ') || 'None'}
- Session length: ${pattern.sessionLength} minutes
- Current streak: ${pattern.streakCount}

Please analyze this data and provide:
1. Recommended difficulty level (easy/medium/hard)
2. Brief reasoning for the recommendation
3. Specific adaptations needed
4. Next 5 letters to focus on

Respond in JSON format:
{
  "recommendedDifficulty": "easy|medium|hard",
  "reasoning": "Brief explanation",
  "adaptations": {
    "letterCount": 3-6,
    "timeLimit": optional_seconds,
    "hints": true/false,
    "encouragementLevel": "high|medium|low"
  },
  "nextLetters": ["A", "B", "C", "D", "E"]
}

Focus on keeping the child engaged and building confidence. Prioritize success over challenge.
`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Gemini AI analysis failed:', error);
      
      // Fallback analysis based on simple rules
      return this.getFallbackAnalysis(pattern);
    }
  }

  private getFallbackAnalysis(pattern: LearningPattern): DifficultyAnalysis {
    const accuracy = pattern.correctAnswers / (pattern.correctAnswers + pattern.incorrectAnswers);
    const hasStruggles = pattern.strugglingLetters.length > 3;
    
    let difficulty: "easy" | "medium" | "hard" = "medium";
    
    if (accuracy < 0.6 || hasStruggles || pattern.averageResponseTime > 8) {
      difficulty = "easy";
    } else if (accuracy > 0.8 && pattern.streakCount > 5) {
      difficulty = "hard";
    }

    return {
      recommendedDifficulty: difficulty,
      reasoning: `Based on ${Math.round(accuracy * 100)}% accuracy and current performance`,
      adaptations: {
        letterCount: difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 6,
        hints: difficulty === "easy",
        encouragementLevel: hasStruggles ? "high" : "medium"
      },
      nextLetters: this.getNextLetters(pattern)
    };
  }

  private getNextLetters(pattern: LearningPattern): string[] {
    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const unmastered = allLetters.filter(l => !pattern.masteredLetters.includes(l));
    
    // Prioritize struggling letters, then new letters
    const priority = [
      ...pattern.strugglingLetters.slice(0, 2),
      ...unmastered.slice(0, 3)
    ];
    
    return priority.slice(0, 5);
  }

  async generateEncouragement(context: {
    childName: string;
    achievement: string;
    difficulty: string;
  }): Promise<string> {
    const prompt = `
Generate a short, enthusiastic encouragement message for a 4-year-old named ${context.childName} who just ${context.achievement} at ${context.difficulty} difficulty.

Requirements:
- Maximum 10 words
- Use simple, positive language
- Include the child's name
- Be genuinely excited and encouraging
- Appropriate for a friendly dinosaur character

Examples:
- "Amazing work, ${context.childName}! You're a letter superstar!"
- "Wow ${context.childName}! That was incredible!"
- "${context.childName}, you're getting so smart!"

Generate one unique message:
`;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text.trim().replace(/"/g, '');
    } catch (error) {
      console.error('Gemini encouragement generation failed:', error);
      return `Great job, ${context.childName}! You're amazing!`;
    }
  }
}

export default GeminiAI;