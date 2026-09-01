import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Globe, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  LayoutGrid
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { AgriLogo } from './ui/AgriLogo';

interface HeaderProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenSignOutConfirm?: () => void;
  unreadCount: number;
}

const ALL_SCREENS: { id: ActiveTab; name: string }[] = [
  { id: 'splash', name: '1. Splash / Launch' },
  { id: 'onboarding', name: '2. Onboarding (3 Steps)' },
  { id: 'login', name: '3. Login' },
  { id: 'signup', name: '4. Sign Up' },
  { id: 'profile_setup', name: '5. Farmer Profile Setup' },
  { id: 'kyc', name: '6. KYC Verification' },
  { id: 'home', name: '7. Main Dashboard' },
  { id: 'assistant', name: '8. AI Farming Assistant' },
  { id: 'scan', name: '9. Crop Disease Detection' },
  { id: 'calendar', name: '10. Crop Calendar' },
  { id: 'weather', name: '11. Weather & Risk Alerts' },
  { id: 'market', name: '12. Market Prices' },
  { id: 'passport', name: '13. Farmer Passport' },
  { id: 'my_farm', name: '14. My Farm' },
  { id: 'notifications', name: '15. Notifications' },
  { id: 'settings', name: '16. Settings' },
  { id: 'help', name: '17. Help & Support' },
];

export const Header: React.FC<HeaderProps> = ({
  profile,
  setProfile,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenNotifications,
  unreadCount,
}) => {
  const { language, setLanguage, currentLangMeta, supportedLanguages, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScreensOpen, setIsScreensOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-blue-900 text-white shadow-md border-b border-blue-800 lg:pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between">
          
          {/* Logo & Mobile Brand Title */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2">
              <AgriLogo size={36} />
              <div>
                <h1 className="text-lg font-black text-white leading-none">{t('appName')}</h1>
                <p className="text-[10px] text-blue-200 font-medium">{t('tagline')}</p>
              </div>
            </div>

            {/* 17-Screen Quick Demo Selector */}
            <div className="relative">
              <button
                onClick={() => setIsScreensOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-xs font-bold text-blue-100 border border-blue-700 transition-all cursor-pointer"
                title="Quick Demo View Switcher"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">{t('views')}</span>
                <ChevronDown className="w-3 h-3 text-blue-300" />
              </button>

              {isScreensOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Jump to Screen
                  </div>
                  {ALL_SCREENS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveTab(s.id);
                        setIsScreensOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-center justify-between ${
                        activeTab === s.id ? 'bg-blue-50 text-blue-700 font-black' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{s.name}</span>
                      {activeTab === s.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Multilingual Selector, Notifications, Farmer Passport & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Centralized Multilingual Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-xs font-bold text-white border border-blue-700 shadow-xs transition-all cursor-pointer"
                title="Select Language / மொழி / भाषा / భాష"
              >
                <Globe className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-sm">{currentLangMeta.flag}</span>
                <span className="font-extrabold text-amber-300 text-xs">{currentLangMeta.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-blue-200 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {t('selectLanguage')}
                  </div>

                  {supportedLanguages.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setProfile(prev => ({ ...prev, language: lang.code }));
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                          isSelected ? 'text-blue-700 bg-blue-50/80 font-black border-l-4 border-blue-600' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{lang.flag}</span>
                          <div>
                            <span className="block text-xs font-bold text-slate-900">{lang.nativeName}</span>
                            <span className="block text-[10px] text-slate-500 font-normal">{lang.name}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="text-xs font-black text-blue-600">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-blue-100 border border-blue-700 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-blue-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Farmer Passport Status Pill */}
            <button
              onClick={() => setActiveTab('passport')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">{t('verifiedFarmer')}</span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setActiveTab('passport')}
              className="flex items-center gap-2 p-1 bg-blue-800 hover:bg-blue-700 rounded-xl border border-blue-700 cursor-pointer"
            >
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt={profile.name}
                className="w-7 h-7 rounded-full object-cover border border-blue-300"
              />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
