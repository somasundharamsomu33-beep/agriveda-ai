import React from 'react';
import { Leaf, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { AgriLogo } from './ui/AgriLogo';

interface SplashViewProps {
  onContinue: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onContinue }) => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-12 relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50/50 rounded-3xl border border-blue-100 shadow-sm">
      {/* Subtle Agricultural Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Brand Icon & Logo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative inline-block p-4 bg-white rounded-3xl shadow-xl border border-blue-100 group">
            <AgriLogo size={72} />
            <div className="absolute -top-1 -right-1 p-1.5 bg-blue-600 rounded-full text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl sm:text-4xl font-black text-blue-900 tracking-tight">AgriVeda</span>
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                AI Powered
              </span>
            </div>
            <p className="text-lg font-bold text-blue-600">Your Smart Farming Companion</p>
          </div>
        </div>

        {/* Dashboard Supporting Statement */}
        <div className="p-5 bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-md space-y-3">
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            AI-powered insights for better crops, decisions & profits.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 text-emerald-700">
              <Leaf className="w-3.5 h-3.5" /> Crop Health
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-blue-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Market Rates
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-amber-700">
              <Sparkles className="w-3.5 h-3.5" /> AI Advisory
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 space-y-3">
          <button
            onClick={onContinue}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-slate-400 font-medium">Designed for Indian Farmers • Simple & Trustworthy</p>
        </div>
      </div>
    </div>
  );
};
