import { Language } from '../types';

export const LANGUAGE_VOICE_MAP: Record<Language, { stt: string; tts: string; name: string }> = {
  en: { stt: 'en-IN', tts: 'en-IN', name: 'English (India)' },
  ta: { stt: 'ta-IN', tts: 'ta-IN', name: 'Tamil (India)' },
  hi: { stt: 'hi-IN', tts: 'hi-IN', name: 'Hindi (India)' },
  te: { stt: 'te-IN', tts: 'te-IN', name: 'Telugu (India)' },
  kn: { stt: 'kn-IN', tts: 'kn-IN', name: 'Kannada (India)' },
  ml: { stt: 'ml-IN', tts: 'ml-IN', name: 'Malayalam (India)' },
  mr: { stt: 'mr-IN', tts: 'mr-IN', name: 'Marathi (India)' },
  bn: { stt: 'bn-IN', tts: 'bn-IN', name: 'Bengali (India)' },
  auto: { stt: 'en-IN', tts: 'en-IN', name: 'Auto-detect' },
};

export interface VoiceStatus {
  state: 'idle' | 'listening' | 'processing' | 'captured' | 'error';
  message: string;
}

// ----------------------------------------------------------------------------
// SPEECH RECOGNITION (STT)
// ----------------------------------------------------------------------------
export class MultilingualSpeechRecognition {
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public listen(
    language: Language,
    onStatusChange: (status: VoiceStatus) => void,
    onResult: (transcript: string) => void
  ) {
    if (!this.recognition) {
      onStatusChange({
        state: 'error',
        message: 'Speech recognition is not supported in this browser.',
      });
      return;
    }

    const locale = LANGUAGE_VOICE_MAP[language]?.stt || 'en-IN';
    this.recognition.lang = locale;

    onStatusChange({
      state: 'listening',
      message: 'Listening...',
    });

    this.recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        onStatusChange({
          state: 'captured',
          message: 'Voice captured',
        });
        onResult(transcript);
      } else {
        onStatusChange({
          state: 'error',
          message: 'Could not understand. Try again.',
        });
      }
    };

    this.recognition.onerror = (err: any) => {
      console.warn('Speech recognition error:', err);
      onStatusChange({
        state: 'error',
        message: 'Could not understand. Try again.',
      });
    };

    this.recognition.onend = () => {
      // Return to idle if captured or finished
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
      onStatusChange({
        state: 'error',
        message: 'Could not understand. Try again.',
      });
    }
  }

  public stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }
}

// ----------------------------------------------------------------------------
// SPEECH SYNTHESIS (TTS)
// ----------------------------------------------------------------------------
export class MultilingualSpeechSynthesis {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public speak(text: string, language: Language, onEnd?: () => void) {
    if (!this.synth) return;

    this.stop(); // Cancel any ongoing speech

    const cleanText = text.replace(/[*_#`~]/g, ''); // Clean markdown formatting before reading aloud
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const targetLocale = LANGUAGE_VOICE_MAP[language]?.tts || 'en-IN';
    
    // Find voice matching language locale
    let matchingVoice = this.voices.find(v => v.lang.toLowerCase().includes(targetLocale.toLowerCase()));
    if (!matchingVoice) {
      matchingVoice = this.voices.find(v => v.lang.toLowerCase().startsWith(language.toLowerCase()));
    }

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    
    utterance.lang = targetLocale;
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechRecognizer = new MultilingualSpeechRecognition();
export const speechSynthesizer = new MultilingualSpeechSynthesis();
