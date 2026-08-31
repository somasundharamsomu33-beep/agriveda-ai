import React from 'react';
import { Home, Calendar, Camera, Mic, MapPin, TrendingUp, User, Users } from 'lucide-react';
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
    { id: 'home' as ActiveTab, label: t.navHome || 'Home', icon: Home },
    { id: 'maps' as ActiveTab, label: t.myFarmMap || 'My Farm', icon: MapPin },
    { id: 'scan' as ActiveTab, label: t.cropDoctor || 'Crop Doctor', icon: Camera, isCenter: true },
    { id: 'market' as ActiveTab, label: t.marketPrices || 'Market', icon: TrendingUp },
    { id: 'assistant' as ActiveTab, label: t.askAgriVeda || 'Ask AI', icon: Mic },
    { id: 'profile' as ActiveTab, label: t.profile || 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-emerald-950/95 backdrop-blur-lg border-t border-emerald-800/60 shadow-2xl px-2 py-1.5 sm:py-2">
      <div className="max-w-md mx-auto flex items-center justify-between px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative -top-5 flex flex-col items-center group focus:outline-none cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all transform group-active:scale-95 border-2 border-amber-300 ${
                    isActive
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/40 scale-105'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500 ring-4 ring-emerald-950'
                  }`}
                >
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <span
                  className={`text-[10px] font-black mt-1 tracking-tight px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'text-emerald-200'
                  }`}
                >
                  {t.scanCrop || 'Scan Crop'}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-amber-300 font-extrabold bg-emerald-900/80 border border-emerald-700/50'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-amber-300' : 'stroke-2 text-emerald-300'}`} />
              <span className="text-[10px] tracking-tight mt-1 font-bold leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
