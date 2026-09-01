import React from 'react';
import { 
  Sprout, 
  Building2, 
  ShoppingCart, 
  GraduationCap, 
  Microscope, 
  Tractor, 
  Wrench, 
  Settings2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { UserRole } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { AgriLogo } from '../ui/AgriLogo';

interface MultiRoleAuthHubProps {
  onSelectRole: (role: UserRole) => void;
}

export interface RoleCardConfig {
  role: UserRole;
  icon: React.ReactNode;
  emoji: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  hoverBg: string;
  iconBg: string;
}

export const ROLE_CONFIGS: RoleCardConfig[] = [
  {
    role: 'farmer',
    icon: <Sprout className="w-7 h-7 text-emerald-600" />,
    emoji: '🌾',
    title: 'Farmer',
    subtitle: 'Manage your farm, crops, disease diagnostics, weather & mandi rates.',
    badge: 'Core Farming',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderColor: 'hover:border-emerald-500',
    hoverBg: 'hover:bg-emerald-50/50',
    iconBg: 'bg-emerald-50 border-emerald-100',
  },
  {
    role: 'b2b_vendor',
    icon: <Building2 className="w-7 h-7 text-blue-600" />,
    emoji: '🏢',
    title: 'B2B Vendor',
    subtitle: 'Connect your agricultural business with buyers & bulk procurement contracts.',
    badge: 'Enterprise Trade',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    borderColor: 'hover:border-blue-500',
    hoverBg: 'hover:bg-blue-50/50',
    iconBg: 'bg-blue-50 border-blue-100',
  },
  {
    role: 'b2c_vendor',
    icon: <ShoppingCart className="w-7 h-7 text-amber-600" />,
    emoji: '🛒',
    title: 'B2C Vendor',
    subtitle: 'Sell fresh produce, organic inputs & farm products directly to consumers.',
    badge: 'Retail Storefront',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    borderColor: 'hover:border-amber-500',
    hoverBg: 'hover:bg-amber-50/50',
    iconBg: 'bg-amber-50 border-amber-100',
  },
  {
    role: 'agronomist',
    icon: <GraduationCap className="w-7 h-7 text-teal-600" />,
    emoji: '🌱',
    title: 'Agronomist',
    subtitle: 'Provide expert agricultural consultations, soil diagnostics & farmer advisory.',
    badge: 'Expert Advisory',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    borderColor: 'hover:border-teal-500',
    hoverBg: 'hover:bg-teal-50/50',
    iconBg: 'bg-teal-50 border-teal-100',
  },
  {
    role: 'research_scholar',
    icon: <Microscope className="w-7 h-7 text-purple-600" />,
    emoji: '🔬',
    title: 'Research Scholar',
    subtitle: 'Access agricultural research tools, trial datasets & scholarly knowledge.',
    badge: 'Academic Research',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    borderColor: 'hover:border-purple-500',
    hoverBg: 'hover:bg-purple-50/50',
    iconBg: 'bg-purple-50 border-purple-100',
  },
  {
    role: 'equipment_vendor',
    icon: <Tractor className="w-7 h-7 text-indigo-600" />,
    emoji: '🚜',
    title: 'Equipment Vendor',
    subtitle: 'Buy, sell & manage tractors, harvesters, seeders & farm machinery.',
    badge: 'Trading Marketplace',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    borderColor: 'hover:border-indigo-500',
    hoverBg: 'hover:bg-indigo-50/50',
    iconBg: 'bg-indigo-50 border-indigo-100',
  },
  {
    role: 'technician',
    icon: <Wrench className="w-7 h-7 text-rose-600" />,
    emoji: '🔧',
    title: 'Technician',
    subtitle: 'Provide field repairs, tractor maintenance & equipment service dispatch.',
    badge: 'Field Service',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    borderColor: 'hover:border-rose-500',
    hoverBg: 'hover:bg-rose-50/50',
    iconBg: 'bg-rose-50 border-rose-100',
  },
  {
    role: 'spare_parts_retailer',
    icon: <Settings2 className="w-7 h-7 text-slate-700" />,
    emoji: '⚙️',
    title: 'Spare Parts Retailer',
    subtitle: 'Manage agricultural spare parts inventory, orders & retail distribution.',
    badge: 'Parts Inventory',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    borderColor: 'hover:border-slate-500',
    hoverBg: 'hover:bg-slate-100/50',
    iconBg: 'bg-slate-100 border-slate-200',
  },
];

export const MultiRoleAuthHub: React.FC<MultiRoleAuthHubProps> = ({ onSelectRole }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-6xl mx-auto w-full space-y-8 py-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-900 text-white rounded-2xl shadow-md border border-blue-800">
            <AgriLogo size={36} />
            <div className="text-left">
              <h1 className="text-xl font-black tracking-tight text-white leading-none">AgriVeda</h1>
              <p className="text-[10px] text-blue-200 font-medium">Your Smart Farming Companion</p>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Welcome to AgriVeda
            </h2>
            <p className="text-base sm:text-lg font-bold text-blue-700">
              Choose how you use AgriVeda
            </p>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-medium">
              AI-powered insights for better crops, decisions & profits. Choose your role to access your dedicated portal.
            </p>
          </div>
        </div>

        {/* 8 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLE_CONFIGS.map((cfg) => (
            <button
              key={cfg.role}
              onClick={() => onSelectRole(cfg.role)}
              className={`p-6 bg-white rounded-3xl border border-slate-200 shadow-sm transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer ${cfg.borderColor} ${cfg.hoverBg} hover:shadow-lg hover:-translate-y-1`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl border ${cfg.iconBg} group-hover:scale-110 transition-transform`}>
                    {cfg.icon}
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${cfg.badgeColor}`}>
                    {cfg.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 flex items-center gap-2">
                    <span>{cfg.emoji}</span>
                    <span>{cfg.title}</span>
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {cfg.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700 mt-4">
                <span>Enter {cfg.title} Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Banner */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-slate-500 font-medium py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Role-Based Secure Authentication Architecture</span>
        </div>
        <p>© 2026 AgriVeda AI Platform • Enterprise Grade Role-Based Access Control</p>
      </footer>
    </div>
  );
};
