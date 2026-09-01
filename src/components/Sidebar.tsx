import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Sprout, 
  Scan, 
  Calendar, 
  CloudSun, 
  TrendingUp, 
  ShieldCheck, 
  Bell, 
  Settings, 
  HelpCircle,
  MapPin,
  Landmark,
  ShoppingCart,
  Compass
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { AgriLogo } from './ui/AgriLogo';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, profile }) => {
  const { t } = useLanguage();

  const mainNavItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: t('dashboard', 'Dashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'assistant', label: t('aiAssistantHeader', 'AI Assistant'), icon: <Bot className="w-5 h-5" />, badge: 'AI' },
    { id: 'my_farm', label: t('myFarmHeader', 'My Farm'), icon: <Sprout className="w-5 h-5" /> },
    { id: 'my_land', label: 'My Land (Patta/Chitta)', icon: <Landmark className="w-5 h-5 text-amber-400" /> },
    { id: 'marketplace', label: 'Agri Marketplace', icon: <ShoppingCart className="w-5 h-5 text-blue-400" /> },
    { id: 'nearby', label: 'Nearby Services', icon: <Compass className="w-5 h-5 text-emerald-400" /> },
    { id: 'maps', label: 'AgriVeda Map', icon: <MapPin className="w-5 h-5 text-emerald-400" /> },
    { id: 'scan', label: t('cropScanHeader', 'Crop Health'), icon: <Scan className="w-5 h-5" /> },
    { id: 'calendar', label: t('cropManagementHeader', 'Crop Calendar'), icon: <Calendar className="w-5 h-5" /> },
    { id: 'weather', label: t('weatherHeader', 'Weather'), icon: <CloudSun className="w-5 h-5" /> },
    { id: 'market', label: t('marketPricesHeader', 'Market Prices'), icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'passport', label: t('passportHeader', 'Farmer Passport'), icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  const secondaryNavItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'notifications', label: t('notificationsHeader', 'Notifications'), icon: <Bell className="w-5 h-5" /> },
    { id: 'settings', label: t('settingsHeader', 'Settings'), icon: <Settings className="w-5 h-5" /> },
    { id: 'help', label: t('helpHeader', 'Help & Support'), icon: <HelpCircle className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 z-30 border-r border-slate-800 p-4 space-y-6">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-2 border-b border-slate-800/80 pb-4">
        <AgriLogo size={36} />
        <div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1">
            <span className="text-blue-400">{t('appName')}</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Smart Farming AI</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 space-y-1">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-3 block mb-2">
          Main Menu
        </span>

        {mainNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-black px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded-md">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Secondary Bottom Navigation */}
      <div className="space-y-1 pt-4 border-t border-slate-800/80">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-3 block mb-2">
          Preferences
        </span>

        {secondaryNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Quick Status Box */}
      <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700/60 flex items-center gap-3">
        <img
          src={profile.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
          alt={profile.name}
          className="w-8 h-8 rounded-full object-cover border border-blue-400"
        />
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">{profile.name || 'Farmer'}</p>
          <p className="text-[10px] text-emerald-400 font-bold truncate">📍 {profile.location || 'Kovilpatti'}</p>
        </div>
      </div>
    </aside>
  );
};
