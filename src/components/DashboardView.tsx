import React from 'react';
import { 
  Sprout, 
  CloudSun, 
  Mic, 
  MessageSquare, 
  Camera, 
  Sparkles, 
  ArrowRight, 
  MapPin 
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DashboardViewProps {
  profile: UserProfile;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectReport?: (report: any) => void;
  latestReport?: any;
  onOpenTutorial?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  setActiveTab,
}) => {
  const { t, suggestedQuestions } = useLanguage();

  return (
    <div className="space-y-6">
      {/* 1. Dashboard Top Greeting Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden space-y-3">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t('goodMorning')}, {profile.name || 'Farmer'} 👋
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-blue-200 border border-white/15 w-fit">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>📍 {profile.location || 'Kovilpatti, Tiruvallur'}</span>
            </div>
          </div>

          <div className="pt-1">
            <h3 className="text-xl sm:text-2xl font-black text-amber-300">{t('appName')}</h3>
            <p className="text-sm font-bold text-blue-100">{t('tagline')}</p>
          </div>

          <p className="text-xs sm:text-sm text-blue-200 font-medium pt-1 max-w-xl leading-relaxed">
            {t('subTagline')}
          </p>
        </div>
      </div>

      {/* 2. Quick Farm Health Card & Weather Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Farm Health Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{t('farmHealth')}</h3>
                  <p className="text-xs text-slate-500 font-medium">{t('farmHealthSub')}</p>
                </div>
              </div>

              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-200">
                {t('statusGood')}
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">{t('cropHealth')}</span>
                <span className="text-xl font-black text-emerald-600 block">86%</span>
                <span className="text-[10px] text-slate-500 font-medium block">{t('optimalGrowth')}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">{t('soilStatus')}</span>
                <span className="text-xl font-black text-slate-900 block">Good</span>
                <span className="text-[10px] text-slate-500 font-medium block">Moisture 68%</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">{t('weatherRisk')}</span>
                <span className="text-xl font-black text-blue-600 block">Low</span>
                <span className="text-[10px] text-slate-500 font-medium block">Safe spray window</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">{t('irrigation')}</span>
                <span className="text-xl font-black text-emerald-600 block">Good</span>
                <span className="text-[10px] text-slate-500 font-medium block">{t('dripOperational')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('my_farm')}
            className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-2xl border border-blue-200 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{t('viewFarmInsights')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Today's Weather Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{t('todaysWeather')}</h3>
                  <p className="text-xs text-slate-500 font-medium">Tiruvallur District Forecast</p>
                </div>
              </div>

              <span className="text-2xl font-black text-slate-900">29°C</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-700">
              <span>{t('partlyCloudy')}</span>
              <span className="font-bold text-blue-700">{t('rainProbability')}: 40%</span>
            </div>

            {/* Smart Farming Recommendation */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider block">{t('farmingRecommendationTitle')}</span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {t('weatherRecommendation')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('weather')}
            className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-2xl border border-blue-200 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{t('viewWeather')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Prominent Ask AgriVeda AI Card */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-3xl shadow-lg border border-blue-700 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="text-xl sm:text-2xl font-black text-white">{t('askAgriVedaAI')}</h3>
            </div>
            <p className="text-xs sm:text-sm text-blue-100 font-medium">
              {t('askAISub')}
            </p>
          </div>

          {/* Big Voice Microphone Button */}
          <button
            onClick={() => setActiveTab('assistant')}
            className="p-4 bg-amber-400 hover:bg-amber-500 active:scale-95 text-slate-950 rounded-full shadow-xl shadow-amber-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            title={t('askByVoice')}
          >
            <Mic className="w-6 h-6 text-slate-950" />
            <span className="text-xs font-black pr-1">{t('askByVoice')}</span>
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('assistant')}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-center space-y-1 transition-all cursor-pointer"
          >
            <Mic className="w-5 h-5 mx-auto text-amber-300" />
            <span className="text-xs font-bold text-white block">{t('askByVoice')}</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-center space-y-1 transition-all cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 mx-auto text-blue-300" />
            <span className="text-xs font-bold text-white block">{t('typeQuestion')}</span>
          </button>

          <button
            onClick={() => setActiveTab('scan')}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-center space-y-1 transition-all cursor-pointer"
          >
            <Camera className="w-5 h-5 mx-auto text-emerald-300" />
            <span className="text-xs font-bold text-white block">{t('uploadImage')}</span>
          </button>
        </div>

        {/* Localized Suggested Questions Chips */}
        <div className="space-y-2 pt-2 border-t border-blue-700/60">
          <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block">{t('suggestedQuestionsTitle')}</span>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab('assistant')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-medium text-blue-50 rounded-xl border border-white/15 transition-all text-left cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. My Crops Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-blue-600" />
            <span>{t('myCrops')}</span>
          </h3>

          <button
            onClick={() => setActiveTab('my_farm')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>{t('viewAllCrops')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Crop 1: Rice */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-blue-200 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl shrink-0">
              🌾
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-slate-900">Rice (Paddy)</h4>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                  Health: 91%
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">{t('vegetativeStage')}</p>
              <p className="text-xs font-extrabold text-blue-700">{t('harvestInDays')} 74 days</p>
            </div>
          </div>

          {/* Crop 2: Tomato */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-blue-200 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-2xl shrink-0">
              🌱
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-slate-900">Tomato</h4>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full">
                  Health: 84%
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">{t('floweringStage')}</p>
              <p className="text-xs font-extrabold text-blue-700">{t('harvestInDays')} 32 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
