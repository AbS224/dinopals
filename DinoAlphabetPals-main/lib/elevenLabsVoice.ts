interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface ElevenLabsResponse {
  audio: ArrayBuffer;
}

class ElevenLabsVoice {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  private voiceId: string;
  private audioCache = new Map<string, string>();

  constructor(apiKey: string, voiceId: string = 'pNInz6obpgDQGcFmaJgB') { // Default child-friendly voice ID
    this.apiKey = apiKey;
    this.voiceId = voiceId; // Default to a child-friendly voice
  }

  async speak(text: string, emotion: 'happy' | 'excited' | 'gentle' | 'encouraging' = 'happy'): Promise<void> {
    try {
      // Check cache first
      const cacheKey = `${text}_${emotion}_${this.voiceId}`;
      if (this.audioCache.has(cacheKey)) {
        await this.playAudio(this.audioCache.get(cacheKey)!);
        return;
      }

      const voiceSettings = this.getVoiceSettings(emotion);
      
      const response = await fetch(`${this.baseUrl}/text-to-speech/${this.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: voiceSettings
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Cache the audio URL
      this.audioCache.set(cacheKey, audioUrl);
      
      await this.playAudio(audioUrl);
    } catch (error) {
      console.error('ElevenLabs TTS failed:', error);
      // Fallback to browser TTS
      this.fallbackToWebSpeech(text, emotion);
    }
  }

  private getVoiceSettings(emotion: string): VoiceSettings {
    switch (emotion) {
      case 'excited':
        return {
          stability: 0.3,
          similarity_boost: 0.8,
          style: 0.8,
          use_speaker_boost: true
        };
      case 'gentle':
        return {
          stability: 0.8,
          similarity_boost: 0.9,
          style: 0.2,
          use_speaker_boost: false
        };
      case 'encouraging':
        return {
          stability: 0.5,
          similarity_boost: 0.85,
          style: 0.6,
          use_speaker_boost: true
        };
      default: // happy
        return {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: true
        };
    }
  }

  private async playAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Audio playback failed'));
      audio.play().catch(reject);
    });
  }

  private fallbackToWebSpeech(text: string, emotion: string): void {
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
    
    window.speechSynthesis.speak(utter);
  }

  async getAvailableVoices(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        }
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json();
      return data.voices;
    } catch (error) {
      console.error('Failed to fetch ElevenLabs voices:', error);
      return [];
    }
  }

  setVoice(voiceId: string): void {
    this.voiceId = voiceId;
    this.audioCache.clear(); // Clear cache when voice changes
  }

  clearCache(): void {
    // Clean up blob URLs to prevent memory leaks
    this.audioCache.forEach(url => URL.revokeObjectURL(url));
    this.audioCache.clear();
  }
}

export default ElevenLabsVoice;