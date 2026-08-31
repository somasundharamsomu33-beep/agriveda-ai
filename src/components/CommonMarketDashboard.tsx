import React, { useState } from 'react';
import { 
  TrendingUp, MapPin, Store, ArrowUpRight, ArrowDownRight, Sparkles, Building2, 
  Handshake, Users, ShoppingBasket, Filter, Search, Scale, ChevronRight, RefreshCw, 
  CheckCircle2, AlertCircle, ShieldCheck, Zap, DollarSign, Calendar, BarChart2, Tag, ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { UserProfile, MarketPriceItem } from '../types';

interface CommonMarketDashboardProps {
  profile: UserProfile;
  onNavigateToMarketplace?: () => void;
}

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
    aiAdvice: '🌶️ Slight price dip due to fresh Guntur arrivals. Hold high-grade sun-dried chilli for 2 weeks until festival trading picks up.'
  }
];

export const CommonMarketDashboard: React.FC<CommonMarketDashboardProps> = ({
  profile,
  onNavigateToMarketplace
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<typeof universalMarketData[0]>(universalMarketData[3]);

  const categories = ['All', 'Grains & Millets', 'Pulses', 'Vegetables', 'Spices'];

  const filteredItems = universalMarketData.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) || item.bestMarket.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in max-w-4xl mx-auto">

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-700" />
            <span>Market Prices • Mandi Quotes</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Live commodity prices, regional Mandi comparisons, and AI sell-timing recommendations.
          </p>
        </div>

        {onNavigateToMarketplace && (
          <button
            onClick={onNavigateToMarketplace}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl shadow-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            <ShoppingBasket className="w-4 h-4" />
            <span>Go to Agri Marketplace →</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search crop name (Tomato, Rice, Millet, Chilli)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:border-emerald-600 outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Crop Cards + Selected Crop Market Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 📋 Crop Cards Listing (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredItems.map(item => {
            const isSelected = selectedCrop.id === item.id;
            const isPositive = item.percentageChange >= 0;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedCrop(item)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                  isSelected ? 'bg-emerald-900 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/20' : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-emerald-800 text-emerald-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.category}
                    </span>
                    <h3 className="text-sm font-black mt-1">{item.cropName}</h3>
                    <p className={`text-[11px] font-medium mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                      📍 Best: {item.bestMarket}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black block">₹{item.currentPrice} <span className="text-[10px] font-normal">/{item.unit}</span></span>
                    <span className={`text-[11px] font-black inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
                      isPositive
                        ? (isSelected ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800')
                        : (isSelected ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-800')
                    }`}>
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{item.percentageChange}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 📈 Selected Crop Detail & Mandi Price Comparison (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full">
                  {selectedCrop.state} • Mandi Rate
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">{selectedCrop.cropName}</h3>
                <p className="text-xs text-slate-500 font-medium">Minimum Trade Qty: {selectedCrop.minQty}</p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">₹{selectedCrop.currentPrice} <span className="text-xs text-slate-400 font-normal">/{selectedCrop.unit}</span></span>
                <span className="text-xs text-emerald-700 font-extrabold block">7-Day Trend: +{selectedCrop.percentageChange}%</span>
              </div>
            </div>

            {/* AI Sell Timing Advisory */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI Mandi Sell Timing Recommendation</span>
              </span>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {selectedCrop.aiAdvice}
              </p>
            </div>

            {/* Regional Mandi Comparison Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Regional Mandi Price Comparison</h4>
              <div className="space-y-2">
                {selectedCrop.regionalMarkets.map((m, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                    m.isBest ? 'bg-emerald-50 border-emerald-300 font-extrabold' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div>
                      <span className="font-bold text-slate-900">{m.marketName}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">Distance: {m.distanceKm} km away</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900">₹{m.price} /{selectedCrop.unit}</span>
                      {m.isBest && (
                        <span className="text-[10px] bg-emerald-700 text-white font-black px-2 py-0.5 rounded-full">
                          Best Return
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Price History Chart */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">7-Day Mandi Price Trend (₹/kg)</h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedCrop.priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#15803d', fontWeight: 700 }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="price" stroke="#15803d" strokeWidth={3} dot={{ fill: '#15803d', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
