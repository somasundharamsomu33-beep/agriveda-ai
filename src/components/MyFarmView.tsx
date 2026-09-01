import React, { useState } from 'react';
import { Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MyFarmViewProps {
  profile: UserProfile;
}

export const MyFarmView: React.FC<MyFarmViewProps> = ({ profile }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'details' | 'crops' | 'history' | 'activities' | 'ai'>('details');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t('myFarmHeader')}</span>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              Active parcel #48/2
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">📍 Kovilpatti Village, Tiruvallur District</p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('farmSize')}</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{profile.farmSizeAcres || 3.5} Acres</p>
          <span className="text-[11px] font-semibold text-blue-600 block">Drip Irrigated</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('currentCropsTab')}</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900">2 Crops</p>
          <span className="text-[11px] font-semibold text-emerald-600 block">Rice (2A), Tomato (1.5A)</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('farmHealth')}</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 flex items-center gap-1">
            <span>88%</span>
            <span className="text-xs font-bold text-slate-500">(Optimal)</span>
          </p>
          <span className="text-[11px] font-semibold text-slate-500 block">Low pest infestation</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Est. Harvest</span>
          <p className="text-xl sm:text-2xl font-black text-blue-700">₹4,85,000</p>
          <span className="text-[11px] font-semibold text-amber-600 block">Expected in 74 Days</span>
        </div>
      </div>

      {/* Farm Visualization Grid Diagram */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>{t('farmParcelLayout')}</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">3.5 Total Acres</span>
        </div>

        {/* Visual Parcel Plot Map */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900">Parcel A (2.0 Acres)</span>
              <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-full">🌾 Rice</span>
            </div>
            <div className="space-y-1 text-xs text-slate-600 font-medium">
              <p>Stage: Vegetative (Day 46)</p>
              <p>Health: <span className="font-bold text-emerald-700">91% Excellent</span></p>
              <p>Soil Moisture: 68% (Optimal)</p>
            </div>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full w-[65%]" />
            </div>
          </div>

          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900">Parcel B (1.0 Acre)</span>
              <span className="px-2 py-0.5 bg-amber-600 text-white font-bold text-[10px] rounded-full">🌱 Tomato</span>
            </div>
            <div className="space-y-1 text-xs text-slate-600 font-medium">
              <p>Stage: Flowering (Day 32)</p>
              <p>Health: <span className="font-bold text-amber-700">84% Good</span></p>
              <p>Soil Moisture: 54% (Irrigate Soon)</p>
            </div>
            <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-600 h-full w-[45%]" />
            </div>
          </div>

          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-900">Parcel C (0.5 Acre)</span>
              <span className="px-2 py-0.5 bg-blue-600 text-white font-bold text-[10px] rounded-full">🥜 Groundnut</span>
            </div>
            <div className="space-y-1 text-xs text-slate-600 font-medium">
              <p>Stage: Sowing Prep</p>
              <p>Health: <span className="font-bold text-blue-700">Soil Ready</span></p>
              <p>Soil pH: 6.8 (Ideal)</p>
            </div>
            <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[20%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
          {[
            { id: 'details', label: t('farmDetailsTab') },
            { id: 'crops', label: t('currentCropsTab') },
            { id: 'history', label: t('cropHistoryTab') },
            { id: 'activities', label: t('farmActivitiesTab') },
            { id: 'ai', label: t('aiRecommendationsTab') },
          ].map(tabItem => (
            <button
              key={tabItem.id}
              onClick={() => setActiveTab(tabItem.id as any)}
              className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tabItem.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 block mb-1">Land Owner</span>
                <p className="font-extrabold text-slate-900">{profile.name || 'Murugan Selvam'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-1">Survey Number</span>
                <p className="font-extrabold text-slate-900">TN-48/2-KOVILPATTI</p>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-1">Soil Category</span>
                <p className="font-extrabold text-slate-900">{profile.soilType || 'Red Loam Soil'}</p>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-1">Irrigation System</span>
                <p className="font-extrabold text-emerald-700">Drip Line + Underground Borewell</p>
              </div>
            </div>
          )}

          {activeTab === 'crops' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">🌾 Rice (CR 1009 Variety)</h4>
                  <p className="text-slate-500">2.0 Acres • Harvest in 74 days</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg">91% Health</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">🌱 Tomato (PKM 1 Variety)</h4>
                  <p className="text-slate-500">1.0 Acre • Harvest in 32 days</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg">84% Health</span>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span>Rabi 2025: Groundnut (1.5 Tons Harvested)</span>
                <span className="font-bold text-blue-600">₹1,12,000 Earned</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span>Kharif 2025: Paddy (3.2 Tons Harvested)</span>
                <span className="font-bold text-blue-600">₹2,40,000 Earned</span>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Yesterday: Bio-fertilizer application completed on Paddy.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3 days ago: Drip line flush and filter clean.</span>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-900 text-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AgriVeda AI Custom Recommendation</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Soil nitrogen levels in Parcel B (Tomato) are slightly depleted. Recommend adding 15kg/acre Urea during tomorrow morning's drip fertigation cycle.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
