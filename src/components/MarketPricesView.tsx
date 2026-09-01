import React, { useState } from 'react';
import { TrendingUp, TrendingDown, MapPin, Sparkles, Search, ArrowUpRight } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MarketPricesViewProps {
  profile: UserProfile;
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({ profile }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Grains & Cereals', 'Vegetables', 'Pulses', 'Oilseeds', 'Spices'];

  const marketItems = [
    {
      id: '1',
      crop: 'Rice (Paddy)',
      market: 'Koyambedu APMC',
      location: 'Chennai, Tamil Nadu',
      price: 3200,
      unit: t('pricePerQuintal', 'per quintal'),
      trend: 4.2,
      isUp: true,
      category: 'Grains & Cereals',
      bestOpportunityMarket: 'Vellore Main Mandi',
      bestPrice: 3350
    },
    {
      id: '2',
      crop: 'Tomato (PKM 1)',
      market: 'Chennai Wholesale Market',
      location: 'Chennai, Tamil Nadu',
      price: 2850,
      unit: t('pricePerQuintal', 'per quintal'),
      trend: -2.1,
      isUp: false,
      category: 'Vegetables',
      bestOpportunityMarket: 'Kanchipuram APMC',
      bestPrice: 3100
    },
    {
      id: '3',
      crop: 'Groundnut (Pod)',
      market: 'Vellore Mandi',
      location: 'Vellore, Tamil Nadu',
      price: 6450,
      unit: t('pricePerQuintal', 'per quintal'),
      trend: 1.8,
      isUp: true,
      category: 'Oilseeds',
      bestOpportunityMarket: 'Tiruvannamalai APMC',
      bestPrice: 6600
    },
    {
      id: '4',
      crop: 'Sugarcane',
      market: 'Villupuram APMC',
      location: 'Villupuram, Tamil Nadu',
      price: 3150,
      unit: 'ton',
      trend: 0.5,
      isUp: true,
      category: 'Grains & Cereals',
      bestOpportunityMarket: 'Villupuram Cooperative',
      bestPrice: 3250
    },
    {
      id: '5',
      crop: 'Banana (Poovan)',
      market: 'Trichy Mandi',
      location: 'Tiruchirappalli, Tamil Nadu',
      price: 2400,
      unit: t('pricePerQuintal', 'per quintal'),
      trend: 3.5,
      isUp: true,
      category: 'Vegetables',
      bestOpportunityMarket: 'Madurai Central Market',
      bestPrice: 2600
    }
  ];

  const filteredItems = marketItems.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.market.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t('marketPricesHeader')}</span>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
              {t('liveMandiRates')}
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Real-time APMC agricultural prices across Tamil Nadu</p>
        </div>
      </div>

      {/* Best Market Opportunity Card */}
      <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl shadow-lg relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{t('bestMarketOpportunity')}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">Tomato Price Surge in Kanchipuram APMC</h3>
            <p className="text-xs text-blue-100 font-medium">
              Kanchipuram APMC is currently offering <span className="font-bold text-emerald-300">₹3,100 / quintal</span> (₹250 higher than local Chennai market). High festival demand.
            </p>
          </div>

          <button
            onClick={() => alert("Connecting with Kanchipuram APMC Mandi Trader...")}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <span>{t('exploreMarkets')}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchMarketPlaceholder')}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Market Prices Table / Cards */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">{item.crop}</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                  {item.category}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{item.market} ({item.location})</span>
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              <div className="text-left sm:text-right">
                <p className="text-xl font-black text-slate-900">₹{item.price.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-slate-400 font-semibold">{item.unit}</p>
              </div>

              <div className="text-right">
                <div className={`inline-flex items-center gap-1 font-black text-xs px-2.5 py-1 rounded-full ${
                  item.isUp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {item.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{item.isUp ? '+' : ''}{item.trend}%</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1 font-medium">Daily Change</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
