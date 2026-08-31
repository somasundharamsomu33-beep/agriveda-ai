import React, { useState, useRef, useEffect } from 'react';
import {
  Mic, Send, Volume2, Globe, Sparkles, RefreshCw, Bot, User,
  Camera, Image as ImageIcon, CheckCircle, AlertTriangle, CloudSun,
  TrendingUp, Calculator, Shield, Leaf, X, Play, Square, Calendar, Sprout, Filter, Edit3, Save, Layers
} from 'lucide-react';
import { Language, UserProfile, VoiceMessage, AgriIntentCategory } from '../types';
import { translations } from '../data/mockData';

interface VoiceAssistantViewProps {
  profile: UserProfile;
  initialQuery?: string;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = ({ profile, initialQuery }) => {
  const t = translations[profile.language] || translations.en;

  const [selectedLang, setSelectedLang] = useState<Language>(profile.language || 'en');
  const [editingContext, setEditingContext] = useState(false);

  const [farmerContext, setFarmerContext] = useState({
    farmerName: profile.name,
    cropType: profile.primaryCrop || 'Tomato',
    cropVariety: profile.cropVariety || 'Hybrid Arka Rakshak',
    sowingDate: profile.sowingDate || '01 June 2024',
    cropAgeDays: profile.cropAgeDays || 32,
    soilType: profile.soilType || 'Red Loamy Soil',
    irrigationMethod: profile.irrigationMethod || 'Drip Irrigation',
    farmArea: profile.farmSizeAcres || 2.5,
    location: profile.location || 'Vellore, Tamil Nadu',
    seedVariety: profile.seedVariety || 'Traditional Nattu Seed',
    seedBankName: profile.seedBankName || 'Vellore Organic Seed Vault'
  });

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<AgriIntentCategory | 'All'>('All');

  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      intentCategory: 'General Agricultural Question',
      text: selectedLang === 'ta'
        ? `வணக்கம் ${farmerContext.farmerName}! நான் உங்கள் அக்ரிவேதா AI உதவியாளர். உங்கள் ${farmerContext.cropType} பயிர், உரம், நோய், வானிலை அல்லது விதை வங்கி பற்றி எதை வேண்டுமானாலும் கேட்கலாம்.`
        : selectedLang === 'hi'
          ? `नमस्ते ${farmerContext.farmerName}! मैं आपका एग्रीवेदा AI कृषि सहायक हूँ। अपनी ${farmerContext.cropType} फसल, खाद, बीमारी या मौसम के बारे में पूछें।`
          : selectedLang === 'te'
            ? `నమస్తే ${farmerContext.farmerName}! నేను మీ అగ్రివేద AI సహాయకుడిని. మీ ${farmerContext.cropType} పంట, ఎరువులు లేదా వాతావరణం గురించి అడగండి.`
            : `Welcome ${farmerContext.farmerName}! I am Ask AgriVeda, your agricultural AI voice copilot. Ask any question about your ${farmerContext.cropType} crop, fertilizer dosage, weather spray risk, or Community Seed Bank.`,
      language: selectedLang,
      timestamp: 'Just now',
      suggestedFollowups: [
        'Calculate fertilizer dosage for my crop',
        'Can I spray pesticide today?',
        'Show Community Seed Bank listings',
        'When should I harvest?'
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(`Tell me about ${initialQuery} sowing and preservation guidelines`);
    }
  }, [initialQuery]);

  const intentCategories: { id: AgriIntentCategory; label: string; icon: string }[] = [
    { id: 'Crop Management', label: 'Crop Mgmt', icon: '🌾' },
    { id: 'Disease / Pest', label: 'Disease / Pest', icon: '🔍' },
    { id: 'Fertilizer', label: 'Fertilizer', icon: '🧪' },
    { id: 'Weather', label: 'Weather', icon: '🌦️' },
    { id: 'Crop Calendar', label: 'Calendar', icon: '📅' },
    { id: 'Seed Bank', label: 'Seed Bank', icon: '🌱' },
    { id: 'Seed Information', label: 'Seed Info', icon: '📦' },
    { id: 'Soil', label: 'Soil Health', icon: '🏔️' },
    { id: 'Irrigation', label: 'Irrigation', icon: '💧' },
    { id: 'Market / Mandi', label: 'Market Mandi', icon: '📈' },
    { id: 'General Agricultural Question', label: 'General Q&A', icon: '💡' }
  ];

  const quickPrompts = [
    {
      category: 'Disease / Pest' as AgriIntentCategory,
      label: selectedLang === 'ta' ? '🌿 இலை மஞ்சள் நோய்' : selectedLang === 'hi' ? '🌿 पत्ती में पीलापन' : '🌿 Yellowing Leaf Remedy',
      text: selectedLang === 'ta'
        ? 'என் தக்காளி செடி இலை மஞ்சள் நிறமாக மாறுகிறது, என்ன செய்ய வேண்டும்?'
        : selectedLang === 'hi'
          ? 'मेरी टमाटर की फसल में पत्तियां पीली हो रही हैं, क्या उपाय करें?'
          : 'My tomato leaves are turning yellow with brown spots. What is the cause and remedy?'
    },
    {
      category: 'Fertilizer' as AgriIntentCategory,
      label: selectedLang === 'ta' ? '🧪 NPK உர அளவு' : selectedLang === 'hi' ? '🧪 NPK खाद की मात्रा' : '🧪 NPK Fertilizer Dosage',
      text: selectedLang === 'ta'
        ? `என் ${farmerContext.cropType} பயிருக்கு எப்போது உரமிட வேண்டும்? NPK உர அளவு என்ன?`
        : selectedLang === 'hi'
          ? `${farmerContext.cropType} फसल में खाद की मात्रा और समय क्या है?`
          : `What is the exact NPK fertilizer schedule for my ${farmerContext.cropType} crop?`
    },
    {
      category: 'Weather' as AgriIntentCategory,
      label: selectedLang === 'ta' ? '🌦️ இன்று மருந்து தெளிக்கலாமா?' : selectedLang === 'hi' ? '🌦️ क्या आज स्प्रे करें?' : '🌦️ Spray Window Today',
      text: selectedLang === 'ta'
        ? `${farmerContext.location} பகுதியில் இன்று மருந்து தெளிக்க வானிலை உகந்ததா?`
        : selectedLang === 'hi'
          ? `क्या ${farmerContext.location} में आज कीटनाशक स्प्रे करना सुरक्षित है?`
          : `Is it safe to spray pesticide today in ${farmerContext.location}? Check rain & wind risk.`
    }
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      let langCode = 'en-US';
      if (selectedLang === 'ta') langCode = 'ta-IN';
      else if (selectedLang === 'hi') langCode = 'hi-IN';
      else if (selectedLang === 'te') langCode = 'te-IN';

      recognition.lang = langCode;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
        handleSendMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() && !attachedImage) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: VoiceMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      attachedImage: attachedImage || undefined,
      language: selectedLang,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, newMsg]);
    setInputPrompt('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          language: selectedLang,
          context: farmerContext,
          imageBase64: attachedImage
        })
      });

      const data = await response.json();

      const botMsg: VoiceMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        intentCategory: data.intentCategory || 'General Agricultural Question',
        text: data.text || 'I could not process that query.',
        language: data.language || selectedLang,
        voiceId: data.voice_id || 'female_01',
        actionCard: data.actionCard,
        suggestedFollowups: data.suggestedFollowups || ['Ask for fertilizer dosage', 'Check weather spray risk'],
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, botMsg]);

      if (data.text) {
        speakText(data.text, data.language || selectedLang);
      }
    } catch (err) {
      console.error('Voice assistant backend error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          intentCategory: 'General Agricultural Question',
          text: '⚠️ Network Connection Issue. Please check your connectivity and try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
      let targetLang = 'en-US';
      if (lang === 'ta') targetLang = 'ta-IN';
      else if (lang === 'hi') targetLang = 'hi-IN';
      else if (lang === 'te') targetLang = 'te-IN';

      utterance.lang = targetLang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredMessages = selectedCategoryFilter === 'All'
    ? messages
    : messages.filter(m => m.sender === 'user' || m.intentCategory === selectedCategoryFilter);

  return (
    <div className="space-y-4 pb-24 animate-in fade-in max-w-4xl mx-auto">

      {/* Title Header Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Mic className="w-6 h-6 text-amber-600" />
            <span>Ask AgriVeda • AI Voice Copilot</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Multilingual agricultural assistant for Tamil, Hindi, Telugu, and English.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(['en', 'ta', 'hi', 'te'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => setSelectedLang(l)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                selectedLang === l ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryFilter('All')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-black shrink-0 transition-all cursor-pointer ${
            selectedCategoryFilter === 'All' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          All Q&A
        </button>
        {intentCategories.slice(0, 6).map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategoryFilter === cat.id ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Conversation Stage */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 min-h-[420px] max-h-[560px] overflow-y-auto space-y-4">
        {filteredMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-2xl rounded-3xl p-4 space-y-2 ${
              msg.sender === 'user'
                ? 'bg-emerald-700 text-white rounded-tr-xs'
                : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-xs'
            }`}>
              
              {/* Category Badge for Bot */}
              {msg.sender === 'assistant' && msg.intentCategory && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full inline-block">
                  {msg.intentCategory}
                </span>
              )}

              {/* Message Content */}
              <p className="text-xs sm:text-sm font-medium whitespace-pre-line leading-relaxed">
                {msg.text}
              </p>

              {/* Attached Image Preview */}
              {msg.imageBase64 && (
                <img src={msg.imageBase64} alt="Attached crop" className="w-32 h-32 object-cover rounded-xl border border-white/20 mt-2" />
              )}

              {/* Action Card Rendering */}
              {msg.actionCard && (
                <div className="mt-3 p-3.5 bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                  <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{msg.actionCard.title}</span>
                  </span>
                  <p className="text-xs text-slate-700 font-medium">{msg.actionCard.data?.details || msg.actionCard.data?.crop}</p>
                </div>
              )}

              {/* Audio Playback Button */}
              {msg.sender === 'assistant' && (
                <button
                  onClick={() => speakText(msg.text, msg.language || selectedLang)}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 pt-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Audio</span>
                </button>
              )}
            </div>

            {/* Follow-up suggestions */}
            {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 pl-2">
                {msg.suggestedFollowups.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-full text-[11px] font-bold border border-amber-200 transition-colors cursor-pointer"
                  >
                    + {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-bold w-fit animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
            <span>AgriVeda AI is formulating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Preset Queries */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(qp.text)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl border border-slate-200 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* 🎙️ PROMINENT PUSH-TO-TALK MIC & PROMPT COMPOSER */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-3">
        {attachedImage && (
          <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold w-fit">
            <span>Attached Image</span>
            <button onClick={() => setAttachedImage(null)} className="text-rose-600 hover:underline">Remove</button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* File Upload Trigger */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors cursor-pointer shrink-0"
            title="Attach Leaf Photo"
          >
            <ImageIcon className="w-5 h-5 text-emerald-700" />
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder={selectedLang === 'ta' ? 'அக்ரிவேதாவிடம் உங்கள் கேள்வியைக் கேளுங்கள்...' : selectedLang === 'hi' ? 'एग्रीवेदा से अपनी फसल सवाल पूछें...' : 'Ask AgriVeda any farming query...'}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold focus:bg-white focus:border-emerald-600 outline-none"
          />

          {/* Large Mic Button */}
          <button
            onClick={handleMicClick}
            className={`p-3.5 rounded-2xl font-black transition-all shadow-md cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
            }`}
            title="Push to Speak"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() && !attachedImage}
            className="p-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl transition-colors cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};
