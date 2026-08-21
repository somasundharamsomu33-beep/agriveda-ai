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

  // Farmer Context editable state
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
        ? `வணக்கம் ${farmerContext.farmerName}! நான் உங்கள் அக்ரிவேதா Groq AI வேளாண்மை உதவியாளர் (Llama-3.3 70B). உங்கள் ${farmerContext.cropType} (${farmerContext.cropVariety}) பயிர், உரம், இலை நோய், வானிலை அல்லது விதை வங்கி பற்றிய எந்தக் கேள்வியையும் கேட்கலாம்.`
        : selectedLang === 'hi'
        ? `नमस्ते ${farmerContext.farmerName}! मैं आपका एग्रीवेदा Groq AI कृषि सहायक (Llama-3.3 70B) हूँ। अपनी ${farmerContext.cropType} (${farmerContext.cropVariety}) फसल, खाद, बीमारी, मौसम या बीज बैंक के बारे में पूछें।`
        : selectedLang === 'te'
        ? `నమస్తే ${farmerContext.farmerName}! నేను మీ అగ్రివేద Groq AI వ్యవసాయ సహాయకుడిని (Llama-3.3 70B). మీ ${farmerContext.cropType} పంట, ఎరువులు, వాతావరణం లేదా విత్తన బ్యాంకు గురించి అడగండి.`
        : `Welcome ${farmerContext.farmerName}! I am your AgriVeda Groq AI Copilot powered by Llama-3.3 70B. Ask any question about your ${farmerContext.cropType} (${farmerContext.farmArea} Acres), fertilizer schedules, weather spray risks, smart crop calendar, or Community Seed Bank.`,
      language: selectedLang,
      timestamp: 'Just now',
      suggestedFollowups: [
        'Calculate fertilizer for my farm',
        'Can I spray pesticide today?',
        'Show Community Seed Bank items',
        'When should I harvest my crop?'
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Send initial query if provided from another view (e.g. Seed Bank)
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(`Tell me about ${initialQuery} sowing and preservation guidelines`);
    }
  }, [initialQuery]);

  // 15 Intent categories definition for UI chips
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
    { id: 'Agricultural Expert', label: 'Agri Expert', icon: '👨‍🌾' },
    { id: 'Vendor / Product', label: 'Vendors', icon: '🛒' },
    { id: 'B2B', label: 'B2B Trade', icon: '🏭' },
    { id: 'B2C', label: 'B2C Retail', icon: '🏬' },
    { id: 'General Agricultural Question', label: 'General Q&A', icon: '💡' }
  ];

  // Multilingual quick preset prompts matching 15 categories
  const quickPrompts = [
    {
      category: 'Disease / Pest' as AgriIntentCategory,
      label: selectedLang === 'ta' ? '🌿 இலை மஞ்சள் நோய்' : selectedLang === 'hi' ? '🌿 पत्ती में पीलापन' : '🌿 Leaf Yellowing Query',
      text: selectedLang === 'ta' 
        ? 'என் தக்காளி செடி இலை மஞ்சள் நிறமாக மாறுகிறது, என்ன செய்ய வேண்டும்?'
        : selectedLang === 'hi'
        ? 'मेरी टमाटर की फसल में पत्तियां पीली हो रही हैं, क्या उपाय करें?'
        : 'My tomato leaves are turning yellow with brown spots. What is the cause and remedy?'
    },
    {
      category: 'Fertilizer' as AgriIntentCategory,
      label: selectedLang === 'ta' ? '🧪 NPK உர அளவு' : selectedLang === 'hi' ? '🧪 NPK खाद की मात्रा' : '🧪 Rice Fertilizer Schedule',
      text: selectedLang === 'ta'
        ? `என் நெல் பயிருக்கு எப்போது உரமிட வேண்டும்? NPK உர அளவு என்ன?`
        : selectedLang === 'hi'
        ? `धान की फसल में खाद कब और कितनी मात्रा में दें?`
        : `When should I fertilize my rice crop? Give step-by-step NPK dosage.`
    },
    {
      category: 'Weather' as AgriIntentCategory,
      label: selectedLang === 'ta' ? '🌦️ இன்று மருந்து தெளிக்கலாமா?' : selectedLang === 'hi' ? '🌦️ क्या आज स्प्रे करें?' : '🌦️ Can I spray today?',
      text: selectedLang === 'ta'
        ? `${farmerContext.location} பகுதியில் இன்று மருந்து தெளிக்க வானிலை உகந்ததா?`
        : selectedLang === 'hi'
        ? `क्या ${farmerContext.location} में आज कीटनाशक स्प्रे करना सुरक्षित है?`
        : `Can I spray pesticides today in ${farmerContext.location}? Check rain and wind risk.`
    },
    {
      category: 'Crop Calendar' as AgriIntentCategory,
      label: selectedLang === 'ta' ? '📅 பயிர் காலண்டர்' : selectedLang === 'hi' ? '📅 फसल कैलेंडर' : '📅 Crop Harvest Timeline',
      text: selectedLang === 'ta'
        ? `${farmerContext.cropType} பயிருக்கு எப்போது அறுவடை மற்றும் பாசனம் செய்ய வேண்டும்?`
        : selectedLang === 'hi'
        ? `${farmerContext.cropType} की फसल में सिंचाई और कटाई कब करें?`
        : `When should I fertilize, irrigate, and harvest my ${farmerContext.cropType} crop?`
    },
    {
      category: 'Seed Bank' as AgriIntentCategory,
      label: selectedLang === 'ta' ? '🌱 சமூக விதை வங்கி' : selectedLang === 'hi' ? '🌱 देसी बीज बैंक' : '🌱 Community Seed Bank',
      text: selectedLang === 'ta'
        ? `வேலூர் சமூக விதை வங்கியில் கிடைக்கும் பாரம்பரிய நாட்டு காய்கறி விதைகள் என்ன?`
        : selectedLang === 'hi'
        ? `सामुदायिक बीज बैंक में कौन सी पारंपरिक बीज किस्में उपलब्ध हैं?`
        : `What heritage seeds are available in the Community Seed Bank? Provide storage conditions and availability.`
    }
  ];

  // Image Upload Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send message to server
  const handleSendMessage = async (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() && !attachedImage) return;

    const userMsg: VoiceMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: promptText || 'Analyzing attached crop photo...',
      language: selectedLang,
      attachedImage: attachedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentAttached = attachedImage;
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          language: selectedLang,
          imageBase64: currentAttached,
          context: {
            farmerName: farmerContext.farmerName,
            cropType: farmerContext.cropType,
            cropVariety: farmerContext.cropVariety,
            sowingDate: farmerContext.sowingDate,
            cropAgeDays: farmerContext.cropAgeDays,
            soilType: farmerContext.soilType,
            irrigationMethod: farmerContext.irrigationMethod,
            farmArea: farmerContext.farmArea,
            location: farmerContext.location,
            seedVariety: farmerContext.seedVariety,
            seedBankName: farmerContext.seedBankName
          }
        })
      });

      const data = await res.json();

      const aiMsg: VoiceMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        intentCategory: data.intentCategory || 'General Agricultural Question',
        text: data.text || 'I have analyzed your query. Follow proper soil aeration and morning irrigation routine.',
        language: selectedLang,
        actionCard: data.actionCard,
        suggestedFollowups: data.suggestedFollowups,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      speakText(aiMsg.text, aiMsg.id);
    } catch (err) {
      console.error('Error in voice assistant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Speech Recognition API
  const handleTapToSpeak = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your prompt.');
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

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputPrompt(transcript);
      setIsListening(false);
      handleSendMessage(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Text-to-Speech Output
  const speakText = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (activeSpeechId === msgId) {
        setActiveSpeechId(null);
        return;
      }

      const cleanText = text.replace(/[*#_~`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);

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

  const filteredMessages = messages.filter(msg => {
    if (selectedCategoryFilter === 'All') return true;
    if (msg.sender === 'user') return true;
    return msg.intentCategory === selectedCategoryFilter;
  });

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-3xl mx-auto">
      
      {/* Top Header & Farm Context Drawer */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">AgriVeda Voice AI Assistant</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border border-emerald-400/40 shadow-xs">
                  ⚡ Powered by Groq AI (Llama-3.3 70B)
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Ultra-Fast Llama-3.3 Multilingual Agronomist & Voice Copilot</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingContext(prev => !prev)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-all border border-slate-700 flex items-center gap-1.5 text-xs font-bold"
              title="Edit Farmer Context"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editingContext ? 'Close' : 'Context'}</span>
            </button>

            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700 flex items-center gap-1.5 text-xs font-bold"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Farmer Context Bar */}
        <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Leaf className="w-3.5 h-3.5" /> Active Farm Context:
            </span>
            <span className="text-slate-400 font-normal">
              {farmerContext.cropType} ({farmerContext.cropVariety}) • {farmerContext.farmArea} Acres
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-medium">
            <span className="px-2.5 py-1 bg-slate-900 text-emerald-300 rounded-lg border border-slate-700">
              🌾 {farmerContext.cropType} ({farmerContext.cropVariety})
            </span>
            <span className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded-lg border border-slate-700">
              📅 Sowing: {farmerContext.sowingDate || 'Not set'}
            </span>
            <span className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded-lg border border-slate-700">
              🏔️ {farmerContext.soilType}
            </span>
            <span className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded-lg border border-slate-700">
              💧 {farmerContext.irrigationMethod}
            </span>
            <span className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded-lg border border-slate-700">
              📍 {farmerContext.location}
            </span>
          </div>

          {/* Context Editor Drawer */}
          {editingContext && (
            <div className="pt-3 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in text-slate-200">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Crop & Variety:</label>
                <input
                  type="text"
                  value={farmerContext.cropVariety}
                  onChange={e => setFarmerContext({...farmerContext, cropVariety: e.target.value})}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-300"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Sowing Date:</label>
                <input
                  type="text"
                  value={farmerContext.sowingDate}
                  onChange={e => setFarmerContext({...farmerContext, sowingDate: e.target.value})}
                  placeholder="e.g. 01 June 2024"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Soil Type:</label>
                <input
                  type="text"
                  value={farmerContext.soilType}
                  onChange={e => setFarmerContext({...farmerContext, soilType: e.target.value})}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-medium text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Irrigation Method:</label>
                <input
                  type="text"
                  value={farmerContext.irrigationMethod}
                  onChange={e => setFarmerContext({...farmerContext, irrigationMethod: e.target.value})}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-medium text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Language selector tabs */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Globe className="w-3.5 h-3.5 text-emerald-400" /> Language:
          </span>
          {(['en', 'ta', 'hi', 'te'] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                selectedLang === lang 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ்' : lang === 'hi' ? 'हिंदी' : 'తెలుగు'}
            </button>
          ))}
        </div>
      </div>

      {/* 15-Category Intent Filters & Presets */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-emerald-600" /> Explore Intent Categories (15 Fields):
          </span>
          <span className="text-[10px] font-extrabold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
            AgriVeda Intent System
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategoryFilter === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Questions
          </button>
          {intentCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategoryFilter === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Mic & Interactive Presets Zone */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 rounded-3xl p-6 border border-emerald-800/40 shadow-xl text-center space-y-4 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          {/* Animated Mic Recording Button */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
                <div className="absolute -inset-3 rounded-full border-2 border-emerald-400/50 animate-pulse" />
              </>
            )}
            <button
              onClick={handleTapToSpeak}
              className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center shadow-2xl transition-all transform active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white ring-8 ring-rose-500/30 scale-105'
                  : 'bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white ring-4 ring-emerald-500/20'
              }`}
            >
              <Mic className={`w-7 h-7 ${isListening ? 'animate-bounce' : ''}`} />
              <span className="text-[9px] font-black uppercase mt-1 tracking-wider">
                {isListening ? 'Listening...' : 'Tap to Speak'}
              </span>
            </button>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-emerald-200">
              {isListening ? 'Listening to your query...' : 'Ask by Voice, Text, or Upload Leaf Photo'}
            </h3>
            <p className="text-[11px] text-slate-300">
              Multilingual NLP tuned for smallholder & commercial farming
            </p>
          </div>

          {/* Quick Preset Action Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.text)}
                className="px-3 py-1.5 bg-slate-900/90 hover:bg-emerald-900/90 border border-slate-700/80 hover:border-emerald-500/60 rounded-xl text-xs font-semibold text-slate-200 hover:text-white shadow-sm transition-all text-left flex items-center gap-1.5"
              >
                <span>{qp.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Thread */}
      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md ${
              msg.sender === 'user' 
                ? 'bg-slate-900 ring-2 ring-slate-700' 
                : 'bg-gradient-to-br from-emerald-600 to-teal-700 ring-2 ring-emerald-500/30'
            }`}>
              {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            <div className={`max-w-[88%] sm:max-w-[82%] rounded-3xl p-5 shadow-sm space-y-3 ${
              msg.sender === 'user'
                ? 'bg-slate-900 text-white border border-slate-800'
                : 'bg-white border border-slate-200/90 text-slate-900'
            }`}>
              {/* Message Header */}
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-black ${msg.sender === 'user' ? 'text-emerald-400' : 'text-emerald-800'}`}>
                    {msg.sender === 'user' ? farmerContext.farmerName : 'AgriVeda AI Agronomist'}
                  </span>
                  {msg.intentCategory && (
                    <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {msg.intentCategory}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {msg.timestamp}
                </span>
              </div>

              {/* User Attached Image (If any) */}
              {msg.attachedImage && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-w-xs">
                  <img src={msg.attachedImage} alt="Uploaded crop leaf" className="w-full h-40 object-cover" />
                </div>
              )}

              {/* Message Content */}
              <div className="text-xs sm:text-sm leading-relaxed font-medium whitespace-pre-line space-y-2">
                {msg.text}
              </div>

              {/* Structured Action Cards */}
              {msg.actionCard && (
                <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-200/80 space-y-3 text-slate-900 shadow-2xs">
                  <div className="flex items-center gap-2 border-b border-emerald-200/60 pb-2">
                    {msg.actionCard.type === 'fertilizer' && <Calculator className="w-5 h-5 text-emerald-700" />}
                    {msg.actionCard.type === 'weather' && <CloudSun className="w-5 h-5 text-amber-600" />}
                    {msg.actionCard.type === 'market' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                    {msg.actionCard.type === 'diagnosis' && <Shield className="w-5 h-5 text-rose-600" />}
                    {msg.actionCard.type === 'seedbank' && <Sprout className="w-5 h-5 text-emerald-700" />}
                    {msg.actionCard.type === 'crop_calendar' && <Calendar className="w-5 h-5 text-indigo-600" />}
                    <h4 className="text-xs font-black text-slate-900">{msg.actionCard.title}</h4>
                  </div>

                  {msg.actionCard.type === 'fertilizer' && (
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Urea Dosage</p>
                        <p className="text-sm font-black text-emerald-800">{msg.actionCard.data.ureaKg || 45} kg</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">DAP Dosage</p>
                        <p className="text-sm font-black text-emerald-800">{msg.actionCard.data.dapKg || 30} kg</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">MOP (Potash)</p>
                        <p className="text-sm font-black text-emerald-800">{msg.actionCard.data.mopKg || 25} kg</p>
                      </div>
                    </div>
                  )}

                  {msg.actionCard.type === 'seedbank' && (
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span>Variety: {msg.actionCard.data.variety || 'Country Tomato'}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md">
                          {msg.actionCard.data.qtyKg || 45} kg Available
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">Vault: {msg.actionCard.data.location}</p>
                      <p className="text-slate-800 font-bold text-[11px]">Contact: {msg.actionCard.data.contact}</p>
                    </div>
                  )}

                  {msg.actionCard.type === 'weather' && (
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-emerald-200 text-xs">
                      <div>
                        <p className="font-black text-slate-900">{msg.actionCard.data.temp || 31}°C • Humidity {msg.actionCard.data.humidity || 60}%</p>
                        <p className="text-slate-500 text-[11px]">Rain Chance: {msg.actionCard.data.rainChance || 10}% | Wind: {msg.actionCard.data.windSpeed || 12} km/h</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[11px]">
                        {msg.actionCard.data.spraySafety || 'Safe Spray Window (7-9 AM)'}
                      </span>
                    </div>
                  )}

                  {msg.actionCard.type === 'diagnosis' && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-200">
                        <span className="font-bold text-slate-800">Issue: {msg.actionCard.data.detectedIssue}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black">
                          {msg.actionCard.data.confidence}% Confidence
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Followups */}
              {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowups.map((sf, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sf)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>💡 {sf}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* TTS Controls */}
              {msg.sender === 'assistant' && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">AgriVeda Speech Engine</span>
                  <button
                    onClick={() => speakText(msg.text, msg.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeSpeechId === msg.id
                        ? 'bg-amber-500 text-white shadow-md animate-pulse'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70'
                    }`}
                  >
                    {activeSpeechId === msg.id ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{activeSpeechId === msg.id ? 'Stop Audio' : 'Listen Voice'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs font-bold text-slate-800 bg-white p-4 rounded-2xl border border-slate-200 max-w-sm shadow-md animate-pulse">
            <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
            <span>AgriVeda AI analyzing crop pathology & weather context...</span>
          </div>
        )}
      </div>

      {/* Multimodal Input & Attachment Bar */}
      <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-lg space-y-2 sticky bottom-2 z-20">
        
        {/* Preview Attached Image */}
        {attachedImage && (
          <div className="relative inline-block pl-2 pt-1">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-emerald-500 shadow-xs">
              <img src={attachedImage} alt="Crop attachment" className="w-full h-full object-cover" />
              <button
                onClick={() => setAttachedImage(null)}
                className="absolute top-1 right-1 p-0.5 bg-slate-900/80 text-white rounded-full hover:bg-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors shrink-0"
            title="Attach Leaf Photo"
          >
            <Camera className="w-5 h-5" />
          </button>

          <button
            onClick={handleTapToSpeak}
            className={`p-3 rounded-2xl transition-colors shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-bounce'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
            }`}
            title="Voice Speech Input"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder={attachedImage ? 'Ask query about attached photo...' : t.askQuestion}
            className="flex-1 px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none bg-slate-50 rounded-2xl border border-slate-200 focus:border-emerald-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={(!inputPrompt.trim() && !attachedImage) || isLoading}
            className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white rounded-2xl transition-all shrink-0 shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};
