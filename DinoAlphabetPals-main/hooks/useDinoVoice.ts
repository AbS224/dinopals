import { useCallback } from "react";
import { useErrorHandler } from "./useErrorHandler";

export function useDinoVoice() {
  const { handleError, handleWarning, handleInfo, safeSync } = useErrorHandler({
    component: 'useDinoVoice'
  });

  // Use browser's speechSynthesis for MVP
  const say = useCallback((text: string) => {
    safeSync(() => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        handleWarning("Speech synthesis not available");
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.pitch = 1.3; // Friendly, youthful voice
      utter.rate = 0.9;  // Slightly slower for young children
      utter.volume = 0.8;
      utter.lang = "en-US";
      
      // Try to pick a child-friendly voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.toLowerCase().includes("child") || 
        v.name.toLowerCase().includes("kid") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("karen")
      ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
      
      if (preferredVoice) utter.voice = preferredVoice;
      
      utter.onstart = () => {
        handleInfo(`Speaking: "${text}"`, 'speech_synthesis_start');
      };
      
      utter.onerror = (event) => {
        handleError(new Error(`Speech synthesis error: ${event.error}`), 'speech_synthesis_error', {
          text,
          errorType: event.error
        });
      };
      
      utter.onend = () => {
        handleInfo("Speech synthesis completed", 'speech_synthesis_end');
      };
      
      window.speechSynthesis.speak(utter);
    }, undefined, 'text_to_speech');
  }, [handleError, handleWarning, handleInfo, safeSync]);

  const sayWithEmotion = useCallback((text: string, emotion: "happy" | "excited" | "gentle" | "encouraging") => {
    safeSync(() => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        handleWarning("Speech synthesis not available for emotional speech");
        return;
      }
      
      window.speechSynthesis.cancel();
      
      const utter = new window.SpeechSynthesisUtterance(text);
      
      // Adjust voice parameters based on emotion
      switch (emotion) {
        case "happy":
          utter.pitch = 1.4;
          utter.rate = 1.0;
          break;
        case "excited":
          utter.pitch = 1.5;
          utter.rate = 1.1;
          break;
        case "gentle":
          utter.pitch = 1.2;
          utter.rate = 0.8;
          break;
        case "encouraging":
          utter.pitch = 1.3;
          utter.rate = 0.9;
          break;
      }
      
      utter.volume = 0.8;
      utter.lang = "en-US";
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.toLowerCase().includes("child") || 
        v.name.toLowerCase().includes("samantha")
      ) || voices.find(v => v.lang.startsWith("en")) || voices[0];
      
      if (preferredVoice) utter.voice = preferredVoice;
      
      utter.onstart = () => {
        handleInfo(`Speaking with ${emotion} emotion: "${text}"`, 'emotional_speech_start');
      };
      
      utter.onerror = (event) => {
        handleError(new Error(`Emotional speech synthesis error: ${event.error}`), 'emotional_speech_error', {
          text,
          emotion,
          errorType: event.error
        });
      };
      
      window.speechSynthesis.speak(utter);
    }, undefined, 'emotional_text_to_speech');
  }, [handleError, handleWarning, handleInfo, safeSync]);

  return { say, sayWithEmotion };
}