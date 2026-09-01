import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Camera, 
  Edit3, 
  Search, 
  Store, 
  Wrench, 
  Tractor, 
  FileText, 
  Layers, 
  Upload, 
  Check, 
  RefreshCw
} from 'lucide-react';
import { AgriMarketItem, UserProfile } from '../../types';
import { SAMPLE_MARKETPLACE_PRODUCTS, SAMPLE_SERVICE_CENTERS } from '../../data/marketplaceFullData';

interface AdminVerificationAuditPortalProps {
  profile: UserProfile;
}

export const AdminVerificationAuditPortal: React.FC<AdminVerificationAuditPortalProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'vendors' | 'technicians' | 'images'>('products');
  const [products, setProducts] = useState<AgriMarketItem[]>(SAMPLE_MARKETPLACE_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<AgriMarketItem | null>(null);
  const [editingImage, setEditingImage] = useState<string>('');

  const handleApproveProduct = (id: string) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              isAdminVerified: true,
              isVerifiedSeller: true,
              imageSourceBadge: 'Verified Image',
              imageSourceType: 'ADMIN_VERIFIED'
            }
          : p
      )
    );
  };

  const handleReplaceImage = (id: string, newUrl: string) => {
    if (!newUrl) return;
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              imageUrl: newUrl,
              imageSourceBadge: 'Verified Image',
              imageSourceType: 'ADMIN_VERIFIED',
              isImageUnavailable: false
            }
          : p
      )
    );
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/60 rounded-full border border-emerald-500/30 text-xs font-bold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AgriVeda Compliance & Audit Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Verification & Product Image Audit
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Verify equipment specs, brand models, vendor GST identity & approve exact product photographs.
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black rounded-full shrink-0">
          ADMIN PRIVILEGE ACTIVE ✓
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'products', label: '🚜 Equipment & Products' },
          { id: 'vendors', label: '🏪 Vendor Verification' },
          { id: 'technicians', label: '🔧 Technician Certifications' },
          { id: 'images', label: '📸 Product Image Audit' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === t.id ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Products Verification Grid */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Product Catalog Approval Queue</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover rounded-2xl border border-slate-200" />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border ${
                          p.isAdminVerified ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-900 border-amber-200'
                        }`}>
                          {p.isAdminVerified ? '✓ AGRI VEDA VERIFIED' : 'PENDING AUDIT'}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-bold rounded-md">
                          {p.imageSourceBadge || 'Verified Image'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm truncate">{p.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{p.brand} • Seller: {p.sellerName}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <p><span className="text-slate-400 font-bold">Price:</span> ₹{p.price.toLocaleString('en-IN')}</p>
                    <p><span className="text-slate-400 font-bold">Location:</span> {p.sellerLocation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleApproveProduct(p.id)}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Verify</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setEditingImage(p.imageUrl);
                    }}
                    className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Replace Image</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vendors Verification Queue */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Registered Agri Dealers & Stores</h3>

          <div className="space-y-3">
            {SAMPLE_SERVICE_CENTERS.map(sc => (
              <div key={sc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{sc.businessName}</h4>
                  <p className="text-slate-500">Prop: {sc.ownerName} • {sc.address}</p>
                </div>

                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black rounded-xl border border-emerald-200">
                  VERIFIED DEALER ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Replace Image Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Replace Product Photo ({selectedProduct.title})</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Exact Image URL</label>
              <input
                type="text"
                value={editingImage}
                onChange={(e) => setEditingImage(e.target.value)}
                placeholder="Enter new image URL..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={() => handleReplaceImage(selectedProduct.id, editingImage)}
                className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Save Exact Image
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
