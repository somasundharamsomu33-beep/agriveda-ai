import React, { useState } from 'react';
import {
  Calculator, Sparkles, Scale, Sprout, AlertCircle, CheckCircle2,
  Calendar, Layers, DollarSign, ChevronRight, RefreshCw, HelpCircle, ArrowRight
} from 'lucide-react';
import { UserProfile, CalendarEvent } from '../types';

interface FertilizerCalculatorProps {
  profile: UserProfile;
  selectedCrop?: string;
  onAddRemindersToCalendar?: (reminders: CalendarEvent[]) => void;
}

// Recommended base NPK per acre (in kg) for major crops (Standard Yield)
const CROP_NPK_REQUIREMENTS: Record<string, { n: number; p: number; k: number; fymTonnes: number; splits: { stage: string; day: number; nPct: number; pPct: number; kPct: number; notes: string }[] }> = {
  'Tomato': {
    n: 60, p: 40, k: 50, fymTonnes: 5,
    splits: [
      { stage: 'Basal Application (At Planting)', day: 0, nPct: 25, pPct: 100, kPct: 50, notes: 'Mix full DAP/SSP, half MOP & 25% Urea with FYM in soil before transplanting' },
      { stage: 'Vegetative Growth (20-25 DAP)', day: 22, nPct: 35, pPct: 0, kPct: 0, notes: 'Apply 35% Urea near root zone followed by light irrigation' },
      { stage: 'Flowering & Fruit Set (45-50 DAP)', day: 48, nPct: 25, pPct: 0, kPct: 25, notes: 'Apply 25% Urea + 25% MOP. Spray 0.5% Boron if blossom drop seen' },
      { stage: 'Fruit Picking Stage (70-75 DAP)', day: 72, nPct: 15, pPct: 0, kPct: 25, notes: 'Apply remaining 15% Urea & 25% MOP for uniform fruit sizing & color' }
    ]
  },
  'Paddy / Rice': {
    n: 50, p: 25, k: 25, fymTonnes: 4,
    splits: [
      { stage: 'Basal Dose (During Final Puddling)', day: 0, nPct: 25, pPct: 100, kPct: 50, notes: 'Apply full Phosphorus (DAP) + 50% Potash + 25% Nitrogen + Zinc Sulphate (10 kg/acre)' },
      { stage: 'Active Tillering (20-25 DAT)', day: 21, nPct: 50, pPct: 0, kPct: 0, notes: 'Broadcast 50% Urea in 2-3 cm standing water' },
      { stage: 'Panicle Initiation (45-50 DAT)', day: 45, nPct: 25, pPct: 0, kPct: 50, notes: 'Apply remaining 25% Urea + 50% MOP for dense grain filling' }
    ]
  },
  'Chilli': {
    n: 70, p: 35, k: 35, fymTonnes: 5,
    splits: [
      { stage: 'Basal Application (Land Prep)', day: 0, nPct: 20, pPct: 100, kPct: 50, notes: 'Apply full P + 50% K + 20% N mixed with Neem Cake (100 kg/acre)' },
      { stage: 'First Branching (30 DAP)', day: 30, nPct: 30, pPct: 0, kPct: 0, notes: 'Top dress 30% Urea' },
      { stage: 'Peak Flowering (60 DAP)', day: 60, nPct: 30, pPct: 0, kPct: 25, notes: 'Apply 30% Urea + 25% MOP + Micronutrient spray' },
      { stage: 'Fruit Harvest Phase (90 DAP)', day: 90, nPct: 20, pPct: 0, kPct: 25, notes: 'Apply remaining 20% Urea + 25% MOP to boost second picking' }
    ]
  },
  'Cotton': {
    n: 60, p: 30, k: 30, fymTonnes: 4,
    splits: [
      { stage: 'Basal Dose (At Sowing)', day: 0, nPct: 15, pPct: 100, kPct: 50, notes: 'Apply 100% DAP + 50% MOP + 15% Urea' },
      { stage: 'Square Formation (35-40 DAS)', day: 38, nPct: 45, pPct: 0, kPct: 0, notes: 'Apply 45% Urea near plants' },
      { stage: 'Boll Development (65-70 DAS)', day: 68, nPct: 40, pPct: 0, kPct: 50, notes: 'Apply 40% Urea + 50% MOP. Spray Magnesium Sulphate if yellowing occurs' }
    ]
  },
  'Sugarcane': {
    n: 110, p: 45, k: 45, fymTonnes: 8,
    splits: [
      { stage: 'Basal (At Planting)', day: 0, nPct: 15, pPct: 100, kPct: 33, notes: 'Incorporate full DAP + 33% MOP in furrows' },
      { stage: 'Tillering Stage (45 Days)', day: 45, nPct: 35, pPct: 0, kPct: 33, notes: 'Top dress 35% Urea followed by earthing up' },
      { stage: 'Grand Growth Phase (90 Days)', day: 90, nPct: 50, pPct: 0, kPct: 34, notes: 'Apply remaining 50% Urea + 34% MOP before monsoon rain' }
    ]
  },
  'Brinjal': {
    n: 55, p: 35, k: 35, fymTonnes: 5,
    splits: [
      { stage: 'Basal (Land Prep)', day: 0, nPct: 25, pPct: 100, kPct: 50, notes: 'Apply full P + 50% K + 25% N' },
      { stage: 'Vegetative (30 Days)', day: 30, nPct: 35, pPct: 0, kPct: 0, notes: 'Top dress 35% Urea' },
      { stage: 'Fruiting (60 Days)', day: 60, nPct: 40, pPct: 0, kPct: 50, notes: 'Apply 40% Urea + 50% MOP' }
    ]
  }
};

