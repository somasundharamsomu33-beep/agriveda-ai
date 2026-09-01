import React from 'react';
import { Tractor, TrendingUp, Package, Plus, ArrowUpRight, AlertCircle } from 'lucide-react';
import { UserProfile } from '../../types';

interface EquipmentVendorDashboardViewProps {
  profile: UserProfile;
}

export const EquipmentVendorDashboardView: React.FC<EquipmentVendorDashboardViewProps> = ({ profile }) => {
  const isVerified = profile.verificationStatus === 'FULLY_VERIFIED' || profile.verificationStatus === 'ROLE_VERIFIED';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Tractor className="w-6 h-6 text-indigo-600" />
            <span>Agri Machinery & Equipment Trading Marketplace</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Buy, sell & rent tractors, harvesters, seeders & farm equipment</p>
        </div>

        <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Post Equipment Listing</span>
        </button>
      </div>

      {/* Verification Notice */}
      {!isVerified && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 font-medium">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Business Verification Pending</p>
            <p>Your equipment dealership registration & GST ID are currently under verification. Equipment sales transactions require verified status.</p>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Equipment Sales</span>
          <p className="text-2xl font-black text-slate-900">₹84,50,000</p>
          <span className="text-[11px] font-bold text-emerald-600 block">Q1 Target Met</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Fleet Listings</span>
          <p className="text-2xl font-black text-indigo-700">12 Machinery Units</p>
          <span className="text-[11px] font-bold text-slate-500 block">Tractors & Harvesters</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Farmer Rental Inquiries</span>
          <p className="text-2xl font-black text-amber-600">18 Inquiries</p>
          <span className="text-[11px] font-bold text-slate-500 block">Kharif Season Demand</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Trading Rating</span>
          <p className="text-2xl font-black text-emerald-600">4.8 / 5.0</p>
          <span className="text-[11px] font-bold text-slate-500 block">Verified Dealer</span>
        </div>
      </div>

      {/* Machinery Catalog Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Active Machinery Inventory</h3>

        <div className="space-y-3">
          {[
            { title: 'Mahindra 575 DI 45HP Tractor', category: '🚜 Tractor', price: '₹6,85,000', rental: '₹800/hr', status: 'Available' },
            { title: 'Kubota Combine Harvester DC-68G', category: '🌾 Harvester', price: '₹24,50,000', rental: '₹2,200/hr', status: 'Rented' },
            { title: 'Pneumatic 4-Row Precision Seeder', category: '🌱 Seeder', price: '₹1,45,000', rental: '₹400/hr', status: 'Available' },
          ].map((m, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{m.title}</h4>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[10px] rounded-md">{m.category}</span>
                </div>
                <p className="text-slate-500">Rental Rate: <span className="font-bold text-indigo-700">{m.rental}</span> • Status: {m.status}</p>
              </div>

              <div className="flex items-center gap-4 text-right">
                <span className="text-sm font-black text-slate-900">{m.price}</span>
                <button className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors cursor-pointer">
                  Manage Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
