import { useState, useCallback, useRef } from "react";
import { useErrorHandler } from "./useErrorHandler";

export function useMicrophone() {
  const [listening, setListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
  const { handleError, handleWarning, handleInfo, safeAsync } = useErrorHandler({
    component: 'useMicrophone'
  });

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      handleWarning("Speech recognition not supported in this browser");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    
    return recognition;
  }, [handleWarning]);

  // Request microphone permission
  const requestPermission = useCallback(async () => {
    return safeAsync(async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      handleInfo("Microphone permission granted");
      return true;
    }, false, 'request_microphone_permission');
  }, [safeAsync, handleInfo]);

  // Enhanced speech recognition with real Web Speech API
  const recognizeSpeech = useCallback(
    (): Promise<string> =>
      new Promise(async (resolve, reject) => {
        try {
          // Check permission first
          if (hasPermission === null) {
            const granted = await requestPermission();
            if (!granted) {
              handleError(new Error("Microphone permission required"), 'permission_denied');
              reject(new Error("Microphone permission required"));
              return;
            }
          }

          // Try real speech recognition first
          const recognition = initializeSpeechRecognition();
          
          if (recognition) {
            setListening(true);
            recognitionRef.current = recognition;

            recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              setListening(false);
              handleInfo(`Speech recognized: ${transcript}`, 'speech_recognition_success');
              resolve(transcript.trim());
            };

            recognition.onerror = (event: any) => {
              handleError(new Error(`Speech recognition error: ${event.error}`), 'speech_recognition_error', {
                errorType: event.error
              });
              setListening(false);
              // Fall back to mock recognition
              setTimeout(() => {
                const sampleNames = [
                  "Bluey", "Sunny", "Bubbles", "Leafy", "Chompy", 
                  "Rainbow", "Giggles", "Sparkle", "Happy", "Buddy"
                ];
                const fallbackName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
                handleInfo(`Using fallback name: ${fallbackName}`, 'fallback_name_used');
                resolve(fallbackName);
              }, 1000);
            };

            recognition.onend = () => {
              setListening(false);
            };

            try {
              recognition.start();
              handleInfo("Speech recognition started", 'speech_recognition_start');
            } catch (error) {
              handleError(error as Error, 'speech_recognition_start_failed');
              setListening(false);
              reject(error);
            }
          } else {
            // Fallback to mock recognition for demo
            handleWarning("Using mock speech recognition", 'mock_recognition_fallback');
            setListening(true);
            setTimeout(() => {
              setListening(false);
              const sampleNames = [
                "Bluey", "Sunny", "Bubbles", "Leafy", "Chompy", 
                "Rainbow", "Giggles", "Sparkle", "Happy", "Buddy"
              ];
              const mockName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
              handleInfo(`Mock recognition result: ${mockName}`, 'mock_recognition_success');
              resolve(mockName);
            }, 2000);
          }
        } catch (error) {
          handleError(error as Error, 'recognize_speech_failed');
          setListening(false);
          reject(error);
        }
      }),
    [hasPermission, requestPermission, initializeSpeechRecognition, handleError, handleWarning, handleInfo]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
    handleInfo("Speech recognition stopped", 'speech_recognition_stop');
  }, [handleInfo]);

  return { 
    listening, 
    recognizeSpeech, 
    stopListening, 
    hasPermission, 
    requestPermission 
  };
}