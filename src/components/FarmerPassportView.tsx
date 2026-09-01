import React from 'react';
import { ShieldCheck, QrCode, CheckCircle2, Download } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FarmerPassportViewProps {
  profile: UserProfile;
}

export const FarmerPassportView: React.FC<FarmerPassportViewProps> = ({ profile }) => {
  const { t } = useLanguage();
  const farmerId = `AGRI-TN-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="max-w-xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t('passportHeader')}</span>
            <span className="p-1 bg-blue-100 text-blue-700 rounded-lg text-xs">{t('digitalID')}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Verified Indian Agricultural Identity Card</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Digital Passport downloaded as PDF!")}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Save ID</span>
          </button>
        </div>
      </div>

      {/* Main Passport Digital Card */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-700 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Card Header Banner */}
        <div className="flex items-center justify-between border-b border-blue-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-wider text-white">AgriVeda Passport</h3>
              <p className="text-[10px] text-blue-200 uppercase tracking-widest font-extrabold">Government & APMC Aligned</p>
            </div>
          </div>

          <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-full text-xs font-black flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('verifiedBadge')}</span>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
              alt={profile.name}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-white/30 shadow-md"
            />
            <span className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-600 rounded-full text-white shadow-md">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <h4 className="text-xl sm:text-2xl font-black text-white">{profile.name || 'Murugan Selvam'}</h4>
              <p className="text-xs text-amber-300 font-extrabold tracking-wider uppercase">
                {t('farmerID')}: <span className="font-mono">{farmerId}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-blue-200 uppercase font-bold block">{t('farmLocation')}</span>
                <span className="font-bold text-white block truncate">{profile.location || 'Kovilpatti, Tiruvallur'}</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-blue-200 uppercase font-bold block">{t('farmSize')}</span>
                <span className="font-bold text-white block">{profile.farmSizeAcres || 3.5} Acres</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-blue-200 uppercase font-bold block">{t('primaryCrops')}</span>
                <span className="font-bold text-emerald-300 block">{profile.primaryCrop || 'Rice, Tomato'}</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 space-y-0.5">
                <span className="text-[10px] text-blue-200 uppercase font-bold block">{t('experience')}</span>
                <span className="font-bold text-white block">8 Years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status Badges */}
        <div className="pt-2 border-t border-blue-700/60">
          <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider block mb-2">
            Verification Checks
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <div className="p-2 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-emerald-300 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('identityCheck')}</span>
            </div>

            <div className="p-2 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-emerald-300 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('farmCheck')}</span>
            </div>

            <div className="p-2 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-emerald-300 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('profileCheck')}</span>
            </div>
          </div>
        </div>

        {/* High Res QR Code Section */}
        <div className="bg-white text-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 shrink-0">
              <QrCode className="w-12 h-12 text-blue-700" />
            </div>
            <div className="space-y-0.5 text-center sm:text-left">
              <p className="text-xs font-black text-slate-900">{t('scanPassportQR')}</p>
              <p className="text-[11px] text-slate-500 font-medium">Valid for Mandi traders, Bank loans & Subsidies</p>
            </div>
          </div>

          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
            Official QR Code
          </span>
        </div>
      </div>
    </div>
  );
};
