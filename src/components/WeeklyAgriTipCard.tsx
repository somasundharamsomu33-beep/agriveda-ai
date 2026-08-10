import React, { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, RefreshCw, CheckCircle2, Share2, MapPin, Calendar, Sprout, ArrowRight, Copy, Check } from 'lucide-react';

interface WeeklyTipData {
  title: string;
  category: string;
  seasonalBadge: string;
  tipText: string;
  actionableSteps: string[];
  impact: string;
  locationUsed: string;
  monthUsed: string;
  cropUsed: string;
}

interface WeeklyAgriTipCardProps {
  location: string;
  primaryCrop: string;
  language: string;
  onAskAssistant?: (question: string) => void;
}

export const WeeklyAgriTipCard: React.FC<WeeklyAgriTipCardProps> = ({
  location,
  primaryCrop,
  language,
  onAskAssistant
}) => {
  const [tip, setTip] = useState<WeeklyTipData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

  const fetchWeeklyTip = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/weekly-agri-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          cropType: primaryCrop,
          month: currentMonth,
          language
        })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch weekly tip');
      }

      const data = await res.json();
      setTip(data);
    } catch (err) {
      console.error('Error loading weekly agri tip:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyTip();
  }, [location, primaryCrop, language]);

  const handleCopy = () => {
    if (!tip) return;
    const shareContent = `🌾 AgriVeda Weekly Agri-Tip (${tip.monthUsed}):\n\n📌 ${tip.title}\n\n💡 ${tip.tipText}\n\nKey Actions:\n${tip.actionableSteps.map(s => `• ${s}`).join('\n')}\n\nBenefit: ${tip.impact}`;
    navigator.clipboard.writeText(shareContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Lightbulb className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Weekly Agri-Tip
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                Gemini AI Seasonal
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Localized for {location} • {currentMonth}
            </p>
          </div>
        </div>

        <button
          onClick={fetchWeeklyTip}
          disabled={loading}
          title="Refresh Seasonal Tip"
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 space-y-4">
        {loading ? (
          <div className="py-8 space-y-3 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="h-4 bg-slate-200 rounded w-32"></div>
            </div>
            <div className="h-5 bg-slate-200 rounded w-3/4"></div>
            <div className="h-12 bg-slate-100 rounded w-full"></div>
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              <div className="h-3 bg-slate-200 rounded w-4/6"></div>
              <div className="h-3 bg-slate-200 rounded w-3/6"></div>
            </div>
          </div>
        ) : error || !tip ? (
          <div className="text-center py-6 text-slate-500 space-y-2">
            <p className="text-xs font-bold text-slate-800">Unable to generate weekly tip</p>
            <button
              onClick={fetchWeeklyTip}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Badges line */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200">
                {tip.category}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {tip.seasonalBadge}
              </span>
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 ml-auto">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{tip.locationUsed}</span>
              </span>
            </div>

            {/* Title */}
            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {tip.title}
            </h4>

            {/* Tip Description */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium">
              {tip.tipText}
            </div>

            {/* Actionable Steps */}
            <div>
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recommended Farmer Actions for {tip.cropUsed}</span>
              </h5>
              <div className="space-y-2">
                {tip.actionableSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-100 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-normal">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Box */}
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-950">Expected Outcome &amp; Benefit:</span>
                <p className="text-[11px] text-emerald-800 font-medium mt-0.5">{tip.impact}</p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copied ? 'Copied Tip!' : 'Share Tip'}</span>
              </button>

              {onAskAssistant && (
                <button
                  onClick={() => onAskAssistant(`Tell me more about this weekly tip: "${tip.title}". How do I apply it for my ${tip.cropUsed} crop in ${tip.locationUsed}?`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 flex items-center gap-1 transition-all ml-auto"
                >
                  <span>Ask AI Voice Assistant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
