import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, CloudSun, CloudRain, Droplets, ShieldAlert, TrendingUp, TrendingDown,
  Camera, Mic, ChevronRight, Activity, CalendarCheck, Sparkles, CheckCircle2,
  Clock, AlertCircle, Sprout, ShieldCheck, Zap, RefreshCw, MapPin, Thermometer, Wind,
  BarChart2, LineChart as LineChartIcon, Layers, Store, Handshake, ShoppingBag, Users, Building2, Tractor, Send, Tag, Plus, ArrowRight, Navigation
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

  // Live Location Weather Feed from Device
  const {
    weather: liveWeather,
    sevenDayForecast,
    locationName,
    isLiveLocation,
    isLoading: isWeatherLoading,
    refresh: refreshLiveWeather,
  } = useLiveLocationWeather();

  const weather = liveWeather || sampleWeather;

  // Initial Smart Action Items based on local crop calendar and current conditions
  const [actions, setActions] = useState<SmartActionItem[]>([
    {
      id: 'action-1',
      title: 'Deep Drip Irrigation & Moisture Boost',
      category: 'Irrigation',
      priority: 'HIGH',
      dueDate: 'Today (31 Jul)',
      bestTime: '4:30 PM - 6:00 PM (Cooler Hours)',
      fieldPlot: `Paddy / Rice (Seeraga Samba) • Field Plot 1`,
      cropPhase: 'Day 45 • Panicle Initiation Stage',
      aiReason: 'High heat forecast tomorrow (33°C). Pre-wet standing water bed to protect developing panicles.',
      completed: false
    },
    {
      id: 'action-2',
      title: 'Bio-Fertilizer Azospirillum + Phosphobacteria Application',
      category: 'Fertilization',
      priority: 'HIGH',
      dueDate: 'Tomorrow (01 Aug)',
      bestTime: 'Early Morning (7:00 AM - 9:00 AM)',
      fieldPlot: `Ragi / Finger Millet • Plot 2 (Millet Vault)`,
      cropPhase: 'Day 25 • Tillering Stage Peak',
      aiReason: 'Organic bio-inoculants boost root nodulation and drought resilience in dryland ragi.',
      completed: false
    },
    {
      id: 'action-3',
      title: 'Rhizobium Seed Treatment & Pod Borer Check',
      category: 'Pest Control',
      priority: 'MEDIUM',
      dueDate: 'In 2 Days (02 Aug)',
      bestTime: 'Evening after dew dries',
      fieldPlot: `Moong Dal / Green Gram • Plot 3 (Legume Bed)`,
      cropPhase: 'Day 30 • Flowering Initiation',
      aiReason: 'Preventative biological barrier against pod borer larvae before peak humidity.',
      completed: false
    },
    {
      id: 'action-4',
      title: 'Breaker-Stage Fruit Inspection & Selective Harvest',
      category: 'Harvest',
      priority: 'NORMAL',
      dueDate: 'In 4 Days (04 Aug)',
      bestTime: 'Morning 6:00 AM',
      fieldPlot: `Country Tomato (Nattu) • Plot 4`,
      cropPhase: 'Pre-Harvest Pick',
      aiReason: 'Vellore Mandi prices trending UP (+16.6%). Harvest pink blush tomatoes for highest market return.',
      completed: false
    }
  ]);

  const [activePriorityFilter, setActivePriorityFilter] = useState<'ALL' | 'HIGH' | 'PENDING'>('ALL');

  // 6-Month Historical Crop Growth & Health Data for Recharts visualization
  const cropGrowthHistory = [
    { month: 'Feb', yield: 18.5, healthScore: 76, soilMoisture: 62 },
    { month: 'Mar', yield: 21.0, healthScore: 82, soilMoisture: 68 },
    { month: 'Apr', yield: 24.5, healthScore: 86, soilMoisture: 74 },
    { month: 'May', yield: 22.0, healthScore: 79, soilMoisture: 61 },
    { month: 'Jun', yield: 28.0, healthScore: 90, soilMoisture: 80 },
    { month: 'Jul', yield: 32.5, healthScore: 95, soilMoisture: 85 }
  ];

  const [activeChartMetric, setActiveChartMetric] = useState<'all' | 'yield' | 'health'>('all');

  // Farm health score from report or default 85
  const healthScore = latestReport?.farmHealthScore || 85;

  const toggleActionComplete = (id: string) => {
    setActions(prev =>
      prev.map(act => (act.id === id ? { ...act, completed: !act.completed } : act))
    );
  };

  const snoozeAction = (id: string) => {
    setActions(prev =>
      prev.map(act => (act.id === id ? { ...act, dueDate: 'Snoozed +1 Day' } : act))
    );
  };

  const filteredActions = actions.filter(act => {
    if (activePriorityFilter === 'HIGH') return act.priority === 'HIGH' && !act.completed;
    if (activePriorityFilter === 'PENDING') return !act.completed;
    return true;
  });

  const completedCount = actions.filter(a => a.completed).length;

  return (
    <div className="space-y-5 pb-20 animate-in fade-in">
      
      {/* Grand High-Contrast Welcome Hero Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-emerald-950/80 to-amber-950/60 border-2 border-emerald-500/40 text-white shadow-2xl overflow-hidden">
        {/* Ambient Glows reflecting Plant Green and Fertile Soil Brown */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            {/* Badge Header with AgriLogo */}
            <div className="flex items-center gap-4">
              <AgriLogo size={62} />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1
                    className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-xl"
                    style={{ fontFamily: "'Caveat', cursive, serif" }}
                  >
                    <span className="text-emerald-400">AgriVeda</span>
                    <span className="text-amber-400">-AI</span>
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/30 to-amber-500/30 text-emerald-300 border border-emerald-400/50 text-[11px] font-black uppercase tracking-wider shadow-sm">
                    🌱 Smart Soil &amp; Crop Intelligence
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-amber-200/90 drop-shadow-sm mt-0.5">
                  Ancient Vedic Agriculture • Real-time GPS Spatial Intelligence • AI Pathology
                </p>
              </div>
            </div>

            {/* Farmer Status Strip */}
            <div className="pt-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{t.goodMorning}, {profile.name}!</span>
                <span className="inline-block animate-pulse">🌾</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Primary Crop: <strong className="text-emerald-300 font-bold">{profile.primaryCrop}</strong> ({profile.farmSizeAcres} Acres) • 
                Farm ID: <span className="text-amber-300 font-mono font-bold">{profile.farmId}</span> • 
                Location: <span className="text-sky-300 font-semibold">{locationName}</span>
              </p>
            </div>

            {/* High-Contrast Fast Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => setActiveTab('scan')}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/60 active:scale-95 transition-all border border-emerald-300/40 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-100" />
                <span>AI Crop Scan &amp; Diagnosis</span>
              </button>
              <button
                onClick={() => setActiveTab('maps')}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-950/60 active:scale-95 transition-all border border-blue-300/40 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-blue-100" />
                <span>Interactive GIS Map</span>
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className="px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center gap-2 border border-amber-500/40 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Mic className="w-4 h-4 text-amber-400" />
                <span>Voice Copilot</span>
              </button>
              {onOpenTutorial && (
                <button
                  onClick={onOpenTutorial}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-emerald-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 shadow-md active:scale-95 transition-all cursor-pointer"
                  title="Launch 8-Slide UI Tutorial & Feature Guide"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>UI Walkthrough</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Profile & Health Gauge */}
          <div className="w-full lg:w-auto bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 border border-emerald-500/40 flex items-center justify-between lg:flex-col lg:items-center gap-4 shrink-0 shadow-xl">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${healthScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">{healthScore}</span>
                <span className="text-[9px] text-slate-400 font-bold block leading-none">/ 100</span>
              </div>
            </div>

            <div className="text-right lg:text-center">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block">
                {t.farmHealthScore}
              </span>
              <span className="text-[10px] text-slate-300 font-medium">
                {healthScore >= 80 ? '🌱 Peak Condition' : '⚠️ Requires Attention'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Location Weather Card with 7-Day Forecast */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50 rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-xl text-white space-y-4">
        
        {/* Location Header & Realtime GPS Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                  Real-Time Live Location Weather
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                  <MapPin className="w-3 h-3" />
                  {locationName}
                </span>
                {isLiveLocation && (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    GPS Live
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-200/80 font-medium">
                Live GPS device feed &amp; 7-day microclimate agricultural forecast
              </p>
            </div>
          </div>

          {/* Quick GPS Refresh Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={refreshLiveWeather}
              disabled={isWeatherLoading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all shadow-xs cursor-pointer"
              title="Re-fetch live device coordinates"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isWeatherLoading ? 'animate-spin' : ''}`} />
              <span>Refresh GPS</span>
            </button>
          </div>
        </div>

        {/* Current Weather Snapshot Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 rounded-2xl p-4 border border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl">{sevenDayForecast[0]?.icon || '⛅'}</div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white">{weather.temperature}°C</span>
              <span className="text-[11px] text-emerald-400 font-bold block">{weather.condition}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Humidity &amp; Soil</span>
              <span className="text-sm font-black text-white">{weather.humidity}% • Soil {weather.soilMoisture}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Rain Probability</span>
              <span className="text-sm font-black text-white">{weather.rainChance}% Chance</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Wind Velocity</span>
              <span className="text-sm font-black text-white">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* 7-Day Live Weekly Forecast Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <span>📅 7-Day Weekly Weather Forecast</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Full Week Telemetry</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 overflow-x-auto pb-1">
            {sevenDayForecast.map((dayItem, idx) => (
              <div
                key={`forecast-day-${idx}`}
                className={`rounded-2xl p-3 border flex flex-col items-center text-center transition-all ${
                  idx === 0
                    ? 'bg-gradient-to-b from-emerald-950/90 to-slate-900 border-emerald-500/60 shadow-lg ring-1 ring-emerald-400/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                  {dayItem.day}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">{dayItem.date}</span>

                <div className="my-2 text-2xl drop-shadow-md">
                  {dayItem.icon}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-white">{dayItem.tempMax}°</span>
                  <span className="text-xs font-bold text-slate-400">/{dayItem.tempMin}°</span>
                </div>

                <span className="text-[10px] font-bold text-emerald-300 mt-0.5 truncate max-w-full">
                  {dayItem.condition}
                </span>

                {/* Rain Probability */}
                <div className="mt-1.5 flex items-center gap-1 text-[9px] font-black text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800/60">
                  <Droplets className="w-2.5 h-2.5 text-blue-400" />
                  <span>{dayItem.rainChance}%</span>
                </div>

                {/* Spray Risk Tag */}
                <span
                  className={`mt-1.5 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                    dayItem.sprayRisk === 'LOW'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : dayItem.sprayRisk === 'MODERATE'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  Spray: {dayItem.sprayRisk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agricultural Advisory Strip */}
        <div className="p-3 bg-emerald-950/50 rounded-2xl border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-200">
          <Sprout className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-emerald-300">Live AI Agronomy Advisory for {locationName}: </strong>
            <span>{sevenDayForecast[0]?.advisory || 'Optimal microclimate detected for vegetative tillering and root nutrient uptake.'}</span>
          </div>
        </div>

      </div>

      {/* Today's Overview Grid */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.todaysOverview}
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">Live Synced</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Weather Card */}
          <div
            onClick={() => setActiveTab('calendar')}
            className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-500">{t.weather}</span>
              <div className="p-1 rounded-md bg-amber-50 text-amber-600">
                <Sun className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold text-slate-900">32°C</p>
              <p className="text-[11px] font-medium text-amber-700">Sunny & Clear</p>
            </div>
          </div>

          {/* Irrigation Card */}
          <div
            onClick={() => setActiveTab('calendar')}
            className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-500">{t.irrigation}</span>
              <div className="p-1 rounded-md bg-blue-50 text-blue-600">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-bold text-slate-900">Recommended</p>
              <p className="text-[11px] font-medium text-blue-600">Today 4:30 PM</p>
            </div>
          </div>

          {/* Disease Risk Card */}
          <div
            onClick={() => setActiveTab('scan')}
            className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-semibold text-slate-500">{t.diseaseRisk}</span>
              <div className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold text-slate-900">Low</p>
              <p className="text-[11px] font-medium text-emerald-700">No Outbreak</p>
            </div>
          </div>

          {/* Market Price Card */}
          <div
            onClick={() => setActiveTab('market')}
            className="bg-slate-900 text-white border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-semibold text-slate-400">{t.marketPrice}</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold text-amber-400">₹35<span className="text-xs font-normal text-slate-300">/kg</span></p>
              <p className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                <span className="text-emerald-400">▲ +16.6%</span> Tomato
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab('scan')}
          className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transform active:scale-98 transition-all"
        >
          <Camera className="w-4 h-4 text-white" />
          <span>{t.scanCrop}</span>
        </button>

        <button
          onClick={() => setActiveTab('assistant')}
          className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transform active:scale-98 transition-all border border-slate-800"
        >
          <Mic className="w-4 h-4 text-blue-400" />
          <span>{t.voiceAI}</span>
        </button>
      </div>

      {/* MapCN Geospatial & Bank Loans Live Spotlight Card */}
      <div 
        onClick={() => setActiveTab('maps')}
        className="bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 text-white rounded-3xl p-4 sm:p-5 shadow-xl border border-blue-500/20 hover:border-emerald-500/50 transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white">Agri-GIS & Bank Loans</h4>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Interactive Portal
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Explore nearest loan branches within 30km, agro-climatic zones, field inspection routing & subsidized credit.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs shrink-0 group-hover:translate-x-1 transition-transform ml-2">
            <span className="hidden sm:inline">Open Maps</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* MULTI-ROLE B2B & B2C FRAMER MARKETPLACE DASHBOARD WIDGET */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 shadow-xl border border-slate-800 space-y-4 relative overflow-hidden"
      >
        <div className="absolute -right-16 -top-16 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              <Store className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Framer Marketplace Live Hub</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h3>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950 rounded-full">
                  Verified Mandi Trade
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Direct Grower Sourcing • Daily Mandi Spot Slabs • B2B Tonnage Pools</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('marketplace')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto cursor-pointer"
          >
            <span>Launch Full Marketplace</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Live Ticker & Tonnage Pool Banner */}
        <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs relative z-10">
          <div className="flex items-center gap-2 text-slate-300">
            <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold text-amber-400">Live Mandi Ticker:</span>
            <span className="text-slate-200">Paddy ₹24.5/kg • Ragi ₹42/kg • Tomato ₹28/kg • Chilli ₹185/kg</span>
          </div>

          <button 
            onClick={() => setActiveTab('marketplace')}
            className="text-[11px] font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>🌾 Join 45T Paddy Pool (+18% Margin)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Framer Animated Produce Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1 relative z-10">
          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            onClick={() => setActiveTab('marketplace')}
            className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800/90 space-y-2 hover:border-emerald-500/50 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">🌾 Seeraga Samba Rice</span>
              <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">🏢 B2B Bulk</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">₹65 <span className="text-xs font-normal text-slate-400">/kg</span></p>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+14.2%</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">2,400 kg Available • Vellore FPC</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            onClick={() => setActiveTab('marketplace')}
            className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800/90 space-y-2 hover:border-purple-500/50 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">🌱 Organic Finger Millet</span>
              <span className="text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-800/60">🌐 B2B + B2C</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-black text-white group-hover:text-purple-400 transition-colors">₹42 <span className="text-xs font-normal text-slate-400">/kg</span></p>
              <span className="text-[10px] font-extrabold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">+8.5%</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">1,800 kg Available • Salem Pool</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            onClick={() => setActiveTab('marketplace')}
            className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800/90 space-y-2 hover:border-blue-500/50 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">🫘 Organic Green Gram</span>
              <span className="text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800/60">🏢 B2B Tonnage</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">₹95 <span className="text-xs font-normal text-slate-400">/kg</span></p>
              <span className="text-[10px] font-extrabold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">Sun-Dried</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">1,200 kg Available • Dharmapuri</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            onClick={() => setActiveTab('marketplace')}
            className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800/90 space-y-2 hover:border-amber-500/50 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">🍅 Country Tomato (Nattu)</span>
              <span className="text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800/60">🛒 B2C Farm</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">₹28 <span className="text-xs font-normal text-slate-400">/kg</span></p>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Fresh Pick</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">850 kg Available • Picked Today</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Weekly Agri-Tip Card (Gemini AI Seasonal Advisory) */}
      <WeeklyAgriTipCard
        location={profile.location}
        primaryCrop={profile.primaryCrop}
        language={profile.language}
        onAskAssistant={() => setActiveTab('assistant')}
      />

      {/* 6-MONTH CROP GROWTH & YIELD HISTORY CHART (RECHARTS) */}
      <div className="bg-white rounded-2xl p-4.5 sm:p-5 shadow-2xs border border-slate-200 space-y-4">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200/80 shadow-2xs">
              <BarChart2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  Crop Growth &amp; Yield History
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Last 6 Months
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Harvest Yield (Qtl/Acre) &amp; Plot Health Index trajectory
              </p>
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/80">
            <button
              onClick={() => setActiveChartMetric('all')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                activeChartMetric === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Metrics
            </button>
            <button
              onClick={() => setActiveChartMetric('yield')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                activeChartMetric === 'yield'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yield Only
            </button>
            <button
              onClick={() => setActiveChartMetric('health')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                activeChartMetric === 'health'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Health Index
            </button>
          </div>
        </div>

        {/* Highlight Quick Stats Chips */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 text-center">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Jul Peak Yield</span>
            <span className="text-sm font-black text-emerald-700">32.5 <span className="text-[10px] font-normal">Qtl/Acre</span></span>
          </div>
          <div className="border-x border-slate-200/80 px-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">6-Mo Avg Health</span>
            <span className="text-sm font-black text-blue-700">86% <span className="text-[10px] font-normal">Score</span></span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Output</span>
            <span className="text-sm font-black text-slate-900">+75% <span className="text-[10px] text-emerald-600 font-bold">▲ Growth</span></span>
          </div>
        </div>

        {/* Recharts Area/Line Chart */}
        <div className="w-full h-56 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cropGrowthHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#cbd5e1' }} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
              
              <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 40]} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[50, 100]} />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                        <p className="font-extrabold text-emerald-400 uppercase tracking-wider text-[10px]">
                          {label} 2026 Performance
                        </p>
                        {payload.map((entry: any, i: number) => (
                          <div key={i} className="flex items-center justify-between gap-3 text-[11px] font-bold">
                            <span style={{ color: entry.color }}>{entry.name}:</span>
                            <span className="text-white">
                              {entry.value} {entry.name.includes('Yield') ? 'Qtl/Acre' : '%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend
                wrapperStyle={{ paddingTop: 10, fontSize: 11, fontWeight: 600 }}
                iconType="circle"
              />

              {(activeChartMetric === 'all' || activeChartMetric === 'yield') && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="yield"
                  name="Crop Yield (Qtl/Acre)"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#yieldGradient)"
                />
              )}

              {(activeChartMetric === 'all' || activeChartMetric === 'health') && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="healthScore"
                  name="Health Score (%)"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Insight Caption */}
        <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/60 text-[11px] font-medium text-emerald-950">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>AI Growth Analysis:</strong> Your plot yield increased consistently from 18.5 to 32.5 Qtl/Acre with balanced NPK split dosing &amp; early disease scanning.
          </span>
        </div>
      </div>

      {/* PRIORITIZED SMART ACTION CARDS SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Section Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>Smart Action Cards</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-600 text-white font-extrabold">
                  {actions.filter(a => !a.completed).length} Tasks
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                AI Prioritized reminders tailored to local crop calendar &amp; weather
              </p>
            </div>
          </div>

          {/* Priority Filters */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setActivePriorityFilter('ALL')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                activePriorityFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({actions.length})
            </button>
            <button
              onClick={() => setActivePriorityFilter('HIGH')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                activePriorityFilter === 'HIGH'
                  ? 'bg-red-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Urgent 🔥
            </button>
            <button
              onClick={() => setActivePriorityFilter('PENDING')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                activePriorityFilter === 'PENDING'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({actions.length - completedCount})
            </button>
          </div>
        </div>

        {/* Action Cards List */}
        <div className="p-4 space-y-3">
          {filteredActions.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">All prioritized farm tasks completed!</p>
              <p className="text-[11px] text-slate-500">Your crop is in optimal health according to the calendar.</p>
            </div>
          ) : (
            filteredActions.map((action) => {
              const isHigh = action.priority === 'HIGH';
              const isDone = action.completed;

              return (
                <div
                  key={action.id}
                  className={`rounded-xl p-4 border transition-all relative overflow-hidden ${
                    isDone
                      ? 'bg-slate-50/80 border-slate-200 opacity-70'
                      : isHigh
                      ? 'bg-amber-50/40 border-amber-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Left priority accent indicator */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                      isDone
                        ? 'bg-slate-300'
                        : isHigh
                        ? 'bg-amber-500'
                        : action.category === 'Irrigation'
                        ? 'bg-blue-500'
                        : action.category === 'Fertilization'
                        ? 'bg-emerald-500'
                        : 'bg-purple-500'
                    }`}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pl-1">
                    
                    {/* Content Section */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Category Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide ${
                            action.category === 'Irrigation'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : action.category === 'Fertilization'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : action.category === 'Pest Control'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-purple-100 text-purple-800 border border-purple-200'
                          }`}
                        >
                          {action.category === 'Irrigation' && <Droplets className="w-3 h-3" />}
                          {action.category === 'Fertilization' && <Sprout className="w-3 h-3" />}
                          {action.category === 'Pest Control' && <ShieldCheck className="w-3 h-3" />}
                          {action.category === 'Harvest' && <TrendingUp className="w-3 h-3" />}
                          {action.category}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isHigh
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : action.priority === 'MEDIUM'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isHigh ? '🔥 High Priority' : `${action.priority} Priority`}
                        </span>

                        {/* Plot / Field info */}
                        <span className="text-[10px] text-slate-500 font-semibold truncate">
                          {action.fieldPlot}
                        </span>
                      </div>

                      {/* Action Title */}
                      <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {action.title}
                      </h4>

                      {/* Schedule details & AI reason */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 font-medium">
                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>Due: {action.dueDate}</span>
                        </span>
                        <span className="text-slate-500 font-normal">
                          Best Window: <strong className="text-slate-700">{action.bestTime}</strong>
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-700 leading-snug font-medium flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>AI Advisory Reason:</strong> {action.aiReason}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        onClick={() => toggleActionComplete(action.id)}
                        className={`w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                      </button>

                      {!isDone && (
                        <button
                          onClick={() => snoozeAction(action.id)}
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Snooze</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Link */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Based on Tamil Nadu Agriculture Advisory &amp; Local Mandi Cycle
          </span>
          <button
            onClick={() => setActiveTab('calendar')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Full Crop Calendar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Recent Diagnosis & Advisory Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Recent Crop Scan Diagnosis
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('scan')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4">
          <div
            onClick={() => {
              if (latestReport) {
                onSelectReport(latestReport);
              } else {
                const demo = sampleCropImages[0];
                onSelectReport({
                  id: 'demo-1',
                  timestamp: 'Today, 9:15 AM',
                  cropType: demo.crop,
                  soilType: 'Red Soil',
                  location: profile.location,
                  imageUrl: demo.url,
                  detectedIssue: demo.issue,
                  confidence: 94,
                  riskLevel: demo.riskLevel,
                  farmHealthScore: demo.healthScore,
                  cause: demo.cause,
                  treatment: demo.treatment,
                  prevention: demo.prevention,
                  fertilizerSuggestion: demo.fertilizer
                });
              }
            }}
            className="bg-slate-50 hover:bg-blue-50/40 rounded-xl p-3.5 border border-slate-200 transition-colors cursor-pointer flex items-center gap-3"
          >
            <img
              src={latestReport?.imageUrl || sampleCropImages[0].url}
              alt="Scanned crop"
              className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {latestReport?.cropType || 'Tomato'} • {latestReport?.timestamp || 'Today'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-100 text-red-700">
                  {latestReport?.riskLevel || 'High Risk'}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {latestReport?.detectedIssue || 'Early Blight Disease (Alternaria solani)'}
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                Confidence: <span className="font-bold text-blue-600">{latestReport?.confidence || 92}%</span> — Recommended Fungicide Spray & Leaf Pruning
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Farm Calendar Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Next Smart Crop Schedule
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('calendar')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            {t.cropCalendar}
          </button>
        </div>

        <div className="p-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-700 uppercase px-2 py-0.5 bg-blue-100 rounded-md">
                15 JUN • Day 15
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1.5">
                Basal Fertilizer & Transplanting
              </p>
              <p className="text-[11px] text-slate-600">
                Apply Neem cake @ 100kg/acre + NPK 50:50:50 kg/acre
              </p>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              className="px-3 py-1 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
