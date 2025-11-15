import React, { useState, useEffect } from 'react';
import { useEnhancedVoice } from '@/hooks/useEnhancedVoice';
import { useAdaptiveDifficulty } from '@/hooks/useAdaptiveDifficulty';

const AIVoiceSettings: React.FC = () => {
  const { availableVoices, changeVoice, hasElevenLabs, speak } = useEnhancedVoice();
  const { hasAI, analyzeDifficulty, isAnalyzing } = useAdaptiveDifficulty();
  const [selectedVoice, setSelectedVoice] = useState('');
  const [testText, setTestText] = useState("Hello! I'm your friendly dinosaur!");

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    changeVoice(voiceId);
  };

  const testVoice = async (emotion: 'happy' | 'excited' | 'gentle' | 'encouraging') => {
    await speak(testText, emotion);
  };

  const triggerAIAnalysis = () => {
    analyzeDifficulty();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        🤖 AI & Voice Settings
      </h3>

      {/* API Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-xl border-2 ${
          hasAI ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧠</span>
            <span className="font-bold">Google Gemini AI</span>
          </div>
          <div className={`text-sm ${hasAI ? 'text-green-700' : 'text-gray-600'}`}>
            {hasAI ? '✅ Connected - Adaptive difficulty active' : '❌ Not configured'}
          </div>
          {!hasAI && (
            <div className="text-xs text-gray-500 mt-1">
              Add NEXT_PUBLIC_GEMINI_API_KEY to enable AI features
            </div>
          )}
        </div>

        <div className={`p-4 rounded-xl border-2 ${
          hasElevenLabs ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎤</span>
            <span className="font-bold">ElevenLabs Voice</span>
          </div>
          <div className={`text-sm ${hasElevenLabs ? 'text-purple-700' : 'text-gray-600'}`}>
            {hasElevenLabs ? '✅ Connected - Premium voice active' : '❌ Not configured'}
          </div>
          {!hasElevenLabs && (
            <div className="text-xs text-gray-500 mt-1">
              Add NEXT_PUBLIC_ELEVENLABS_API_KEY to enable premium voice
            </div>
          )}
        </div>
      </div>

      {/* AI Controls */}
      {hasAI && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <h4 className="font-bold text-blue-800 mb-3">🧠 AI Adaptive Difficulty</h4>
          <div className="flex items-center gap-3">
            <button
              onClick={triggerAIAnalysis}
              disabled={isAnalyzing}
              className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                isAnalyzing 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isAnalyzing ? '🔄 Analyzing...' : '🔍 Analyze Now'}
            </button>
            <div className="text-sm text-blue-700">
              AI automatically adjusts difficulty based on the learner's performance
            </div>
          </div>
        </div>
      )}

      {/* Voice Controls */}
      {hasElevenLabs && (
        <div className="mb-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
          <h4 className="font-bold text-purple-800 mb-3">🎤 Premium Voice Settings</h4>
          
          {/* Voice Selection */}
          {availableVoices.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Select Voice:
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Default Voice</option>
                {availableVoices.map((voice) => (
                  <option key={voice.voice_id} value={voice.voice_id}>
                    {voice.name} ({voice.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Voice Test */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Test Text:
            </label>
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full p-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter text to test voice..."
            />
          </div>

          {/* Emotion Test Buttons */}
          <div className="flex flex-wrap gap-2">
            {(['happy', 'excited', 'gentle', 'encouraging'] as const).map((emotion) => (
              <button
                key={emotion}
                onClick={() => testVoice(emotion)}
                className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
              >
                Test {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      {(!hasAI || !hasElevenLabs) && (
        <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
          <h4 className="font-bold text-yellow-800 mb-3">🔧 Setup Instructions</h4>
          <div className="text-sm text-yellow-700 space-y-2">
            {!hasAI && (
              <div>
                <strong>Google Gemini AI:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1">
                  <li>Get API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                  <li>Add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables</li>
                  <li>Restart the application</li>
                </ol>
              </div>
            )}
            {!hasElevenLabs && (
              <div>
                <strong>ElevenLabs Voice:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1">
                  <li>Get API key from <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="underline">ElevenLabs</a></li>
                  <li>Add NEXT_PUBLIC_ELEVENLABS_API_KEY to your environment variables</li>
                  <li>Restart the application</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="mt-6 p-4 bg-green-50 rounded-xl border-2 border-green-200">
        <h4 className="font-bold text-green-800 mb-3">✨ Benefits of AI & Premium Voice</h4>
        <div className="text-sm text-green-700 space-y-1">
          <div>🧠 <strong>AI Adaptive Difficulty:</strong> Automatically adjusts game difficulty based on the learner's performance</div>
          <div>🎯 <strong>Personalized Encouragement:</strong> AI generates custom praise messages for the learner</div>
          <div>🎤 <strong>Premium Voice:</strong> High-quality, natural-sounding voice with emotional expressions</div>
          <div>📊 <strong>Smart Analytics:</strong> AI analyzes learning patterns and suggests improvements</div>
          <div>🎭 <strong>Emotional Range:</strong> Voice adapts to different emotions (happy, excited, gentle, encouraging)</div>
        </div>
      </div>
    </div>
  );
};

export default AIVoiceSettings;