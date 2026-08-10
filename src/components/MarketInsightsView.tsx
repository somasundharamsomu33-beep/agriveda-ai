import React, { useState } from 'react';
import { TrendingUp, MapPin, Store, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MarketPriceItem, UserProfile } from '../types';
import { translations, sampleMarketPrices } from '../data/mockData';

interface MarketInsightsViewProps {
  profile: UserProfile;
}

export const MarketInsightsView: React.FC<MarketInsightsViewProps> = ({ profile }) => {
  const t = translations[profile.language] || translations.en;

  const [selectedCropId, setSelectedCropId] = useState('m-tomato');
  const marketItem = sampleMarketPrices.find(m => m.id === selectedCropId) || sampleMarketPrices[0];

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-2xl mx-auto">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>{t.marketInsights}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Live Mandi prices & AI harvest trading advice
          </p>
        </div>
      </div>

      {/* Commodity Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sampleMarketPrices.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedCropId(item.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCropId === item.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {item.cropName.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Main Price Card */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 space-y-4">
        
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">
              {marketItem.cropName} Price Today
            </span>
            <div className="flex items-baseline gap-2 mt-3">
              <h1 className="text-4xl font-extrabold text-white">
                ₹{marketItem.currentPrice}
                <span className="text-sm font-normal text-slate-400">/{marketItem.unit}</span>
              </h1>
              
              <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-md ${
                marketItem.priceChange >= 0 ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60' : 'bg-red-900/80 text-red-200 border border-red-700/60'
              }`}>
                {marketItem.priceChange >= 0 ? (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+₹{marketItem.priceChange} ({marketItem.percentageChange}%)</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                    <span>-₹{Math.abs(marketItem.priceChange)} ({marketItem.percentageChange}%)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Best Mandi</p>
            <p className="text-xs font-bold text-blue-400 flex items-center justify-end gap-1 mt-0.5">
              <Store className="w-3.5 h-3.5" /> {marketItem.bestMarket}
            </p>
          </div>
        </div>

        {/* 7-Day Price Trend Recharts */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/70">
          <p className="text-xs font-bold text-slate-300 mb-2">{t.viewPriceTrend} (7-Day Price History)</p>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketItem.priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Regional Mandi Comparison Table */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>Nearby Regional Market Comparison</span>
        </h3>

        <div className="space-y-2">
          {marketItem.regionalMarkets.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border flex items-center justify-between ${
                m.isBest
                  ? 'bg-blue-50/70 border-blue-200 font-bold text-slate-900 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">{m.marketName}</span>
                  {m.isBest && (
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-blue-600 text-white uppercase">
                      Best Price
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Distance: {m.distanceKm} km from farm
                </p>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-slate-900">
                  ₹{m.price}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">/{marketItem.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Harvest & Trading Advice Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>AgriVeda AI Market Recommendation</span>
        </h4>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {marketItem.aiAdvice}
        </p>
      </div>

    </div>
  );
};
