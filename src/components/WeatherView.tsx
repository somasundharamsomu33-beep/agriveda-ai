import React from 'react';
import { CloudSun, CloudRain, Wind, Droplets, Thermometer, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface WeatherViewProps {
  profile: UserProfile;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ profile }) => {
  const { t } = useLanguage();

  const forecast = [
    { day: 'Today', temp: 29, condition: t('partlyCloudy', 'Partly Cloudy'), rainChance: 40, wind: '14 km/h' },
    { day: 'Tomorrow', temp: 31, condition: 'Moderate Rain', rainChance: 75, wind: '18 km/h' },
    { day: 'Thursday', temp: 28, condition: 'Clear Sky', rainChance: 10, wind: '10 km/h' },
    { day: 'Friday', temp: 30, condition: 'Sunny', rainChance: 5, wind: '12 km/h' },
    { day: 'Saturday', temp: 32, condition: t('partlyCloudy', 'Partly Cloudy'), rainChance: 20, wind: '15 km/h' },
  ];

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-blue-600" />
            <span>{t('weatherHeader')}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">📍 {profile.location || 'Kovilpatti, Tiruvallur District'}</p>
        </div>
      </div>

      {/* Main Weather Hero Card */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-700 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">{t('todaysWeather')}</span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-white">29°C</span>
              <span className="text-lg font-bold text-blue-200">{t('partlyCloudy')}</span>
            </div>
            <p className="text-xs text-blue-200 font-medium">Feels like 32°C • Tiruvallur Agriculture Region</p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center space-y-1 shrink-0">
            <CloudRain className="w-8 h-8 text-amber-300 mx-auto" />
            <span className="text-xs font-black text-white block">{t('rainProbability')}</span>
            <span className="text-lg font-black text-amber-300 block">40%</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-center space-y-1">
            <Droplets className="w-4 h-4 text-blue-300 mx-auto" />
            <span className="text-[10px] text-blue-200 uppercase font-bold block">{t('humidity')}</span>
            <span className="text-sm font-black text-white block">68%</span>
          </div>

          <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-center space-y-1">
            <Wind className="w-4 h-4 text-blue-300 mx-auto" />
            <span className="text-[10px] text-blue-200 uppercase font-bold block">{t('windSpeed')}</span>
            <span className="text-sm font-black text-white block">14 km/h</span>
          </div>

          <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-center space-y-1">
            <Thermometer className="w-4 h-4 text-blue-300 mx-auto" />
            <span className="text-[10px] text-blue-200 uppercase font-bold block">{t('uvIndex')}</span>
            <span className="text-sm font-black text-white block">Moderate (5)</span>
          </div>
        </div>

        {/* Smart Farming Recommendation Banner */}
        <div className="p-4 bg-amber-400 text-slate-950 rounded-2xl font-bold text-xs space-y-1 shadow-md">
          <div className="flex items-center gap-1.5 font-black uppercase text-[11px]">
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{t('farmingRecommendationTitle')}</span>
          </div>
          <p className="text-xs font-semibold leading-relaxed">
            {t('weatherRecommendation')}
          </p>
        </div>
      </div>

      {/* 5-Day Agricultural Forecast */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900">{t('outlookTitle')}</h3>

        <div className="space-y-2">
          {forecast.map((f, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-800"
            >
              <div className="flex items-center gap-3 w-32">
                <span className="font-extrabold">{f.day}</span>
                <span className="text-slate-500 text-[11px]">{f.condition}</span>
              </div>

              <div className="flex items-center gap-6">
                <span className="font-bold text-blue-700">Rain: {f.rainChance}%</span>
                <span className="font-bold text-slate-500">{f.wind}</span>
                <span className="font-black text-slate-900 text-sm">{f.temp}°C</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
