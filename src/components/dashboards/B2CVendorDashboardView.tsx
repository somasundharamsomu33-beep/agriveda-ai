import React from 'react';
import { ShoppingCart, Package, TrendingUp, Star, Plus, ArrowUpRight } from 'lucide-react';
import { UserProfile } from '../../types';

interface B2CVendorDashboardViewProps {
  profile: UserProfile;
}

export const B2CVendorDashboardView: React.FC<B2CVendorDashboardViewProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amber-600" />
            <span>B2C Retail Vendor Storefront</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Direct consumer sales, produce delivery & retail orders</p>
        </div>

        <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add New Product Listing</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Retail Sales Today</span>
          <p className="text-2xl font-black text-slate-900">₹14,850</p>
          <span className="text-[11px] font-bold text-emerald-600 block">32 Orders</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Listings</span>
          <p className="text-2xl font-black text-blue-700">18 Products</p>
          <span className="text-[11px] font-bold text-slate-500 block">Organic Produce & Seeds</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Customer Rating</span>
          <p className="text-2xl font-black text-amber-600 flex items-center gap-1">
            <span>4.9</span>
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          </p>
          <span className="text-[11px] font-bold text-slate-500 block">142 Customer Reviews</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Deliveries</span>
          <p className="text-2xl font-black text-emerald-600">6 Orders</p>
          <span className="text-[11px] font-bold text-slate-500 block">Express Local Delivery</span>
        </div>
      </div>

      {/* Active Retail Listings Catalog */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Top Selling Retail Listings</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Fresh Country Tomatoes (Nattu)', price: '₹40 / kg', stock: '120 kg', img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb197a5?auto=format&fit=crop&w=400&q=80' },
            { title: 'Organic Vermicompost Pack (10kg)', price: '₹250 / pack', stock: '45 packs', img: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=400&q=80' },
            { title: 'CR 1009 Raw Paddy Rice (5kg)', price: '₹320 / bag', stock: '60 bags', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <img src={item.img} alt={item.title} className="w-full h-32 object-cover rounded-xl border border-slate-200" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">{item.title}</h4>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-700">{item.price}</span>
                  <span className="text-slate-500">In Stock: {item.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
