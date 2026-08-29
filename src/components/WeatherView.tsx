import React, { useEffect, useState } from 'react';
import { Sun, CloudRain, Wind, Droplets, AlertTriangle, ShieldAlert, TrendingUp } from 'lucide-react';
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
import { WeatherInfo, UserProfile } from '../types';
import { translations, sampleWeather } from '../data/mockData';

interface WeatherViewProps {
  profile: UserProfile;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ profile }) => {
  const t = translations[profile.language] || translations.en;

  // State for Open Meteo Data mapped to AgriVeda format
  const [weather, setWeather] = useState<WeatherInfo>(sampleWeather);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Hardcoded generic Indian coords or extract from profile? We'll provide default New Delhi coords
        const lat = 28.6139;
        const lon = 77.2090;

        const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        const data = await response.json();

        if (data.success) {
          // Map Python output to React UI required format
          const openMeteoWeather: WeatherInfo = {
            temperature: Math.round(data.current.temperature_2m),
            condition: data.current.rain > 0 ? "Rainy" : "Sunny & Clear",
            humidity: Math.round(data.current.relative_humidity_2m),
            windSpeed: 12, // Default or pull from open meteo if added later
            rainChance: data.current.rain > 0 ? 90 : 10,
            location: profile.location || "New Delhi",
            // 7 Day visual
            weeklyTrend: data.daily.map((d: any) => {
              const dt = new Date(d.date);
              const dayStr = dt.toLocaleDateString('en-US', { weekday: 'short' });
              return {
                day: dayStr,
                temp: Math.round(d.temperature_max),
                rainfall: d.rain_sum,
                humidity: 60 // placeholder 
              };
            }),
            // 5 Day forecast cards
            forecast: data.daily.slice(0, 5).map((d: any) => {
              const dt = new Date(d.date);
              return {
                day: dt.toLocaleDateString('en-US', { weekday: 'short' }),
                temp: Math.round(d.temperature_max),
                icon: d.rain_sum > 0 ? 'rain' : 'sun',
                condition: d.rain_sum > 0.5 ? 'Showers' : 'Clear Sky'
              };
            }),
            alerts: sampleWeather.alerts
          };
          setWeather(openMeteoWeather);
        }
      } catch (err) {
        console.error("Error fetching open meteo data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [profile.location]);

  const trendData = weather.weeklyTrend || [];

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-2xl mx-auto">

      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sun className="w-5 h-5 text-blue-600" />
            <span>{t.weatherAlerts}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Real-time agricultural weather forecasts & pest vector warnings for {profile.location}
          </p>
        </div>
      </div>

      {/* Main Temperature Card */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 relative overflow-hidden">

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-md">
              Today's Weather • {weather.location}
            </span>
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

      {/* 5-Day Forecast Grid */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
          5-Day Weather Forecast
        </h3>

        <div className="grid grid-cols-5 gap-2 text-center">
          {weather.forecast.map((fc, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border ${idx === 0
                  ? 'bg-blue-50/80 border-blue-600 text-blue-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
            >
              <p className="text-[11px] font-bold">{fc.day}</p>
              <div className="my-1 text-center">
                {fc.icon === 'sun' ? (
                  <Sun className="w-5 h-5 text-amber-500 mx-auto" />
                ) : (
                  <CloudRain className="w-5 h-5 text-blue-500 mx-auto" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-900">{fc.temp}°C</p>
              <p className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">{fc.condition}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
