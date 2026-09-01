import React from 'react';
import { Settings2, Package, TrendingUp, AlertCircle, Plus, Search } from 'lucide-react';
import { UserProfile } from '../../types';

interface SparePartsDashboardViewProps {
  profile: UserProfile;
}

export const SparePartsDashboardView: React.FC<SparePartsDashboardViewProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-slate-800" />
            <span>Agri Spare Parts Trading Marketplace</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Tractor engine parts, hydraulic hoses, filters, belts & implements</p>
        </div>

        <button className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add Spare Part Listing</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Parts In Stock</span>
          <p className="text-2xl font-black text-slate-900">420 SKUs</p>
          <span className="text-[11px] font-bold text-emerald-600 block">Mahindra, Tafe, John Deere</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Parts Sales This Month</span>
          <p className="text-2xl font-black text-blue-700">₹6,45,000</p>
          <span className="text-[11px] font-bold text-slate-500 block">184 Orders Dispatched</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Low Stock Alerts</span>
          <p className="text-2xl font-black text-rose-600">3 Items</p>
          <span className="text-[11px] font-bold text-slate-500 block">Reorder Recommended</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Retail Store Status</span>
          <p className="text-2xl font-black text-emerald-600">ACTIVE ✓</p>
          <span className="text-[11px] font-bold text-slate-500 block">Madurai Wholesale Hub</span>
        </div>
      </div>

      {/* Spare Parts Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Top Selling Spare Parts Inventory</h3>

        <div className="space-y-3">
          {[
            { part: 'High-Pressure Hydraulic Hose (2m)', partNo: 'HYD-MS-994', price: '₹1,850', stock: '24 units', category: 'Hydraulics' },
            { part: 'Heavy Duty Diesel Oil Filter', partNo: 'FLT-JD-102', price: '₹450', stock: '85 units', category: 'Filters' },
            { part: 'Tractor Fan Belt (V-Belt B-54)', partNo: 'BLT-VB-54', price: '₹380', stock: '2 units (Low Stock)', category: 'Belts' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{item.part}</h4>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-bold text-[10px] rounded-md">{item.category}</span>
                </div>
                <p className="text-slate-500">Part No: <span className="font-mono">{item.partNo}</span> • Stock Level: {item.stock}</p>
              </div>

              <div className="flex items-center gap-4 text-right">
                <span className="text-sm font-black text-slate-900">{item.price}</span>
                <button className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer">
                  Update Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
