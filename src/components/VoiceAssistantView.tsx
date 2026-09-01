import React, { useState, useEffect } from 'react';
import { Bot, Mic, Camera, Send, Sparkles, Volume2, Square, Globe, RefreshCw, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getAIResponse, AIResponse } from '../lib/aiService';
import { speechRecognizer, speechSynthesizer, VoiceStatus } from '../lib/voiceService';

interface VoiceAssistantViewProps {
  profile: UserProfile;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  details?: string[];
  actionCard?: any;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = ({ profile }) => {
  const { language, setLanguage, currentLangMeta, supportedLanguages, t, suggestedQuestions } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>({ state: 'idle', message: '' });

  // Initial localized sample conversation
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (language === 'ta') {
      return [
        { id: '1', sender: 'user', text: 'தக்காளி இலைகளில் மஞ்சள் நிறம் ஏன் வருகிறது?' },
        {
          id: '2',
          sender: 'ai',
          text: 'தக்காளி இலைகள் மஞ்சளாவதற்கு நைட்ரஜன் குறைபாடு அல்லது ஆரம்பகட்ட பூஞ்சை தாக்குதல் காரணமாக இருக்கலாம்.',
          details: [
            'பாதிக்கப்பட்ட கீழ் இலைகளை அகற்றி காற்றில் பரவுவதை தடுக்கவும்.',
            'சொட்டு நீர் பாசனத்தை இலைகளின் மேல் தெளிக்காமல் தரைப்பகுதியில் பயன்படுத்தவும்.',
            'இயற்கை வேப்ப எண்ணெய் (5ml/L) தெளிக்கவும்.'
          ]
        }
      ];
    }
    if (language === 'hi') {
      return [
        { id: '1', sender: 'user', text: 'मेरी टमाटर की फसल के पत्ते पीले क्यों हो रहे हैं?' },
        {
          id: '2',
          sender: 'ai',
          text: 'टमाटर की पत्तियों में पीलापन नाइट्रोजन की कमी या फफूंद संक्रमण के कारण हो सकता है।',
          details: [
            'प्रभावित निचली पत्तियों को हटाकर नष्ट करें।',
            'पत्तियों पर ऊपर से पानी देने से बचें।',
            'जैविक नीम तेल (5ml/L) या संतुलित NPK 19:19:19 का छिड़काव करें।'
          ]
        }
      ];
    }
    if (language === 'te') {
      return [
        { id: '1', sender: 'user', text: 'టమోటా ఆకులు ఎందుకు పసుపు రంగులోకి మారుతున్నాయి?' },
        {
          id: '2',
          sender: 'ai',
          text: 'టమోటా ఆకులు పసుపు రంగులోకి మారడానికి నత్రజని లోపం లేదా శీలీంధ్ర సోకడం కారణం కావచ్చు.',
          details: [
            'బాధిత దిగువ ఆకులను తొలగించండి.',
            'ఆకులపై నీరు పడకుండా బిందు సేద్యం వాడండి.',
            'సేంద్రీయ వేప నూనె (5ml/L) పిచికారీ చేయండి.'
          ]
        }
      ];
    }
    return [
      { id: '1', sender: 'user', text: 'Why are my tomato leaves turning yellow?' },
      {
        id: '2',
        sender: 'ai',
        text: 'Yellowing in tomato leaves can stem from nitrogen deficiency or early fungal blight.',
        details: [
          'Prune affected lower leaves to prevent airborne spore spread.',
          'Avoid overhead watering (switch to drip irrigation at root level).',
          'Apply organic Neem oil extract (5ml/L) or balanced NPK 19:19:19 fertilizer.'
        ]
      }
    ];
  });

  // Re-sync initial chat defaults when language changes if only sample conversation exists
  useEffect(() => {
    speechSynthesizer.stop();
    setIsSpeakingId(null);
  }, [language]);

  const handleSend = async (queryOverride?: string) => {
    const textToSend = queryOverride || inputQuery;
    if (!textToSend.trim() || isSending) return;

    setInputQuery('');
    const userMsgId = Date.now().toString();
    const aiMsgId = (Date.now() + 1).toString();

    setChatMessages(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: textToSend }
    ]);

    setIsSending(true);

    // Call AI Service with explicit language parameter
    const aiResult: AIResponse = await getAIResponse(textToSend, language, profile);

    setIsSending(false);

    setChatMessages(prev => [
      ...prev,
      {
        id: aiMsgId,
        sender: 'ai',
        text: aiResult.text,
        details: aiResult.actionCard?.data?.treatment || aiResult.actionCard?.data?.details?.split('\n') || undefined,
        actionCard: aiResult.actionCard
      }
    ]);
  };

  // Voice Input (STT) Trigger
  const handleVoiceListen = () => {
    if (voiceStatus.state === 'listening') {
      speechRecognizer.stop();
      setVoiceStatus({ state: 'idle', message: '' });
      return;
    }

    speechRecognizer.listen(
      language,
      (status) => setVoiceStatus(status),
      (transcript) => {
        setInputQuery(transcript);
        handleSend(transcript);
      }
    );
  };

  // Voice Output (TTS) Trigger
  const handleSpeakToggle = (msgId: string, text: string) => {
    if (isSpeakingId === msgId) {
      speechSynthesizer.stop();
      setIsSpeakingId(null);
    } else {
      setIsSpeakingId(msgId);
      speechSynthesizer.speak(text, language, () => {
        setIsSpeakingId(null);
      });
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto flex flex-col h-[82vh] bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden relative">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 to-blue-800 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <Bot className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{t('aiAssistantHeader')}</h2>
            <p className="text-xs text-blue-200 font-medium">{t('aiAssistantSub')}</p>
          </div>
        </div>

        {/* Centralized Language Selector */}
        <div className="flex items-center gap-1 bg-blue-950/70 p-1 rounded-2xl border border-blue-700/60">
          {supportedLanguages.map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isSelected ? 'bg-blue-600 text-white shadow-xs' : 'text-blue-200 hover:text-white'
                }`}
              >
                <span>{l.flag} </span>
                <span>{l.nativeName}</span>
                {isSelected && <span className="ml-1 text-amber-300">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Status Indicator Banner */}
      {voiceStatus.state !== 'idle' && (
        <div className={`px-4 py-2 text-xs font-bold flex items-center justify-between transition-all ${
          voiceStatus.state === 'listening' ? 'bg-rose-500 text-white animate-pulse' :
          voiceStatus.state === 'processing' ? 'bg-amber-500 text-slate-950' :
          voiceStatus.state === 'captured' ? 'bg-emerald-600 text-white' :
          'bg-rose-100 text-rose-900 border-b border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            <span>{voiceStatus.message}</span>
          </div>
          {voiceStatus.state === 'listening' && (
            <button
              onClick={() => speechRecognizer.stop()}
              className="text-[11px] font-black underline text-white"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'user' ? (
              <div className="max-w-md p-4 bg-blue-600 text-white font-semibold text-sm rounded-2xl rounded-tr-none shadow-sm">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-lg p-5 bg-white border border-slate-200 rounded-3xl rounded-tl-none shadow-md space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-black">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>AgriVeda AI ({currentLangMeta.nativeName})</span>
                  </div>

                  {/* Listen 🔊 & Stop ⏹ Controls */}
                  <button
                    onClick={() => handleSpeakToggle(msg.id, msg.text)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSpeakingId === msg.id
                        ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    {isSpeakingId === msg.id ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-rose-600" />
                        <span>{t('stop')}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t('listen')} 🔊</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm font-semibold text-slate-800 leading-relaxed">{msg.text}</p>

                {msg.details && (
                  <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 space-y-1.5 text-xs text-slate-700 font-medium">
                    {msg.details.map((d, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="p-4 bg-white border border-slate-200 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2 text-xs font-bold text-blue-700 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>{t('processingStatus')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-black text-slate-500 uppercase shrink-0">
          {t('suggestedQuestionsTitle')}:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs rounded-xl border border-slate-200 whitespace-nowrap transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('askAnythingPlaceholder')}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleVoiceListen}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              voiceStatus.state === 'listening'
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200'
            }`}
            title={t('askByVoice')}
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            onClick={() => alert('Image attached for analysis.')}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-200 transition-colors cursor-pointer"
            title={t('uploadImage')}
          >
            <Camera className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleSend()}
            disabled={isSending}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            title="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
