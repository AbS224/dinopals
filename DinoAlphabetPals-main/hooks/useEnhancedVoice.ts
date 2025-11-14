import { useState, useCallback, useEffect } from 'react';
import ElevenLabsVoice from '@/lib/elevenLabsVoice';
import { useErrorHandler } from './useErrorHandler';

export function useEnhancedVoice() {
  const [elevenLabs, setElevenLabs] = useState<ElevenLabsVoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const { handleError, handleInfo, handleWarning } = useErrorHandler({ component: 'useEnhancedVoice' });

  // Initialize ElevenLabs when API key is available
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    if (apiKey) {
      const voice = new ElevenLabsVoice(apiKey);
      setElevenLabs(voice);
      handleInfo('ElevenLabs voice initialized');
      
      // Load available voices
      voice.getAvailableVoices().then(voices => {
        setAvailableVoices(voices);
        handleInfo(`Loaded ${voices.length} ElevenLabs voices`);
      });
    } else {
      handleWarning('ElevenLabs API key not found, using browser TTS');
    }

    // Cleanup on unmount
    return () => {
      if (elevenLabs) {
        elevenLabs.clearCache();
      }
    };
  }, [handleError, handleInfo, handleWarning]);

  const speak = useCallback(async (
    text: string, 
    emotion: 'happy' | 'excited' | 'gentle' | 'encouraging' = 'happy'
  ) => {
    setIsLoading(true);
    
    try {
      if (elevenLabs) {
        await elevenLabs.speak(text, emotion);
        handleInfo(`ElevenLabs TTS: "${text}" with ${emotion} emotion`);
      } else {
        // Fallback to browser TTS
        fallbackSpeak(text, emotion);
        handleInfo(`Browser TTS fallback: "${text}"`);
      }
    } catch (error) {
      handleError(error as Error, 'enhanced_voice_failed');
      fallbackSpeak(text, emotion);
    } finally {
      setIsLoading(false);
    }
  }, [elevenLabs, handleError, handleInfo]);

  const fallbackSpeak = useCallback((text: string, emotion: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utter = new window.SpeechSynthesisUtterance(text);
    
    // Adjust parameters based on emotion
    switch (emotion) {
      case 'excited':
        utter.pitch = 1.5;
        utter.rate = 1.1;
        break;
      case 'gentle':
        utter.pitch = 1.2;
        utter.rate = 0.8;
        break;
      case 'encouraging':
        utter.pitch = 1.3;
        utter.rate = 0.9;
        break;
      default:
        utter.pitch = 1.3;
        utter.rate = 0.9;
    }
    
    utter.volume = 0.8;
    utter.lang = "en-US";
    
    // Try to pick a child-friendly voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.toLowerCase().includes("child") || 
      v.name.toLowerCase().includes("samantha")
    ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
    
    if (preferredVoice) utter.voice = preferredVoice;
    
    window.speechSynthesis.speak(utter);
  }, []);

  const changeVoice = useCallback((voiceId: string) => {
    if (elevenLabs) {
      elevenLabs.setVoice(voiceId);
      handleInfo(`Voice changed to: ${voiceId}`);
    }
  }, [elevenLabs, handleInfo]);

  return {
    speak,
    changeVoice,
    isLoading,
    availableVoices,
    hasElevenLabs: !!elevenLabs
  };
}