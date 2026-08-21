import React, { useState } from 'react';
import { 
  TrendingUp, MapPin, Store, ArrowUpRight, ArrowDownRight, Sparkles, Building2, 
  Handshake, Users, ShoppingBasket, Filter, Search, Scale, ChevronRight, RefreshCw, 
  CheckCircle2, AlertCircle, ShieldCheck, Zap, DollarSign, Calendar, BarChart2, Tag
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { UserProfile, MarketPriceItem } from '../types';
import { sampleMarketPrices } from '../data/mockData';

interface CommonMarketDashboardProps {
  profile: UserProfile;
  onNavigateToMarketplace?: () => void;
}

// Expanded Universal Commodity Mandi Data (All Regions & Categories)
const universalMarketData: (MarketPriceItem & { category: string; state: string; minQty: string; tradeMode: 'B2B' | 'B2C' | 'Both' })[] = [
  {
    id: 'm-paddy-seeraga',
    cropName: 'Seeraga Samba Paddy Rice (A-Grade)',
    category: 'Grains & Millets',
    state: 'Tamil Nadu',
    currentPrice: 65,
    priceChange: 4.5,
    percentageChange: 7.4,
    unit: 'kg',
    bestMarket: 'Thanjavur Direct Procurement Center',
    minQty: '100 kg (B2B Bulk)',
    tradeMode: 'B2B',
    regionalMarkets: [
      { marketName: 'Thanjavur DPC', price: 68, distanceKm: 90, isBest: true },
      { marketName: 'Vellore Grain Mandi', price: 65, distanceKm: 8 },
      { marketName: 'Arani Rice Mill Hub', price: 66.5, distanceKm: 42 },
    ],
    priceHistory: [
      { date: '15 Aug', price: 58 },
      { date: '16 Aug', price: 59 },
      { date: '17 Aug', price: 60 },
      { date: '18 Aug', price: 62 },
      { date: '19 Aug', price: 63.5 },
      { date: '20 Aug', price: 64 },
      { date: '21 Aug', price: 65 },
    ],
    aiAdvice: '🔥 Strong export & festival demand. Moisture below 13% receives +₹3/kg bonus at Thanjavur Mandi. Recommended to release 60% stock now.'
  },
  {
    id: 'm-ragi-millet',
    cropName: 'Organic Ragi Finger Millet (Kezhvaragu)',
    category: 'Grains & Millets',
    state: 'Tamil Nadu & Karnataka',
    currentPrice: 42,
    priceChange: 3.0,
    percentageChange: 7.7,
    unit: 'kg',
    bestMarket: 'Salem Millet & Heritage Granary',
    minQty: '25 kg',
    tradeMode: 'Both',
    regionalMarkets: [
      { marketName: 'Salem Heritage Hub', price: 44, distanceKm: 120, isBest: true },
      { marketName: 'Vellore Organic Trust', price: 42, distanceKm: 12 },
      { marketName: 'Bangalore K.R. Market', price: 43.5, distanceKm: 210 },
    ],
    priceHistory: [
      { date: '15 Aug', price: 37 },
      { date: '16 Aug', price: 38 },
      { date: '17 Aug', price: 39 },
      { date: '18 Aug', price: 40 },
      { date: '19 Aug', price: 41 },
      { date: '20 Aug', price: 41.5 },
      { date: '21 Aug', price: 42 },
    ],
    aiAdvice: '🌱 Millets prices trending UP (+7.7%) supported by National Millet Mission procurement. Store in hermetic bags for top winter returns.'
  },
  {
    id: 'm-moong-dal',
    cropName: 'Moong Dal (Green Gram Pureline)',
    category: 'Pulses',
    state: 'Tamil Nadu & AP',
    currentPrice: 95,
    priceChange: 5.0,
    percentageChange: 5.5,
    unit: 'kg',
    bestMarket: 'Dharmapuri Pulses Trading Yard',
    minQty: '50 kg',
    tradeMode: 'B2B',
    regionalMarkets: [
      { marketName: 'Dharmapuri Yard', price: 98, distanceKm: 75, isBest: true },
      { marketName: 'Vellore Market', price: 95, distanceKm: 10 },
      { marketName: 'Chennai Wholesale Market', price: 97, distanceKm: 135 },
    ],
    priceHistory: [
      { date: '15 Aug', price: 88 },
      { date: '16 Aug', price: 90 },
      { date: '17 Aug', price: 91 },
      { date: '18 Aug', price: 92 },
      { date: '19 Aug', price: 93 },
      { date: '20 Aug', price: 94 },
      { date: '21 Aug', price: 95 },
    ],
    aiAdvice: '🫘 High demand from pulse processors. Clean, de-stoned lots command premium ₹98/kg rate.'
  },
  {
    id: 'm-tomato',
    cropName: 'Country Tomato (Nattu Thakkali)',
    category: 'Vegetables',
    state: 'Tamil Nadu',
    currentPrice: 28,
    priceChange: 4.0,
    percentageChange: 16.6,
    unit: 'kg',
    bestMarket: 'Vellore Main Wholesale Mandi',
    minQty: '5 kg',
    tradeMode: 'B2C',
    regionalMarkets: [
      { marketName: 'Vellore Main Mandi', price: 30, distanceKm: 8, isBest: true },
      { marketName: 'Chennai Koyambedu', price: 28, distanceKm: 135 },
      { marketName: 'Katpadi Local Farmers Market', price: 27, distanceKm: 4 },
    ],
    priceHistory: [
      { date: '15 Aug', price: 22 },
      { date: '16 Aug', price: 23 },
      { date: '17 Aug', price: 24 },
      { date: '18 Aug', price: 25 },
      { date: '19 Aug', price: 26 },
      { date: '20 Aug', price: 27 },
      { date: '21 Aug', price: 28 },
    ],
    aiAdvice: '🍅 Prices rose +16.6% due to rain disruption in neighboring supply routes. Harvest breaker stage fruits immediately for top returns.'
  },
  {
    id: 'm-chilli',
    cropName: 'Red Chilli (Guntur Teja Sun-Dried)',
    category: 'Spices',
    state: 'Andhra Pradesh',
    currentPrice: 185,
    priceChange: -6.0,
    percentageChange: -3.1,
    unit: 'kg',
    bestMarket: 'Guntur APMC Yard',
    minQty: '10 kg',
    tradeMode: 'Both',
    regionalMarkets: [
      { marketName: 'Guntur APMC Yard', price: 192, distanceKm: 380, isBest: true },
      { marketName: 'Vellore Market', price: 185, distanceKm: 10 },
      { marketName: 'Chennai Spice Exchange', price: 188, distanceKm: 130 },
    ],
    priceHistory: [
      { date: '15 Aug', price: 195 },
      { date: '16 Aug', price: 192 },
      { date: '17 Aug', price: 190 },
      { date: '18 Aug', price: 188 },
      { date: '19 Aug', price: 187 },
      { date: '20 Aug', price: 186 },
      { date: '21 Aug', price: 185 },
    ],
    aiAdvice: '🌶️ Temporary price dip due to heavy arrival at Guntur. Expected to recover by 10-15% next month. Hold cold storage stocks.'
  },
  {
    id: 'm-cotton',
    cropName: 'Cotton (Long Staple Fiber)',
    category: 'Spices',
    state: 'Tamil Nadu',
    currentPrice: 62,
    priceChange: 3.0,
    percentageChange: 5.0,
    unit: 'kg',
    bestMarket: 'Coimbatore Textile Mill Market',
    minQty: '100 kg (B2B)',
    tradeMode: 'B2B',
    regionalMarkets: [
      { marketName: 'Coimbatore Market', price: 64, distanceKm: 280, isBest: true },
      { marketName: 'Vellore Co-op', price: 62, distanceKm: 15 },
    ],
    priceHistory: [
      { date: '15 Aug', price: 58 },
      { date: '16 Aug', price: 59 },
      { date: '17 Aug', price: 59 },
      { date: '18 Aug', price: 60 },
      { date: '19 Aug', price: 61 },
      { date: '20 Aug', price: 61.5 },
      { date: '21 Aug', price: 62 },
    ],
    aiAdvice: '🧵 Textile mills buying actively. Ensure lint is free of leaf trash for Grade-A pricing bonus.'
  }
];

export const CommonMarketDashboard: React.FC<CommonMarketDashboardProps> = ({ profile, onNavigateToMarketplace }) => {
  const [selectedCropId, setSelectedCropId] = useState('m-paddy-seeraga');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');

  const selectedItem = universalMarketData.find(item => item.id === selectedCropId) || universalMarketData[0];

  const filteredItems = universalMarketData.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchQuery = item.cropName.toLowerCase().includes(searchFilter.toLowerCase()) || item.bestMarket.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in max-w-6xl mx-auto">
      
      {/* Universal Dashboard Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-2xl overflow-hidden relative border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-emerald-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">Universal Common Market Dashboard</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Mandi + B2B + B2C
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">For Farmers, Wholesale Vendors, B2B Traders, and Retail Buyers across India</p>
            </div>
          </div>

          {onNavigateToMarketplace && (
            <button
              onClick={onNavigateToMarketplace}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Store className="w-4 h-4" />
              <span>Open B2B/B2C Marketplace</span>
            </button>
          )}
        </div>

        {/* Live Mandi Ticker Bar */}
        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-4 text-xs">
          <span className="text-[11px] font-black uppercase text-emerald-400 shrink-0 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Mandi Ticker:
          </span>

          <div className="flex items-center gap-6 whitespace-nowrap">
            {universalMarketData.map(item => (
              <div key={item.id} className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedCropId(item.id)}>
                <span className="font-bold text-slate-200">{item.cropName.split(' ')[0]}</span>
                <span className="font-black text-amber-400">₹{item.currentPrice}/{item.unit}</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                  item.priceChange >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {item.priceChange >= 0 ? '▲' : '▼'} {Math.abs(item.percentageChange)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Selected Commodity Deep Dive */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-6">
        
        {/* Commodity Selector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {universalMarketData.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedCropId(item.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border ${
                  selectedCropId === item.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md scale-105'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {item.cropName.split(' (')[0]}
              </button>
            ))}
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Best Mandi Sourcing Hub</span>
            <span className="text-xs font-black text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
              <Store className="w-3.5 h-3.5" /> {selectedItem.bestMarket}
            </span>
          </div>
        </div>

        {/* Selected Commodity Metrics & Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Price Metrics Left */}
          <div className="space-y-4 lg:col-span-1">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-emerald-300 px-3 py-1 rounded-md border border-slate-700 inline-block">
                {selectedItem.category} • {selectedItem.state}
              </span>
              <h2 className="text-xl font-black text-white">{selectedItem.cropName}</h2>
            </div>

            <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Current Market Rate</span>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-black text-amber-400">
                  ₹{selectedItem.currentPrice}
                  <span className="text-sm font-medium text-slate-400">/{selectedItem.unit}</span>
                </h3>

                <div className={`flex items-center gap-0.5 text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
                  selectedItem.priceChange >= 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}>
                  {selectedItem.priceChange >= 0 ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
                  <span>{selectedItem.priceChange >= 0 ? '+' : ''}₹{selectedItem.priceChange} ({selectedItem.percentageChange}%)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trade Mode</span>
                <p className="font-extrabold text-emerald-300">{selectedItem.tradeMode} Exchange</p>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Min Order (MOQ)</span>
                <p className="font-extrabold text-amber-300">{selectedItem.minQty}</p>
              </div>
            </div>

            {/* Groq AI Market Advisory Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/90 to-slate-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black">
                <Sparkles className="w-4 h-4" />
                <span>Groq AI Harvest &amp; Procurement Advice</span>
              </div>
              <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                {selectedItem.aiAdvice}
              </p>
            </div>
          </div>

          {/* 7-Day Price Recharts Chart Right */}
          <div className="lg:col-span-2 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>7-Day Price History Trajectory</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-bold">Updated Today</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedItem.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11, fontWeight: 700 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    name="Mandi Price (₹)"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#34d399', r: 5, strokeWidth: 2, stroke: '#064e3b' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Regional Mandi Comparison Matrix */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Regional Mandi Rate Comparison Matrix ({selectedItem.cropName.split(' ')[0]})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {selectedItem.regionalMarkets.map((m, idx) => (
              <div key={idx} className={`p-3.5 rounded-2xl border transition-all ${
                m.isBest
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-slate-200">{m.marketName}</span>
                  {m.isBest && (
                    <span className="text-[9px] font-black uppercase bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                      ★ Top Mandi Rate
                    </span>
                  )}
                </div>
                <p className="text-xl font-black text-amber-400">₹{m.price} <span className="text-xs font-normal text-slate-400">/{selectedItem.unit}</span></p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> Distance: {m.distanceKm} km from your location
                </p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Commodity Exchange Grid Across Categories */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              <span>Universal Mandi Exchange Matrix</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Compare prices, trend directions, and order requirements across major crop categories</p>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search commodity or mandi..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Grains & Millets', 'Pulses', 'Vegetables', 'Spices'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table View for Commodities */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-black uppercase text-[10px]">
                <th className="p-3">Commodity &amp; State</th>
                <th className="p-3">Category</th>
                <th className="p-3">Live Rate</th>
                <th className="p-3">7-Day Trend</th>
                <th className="p-3">Best Mandi Hub</th>
                <th className="p-3">Trade Mode</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900">
                    <p>{item.cropName}</p>
                    <span className="text-[10px] font-normal text-slate-500">{item.state}</span>
                  </td>
                  <td className="p-3 font-semibold text-slate-600">{item.category}</td>
                  <td className="p-3 font-black text-slate-900 text-sm">₹{item.currentPrice}/{item.unit}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold inline-flex items-center gap-0.5 ${
                      item.priceChange >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.priceChange >= 0 ? '▲ +' : '▼ '}{item.percentageChange}%
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-700">{item.bestMarket}</td>
                  <td className="p-3 font-bold text-slate-700">{item.tradeMode}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedCropId(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white font-bold text-[11px] transition-all"
                    >
                      Inspect Rate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
