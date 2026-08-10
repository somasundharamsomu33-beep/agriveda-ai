import React from 'react';
import { Sprout, ArrowRight, Globe } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../data/mockData';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onGetStarted: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  profile,
  setProfile,
  onGetStarted,
}) => {
  if (!isOpen) return null;

  const t = translations[profile.language] || translations.en;

  const selectLanguage = (lang: Language) => {
    setProfile(prev => ({ ...prev, language: lang }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-800 relative overflow-hidden text-white">
        
        {/* Background decorative blue glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>

        {/* Farmer Illustration Icon */}
        <div className="relative mb-4">
          <div className="w-20 h-20 mx-auto bg-blue-600 rounded-2xl p-1 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center border border-blue-500/30">
              <Sprout className="w-10 h-10 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Brand Header */}
        <h2 className="text-2xl font-black text-white tracking-tight">
          AgriVeda <span className="text-blue-400">AI</span>
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1">
          {t.tagline}
        </p>

        {/* Farmer image banner */}
        <div className="my-4 rounded-xl overflow-hidden shadow-sm border border-slate-800 bg-slate-950 p-2">
          <img
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80"
            alt="Modern Farmer using AI"
            className="w-full h-28 object-cover rounded-lg"
          />
          <p className="text-[11px] font-medium text-slate-400 mt-1.5 italic">
            "Every farmer deserves an AI agricultural expert in their pocket."
          </p>
        </div>

        {/* Language Selection Buttons */}
        <div className="mb-5">
          <p className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-center gap-1">
            <Globe className="w-3.5 h-3.5 text-blue-400" /> Select Language / மொழி தேர்வு
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => selectLanguage('ta')}
              className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                profile.language === 'ta'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => selectLanguage('en')}
              className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                profile.language === 'en'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => selectLanguage('hi')}
              className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                profile.language === 'hi'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transform active:scale-98 transition-all"
        >
          <span>{t.getStarted}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-slate-500 font-medium mt-3">
          Empowering Farmers with AI Agricultural Guidance
        </p>

      </div>
    </div>
  );
};
