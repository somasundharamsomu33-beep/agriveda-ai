import React, { useState } from 'react';
import { 
  Sprout, Search, Filter, ShieldCheck, Thermometer, Droplets, Wind, Phone, 
  MapPin, Plus, ArrowRightLeft, Sparkles, AlertCircle, CheckCircle2, ChevronRight, BookOpen, Layers
} from 'lucide-react';
import { UserProfile, SeedBankItem, ActiveTab, Language } from '../types';
import { sampleSeedBankItems, translations } from '../data/mockData';

interface SeedBankViewProps {
  profile: UserProfile;
  setActiveTab: (tab: ActiveTab) => void;
  onAskAssistantWithSeed?: (seedName: string) => void;
}

export const SeedBankView: React.FC<SeedBankViewProps> = ({
  profile,
  setActiveTab,
  onAskAssistantWithSeed
}) => {
  const t = translations[profile.language] || translations.en;
  const [seeds, setSeeds] = useState<SeedBankItem[]>(sampleSeedBankItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('All');
  const [showHeritageOnly, setShowHeritageOnly] = useState<boolean>(false);
  const [selectedSeedForExchange, setSelectedSeedForExchange] = useState<SeedBankItem | null>(null);
  const [showAddSeedModal, setShowAddSeedModal] = useState<boolean>(false);

  // New Seed Form state
  const [newSeedForm, setNewSeedForm] = useState({
    seedVariety: '',
    cropType: 'Paddy / Rice',
    availableQuantityKg: 10,
    seedBankLocation: profile.location || 'Vellore, Tamil Nadu',
    seedBankName: `${profile.name}'s Farm Vault`,
    storageInformation: 'Stored in traditional airtight container with dried neem leaves.',
    preservationMethod: 'Traditional Ash Coating',
    contactPerson: profile.name,
    contactPhone: profile.phone || '+91 98765 43210',
    tempCelsius: 23,
    humidityPercent: 42,
    moisturePercent: 10.0,
    germinationRatePercent: 92
  });

  const cropCategories = ['All', 'Paddy / Rice', 'Tomato', 'Millets', 'Pulses & Legumes', 'Chilli'];

  const filteredSeeds = seeds.filter(item => {
    const matchesSearch = item.seedVariety.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.seedBankLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCropFilter === 'All' || item.cropType.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const matchesHeritage = !showHeritageOnly || item.isHeritageVariety;
    return matchesSearch && matchesCrop && matchesHeritage;
  });

  const handleCreateSeedExchange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeedForExchange) return;
    alert(`Exchange Request submitted for ${selectedSeedForExchange.seedVariety}! The custodian (${selectedSeedForExchange.contactPerson}) will contact you at ${profile.phone}.`);
    setSelectedSeedForExchange(null);
  };

  const handleAddNewSeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeedForm.seedVariety) return;

    const newEntry: SeedBankItem = {
      id: `sb-${Date.now()}`,
      seedVariety: newSeedForm.seedVariety,
      cropType: newSeedForm.cropType,
      availableQuantityKg: Number(newSeedForm.availableQuantityKg),
      seedBankLocation: newSeedForm.seedBankLocation,
      seedBankName: newSeedForm.seedBankName,
      storageInformation: newSeedForm.storageInformation,
      isAvailable: true,
      storageCondition: {
        tempCelsius: Number(newSeedForm.tempCelsius),
        humidityPercent: Number(newSeedForm.humidityPercent),
        moisturePercent: Number(newSeedForm.moisturePercent)
      },
      germinationRatePercent: Number(newSeedForm.germinationRatePercent),
      preservationMethod: newSeedForm.preservationMethod,
      contactPerson: newSeedForm.contactPerson,
      contactPhone: newSeedForm.contactPhone,
      isHeritageVariety: true,
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80'
    };

    setSeeds(prev => [newEntry, ...prev]);
    setShowAddSeedModal(false);
    setNewSeedForm({
      seedVariety: '',
      cropType: 'Paddy / Rice',
      availableQuantityKg: 10,
      seedBankLocation: profile.location || 'Vellore, Tamil Nadu',
      seedBankName: `${profile.name}'s Farm Vault`,
      storageInformation: 'Stored in traditional airtight container with dried neem leaves.',
      preservationMethod: 'Traditional Ash Coating',
      contactPerson: profile.name,
      contactPhone: profile.phone || '+91 98765 43210',
      tempCelsius: 23,
      humidityPercent: 42,
      moisturePercent: 10.0,
      germinationRatePercent: 92
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-3.5 h-3.5" />
              Community Seed Vault & Heritage Bank
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AgriVeda Community Seed Bank
            </h2>
            <p className="text-slate-300 text-sm font-medium leading-relaxed">
              Protecting indigenous heirloom crops, traditional preservation wisdom, and enabling farmer-to-farmer seed exchanges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddSeedModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all active:scale-95 border border-emerald-400/30"
            >
              <Plus className="w-4 h-4" />
              Deposit Seed Variety
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-slate-700 shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Ask AI Preservation Advice
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search seed variety, crop type, or seed bank location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          <button
            onClick={() => setShowHeritageOnly(prev => !prev)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all shrink-0 ${
              showHeritageOnly
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${showHeritageOnly ? 'text-amber-600' : 'text-slate-400'}`} />
            Heritage Seeds Only
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Crop Category:
          </span>
          {cropCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCropFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCropFilter === cat
                  ? 'bg-emerald-800 text-emerald-100 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Seed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSeeds.map((seed) => (
          <div 
            key={seed.id}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            {seed.isHeritageVariety && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-2xl shadow-xs">
                Heritage Heirloom
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-start gap-4">
                {seed.image ? (
                  <img
                    src={seed.image}
                    alt={seed.seedVariety}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <Sprout className="w-8 h-8" />
                  </div>
                )}

                <div className="space-y-1 flex-1 pr-12">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {seed.cropType}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                    {seed.seedVariety}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{seed.seedBankLocation}</span>
                  </div>
                </div>
              </div>

              {/* Quantity & Germination Row */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Available Vault Qty</span>
                  <span className="text-sm font-black text-slate-800">{seed.availableQuantityKg} kg</span>
                </div>
                <div className="p-2.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block">Germination Rate</span>
                  <span className="text-sm font-black text-emerald-800">{seed.germinationRatePercent}% High Quality</span>
                </div>
              </div>

              {/* Live Storage Condition Indicators */}
              <div className="p-3 bg-slate-900 text-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Layers className="w-3.5 h-3.5" /> Vault Storage Monitoring
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px]">Optimal Zone</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-center gap-1 text-amber-400 text-[10px] font-bold mb-0.5">
                      <Thermometer className="w-3 h-3" /> Temp
                    </div>
                    <span className="font-extrabold text-white">{seed.storageCondition.tempCelsius}°C</span>
                  </div>

                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-center gap-1 text-blue-400 text-[10px] font-bold mb-0.5">
                      <Droplets className="w-3 h-3" /> Humidity
                    </div>
                    <span className="font-extrabold text-white">{seed.storageCondition.humidityPercent}%</span>
                  </div>

                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-center gap-1 text-emerald-400 text-[10px] font-bold mb-0.5">
                      <Wind className="w-3 h-3" /> Moisture
                    </div>
                    <span className="font-extrabold text-white">{seed.storageCondition.moisturePercent}%</span>
                  </div>
                </div>
              </div>

              {/* Traditional Preservation Method */}
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800 block">Preservation Wisdom</span>
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  {seed.storageInformation}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedSeedForExchange(seed)}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Request Seed Exchange
              </button>

              <button
                onClick={() => {
                  if (onAskAssistantWithSeed) {
                    onAskAssistantWithSeed(seed.seedVariety);
                  } else {
                    setActiveTab('assistant');
                  }
                }}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all text-xs font-bold flex items-center justify-center shrink-0"
                title="Ask AgriVeda AI about sowing & growing this seed"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSeeds.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Sprout className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Seed Varieties Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting search filters or register a new seed variety into the Community Seed Vault.
          </p>
        </div>
      )}

      {/* Seed Exchange Modal */}
      {selectedSeedForExchange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Seed Exchange Request</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{selectedSeedForExchange.seedVariety}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSeedForExchange(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSeedExchange} className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs text-emerald-900">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Community Seed Guarantee
                </div>
                <p className="text-[11px]">
                  You are requesting seeds from <strong>{selectedSeedForExchange.contactPerson}</strong> at {selectedSeedForExchange.seedBankName}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requested Quantity (kg):
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedSeedForExchange.availableQuantityKg}
                  defaultValue="2"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seed You Offer to Exchange in Return:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Local Organic Chilli Seeds or Native Millet"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Delivery Location / Phone:
                </label>
                <input
                  type="text"
                  defaultValue={`${profile.location} (${profile.phone})`}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSeedForExchange(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  Submit Exchange Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Seed Modal */}
      {showAddSeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">Deposit Seed Variety to Vault</h3>
              </div>
              <button
                onClick={() => setShowAddSeedModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewSeed} className="space-y-4 text-xs font-medium text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Seed Variety Name:</label>
                  <input
                    type="text"
                    required
                    value={newSeedForm.seedVariety}
                    onChange={e => setNewSeedForm({...newSeedForm, seedVariety: e.target.value})}
                    placeholder="e.g. Poongar Traditional Paddy"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Crop Category:</label>
                  <select
                    value={newSeedForm.cropType}
                    onChange={e => setNewSeedForm({...newSeedForm, cropType: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="Paddy / Rice">Paddy / Rice</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Millets">Millets</option>
                    <option value="Chilli">Chilli</option>
                    <option value="Pulses">Pulses</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Available Quantity (kg):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newSeedForm.availableQuantityKg}
                    onChange={e => setNewSeedForm({...newSeedForm, availableQuantityKg: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Germination Rate (%):</label>
                  <input
                    type="number"
                    required
                    min="50"
                    max="100"
                    value={newSeedForm.germinationRatePercent}
                    onChange={e => setNewSeedForm({...newSeedForm, germinationRatePercent: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Storage & Organic Preservation Method:</label>
                <textarea
                  rows={2}
                  value={newSeedForm.storageInformation}
                  onChange={e => setNewSeedForm({...newSeedForm, storageInformation: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSeedModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Register Seed in Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
