import React, { useState } from 'react';
import { 
  Building2, 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  MessageSquare, 
  Store, 
  Clock, 
  Phone,
  FileText
} from 'lucide-react';
import { AgriMarketItem, UserProfile } from '../../types';
import { SAMPLE_MARKETPLACE_PRODUCTS } from '../../data/marketplaceFullData';

interface VendorEcommerceDashboardProps {
  profile: UserProfile;
}

export const VendorEcommerceDashboard: React.FC<VendorEcommerceDashboardProps> = ({ profile }) => {
  const [vendorProducts, setVendorProducts] = useState<AgriMarketItem[]>(SAMPLE_MARKETPLACE_PRODUCTS.slice(0, 4));
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'inquiries' | 'analytics'>('products');
  
  // Add Product Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'equipment' | 'seeds' | 'fertilizers' | 'spare_parts'>('equipment');
  const [newPrice, setNewPrice] = useState(1500);
  const [newStock, setNewStock] = useState(10);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AgriMarketItem = {
      id: `vendor-prod-${Date.now()}`,
      title: newTitle || 'Custom Agri Product',
      category: newCategory,
      subCategory: 'Farm Supplies',
      brand: profile.name || 'AgriVeda Dealer',
      price: newPrice,
      rating: 5.0,
      reviewCount: 1,
      sellerName: profile.name || 'Verified Vendor',
      sellerPhone: profile.phone || '+91 98765 43210',
      sellerLocation: profile.location || 'Kovilpatti, Tamil Nadu',
      distanceKm: 2.0,
      isVerifiedSeller: true,
      condition: 'NEW',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80',
      specifications: { 'Quality Grade': 'Standard' },
      description: 'Vendor catalog listing.',
      stockCount: newStock
    };

    setVendorProducts(prev => [created, ...prev]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Vendor Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-800/60 rounded-full border border-blue-400/30 text-xs font-bold text-blue-200">
            <Store className="w-3.5 h-3.5 text-blue-300" />
            <span>AgriVeda Vendor E-Commerce Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {profile.name || 'Agri Merchant'} E-Commerce Portal
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 font-medium">
            Manage inventory, publish equipment/inputs catalog, process orders & respond to farmer inquiries.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product Listing</span>
        </button>
      </div>

      {/* Verified Status Notice */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-2 text-xs text-emerald-950 font-bold">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>VERIFIED VENDOR ACCOUNT ✓ • GST Registration & Business Identity Confirmed</span>
        </div>
        <span className="px-2.5 py-0.5 bg-emerald-700 text-white rounded-md text-[10px] uppercase font-black">
          Active Storefront
        </span>
      </div>

      {/* Dashboard Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Active Products</span>
          <p className="text-2xl font-black text-slate-900">{vendorProducts.length} Items</p>
          <span className="text-[11px] font-bold text-emerald-600 block">Catalog Live</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Orders Processed</span>
          <p className="text-2xl font-black text-blue-700">42 Orders</p>
          <span className="text-[11px] font-bold text-slate-500 block">This Month</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Store Revenue</span>
          <p className="text-2xl font-black text-slate-900">₹4,85,000</p>
          <span className="text-[11px] font-bold text-emerald-600 block">+15.2% vs last month</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Customer Rating</span>
          <p className="text-2xl font-black text-amber-600 flex items-center gap-1">
            <span>4.9</span>
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          </p>
          <span className="text-[11px] font-bold text-slate-500 block">128 Farmer Reviews</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'products', label: '📦 Product Inventory' },
          { id: 'orders', label: '🛒 Customer Orders' },
          { id: 'inquiries', label: '💬 Farmer Inquiries' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === t.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Products Table */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Active Store Catalog</h3>

          <div className="space-y-3">
            {vendorProducts.map(p => (
              <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <img src={p.imageUrl} alt={p.title} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{p.title}</h4>
                    <p className="text-slate-500">Category: {p.category} • Stock: <span className="font-bold text-slate-900">{p.stockCount} units</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <span className="text-sm font-black text-slate-900">₹{p.price.toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => setVendorProducts(prev => prev.filter(i => i.id !== p.id))}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders View */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Recent Orders Received</h3>

          <div className="space-y-3">
            {[
              { id: 'ORD-9941', customer: 'Ravi Kumar (Farmer)', items: 'Mahindra Dual Clutch Plate Assembly', total: '₹4,500', status: 'CONFIRMED', date: 'Sept 01, 2026' },
              { id: 'ORD-9942', customer: 'Meena Sundaram', items: 'CR 1009 Sub1 Paddy Seeds (10kg)', total: '₹680', status: 'DISPATCHED', date: 'Sept 01, 2026' }
            ].map(ord => (
              <div key={ord.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900">{ord.id} • {ord.customer}</h4>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-md">{ord.status}</span>
                  </div>
                  <p className="text-slate-500">{ord.items} • {ord.date}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-slate-900">{ord.total}</span>
                  <button className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer">
                    Manage Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden my-8 relative p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Add New Product to Storefront</h3>

            <form onSubmit={handleAddProduct} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Swaraj Tractor Oil Filter..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer"
              >
                Publish Product to Marketplace
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
