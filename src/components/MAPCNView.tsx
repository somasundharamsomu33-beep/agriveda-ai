import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, MapPin, Store, Building2, Search, Filter,
  Phone, Bell, ArrowRight, ShieldCheck, Sparkles, Navigation, CheckCircle2,
  Calendar, Layers, Activity, Truck, AlertCircle, Share2, DollarSign,
  BarChart3, Clock, Compass, HelpCircle, X, ChevronRight
} from 'lucide-react';
import { UserProfile, MAPCNCommodityItem, MAPCNMandiCenter, MAPCNTrader, MAPCNPriceAlert, ActiveTab } from '../types';
import { sampleMAPCNItems, sampleMAPCNMandiCenters, sampleMAPCNTraders, translations } from '../data/mockData';

interface MAPCNViewProps {
  profile: UserProfile;
  setActiveTab: (tab: ActiveTab) => void;
  onAskAssistantWithCommodity?: (cropName: string) => void;
}

export const MAPCNView: React.FC<MAPCNViewProps> = ({
  profile,
  setActiveTab,
  onAskAssistantWithCommodity
}) => {
  const t = translations[profile.language] || translations.en;
  
  // State
  const [activeSubTab, setActiveSubTab] = useState<'commodities' | 'mandis' | 'compare' | 'traders' | 'alerts'>('commodities');
  const [commodities, setCommodities] = useState<MAPCNCommodityItem[]>(sampleMAPCNItems);
  const [mandiCenters, setMandiCenters] = useState<MAPCNMandiCenter[]>(sampleMAPCNMandiCenters);
  const [traders, setTraders] = useState<MAPCNTrader[]>(sampleMAPCNTraders);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMandiFilter, setSelectedMandiFilter] = useState<string>('All');
  const [selectedCommodityForCompare, setSelectedCommodityForCompare] = useState<string>('Tomato');
  
  // Modals
  const [selectedCommodityForAlert, setSelectedCommodityForAlert] = useState<MAPCNCommodityItem | null>(null);
  const [targetAlertPrice, setTargetAlertPrice] = useState<number>(3800);
  const [alertSuccessMsg, setAlertSuccessMsg] = useState<string>('');
  const [activeAlerts, setActiveAlerts] = useState<MAPCNPriceAlert[]>([
    {
      id: 'alt-1',
      userId: profile.id || 'user-1',
      cropName: 'Tomato',
      targetPricePerQuintal: 3600,
      alertCondition: 'ABOVE',
      preferredMandiName: 'Vellore Central APMC Yard',
      isActive: true,
      createdAt: 'Today, 08:30 AM'
    },
    {
      id: 'alt-2',
      userId: profile.id || 'user-1',
      cropName: 'Red Chilli',
      targetPricePerQuintal: 19500,
      alertCondition: 'ABOVE',
      preferredMandiName: 'Guntur Mirchi Yard',
      isActive: true,
      createdAt: 'Yesterday'
    }
  ]);

  const categories = ['All', 'Vegetables', 'Grains & Cereals', 'Spices', 'Commercial'];

  // Filtered commodities
  const filteredCommodities = commodities.filter((item) => {
    const matchesSearch = item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.mandiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesMandi = selectedMandiFilter === 'All' || item.mandiId === selectedMandiFilter;
    return matchesSearch && matchesCat && matchesMandi;
  });

  // Handle setting price alert
  const handleSavePriceAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommodityForAlert) return;

    const newAlert: MAPCNPriceAlert = {
      id: `alt-${Date.now()}`,
      userId: profile.id || 'user-1',
      cropName: selectedCommodityForAlert.cropName,
      targetPricePerQuintal: targetAlertPrice,
      alertCondition: 'ABOVE',
      preferredMandiName: selectedCommodityForAlert.mandiName,
      isActive: true,
      createdAt: 'Just now'
    };

    setActiveAlerts([newAlert, ...activeAlerts]);
    setAlertSuccessMsg(`Alert active! We'll notify you on SMS & App when ${selectedCommodityForAlert.cropName} reaches ₹${targetAlertPrice}/qtl.`);
    setTimeout(() => {
      setSelectedCommodityForAlert(null);
      setAlertSuccessMsg('');
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in max-w-7xl mx-auto">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 shadow-2xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>MAPCN Live APMC Market Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Mandi & APMC Price Commodity Network
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Real-time commodity arrivals, transparent modal auction rates, regional mandi arbitrage, and direct connections with licensed APMC traders.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Active Mandis</span>
              <span className="text-lg font-black text-emerald-400">6 APMCs</span>
            </div>
            <div className="text-center px-2 border-l border-white/10">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Live Arrivals</span>
              <span className="text-lg font-black text-blue-400">605.4 T</span>
            </div>
            <div className="text-center px-2 border-l border-white/10">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Top Gainer</span>
              <span className="text-lg font-black text-amber-400">+14.5%</span>
            </div>
            <div className="text-center px-2 border-l border-white/10">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">e-NAM Nodes</span>
              <span className="text-lg font-black text-purple-400">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: 'commodities', label: 'Live Commodity Feed', icon: TrendingUp },
          { id: 'mandis', label: 'APMC Mandi Locator', icon: MapPin },
          { id: 'compare', label: 'Mandi Comparison & Arbitrage', icon: BarChart3 },
          { id: 'traders', label: 'Verified APMC Traders', icon: Store },
          { id: 'alerts', label: `My Price Alerts (${activeAlerts.length})`, icon: Bell }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------------ */}
      {/* SUB-TAB 1: LIVE COMMODITY FEED */}
      {/* ------------------------------------------------------------------------ */}
      {activeSubTab === 'commodities' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search commodity (e.g. Tomato, Paddy, Chilli) or Mandi..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Commodity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCommodities.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Image Banner with Badges */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Trend Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[11px] font-bold border border-white/10">
                      {item.trendDirection === 'UP' ? (
                        <>
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">+{item.trendPercentage}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                          <span className="text-rose-400">-{item.trendPercentage}%</span>
                        </>
                      )}
                    </div>

                    {/* Distance Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[11px] font-bold">
                      <MapPin className="w-3 h-3" />
                      <span>{item.distanceKm} km away</span>
                    </div>

                    {/* Commodity Title Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
                        {item.category} • {item.grade}
                      </span>
                      <h3 className="text-lg font-black leading-tight truncate">
                        {item.cropName}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium truncate">
                        {item.variety}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Breakdown Section */}
                  <div className="p-5 space-y-4">
                    {/* Mandi Yard Info */}
                    <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold truncate">
                        <Store className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{item.mandiName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200/60 shrink-0">
                        {item.priceDate}
                      </span>
                    </div>

                    {/* Price Rates Card */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Min Rate</span>
                        <span className="text-xs font-bold text-slate-700">₹{item.minPricePerQuintal}/q</span>
                        <span className="text-[10px] text-slate-400 block">₹{(item.minPricePerQuintal / 100).toFixed(1)}/kg</span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-blue-600 block">Modal Rate</span>
                        <span className="text-sm font-black text-slate-900">₹{item.modalPricePerQuintal}/q</span>
                        <span className="text-[10px] font-bold text-blue-600 block">₹{(item.modalPricePerQuintal / 100).toFixed(1)}/kg</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Max Rate</span>
                        <span className="text-xs font-bold text-slate-700">₹{item.maxPricePerQuintal}/q</span>
                        <span className="text-[10px] text-slate-400 block">₹{(item.maxPricePerQuintal / 100).toFixed(1)}/kg</span>
                      </div>
                    </div>

                    {/* Arrival Volume & MSP Comparison */}
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>Daily Arrival: <strong className="text-slate-900">{item.arrivalVolumeMetricTons} MT</strong></span>
                      </div>
                      {item.mspPricePerQuintal && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>MSP: ₹{item.mspPricePerQuintal}/q</span>
                        </div>
                      )}
                    </div>

                    {/* AI Market Outlook Box */}
                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-950 font-medium flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p className="leading-snug">
                        <strong className="font-bold text-blue-900">AI Outlook: </strong>
                        {item.aiMarketOutlook}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCommodityForAlert(item)}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                  >
                    <Bell className="w-3.5 h-3.5 text-slate-600" />
                    <span>Set Alert</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onAskAssistantWithCommodity) {
                        onAskAssistantWithCommodity(item.cropName);
                      } else {
                        setActiveTab('assistant');
                      }
                    }}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>Ask AI Price</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------ */}
      {/* SUB-TAB 2: APMC MANDI LOCATOR */}
      {/* ------------------------------------------------------------------------ */}
      {activeSubTab === 'mandis' && (
        <div className="space-y-5">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Regional APMC Regulated Markets Directory</h2>
              <p className="text-xs text-slate-500 font-medium">Equipped with electronic weighing bridges, cold storage and e-NAM online auction bidding</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-white rounded-lg border border-slate-200 text-blue-700 shrink-0">
              {mandiCenters.length} APMC Centers Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mandiCenters.map((mandi) => (
              <div
                key={mandi.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-400 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                        {mandi.marketCode}
                      </span>
                      {mandi.isEnamConnected && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> e-NAM Integrated
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {mandi.name}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 block">
                      {mandi.distanceKm} km away
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{mandi.locationAddress}</span>
                </p>

                {/* Mandi Features Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] font-bold text-slate-700 text-center">
                  <div className={`p-2 rounded-lg ${mandi.coldStorageAvailable ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' : 'bg-slate-50 text-slate-400'}`}>
                    Cold Storage {mandi.coldStorageAvailable ? '✓' : '✗'}
                  </div>
                  <div className={`p-2 rounded-lg ${mandi.weighbridgeAvailable ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' : 'bg-slate-50 text-slate-400'}`}>
                    Weighbridge {mandi.weighbridgeAvailable ? '✓' : '✗'}
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/60 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>06:00 - 18:00</span>
                  </div>
                </div>

                {/* Contact & Navigation */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <div className="text-xs font-medium text-slate-500 truncate">
                    <span>Officer: <strong className="text-slate-800">{mandi.secretaryName}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${mandi.contactPhone}`}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <span className="hidden sm:inline">Call Mandi</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${mandi.latitude},${mandi.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------ */}
      {/* SUB-TAB 3: MANDI ARBITRAGE & COMPARISON */}
      {/* ------------------------------------------------------------------------ */}
      {activeSubTab === 'compare' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Regional Price Arbitrage Analyzer</h2>
                <p className="text-xs text-slate-500 font-medium">Compare auction rates across neighboring APMC yards to choose where to dispatch produce for maximum profit</p>
              </div>

              {/* Commodity Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Select Crop:</span>
                <select
                  value={selectedCommodityForCompare}
                  onChange={(e) => setSelectedCommodityForCompare(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-600"
                >
                  <option value="Tomato">Tomato (Grade A)</option>
                  <option value="Paddy / Rice">Paddy (Samba Mahsuri)</option>
                  <option value="Red Chilli">Red Chilli (Guntur Teja)</option>
                  <option value="Cotton">Cotton (Long Staple)</option>
                  <option value="Turmeric">Turmeric (Finger)</option>
                </select>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3 rounded-l-xl">APMC Mandi Yard</th>
                    <th className="p-3">Distance</th>
                    <th className="p-3">Modal Price / Quintal</th>
                    <th className="p-3">Modal Price / Kg</th>
                    <th className="p-3">Est. Transport Cost / Qtl</th>
                    <th className="p-3">Net Realization</th>
                    <th className="p-3 rounded-r-xl text-center">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr className="bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span>Vellore Central APMC Yard</span>
                    </td>
                    <td className="p-3">4.8 km</td>
                    <td className="p-3 font-black text-slate-900">₹3,500/q</td>
                    <td className="p-3 font-bold text-emerald-700">₹35.00/kg</td>
                    <td className="p-3 text-slate-500">₹25/q</td>
                    <td className="p-3 font-bold text-emerald-800">₹3,475/q (Net ₹34.75/kg)</td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-bold text-[10px]">
                        ★ Best Net Profit
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <Store className="w-4 h-4 text-slate-400" />
                      <span>Chennai Koyambedu KWMC</span>
                    </td>
                    <td className="p-3">135 km</td>
                    <td className="p-3 font-bold text-slate-900">₹3,600/q</td>
                    <td className="p-3 font-bold text-slate-800">₹36.00/kg</td>
                    <td className="p-3 text-slate-500">₹180/q</td>
                    <td className="p-3 font-medium text-slate-700">₹3,420/q (Net ₹34.20/kg)</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                        Secondary Hub
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <Store className="w-4 h-4 text-slate-400" />
                      <span>Bangalore K.R. Market</span>
                    </td>
                    <td className="p-3">210 km</td>
                    <td className="p-3 font-bold text-slate-900">₹3,550/q</td>
                    <td className="p-3 font-bold text-slate-800">₹35.50/kg</td>
                    <td className="p-3 text-slate-500">₹240/q</td>
                    <td className="p-3 font-medium text-slate-700">₹3,310/q (Net ₹33.10/kg)</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                        High Freight
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200/70 text-xs text-emerald-900 font-medium flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p>
                <strong>Arbitrage Insight:</strong> Even though Chennai Koyambedu offers ₹3,600/q (₹100 higher than Vellore), the local transport freight of ₹180/q makes <strong>Vellore Central APMC Yard</strong> more profitable by ₹55 per quintal net in farmer’s hand.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------ */}
      {/* SUB-TAB 4: VERIFIED APMC TRADERS */}
      {/* ------------------------------------------------------------------------ */}
      {activeSubTab === 'traders' && (
        <div className="space-y-5">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Licensed APMC Commission Agents & Bulk Traders</h2>
              <p className="text-xs text-slate-500 font-medium">Direct contact with verified buyers for prompt payment and immediate harvest liquidation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {traders.map((trader) => (
              <div
                key={trader.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> APMC Licensed
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{trader.businessName}</h3>
                      <p className="text-xs text-slate-500 font-medium">Rep: {trader.traderName}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      ★ {trader.rating}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    📍 {trader.shopNumber}, {trader.mandiName}
                  </p>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Commodities Traded</span>
                    <div className="flex flex-wrap gap-1">
                      {trader.commoditiesTraded.map((crop) => (
                        <span key={crop} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">{trader.apmcLicenseNumber}</span>
                  <a
                    href={`tel:${trader.contactPhone}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Trader</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------ */}
      {/* SUB-TAB 5: MY PRICE ALERTS */}
      {/* ------------------------------------------------------------------------ */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-5 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>My Active Mandi Price Triggers</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">Get instant SMS and WhatsApp notifications when crop rates hit your target</p>
              </div>
            </div>

            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{alert.cropName}</h4>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Target: ₹{alert.targetPricePerQuintal}/qtl
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Mandi: {alert.preferredMandiName} • Created {alert.createdAt}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold shrink-0">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------ */}
      {/* PRICE ALERT CREATION MODAL */}
      {/* ------------------------------------------------------------------------ */}
      {selectedCommodityForAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 relative">
            <button
              onClick={() => setSelectedCommodityForAlert(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Set Mandi Price Trigger</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedCommodityForAlert.cropName} ({selectedCommodityForAlert.variety})</p>
              </div>
            </div>

            {alertSuccessMsg ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs font-bold text-emerald-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>{alertSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSavePriceAlert} className="space-y-4 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between">
                  <span className="text-slate-500">Current Modal Rate:</span>
                  <span className="font-bold text-slate-900">₹{selectedCommodityForAlert.modalPricePerQuintal}/q (₹{(selectedCommodityForAlert.modalPricePerQuintal / 100).toFixed(1)}/kg)</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Notify me when rate reaches (₹ per Quintal):
                  </label>
                  <input
                    type="number"
                    value={targetAlertPrice}
                    onChange={(e) => setTargetAlertPrice(Number(e.target.value))}
                    required
                    min={100}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-blue-600"
                  />
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Equivalent to ₹{(targetAlertPrice / 100).toFixed(1)} per kg
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Target Mandi Yard:
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedCommodityForAlert.mandiName}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Activate Price Alert Trigger
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
