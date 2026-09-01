import React from 'react';
import { User, ShieldCheck, Globe, HelpCircle, ChevronRight, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SettingsViewProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onNavigateTab: (tab: any) => void;
  onOpenSignOutConfirm?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  setProfile,
  onNavigateTab,
  onOpenSignOutConfirm,
}) => {
  const { language, setLanguage, currentLangMeta, supportedLanguages, t } = useLanguage();

  return (
    <div className="max-w-2xl w-full mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{t('settingsHeader')}</h2>
        <p className="text-xs text-slate-500 font-medium">Manage your AgriVeda account, language, and security settings</p>
      </div>

      {/* SECTION 1: Account */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 font-black text-xs text-slate-500 uppercase tracking-wider">
          {t('accountSettings')}
        </div>

        <div className="divide-y divide-slate-100">
          <button
            onClick={() => onNavigateTab('profile_setup')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Edit Farmer Profile</p>
                <p className="text-xs text-slate-500">{profile.name || 'Murugan Selvam'} • {profile.phone || '9842155432'}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => onNavigateTab('passport')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Farmer Passport Digital ID</p>
                <p className="text-xs text-emerald-600 font-bold">Verified Status: ACTIVE ✓</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* SECTION 2: Multilingual Preferences */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 font-black text-xs text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>{t('appPreferences')}</span>
          <span className="text-blue-700 font-bold text-[11px]">{currentLangMeta.flag} {currentLangMeta.nativeName} ✓</span>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Regional Language Selector</span>
              </span>
              <span className="text-xs font-black text-blue-600">Selected: {currentLangMeta.nativeName} ✓</span>
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {supportedLanguages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setProfile(prev => ({ ...prev, language: l.code }));
                    }}
                    className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-start justify-between min-h-[70px] ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30 font-black'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base">{l.flag}</span>
                      {isSelected && <span className="text-xs font-black text-amber-300">✓</span>}
                    </div>
                    <div>
                      <span className="block text-sm font-black leading-tight">{l.nativeName}</span>
                      <span className={`block text-[10px] ${isSelected ? 'text-blue-100 font-medium' : 'text-slate-500'}`}>{l.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Support */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 font-black text-xs text-slate-500 uppercase tracking-wider">
          {t('supportAndHelp')}
        </div>

        <div className="divide-y divide-slate-100">
          <button
            onClick={() => onNavigateTab('help')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{t('helpHeader')}</p>
                <p className="text-xs text-slate-500">Video tutorials & farmer guides</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Sign Out Action */}
      {onOpenSignOutConfirm && (
        <button
          onClick={onOpenSignOutConfirm}
          className="w-full p-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Account</span>
        </button>
      )}
    </div>
  );
};
