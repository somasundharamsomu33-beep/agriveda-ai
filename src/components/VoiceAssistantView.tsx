import React, { useState, useRef } from 'react';
import { Mic, Send, Volume2, Globe, Sparkles, RefreshCw, Bot, User } from 'lucide-react';
import { Language, UserProfile, VoiceMessage } from '../types';
import { translations } from '../data/mockData';

interface VoiceAssistantViewProps {
  profile: UserProfile;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = ({ profile }) => {
  const t = translations[profile.language] || translations.en;

  const [selectedLang, setSelectedLang] = useState<Language>(profile.language || 'en');
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: selectedLang === 'ta'
        ? "வணக்கம்! நான் உங்கள் அக்ரிவேதா AI உதவி மையம். உங்கள் பயிர் சந்தேகங்களை கேட்கலாம்."
        : selectedLang === 'hi'
        ? "नमस्ते! मैं आपका एग्रीवेदा AI कृषि सहायक हूँ। अपनी फसल से जुड़े सवाल पूछें।"
        : "Welcome! I am your AgriVeda AI Voice Assistant. How can I help your farm today?",
      language: selectedLang,
      timestamp: 'Just now'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  // Quick preset sample prompts matching Screen 7 spec
  const quickPrompts = [
    {
      lang: 'ta',
      text: 'என் தக்காளி செடி இலை மஞ்சள் நிறமாக மாறுகிறது, என்ன செய்ய வேண்டும்?'
    },
    {
      lang: 'ta',
      text: 'பயிருக்கு வேப்ப எண்ணெய் கரைசல் எவ்வாறு தெளிக்க வேண்டும்?'
    },
    {
      lang: 'hi',
      text: 'धान की फसल में कीट नियंत्रण के लिए जैविक उपाय क्या हैं?'
    },
    {
      lang: 'en',
      text: 'What is the recommended NPK fertilizer ratio for tomato crops during flowering?'
    }
  ];

  // Send message to Gemini server
  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim()) return;

    const userMsg: VoiceMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: promptText,
      language: selectedLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          language: selectedLang
        })
      });

      const data = await res.json();

      const aiMsg: VoiceMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'I have analyzed your query. Ensure adequate soil aeration and spray neem oil solution.',
        language: selectedLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      // Auto speech response
      speakText(aiMsg.text, aiMsg.id);
    } catch (err) {
      console.error('Error in voice assistant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Web Speech API Voice Recognition (Tap to Speak)
  const handleTapToSpeak = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Please type your query below.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    if (selectedLang === 'ta') recognition.lang = 'ta-IN';
    else if (selectedLang === 'hi') recognition.lang = 'hi-IN';
    else if (selectedLang === 'te') recognition.lang = 'te-IN';
    else recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputPrompt(transcript);
      setIsListening(false);
      handleSendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Speech Synthesis Audio Readout
  const speakText = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (activeSpeechId === msgId) {
        setActiveSpeechId(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedLang === 'ta') utterance.lang = 'ta-IN';
      else if (selectedLang === 'hi') utterance.lang = 'hi-IN';
      else if (selectedLang === 'te') utterance.lang = 'te-IN';
      else utterance.lang = 'en-US';

      utterance.onend = () => setActiveSpeechId(null);
      utterance.onerror = () => setActiveSpeechId(null);

      setActiveSpeechId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-2xl mx-auto">
      
      {/* Header & Language Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AgriVeda AI Assistant</h2>
              <p className="text-xs text-slate-400">Multilingual Agricultural Voice Intelligence</p>
            </div>
          </div>

          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Clear conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Language selector tabs */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Globe className="w-3 h-3 text-blue-400" /> Language:
          </span>
          <button
            onClick={() => setSelectedLang('en')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedLang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLang('ta')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedLang === 'ta' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            தமிழ்
          </button>
          <button
            onClick={() => setSelectedLang('hi')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedLang === 'hi' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setSelectedLang('te')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              selectedLang === 'te' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      {/* Voice Mic Wave Animation Zone */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center space-y-4">
        
        {/* Animated Mic Button */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
          )}
          <button
            onClick={handleTapToSpeak}
            className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-sm transition-all transform active:scale-95 ${
              isListening
                ? 'bg-red-600 text-white ring-8 ring-red-100 scale-105'
                : 'bg-blue-600 hover:bg-blue-700 text-white ring-4 ring-blue-100'
            }`}
          >
            <Mic className="w-7 h-7" />
            <span className="text-[9px] font-bold uppercase mt-0.5 tracking-tight">
              {isListening ? 'Listening...' : 'Tap to Speak'}
            </span>
          </button>
        </div>

        <p className="text-xs font-bold text-slate-700">
          {isListening ? 'Speak your crop question clearly...' : 'Tap the microphone or select a sample question below'}
        </p>

        {/* Quick Sample Prompts Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.text)}
              className="text-left px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-medium text-slate-700 shadow-2xs transition-colors"
            >
              💬 "{qp.text}"
            </button>
          ))}
        </div>

      </div>

      {/* Chat Messages Thread */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs ${
              msg.sender === 'user' ? 'bg-slate-900' : 'bg-blue-600'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] rounded-xl p-4 shadow-2xs ${
              msg.sender === 'user'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className={`text-[10px] font-bold ${msg.sender === 'user' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {msg.sender === 'user' ? profile.name : 'AgriVeda AI Expert'}
                </span>
                <span className={`text-[9px] ${msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>

              <p className="text-xs leading-relaxed font-medium whitespace-pre-line">
                {msg.text}
              </p>

              {msg.sender === 'assistant' && (
                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => speakText(msg.text, msg.id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors ${
                      activeSpeechId === msg.id
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{activeSpeechId === msg.id ? 'Playing...' : 'Audio'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-white p-3 rounded-xl border border-slate-200 max-w-xs shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span>AgriVeda AI generating agricultural response...</span>
          </div>
        )}
      </div>

      {/* Manual Input Box */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <input
          type="text"
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder={t.askQuestion}
          className="flex-1 px-3 py-2 text-xs text-slate-800 focus:outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputPrompt.trim() || isLoading}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-lg transition-colors shrink-0 shadow-2xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
