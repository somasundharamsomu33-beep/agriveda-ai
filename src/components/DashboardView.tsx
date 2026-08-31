import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, CloudSun, CloudRain, Droplets, ShieldAlert, TrendingUp, TrendingDown,
  Camera, Mic, ChevronRight, Activity, CalendarCheck, Sparkles, CheckCircle2,
  Clock, AlertCircle, Sprout, ShieldCheck, Zap, RefreshCw, MapPin, Thermometer, Wind,
  BarChart2, LineChart as LineChartIcon, Layers, Store, Handshake, ShoppingBag, Users, Building2, Tractor, Send, Tag, Plus, ArrowRight, Navigation, Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { UserProfile, CropDiagnosisReport, ActiveTab } from '../types';
import { translations, sampleCropImages, sampleWeather } from '../data/mockData';
import { WeeklyAgriTipCard } from './WeeklyAgriTipCard';
import { useLiveLocationWeather } from '../lib/liveLocationWeather';
import { AgriLogo } from './ui/AgriLogo';

interface DashboardViewProps {
  profile: UserProfile;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectReport: (report: CropDiagnosisReport) => void;
  latestReport?: CropDiagnosisReport | null;
  onOpenTutorial?: () => void;
}

export interface SmartActionItem {
  id: string;
  title: string;
  category: 'Irrigation' | 'Fertilization' | 'Pest Control' | 'Harvest';
  priority: 'HIGH' | 'MEDIUM' | 'NORMAL';
  dueDate: string;
  bestTime: string;
  fieldPlot: string;
  cropPhase: string;
  aiReason: string;
  completed: boolean;
  snoozedUntil?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  setActiveTab,
  onSelectReport,
  latestReport,
  onOpenTutorial
}) => {
  const t = translations[profile.language] || translations.en;

  const {
    weather: liveWeather,
    sevenDayForecast,
    locationName,
    isLiveLocation,
    isLoading: isWeatherLoading,
    refresh: refreshLiveWeather,
  } = useLiveLocationWeather();

  const weather = liveWeather || sampleWeather;

  const [actions, setActions] = useState<SmartActionItem[]>([
    {
      id: 'action-1',
      title: 'Deep Drip Irrigation & Root Zone Water Boost',
      category: 'Irrigation',
      priority: 'HIGH',
      dueDate: 'Today',
      bestTime: '4:30 PM - 6:00 PM (Cooler Evening)',
      fieldPlot: `${profile.primaryCrop || 'Tomato'} • Field Plot 1`,
      cropPhase: 'Day 45 • Flowering & Fruit Set',
      aiReason: 'High ambient temperature forecast (33°C). Irrigate early to prevent blossom end drop.',
      completed: false
    },
    {
      id: 'action-2',
      title: 'Organic Neem Oil Spray & Whitefly Inspection',
      category: 'Pest Control',
      priority: 'HIGH',
      dueDate: 'Tomorrow',
      bestTime: 'Early Morning (7:00 AM - 9:00 AM)',
      fieldPlot: `${profile.primaryCrop || 'Tomato'} • Plot 2`,
      cropPhase: 'Vegetative Growth Peak',
      aiReason: 'Humidity > 65% increases pest risk. Apply 5ml/L organic neem spray as preventative.',
      completed: false
    },
    {
      id: 'action-3',
      title: 'Bio-Fertilizer Azospirillum Top Dressing',
      category: 'Fertilization',
      priority: 'MEDIUM',
      dueDate: 'In 2 Days',
      bestTime: 'Morning after dew dries',
      fieldPlot: `Soil Bed • Organic Section`,
      cropPhase: 'Root Zone Feeding',
      aiReason: 'Organic bio-inoculants boost nitrogen fixation and soil health.',
      completed: false
    },
    {
      id: 'action-4',
      title: 'Breaker-Stage Fruit Pick for Mandi Transport',
      category: 'Harvest',
      priority: 'NORMAL',
      dueDate: 'In 3 Days',
      bestTime: 'Morning 6:00 AM',
      fieldPlot: `Harvest Plot 1`,
      cropPhase: 'Harvest Ready',
      aiReason: 'Local Mandi prices up (+16.6%). Harvest blush pink produce for maximum market returns.',
      completed: false
    }
  ]);

  const [activePriorityFilter, setActivePriorityFilter] = useState<'ALL' | 'HIGH' | 'PENDING'>('ALL');

  const cropGrowthHistory = [
    { month: 'Feb', yield: 18.5, healthScore: 76, soilMoisture: 62 },
    { month: 'Mar', yield: 21.0, healthScore: 82, soilMoisture: 68 },
    { month: 'Apr', yield: 24.5, healthScore: 86, soilMoisture: 74 },
    { month: 'May', yield: 22.0, healthScore: 79, soilMoisture: 61 },
    { month: 'Jun', yield: 28.0, healthScore: 90, soilMoisture: 80 },
    { month: 'Jul', yield: 32.5, healthScore: 95, soilMoisture: 85 }
  ];

  const [activeChartMetric, setActiveChartMetric] = useState<'all' | 'yield' | 'health'>('all');
  const healthScore = latestReport?.farmHealthScore || 88;

  const toggleActionComplete = (id: string) => {
    setActions(prev =>
      prev.map(act => (act.id === id ? { ...act, completed: !act.completed } : act))
    );
  };

  const filteredActions = actions.filter(act => {
    if (activePriorityFilter === 'HIGH') return act.priority === 'HIGH';
    if (activePriorityFilter === 'PENDING') return !act.completed;
    return true;
  });

  const pendingCount = actions.filter(a => !a.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* 🌿 Welcome Header & Farmer Context Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-800/60">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider border border-amber-500/40">
                🌱 {profile.location || 'Vellore, Tamil Nadu'}
              </span>
              <span className="text-xs text-emerald-300 font-semibold">
                Kisan ID: #{profile.id ? profile.id.slice(0, 8) : '8472910'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.welcomeBack || 'Vanakkam'}, {profile.name}! 👋
            </h2>
            <p className="text-sm text-emerald-200/90 font-medium max-w-xl">
              {t.cropOverview || 'Here is your daily farm summary for'} <strong className="text-amber-300">{profile.primaryCrop || 'Tomato'}</strong> ({profile.farmSizeAcres || 2.5} Acres).
            </p>
          </div>

          <div className="flex items-center gap-3 bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700/50 backdrop-blur-sm self-start md:self-auto">
            <div className="p-3 bg-emerald-700/60 text-emerald-200 rounded-xl">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Farm Health Index</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{healthScore}%</span>
                <span className="text-xs text-emerald-400 font-bold">Excellent Condition</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 ABOVE THE FOLD: 5 PRIORITIZED FARMER ACTIONS */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <span>5 Core Farmer Actions</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Quick One-Tap Launcher</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          
          {/* Action 1: Scan My Crop */}
          <button
            onClick={() => setActiveTab('scan')}
            className="agri-card flex flex-col items-center justify-center p-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-3xl shadow-md border border-emerald-600 group transition-all text-center cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-black text-white leading-tight">Scan My Crop</span>
            <span className="text-[10px] text-emerald-100 font-medium mt-0.5">Crop Doctor AI</span>
          </button>

          {/* Action 2: Ask AgriVeda */}
          <button
            onClick={() => setActiveTab('assistant')}
            className="agri-card flex flex-col items-center justify-center p-4 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-3xl shadow-md border border-amber-400 group transition-all text-center cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-950/10 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-xs font-black text-slate-950 leading-tight">Ask AgriVeda</span>
            <span className="text-[10px] text-slate-800 font-bold mt-0.5">Voice Assistant</span>
          </button>

          {/* Action 3: 7-Day Weather */}
          <button
            onClick={() => setActiveTab('weather')}
            className="agri-card flex flex-col items-center justify-center p-4 bg-sky-700 hover:bg-sky-800 text-white rounded-3xl shadow-md border border-sky-600 group transition-all text-center cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <CloudSun className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-black text-white leading-tight">7-Day Weather</span>
            <span className="text-[10px] text-sky-100 font-medium mt-0.5">Spray Risk Alert</span>
          </button>

          {/* Action 4: Market Prices */}
          <button
            onClick={() => setActiveTab('market')}
            className="agri-card flex flex-col items-center justify-center p-4 bg-slate-900 hover:bg-slate-950 text-white rounded-3xl shadow-md border border-slate-800 group transition-all text-center cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xs font-black text-white leading-tight">Market Prices</span>
            <span className="text-[10px] text-emerald-400 font-bold mt-0.5">Live Mandi Quotes</span>
          </button>

          {/* Action 5: Today's Farm Tasks */}
          <button
            onClick={() => {
              const el = document.getElementById('today-tasks-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="agri-card col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 rounded-3xl shadow-sm border border-emerald-300 group transition-all text-center cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-black text-emerald-950 leading-tight">Today's Tasks</span>
            <span className="text-[10px] text-emerald-700 font-bold mt-0.5">{pendingCount} Action Items</span>
          </button>

        </div>
      </div>

      {/* ☀️ LIVE WEATHER & SPRAY WINDOW ADVISORY */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Today's Weather & Spray Safety</h3>
              <p className="text-xs text-slate-500 font-medium">{locationName || weather.location}</p>
            </div>
          </div>

          <button
            onClick={() => refreshLiveWeather()}
            className="p-2 text-slate-400 hover:text-emerald-700 rounded-xl hover:bg-slate-50 transition-colors"
            title="Refresh Live Weather"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Temperature</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-slate-900">{weather.temperature}°C</span>
              <span className="text-xs text-slate-400 font-bold">{weather.condition}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Humidity</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{weather.humidity}%</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Rain Risk</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{weather.rainChance}%</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-[11px] text-emerald-800 font-bold block">Spray Window</span>
            <span className="text-xs font-black text-emerald-900 mt-0.5 block">
              7:00 AM - 9:30 AM (Safe)
            </span>
          </div>
        </div>

        {/* Actionable recommendation alert */}
        <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-900">Actionable Advisory</h4>
            <p className="text-xs text-amber-800 mt-0.5 font-medium">
              Afternoon winds will reach 16 km/h with humidity above 65%. <strong>Complete foliar spray early in the morning</strong> to prevent drift and fungus spore germination.
            </p>
          </div>
        </div>
      </div>

      {/* 📋 TODAY'S FARM TASKS ("What does the farmer need to do today?") */}
      <div id="today-tasks-section" className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-700" />
              <span>Today's Farm Action Checklist</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              AI-prioritized task recommendations for {profile.primaryCrop || 'Tomato'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setActivePriorityFilter('ALL')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                activePriorityFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({actions.length})
            </button>
            <button
              onClick={() => setActivePriorityFilter('HIGH')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                activePriorityFilter === 'HIGH' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              High Risk
            </button>
            <button
              onClick={() => setActivePriorityFilter('PENDING')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                activePriorityFilter === 'PENDING' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredActions.map(action => (
            <div
              key={action.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                action.completed
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : action.priority === 'HIGH'
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleActionComplete(action.id)}
                  className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                    action.completed
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'border-slate-300 hover:border-emerald-600 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-black ${action.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {action.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {action.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      ⏰ Best: {action.bestTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {action.aiReason}
                  </p>

                  <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-2 pt-0.5">
                    <span>📍 {action.fieldPlot}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{action.cropPhase}</span>
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 ${
                action.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {action.dueDate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 📊 RECENT CROP DOCTOR REPORT & WEEKLY AGRI TIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Latest Pathology Diagnosis Summary */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Latest Crop Doctor Diagnosis</h3>
                  <p className="text-xs text-slate-500 font-medium">Pathology Inspection Report</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('scan')}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Scan New +
              </button>
            </div>

            {latestReport ? (
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{latestReport.cropType}</span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                    {latestReport.detectedIssue}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <p><strong>Cause:</strong> {latestReport.cause}</p>
                  <p><strong>Treatment:</strong> {latestReport.treatment?.[0]}</p>
                </div>

                <button
                  onClick={() => onSelectReport(latestReport)}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors text-center cursor-pointer"
                >
                  View Full Diagnosis Report →
                </button>
              </div>
            ) : (
              <div className="p-5 text-center space-y-2 bg-slate-50 rounded-2xl border border-slate-100">
                <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">No Crop Scans Yet</h4>
                <p className="text-xs text-slate-500 font-medium">
                  Take a photo of any leaf spot or pest to get an instant AI diagnosis.
                </p>
                <button
                  onClick={() => setActiveTab('scan')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Scan Crop Now
                </button>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium flex items-center justify-between pt-2">
            <span>Powered by Gemini Multimodal Engine</span>
            <span>94% Confidence</span>
          </div>
        </div>

        {/* Weekly Agri Advisory Card */}
        <WeeklyAgriTipCard profile={profile} />

      </div>

    </div>
  );
};
