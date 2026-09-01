import React from 'react';
import { Building2, TrendingUp, Package, FileText, CheckCircle2, AlertCircle, Search, ArrowUpRight } from 'lucide-react';
import { UserProfile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface B2BVendorDashboardViewProps {
  profile: UserProfile;
}

export const B2BVendorDashboardView: React.FC<B2BVendorDashboardViewProps> = ({ profile }) => {
  const { t } = useLanguage();

  const isVerified = profile.verificationStatus === 'FULLY_VERIFIED' || profile.verificationStatus === 'ROLE_VERIFIED';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>B2B Vendor Enterprise Portal</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Bulk produce procurement, mandi contracts & institutional trade</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-black rounded-full border ${
            isVerified ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-900 border-amber-200'
          }`}>
            {isVerified ? 'VERIFIED B2B VENDOR ✓' : 'VERIFICATION PENDING'}
          </span>
        </div>
      </div>

      {/* Verification Pending Notice */}
      {!isVerified && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 font-medium">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Verification Pending</p>
            <p>Your business profile & GST registration are being reviewed by AgriVeda Compliance Officers. Some bulk contract features will remain unavailable until verification is completed.</p>
          </div>
        </div>
      )}

      {/* Executive Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Bulk Contracts</span>
          <p className="text-2xl font-black text-slate-900">14 Orders</p>
          <span className="text-[11px] font-bold text-emerald-600 block">+18.4% vs last month</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Procurement Volume</span>
          <p className="text-2xl font-black text-blue-700">185 Tons</p>
          <span className="text-[11px] font-bold text-slate-500 block">Paddy, Tomato, Cotton</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Trade Revenue</span>
          <p className="text-2xl font-black text-slate-900">₹42,80,000</p>
          <span className="text-[11px] font-bold text-emerald-600 block">Q1 Settled</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Verified FPO Partners</span>
          <p className="text-2xl font-black text-emerald-600">8 FPOs</p>
          <span className="text-[11px] font-bold text-slate-500 block">Tamil Nadu & Andhra</span>
        </div>
      </div>

      {/* Bulk B2B Procurement Contracts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Active Bulk Procurement Contracts</h3>
          <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
            <span>New Bulk Request</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { crop: 'CR-1009 Paddy (Bulk)', fpo: 'Tiruvallur Farmers Producer Co.', qty: '50 Tons', rate: '₹3,250 / quintal', status: 'Delivering', date: 'Sept 04, 2026' },
            { crop: 'Hybrid Tomato (PKM 1)', fpo: 'Kanchipuram Organic Growers FPO', qty: '20 Tons', rate: '₹3,100 / quintal', status: 'Inspection', date: 'Sept 06, 2026' },
            { crop: 'Raw Sugarcane', fpo: 'Villupuram Sugarcane Federation', qty: '100 Tons', rate: '₹3,150 / ton', status: 'Confirmed', date: 'Sept 10, 2026' },
          ].map((c, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{c.crop}</h4>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded-md">{c.status}</span>
                </div>
                <p className="text-slate-500">{c.fpo} • Target Date: {c.date}</p>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <span className="block font-black text-slate-900 text-sm">{c.qty}</span>
                  <span className="block text-slate-500 font-bold">{c.rate}</span>
                </div>
                <button className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer">
                  View Contract
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
