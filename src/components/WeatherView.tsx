import React from 'react';
import { Sun, CloudRain, Wind, Droplets, AlertTriangle, ShieldAlert, TrendingUp, RefreshCw, MapPin } from 'lucide-react';
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
    <div className="space-y-5 pb-24 animate-in fade-in max-w-2xl mx-auto">

      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sun className="w-5 h-5 text-emerald-600" />
            <span>{t.weatherAlerts}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Live satellite &amp; device GPS agricultural weather forecast for <strong className="text-slate-800">{locationName}</strong>
          </p>
        </div>
        <button
          onClick={refreshWeather}
          disabled={loading}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200 active:scale-95 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh GPS</span>
        </button>
      </div>

      {/* Main Temperature Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 relative overflow-hidden">

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {locationName}
              </span>
              {isLiveLocation && (
                <span className="text-[10px] font-bold text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded-md border border-blue-700/50">
                  📍 Real-time Device GPS
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-3 mt-3">
              <h1 className="text-5xl font-extrabold tracking-tight text-white">{weather.temperature}°C</h1>
              <span className="text-sm font-semibold text-slate-300">{weather.condition}</span>
            </div>
          </div>

          <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Sun className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        {/* Atmospheric Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-800 text-center">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-2.5">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold uppercase">Humidity</span>
            </div>
            <p className="text-sm font-bold text-white">{weather.humidity}%</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-2.5">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <Wind className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold uppercase">Wind</span>
            </div>
            <p className="text-sm font-bold text-white">{weather.windSpeed} km/h</p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-2.5">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold uppercase">Rain Risk</span>
            </div>
            <p className="text-sm font-bold text-white">{weather.rainChance}%</p>
          </div>
        </div>

      </div>

      {/* Recharts 7-Day Temperature & Rainfall Trend Chart */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>7-Day Climate Pattern &amp; Rainfall Trend</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Visualizing temperature (°C) and precipitation (mm) to time irrigation &amp; pest spraying
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-amber-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              Temp (°C)
            </span>
            <span className="flex items-center gap-1 text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
              Rain (mm)
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#d97706', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                domain={[20, 40]}
                unit="°C"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#2563eb', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 35]}
                unit="mm"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '0.75rem',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                formatter={(value: any, name: any) => {
                  if (name === 'Temperature (°C)') return [`${value}°C`, name];
                  if (name === 'Rainfall (mm)') return [`${value} mm`, name];
                  return [value, name];
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 600 }}
              />
              <Bar
                yAxisId="right"
                dataKey="rainfall"
                name="Rainfall (mm)"
                fill="#60a5fa"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                name="Temperature (°C)"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: '#f97316', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#ea580c' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Insight note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="font-semibold text-[11px] leading-tight">
              <strong>Peak Rainfall Expected Sat (28mm):</strong> Delay heavy fertilizer spray until Sunday to avoid washout.
            </p>
          </div>
        </div>
      </div>

      {/* Smart Farming Alerts Section */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>Smart AI Agriculture Alerts</span>
        </h3>

        <div className="space-y-3">
          {weather.alerts.map((alertItem) => (
            <div
              key={alertItem.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${alertItem.severity === 'warning'
                  ? 'bg-amber-50/80 border-amber-200 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${alertItem.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'
                    }`} />
                  <h4 className="text-xs font-bold text-slate-900">{alertItem.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {alertItem.description}
                </p>
              </div>

              <button
                onClick={() => alert(`Action executed: ${alertItem.action}`)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shrink-0 transition-colors shadow-2xs"
              >
                {alertItem.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Full Weekly Forecast Grid */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>📅 7-Day Agricultural Weather Forecast</span>
          </h3>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Microclimate Synced
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
          {sevenDayForecast.map((fc, idx) => (
            <div
              key={`weather-fc-${idx}`}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-between transition-all ${
                idx === 0
                  ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div>
                <p className="text-[11px] font-black uppercase">{fc.day}</p>
                <p className="text-[9px] text-slate-400 font-mono">{fc.date}</p>
              </div>

              <div className="my-2 text-2xl">
                {fc.icon}
              </div>

              <div>
                <p className="text-xs font-black text-slate-900">{fc.tempMax}° <span className="text-[10px] text-slate-400 font-normal">/{fc.tempMin}°</span></p>
                <p className="text-[9px] text-emerald-700 font-semibold truncate max-w-[80px] mt-0.5">{fc.condition}</p>
              </div>

              <div className="mt-2 w-full pt-1.5 border-t border-slate-200/60 flex flex-col gap-1 items-center">
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                  🌧️ {fc.rainChance}%
                </span>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase ${
                  fc.sprayRisk === 'LOW' ? 'bg-emerald-100 text-emerald-800' : fc.sprayRisk === 'MODERATE' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {fc.sprayRisk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
