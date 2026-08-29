import React, { useState, useRef, useEffect } from 'react';
import { Sprout, Bell, Globe, User, ChevronDown, Check, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../data/mockData';
import { AgriLogo } from './ui/AgriLogo';
import { VerificationEngine } from '../lib/verificationEngine';

interface HeaderProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  onOpenRoleOnboarding?: () => void;
  onOpenAdminVerification?: () => void;
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
  unreadCount,
}) => {
  const t = translations[profile.language] || translations.en;
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
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
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <AgriLogo size={42} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm flex items-center gap-1" style={{ fontFamily: "'Caveat', cursive, serif" }}>
                  <span className="text-emerald-400 font-extrabold text-2xl sm:text-3xl">AgriVeda</span>
                  <span className="text-amber-400 font-black text-2xl sm:text-3xl">-AI</span>
                </h1>
                <span className="hidden md:inline-block text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 shadow-xs">
                  🌱 Smart Farming
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 hidden sm:block font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Controls: Language, Notifications, Farm ID & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Interactive Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all active:scale-95 shadow-2xs"
                title="Change Interface Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-extrabold uppercase text-[11px] text-emerald-300">{currentLangObj.badge}</span>
                <span className="hidden sm:inline font-medium text-slate-300">({currentLangObj.nativeName})</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
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
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          isSelected ? 'text-emerald-700 font-bold bg-emerald-50/70' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-5 rounded bg-slate-100 text-slate-600 font-extrabold text-[10px] flex items-center justify-center border border-slate-200">
                            {lang.badge}
                          </span>
                          <div>
                            <span className="block text-xs font-bold">{lang.nativeName}</span>
                            <span className="block text-[10px] text-slate-400 font-normal">{lang.name}</span>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Weather & Farming Alerts"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Verification Status Pill */}
            <button
              onClick={onOpenRoleOnboarding || onOpenAuth}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md border transition-all active:scale-95 cursor-pointer ${
                profile.verificationStatus === 'FULLY_VERIFIED'
                  ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/20'
                  : profile.verificationStatus === 'ROLE_VERIFIED'
                  ? 'bg-blue-950/70 border-blue-400 text-blue-300'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 border-amber-300'
              }`}
              title="Role-Based Onboarding & Verification"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {profile.verificationStatus === 'FULLY_VERIFIED'
                  ? '🛡️ Fully Verified'
                  : profile.verificationStatus === 'ROLE_VERIFIED'
                  ? '✓ Role Verified'
                  : 'Get Role Verified'}
              </span>
            </button>

            {/* Admin Verification Audit Portal Trigger */}
            {onOpenAdminVerification && (
              <button
                onClick={onOpenAdminVerification}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-700 transition-colors cursor-pointer"
                title="Admin Verification & Compliance Audit Console"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Audit</span>
              </button>
            )}

            {/* User Profile Pill */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-medium transition-all cursor-pointer"
              title="View Profile & Switch Roles"
            >
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-600"
              />
              <div className="hidden lg:block text-left">
                <p className="font-bold text-white text-[11px] leading-tight">{profile.name}</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase leading-none">{profile.role || 'Farmer'}</p>
              </div>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

