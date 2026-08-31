import React from 'react';
import { Sun, CloudRain, Wind, Droplets, AlertTriangle, ShieldAlert, TrendingUp, RefreshCw, MapPin, ShieldCheck, Zap } from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { UserProfile } from '../types';
import { translations, sampleWeather } from '../data/mockData';
import { useLiveLocationWeather } from '../lib/liveLocationWeather';

interface WeatherViewProps {
  profile: UserProfile;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ profile }) => {
  const t = translations[profile.language] || translations.en;

  const {
    weather: liveWeather,
    sevenDayForecast,
    locationName,
    isLiveLocation,
    isLoading: loading,
    refresh: refreshWeather
  } = useLiveLocationWeather();

  const weather = liveWeather || sampleWeather;
  const trendData = weather.weeklyTrend || [];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in max-w-4xl mx-auto">

      {/* Title Header Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Sun className="w-6 h-6 text-emerald-700" />
            <span>7-Day Weather & Microclimate</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Live GPS agricultural weather advisory for <strong className="text-slate-800">{locationName || weather.location}</strong>
          </p>
        </div>

        <button
          onClick={refreshWeather}
          disabled={loading}
          className="px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-2 border border-emerald-300 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-700 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh GPS</span>
        </button>
      </div>

      {/* Main Temperature & Spray Safety Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-800 text-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {locationName}
              </span>
              {isLiveLocation && (
                <span className="text-[11px] font-extrabold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40">
                  📍 Real-time Device GPS
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-4 mt-4">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white">{weather.temperature}°C</h1>
              <div>
                <span className="text-base font-bold text-emerald-200 block">{weather.condition}</span>
                <span className="text-xs text-emerald-300/80 font-medium">High 34°C / Low 22°C</span>
              </div>
            </div>
          </div>

          {/* Spray Safety Badge */}
          <div className="bg-emerald-900/80 border border-emerald-700/60 p-4 rounded-2xl space-y-1 text-center self-start sm:self-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">Today's Spray Safety</span>
            <span className="text-sm font-black text-amber-300 block">
              7:00 AM - 9:30 AM (Safe)
            </span>
            <span className="text-[10px] text-emerald-200 font-medium block">Avoid Afternoon Spray</span>
          </div>
        </div>

        {/* Atmospheric Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-800/80 text-center">
          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-2xl p-3">
            <div className="flex items-center justify-center gap-1 text-emerald-300 mb-1">
              <Droplets className="w-4 h-4 text-sky-400" />
              <span className="text-[10px] font-black uppercase">Humidity</span>
            </div>
            <p className="text-lg font-black text-white">{weather.humidity}%</p>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-2xl p-3">
            <div className="flex items-center justify-center gap-1 text-emerald-300 mb-1">
              <Wind className="w-4 h-4 text-emerald-300" />
              <span className="text-[10px] font-black uppercase">Wind Speed</span>
            </div>
            <p className="text-lg font-black text-white">{weather.windSpeed} km/h</p>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-2xl p-3">
            <div className="flex items-center justify-center gap-1 text-emerald-300 mb-1">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <span className="text-[10px] font-black uppercase">Rain Risk</span>
            </div>
            <p className="text-lg font-black text-white">{weather.rainChance}%</p>
          </div>
        </div>

      </div>

      {/* Recharts 7-Day Climate Pattern Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
              <span>7-Day Temperature & Rainfall Forecast</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Plan irrigation and fertilizer sprays around daily precipitation patterns
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              Temp (°C)
            </span>
            <span className="flex items-center gap-1 text-sky-700">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
              Rain (mm)
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#d97706', fontWeight: 700 }} axisLine={false} tickLine={false} domain={[20, 40]} unit="°C" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#0284c7', fontWeight: 700 }} axisLine={false} tickLine={false} domain={[0, 35]} unit="mm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '1rem',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
              <Bar yAxisId="right" dataKey="rainfall" name="Rainfall (mm)" fill="#38bdf8" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Line yAxisId="left" type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="font-medium">
            <strong>Actionable Recommendation:</strong> Moderate rainfall expected on Saturday (28mm). <strong>Delay foliar fertilizer spray until Sunday</strong> to avoid chemical washout.
          </p>
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
          📅 Weekly Microclimate Calendar
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {sevenDayForecast.map((fc, idx) => (
            <div
              key={`fc-${idx}`}
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                idx === 0
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div>
                <p className="text-xs font-black uppercase">{fc.day}</p>
                <p className="text-[10px] text-slate-400 font-mono">{fc.date}</p>
              </div>

              <div className="my-2 text-2xl">{fc.icon}</div>

              <div>
                <p className="text-xs font-black text-slate-900">{fc.tempMax}° <span className="text-[10px] text-slate-400 font-normal">/{fc.tempMin}°</span></p>
                <p className="text-[10px] text-emerald-800 font-bold truncate max-w-[80px] mt-0.5">{fc.condition}</p>
              </div>

              <div className="mt-2 w-full pt-2 border-t border-slate-200/80 flex flex-col gap-1 items-center">
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  🌧️ {fc.rainChance}%
                </span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                  fc.sprayRisk === 'LOW' ? 'bg-emerald-100 text-emerald-800' : fc.sprayRisk === 'MODERATE' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'
                }`}>
                  {fc.sprayRisk} Risk
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
