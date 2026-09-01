import React from 'react';
import { Home, Sprout, ShoppingCart, Compass, Bot, User } from 'lucide-react';
import { ActiveTab, Language } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language?: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; isProminent?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'marketplace', label: 'Store', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'assistant', label: 'AI', icon: <Bot className="w-6 h-6" />, isProminent: true },
    { id: 'nearby', label: 'Nearby', icon: <Compass className="w-5 h-5" /> },
    { id: 'passport', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden shadow-lg">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (tab.isProminent) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative -top-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-3.5 rounded-full shadow-xl shadow-blue-500/30 border-4 border-slate-100 flex items-center justify-center transition-all cursor-pointer"
                title="Ask AgriVeda AI"
              >
                {tab.icon}
                <span className="absolute -bottom-5 text-[10px] font-black text-blue-700 uppercase tracking-wider">
                  AI
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 transition-colors cursor-pointer ${
                isActive ? 'text-blue-600 font-black' : 'text-slate-400 hover:text-slate-600 font-semibold'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
