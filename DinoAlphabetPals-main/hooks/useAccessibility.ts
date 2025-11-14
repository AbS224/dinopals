import { useState, useCallback } from "react";

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  audioDescriptions: boolean;
  keyboardNavigation: boolean;
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    audioDescriptions: false,
    keyboardNavigation: false
  });

  const updateSetting = useCallback((key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Apply settings to document
    if (key === "highContrast") {
      document.body.classList.toggle("high-contrast", value);
    }
    if (key === "largeText") {
      document.body.classList.toggle("large-text", value);
    }
    if (key === "reducedMotion") {
      document.body.classList.toggle("reduced-motion", value);
    }
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      audioDescriptions: false,
      keyboardNavigation: false
    });
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings
  };
}