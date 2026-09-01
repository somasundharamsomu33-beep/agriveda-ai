import React, { useState } from 'react';
import { User, MapPin, Sprout, Calendar, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileSetupViewProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onComplete: () => void;
}

export const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({
  profile,
  setProfile,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form local states
  const [fullName, setFullName] = useState(profile.name || 'Murugan Selvam');
  const [mobile, setMobile] = useState(profile.phone || '9842155432');
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Tiruvallur');
  const [village, setVillage] = useState('Kovilpatti');

  const [farmLocation, setFarmLocation] = useState('Kovilpatti North Survey #48/2');
  const [farmSize, setFarmSize] = useState<number>(profile.farmSizeAcres || 3.5);
  const [primaryCrop, setPrimaryCrop] = useState(profile.primaryCrop || 'Rice');

  const [experience, setExperience] = useState('5-10 years');
  const [soilType, setSoilType] = useState(profile.soilType || 'Red Loam');
  const [irrigation, setIrrigation] = useState('Drip Irrigation');

  const CROP_CHIPS = ['Rice', 'Tomato', 'Groundnut', 'Sugarcane', 'Banana', 'Cotton', 'Maize', 'Chilli'];
  const SOIL_CHIPS = ['Red Loam', 'Black Cotton Soil', 'Alluvial Soil', 'Sandy Loam', 'Clay Soil'];
  const EXPERIENCE_CHIPS = ['< 2 years', '2 - 5 years', '5 - 10 years', '10+ years'];
  const IRRIGATION_CHIPS = ['Drip Irrigation', 'Borewell', 'Canal Water', 'Rainfed', 'Sprinkler'];

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      // Save profile
      setProfile(prev => ({
        ...prev,
        name: fullName,
        phone: mobile,
        location: `${village}, ${district}`,
        farmSizeAcres: farmSize,
        primaryCrop: primaryCrop,
        soilType: soilType,
        irrigationMethod: irrigation,
        isAuthenticated: true
      }));
      onComplete();
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-md space-y-6">
      {/* Header & Progress Indicator */}
      <div className="space-y-4 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
            Step {step} of 3
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {step === 1 ? 'Personal Info' : step === 2 ? 'Farm Details' : 'Farming Experience'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Farmer Profile Setup</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {step === 1 && 'Tell us your name and village location to personalize weather and market data.'}
            {step === 2 && 'Provide farm size and crop information for custom AI agricultural advice.'}
            {step === 3 && 'Select your soil type and irrigation setup to complete setup.'}
          </p>
        </div>
      </div>

      {/* STEP 1: Personal & Location Information */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Murugan Selvam"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="e.g. 9842155432"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">State</label>
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white"
              >
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Telangana">Telangana</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">District</label>
              <input
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                placeholder="District"
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Village</label>
              <input
                type="text"
                value={village}
                onChange={e => setVillage(e.target.value)}
                placeholder="Village Name"
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Farm Information & Primary Crop */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Farm Location / Survey Details</label>
            <input
              type="text"
              value={farmLocation}
              onChange={e => setFarmLocation(e.target.value)}
              placeholder="e.g. Kovilpatti North Survey #48/2"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex justify-between">
              <span>Farm Size (Acres)</span>
              <span className="text-blue-600 font-extrabold">{farmSize} Acres</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.5"
              value={farmSize}
              onChange={e => setFarmSize(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>0.5 Acre</span>
              <span>10 Acres</span>
              <span>25+ Acres</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Primary Crop</label>
            <div className="flex flex-wrap gap-2">
              {CROP_CHIPS.map(crop => {
                const isSelected = primaryCrop === crop;
                return (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => setPrimaryCrop(crop)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {crop}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Experience, Soil & Irrigation */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Farming Experience</label>
            <div className="grid grid-cols-2 gap-2">
              {EXPERIENCE_CHIPS.map(exp => {
                const isSelected = experience === exp;
                return (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setExperience(exp)}
                    className={`p-3 rounded-xl text-xs font-bold border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {exp}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Soil Type</label>
            <div className="flex flex-wrap gap-2">
              {SOIL_CHIPS.map(soil => {
                const isSelected = soilType === soil;
                return (
                  <button
                    key={soil}
                    type="button"
                    onClick={() => setSoilType(soil)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {soil}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Irrigation Source</label>
            <div className="flex flex-wrap gap-2">
              {IRRIGATION_CHIPS.map(irr => {
                const isSelected = irrigation === irr;
                return (
                  <button
                    key={irr}
                    type="button"
                    onClick={() => setIrrigation(irr)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {irr}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(prev => prev - 1)}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
        >
          <span>{step === 3 ? 'Save Profile & Continue' : 'Next Step'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