export const FertilizerCalculator: React.FC<FertilizerCalculatorProps> = ({
  profile,
  selectedCrop: initialCrop,
  onAddRemindersToCalendar
}) => {
  const [crop, setCrop] = useState<string>(initialCrop || profile.primaryCrop || 'Tomato');
  const [area, setArea] = useState<number>(profile.farmSizeAcres || 1);
  const [areaUnit, setAreaUnit] = useState<'Acre' | 'Hectare' | 'Cent'>('Acre');
  
  // Soil test levels
  const [nSoil, setNSoil] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [pSoil, setPSoil] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [kSoil, setKSoil] = useState<'Low' | 'Medium' | 'High'>('Medium');
  
  // Fertilizer source preferences
  const [pSource, setPSource] = useState<'DAP' | 'SSP'>('DAP');
  
  const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);

  // Convert area to Acres for standard calculation
  const areaInAcres = areaUnit === 'Acre' ? area : areaUnit === 'Hectare' ? area * 2.471 : area / 100;

  // Base requirement lookup
  const cropData = CROP_NPK_REQUIREMENTS[crop] || CROP_NPK_REQUIREMENTS['Tomato'];

  // Soil adjustment multipliers
  const getMultiplier = (level: 'Low' | 'Medium' | 'High') => {
    if (level === 'Low') return 1.25; // Increase by 25% if deficient
    if (level === 'High') return 0.75; // Reduce by 25% if rich
    return 1.0;
  };

  const reqN = Math.round(cropData.n * areaInAcres * getMultiplier(nSoil));
  const reqP = Math.round(cropData.p * areaInAcres * getMultiplier(pSoil));
  const reqK = Math.round(cropData.k * areaInAcres * getMultiplier(kSoil));

  // Fertilizer Quantities Calculation:
  // DAP: 18% N, 46% P2O5
  // SSP: 16% P2O5
  // MOP: 60% K2O
  // Urea: 46% N

  let dapKg = 0;
  let sspKg = 0;
  let nFromP = 0;

  if (pSource === 'DAP') {
    dapKg = Math.round(reqP / 0.46);
    nFromP = Math.round(dapKg * 0.18);
  } else {
    sspKg = Math.round(reqP / 0.16);
  }

  const netNNeeded = Math.max(0, reqN - nFromP);
  const ureaKg = Math.round(netNNeeded / 0.46);
  const mopKg = Math.round(reqK / 0.60);

  // Bag conversions (50kg bags)
  const ureaBags = (ureaKg / 50).toFixed(1);
  const pBags = pSource === 'DAP' ? (dapKg / 50).toFixed(1) : (sspKg / 50).toFixed(1);
  const mopBags = (mopKg / 50).toFixed(1);

  // Estimated Cost Calculation (Govt Subsidy approximate rates in INR)
  // Urea ~₹268 per 45kg bag (~₹6/kg), DAP ~₹1350 per 50kg bag (~₹27/kg), SSP ~₹380 per 50kg (~₹7.6/kg), MOP ~₹1700 per 50kg (~₹34/kg)
  const ureaCost = Math.round(ureaKg * 6);
  const pCost = pSource === 'DAP' ? Math.round(dapKg * 27) : Math.round(sspKg * 7.6);
  const mopCost = Math.round(mopKg * 34);
  const totalCost = ureaCost + pCost + mopCost;

  // Add calculated doses to Crop Calendar
  const handleSyncToCalendar = () => {
    if (!onAddRemindersToCalendar) return;

    const events: CalendarEvent[] = cropData.splits.map((split, i) => {
      const splitUrea = Math.round((ureaKg * split.nPct) / 100);
      const splitP = pSource === 'DAP' ? Math.round((dapKg * split.pPct) / 100) : Math.round((sspKg * split.pPct) / 100);
      const splitMop = Math.round((mopKg * split.kPct) / 100);

      const doseDetails = [
        splitUrea > 0 ? `Urea: ${splitUrea} kg` : null,
        splitP > 0 ? `${pSource}: ${splitP} kg` : null,
        splitMop > 0 ? `MOP: ${splitMop} kg` : null
      ].filter(Boolean).join(' + ');

      return {
        id: `fert-${Date.now()}-${i}`,
        dayNumber: split.day,
        dateStr: split.day === 0 ? 'At Sowing' : `Day ${split.day}`,
        title: `Fertilizer: ${split.stage.split('(')[0].trim()}`,
        category: 'Fertilizer',
        description: `Apply: ${doseDetails || 'Organic Neem / FYM'}. Tip: ${split.notes}`,
        completed: false,
        recommendedTime: '6:00 AM (Early Morning)'
      };
    });

    onAddRemindersToCalendar(events);
    setIsAddedToCalendar(true);
    setTimeout(() => setIsAddedToCalendar(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-5 animate-in fade-in">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shadow-2xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Precision Fertilizer Calculator</h3>
            <p className="text-[11px] text-slate-500">Calculate exact NPK bag requirements &amp; application schedule</p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
          Soil Test Calibrated
        </span>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        
        {/* Crop Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Target Crop</label>
          <select
            value={crop}
            onChange={e => setCrop(e.target.value)}
            className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            {Object.keys(CROP_NPK_REQUIREMENTS).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Farm Area & Unit */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Field Size / Area</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={area}
              onChange={e => setArea(Math.max(0.1, Number(e.target.value)))}
              className="w-1/2 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
            <select
              value={areaUnit}
              onChange={e => setAreaUnit(e.target.value as any)}
              className="w-1/2 px-2.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="Acre">Acres</option>
              <option value="Hectare">Hectares</option>
              <option value="Cent">Cents</option>
            </select>
          </div>
        </div>

        {/* Phosphorus Source Choice */}
        <div className="sm:col-span-2 pt-1 border-t border-slate-200/60">
          <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Phosphorus Source</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPSource('DAP')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                pSource === 'DAP'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              DAP (18-46-0) + Urea
            </button>
            <button
              type="button"
              onClick={() => setPSource('SSP')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                pSource === 'SSP'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              SSP (0-16-0) + Urea
            </button>
          </div>
        </div>

      </div>

      {/* Soil Test Result Ratings */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Soil Health Test Levels (Adjust if tested)</span>
          </label>
          <span className="text-[10px] font-bold text-slate-500">Auto-adjusts dosage ±25%</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* N */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase">Nitrogen (N)</span>
            <div className="flex justify-center gap-1">
              {(['Low', 'Medium', 'High'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setNSoil(lvl)}
                  className={`px-2 py-1 rounded text-[10px] font-extrabold transition-all ${
                    nSoil === lvl
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {lvl[0]}
                </button>
              ))}
            </div>
          </div>

          {/* P */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase">Phosphorus (P)</span>
            <div className="flex justify-center gap-1">
              {(['Low', 'Medium', 'High'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPSoil(lvl)}
                  className={`px-2 py-1 rounded text-[10px] font-extrabold transition-all ${
                    pSoil === lvl
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {lvl[0]}
                </button>
              ))}
            </div>
          </div>

          {/* K */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase">Potassium (K)</span>
            <div className="flex justify-center gap-1">
              {(['Low', 'Medium', 'High'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setKSoil(lvl)}
                  className={`px-2 py-1 rounded text-[10px] font-extrabold transition-all ${
                    kSoil === lvl
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {lvl[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calculated Results Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm space-y-3">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-xs font-bold text-slate-300">
            Total Pure Nutrient Need ({area} {areaUnit}s)
          </span>
          <span className="text-xs font-extrabold text-emerald-400">
            N: {reqN}kg • P: {reqP}kg • K: {reqK}kg
          </span>
        </div>

        {/* Commercial Fertilizer Bags Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          
          {/* Urea Bag */}
          <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/80 text-center space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Urea (46% N)</span>
            <span className="text-lg font-black text-amber-400 block">{ureaKg} <span className="text-xs font-semibold">kg</span></span>
            <span className="text-[10px] font-bold text-slate-300 block bg-slate-700/60 py-0.5 rounded">
              ≈ {ureaBags} Bags (50kg)
            </span>
          </div>

          {/* DAP / SSP Bag */}
          <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/80 text-center space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">{pSource}</span>
            <span className="text-lg font-black text-blue-400 block">
              {pSource === 'DAP' ? dapKg : sspKg} <span className="text-xs font-semibold">kg</span>
            </span>
            <span className="text-[10px] font-bold text-slate-300 block bg-slate-700/60 py-0.5 rounded">
              ≈ {pBags} Bags (50kg)
            </span>
          </div>

          {/* MOP Bag */}
          <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/80 text-center space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">MOP (60% K₂O)</span>
            <span className="text-lg font-black text-emerald-400 block">{mopKg} <span className="text-xs font-semibold">kg</span></span>
            <span className="text-[10px] font-bold text-slate-300 block bg-slate-700/60 py-0.5 rounded">
              ≈ {mopBags} Bags (50kg)
            </span>
          </div>

        </div>

        {/* Cost & Organic Tip */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Approx. Cost: <strong className="text-white">₹{totalCost.toLocaleString()}</strong></span>
          </div>
          <span className="text-[10px] text-slate-400">Add FYM: {cropData.fymTonnes * areaInAcres} Tonnes</span>
        </div>

      </div>

      {/* Split Application Schedule Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>Stage-wise Split Application Schedule</span>
          </h4>

          {onAddRemindersToCalendar && (
            <button
              onClick={handleSyncToCalendar}
              disabled={isAddedToCalendar}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all transform active:scale-95 shrink-0"
            >
              {isAddedToCalendar ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Added to Timeline!</span>
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Sync to Crop Timeline</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-2">
          {cropData.splits.map((split, idx) => {
            const splitUrea = Math.round((ureaKg * split.nPct) / 100);
            const splitP = pSource === 'DAP' ? Math.round((dapKg * split.pPct) / 100) : Math.round((sspKg * split.pPct) / 100);
            const splitMop = Math.round((mopKg * split.kPct) / 100);

            return (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {split.stage}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {split.day === 0 ? 'Sowing / Transplanting' : `Day ${split.day}`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1 text-xs font-bold">
                  {splitUrea > 0 && (
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                      Urea: {splitUrea} kg ({split.nPct}%)
                    </span>
                  )}
                  {splitP > 0 && (
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                      {pSource}: {splitP} kg ({split.pPct}%)
                    </span>
                  )}
                  {splitMop > 0 && (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                      MOP: {splitMop} kg ({split.kPct}%)
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 font-medium pt-1">
                  💡 <strong>Pro Tip:</strong> {split.notes}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
