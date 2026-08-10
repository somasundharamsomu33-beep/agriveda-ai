import React from 'react';
import { Home, Calendar, Camera, TrendingUp, Mic, Users, User } from 'lucide-react';
import { ActiveTab, Language } from '../types';
import { translations } from '../data/mockData';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  language
}) => {
  const t = translations[language] || translations.en;

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'calendar' as ActiveTab, label: 'Calendar', icon: Calendar },
    { id: 'scan' as ActiveTab, label: 'Scan AI', icon: Camera, isCenter: true },
    { id: 'market' as ActiveTab, label: 'Market', icon: TrendingUp },
    { id: 'assistant' as ActiveTab, label: 'Voice AI', icon: Mic },
    { id: 'community' as ActiveTab, label: 'Community', icon: Users },
    { id: 'profile' as ActiveTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-xl px-2 py-1.5 sm:py-2">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative -top-4 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-13 h-13 rounded-xl flex items-center justify-center shadow-lg transition-all transform group-active:scale-95 ${
                    isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 scale-105'
                      : 'bg-blue-600 text-white hover:bg-blue-700 ring-4 ring-slate-900'
                  }`}
                >
                  <Camera className="w-6 h-6" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-tight ${
                    isActive ? 'text-blue-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  {t.scanCrop}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-all ${
                isActive
                  ? 'text-blue-400 font-bold bg-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px] text-blue-400' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-1 font-medium leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
