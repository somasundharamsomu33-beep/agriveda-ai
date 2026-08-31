import React, { useState, useRef, useEffect } from 'react';
import { Bell, Globe, ChevronDown, Check, ShieldCheck, ShieldAlert, Compass, LogOut, LogIn, Sparkles } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../data/mockData';
import { AgriLogo } from './ui/AgriLogo';

interface HeaderProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenRoleOnboarding?: () => void;
  onOpenAdminVerification?: () => void;
  onOpenTutorial?: () => void;
  onOpenSignOutConfirm?: () => void;
  unreadCount: number;
}

const LANGUAGES: { code: Language; name: string; nativeName: string; badge: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', badge: 'EN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', badge: 'TA' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', badge: 'HI' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', badge: 'TE' }
];

export const Header: React.FC<HeaderProps> = ({
  profile,
  setProfile,
  onOpenAuth,
  onOpenNotifications,
  onOpenRoleOnboarding,
  onOpenAdminVerification,
  onOpenTutorial,
  onOpenSignOutConfirm,
  unreadCount,
}) => {
  const t = translations[profile.language] || translations.en;
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setProfile(prev => ({ ...prev, language: lang }));
    setIsLangOpen(false);
  };

  const currentLangObj = LANGUAGES.find(l => l.code === profile.language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-emerald-950 text-white shadow-md border-b border-emerald-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <AgriLogo size={42} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  <span className="text-emerald-400 font-black text-2xl sm:text-3xl">AgriVeda</span>
                  <span className="text-amber-400 font-extrabold text-2xl sm:text-3xl">AI</span>
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 bg-emerald-900/80 text-emerald-300 rounded-full border border-emerald-700/60">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Farmer First</span>
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 hidden sm:block font-medium">
                {t.tagline || 'Smart Multilingual Agricultural Assistant'}
              </p>
            </div>
          </div>

          {/* Controls: Language, Guide, Notifications, Verification & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Interactive Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800/90 text-xs font-bold text-emerald-100 border border-emerald-700/60 transition-all active:scale-95 shadow-2xs"
                title="Select Interface Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="font-extrabold uppercase text-[11px] text-amber-300">{currentLangObj.badge}</span>
                <span className="hidden sm:inline font-medium text-emerald-100">({currentLangObj.nativeName})</span>
                <ChevronDown className={`w-3 h-3 text-emerald-300 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language / மொழி
                  </div>

                  {LANGUAGES.map((lang) => {
                    const isSelected = profile.language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50/70 transition-colors ${
                          isSelected ? 'text-emerald-800 font-bold bg-emerald-50 border-l-4 border-emerald-600' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-5 rounded bg-slate-100 text-slate-600 font-extrabold text-[10px] flex items-center justify-center border border-slate-200">
                            {lang.badge}
                          </span>
                          <div>
                            <span className="block text-xs font-bold text-slate-900">{lang.nativeName}</span>
                            <span className="block text-[10px] text-slate-500 font-normal">{lang.name}</span>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Interactive UI Guide & Tutorial Trigger */}
            {onOpenTutorial && (
              <button
                onClick={onOpenTutorial}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-xs font-bold text-amber-300 border border-emerald-700/60 transition-all active:scale-95 shadow-2xs cursor-pointer"
                title="Launch Farmer Guide"
              >
                <Compass className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="hidden sm:inline">Farmer Guide</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 transition-colors cursor-pointer"
              title="Weather & Farming Alerts"
            >
              <Bell className="w-4 h-4 text-emerald-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-emerald-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Verification Status Pill */}
            <button
              onClick={onOpenRoleOnboarding || onOpenAuth}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm border transition-all active:scale-95 cursor-pointer ${
                profile.verificationStatus === 'FULLY_VERIFIED'
                  ? 'bg-emerald-800 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/20'
                  : profile.verificationStatus === 'ROLE_VERIFIED'
                  ? 'bg-blue-900 border-blue-500 text-blue-100'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-300 font-extrabold'
              }`}
              title="Role Verification Status"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {profile.verificationStatus === 'FULLY_VERIFIED'
                  ? 'Verified Kisan'
                  : profile.verificationStatus === 'ROLE_VERIFIED'
                  ? 'Verified Role'
                  : 'Verify Kisan ID'}
              </span>
            </button>

            {/* Admin Verification Audit Console */}
            {onOpenAdminVerification && (
              <button
                onClick={onOpenAdminVerification}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white text-[11px] font-bold border border-emerald-700/60 transition-colors cursor-pointer"
                title="Admin Verification Audit Portal"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Audit</span>
              </button>
            )}

            {/* User Profile Pill or Sign In Button */}
            {profile.isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 text-xs text-emerald-100 font-medium transition-all cursor-pointer"
                  title="View Account"
                >
                  <img
                    src={profile.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'}
                    alt={profile.name}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="font-bold text-white text-[11px] leading-tight">{profile.name}</p>
                    <p className="text-[10px] text-amber-300 font-extrabold uppercase leading-none">{profile.role || 'Farmer'}</p>
                  </div>
                </button>

                {onOpenSignOutConfirm && (
                  <button
                    onClick={onOpenSignOutConfirm}
                    className="p-1.5 sm:p-2 rounded-xl bg-emerald-900 hover:bg-rose-900/70 text-emerald-300 hover:text-rose-200 border border-emerald-700 hover:border-rose-500 transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer border border-amber-300"
                title="Sign In or Create Account"
              >
                <LogIn className="w-4 h-4 text-slate-950" />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
