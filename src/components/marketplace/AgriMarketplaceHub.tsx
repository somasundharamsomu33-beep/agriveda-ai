import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  SlidersHorizontal, 
  Star, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Plus, 
  Minus, 
  X, 
  Tractor, 
  Sprout, 
  Wrench, 
  Droplets, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Upload, 
  Camera, 
  Layers, 
  Check, 
  ExternalLink,
  ChevronRight,
  FlaskConical,
  Store
} from 'lucide-react';
import { AgriMarketItem, CartItem, UserProfile } from '../../types';
import { SAMPLE_MARKETPLACE_PRODUCTS } from '../../data/marketplaceFullData';
import { useLanguage } from '../../context/LanguageContext';

interface AgriMarketplaceHubProps {
  profile: UserProfile;
  onOpenCart?: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const AgriMarketplaceHub: React.FC<AgriMarketplaceHubProps> = ({
  profile,
  onNavigateTab
}) => {
  const { t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating' | 'distance'>('recommended');
  
  // E-Commerce States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareItems, setCompareItems] = useState<AgriMarketItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<AgriMarketItem | null>(null);
  const [showCartModal, setShowCartModal] = useState<boolean>(false);
  const [showSparePartRequestModal, setShowSparePartRequestModal] = useState<boolean>(false);
  
  // Spare Part Request State
  const [requestPartName, setRequestPartName] = useState('');
  const [requestTractorModel, setRequestTractorModel] = useState('Mahindra 575 DI');
  const [requestSuccessMsg, setRequestSuccessMsg] = useState('');

  // Cart Helper
  const addToCart = (product: AgriMarketItem, option: 'buy' | 'rent' = 'buy') => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedOption === option);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedOption === option
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedOption: option }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleCompare = (product: AgriMarketItem) => {
    setCompareItems(prev => {
      if (prev.some(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 products at a time.');
        return prev;
      }
      return [...prev, product];
    });
  };

  // Filter & Search Pipeline
  const filteredProducts = useMemo(() => {
    return SAMPLE_MARKETPLACE_PRODUCTS.filter(item => {
      // Category Match
      const matchesCategory =
        activeCategory === 'all' ||
        (activeCategory === 'equipment' && (item.category === 'equipment' || item.category === 'machinery')) ||
        (activeCategory === 'seeds' && item.category === 'seeds') ||
        (activeCategory === 'fertilizers' && item.category === 'fertilizers') ||
        (activeCategory === 'spare_parts' && item.category === 'spare_parts') ||
        (activeCategory === 'irrigation' && item.category === 'irrigation') ||
        (activeCategory === 'farm_tools' && item.category === 'farm_tools');

      // Search Query Match
      const cleanQuery = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !cleanQuery ||
        item.title.toLowerCase().includes(cleanQuery) ||
        item.brand.toLowerCase().includes(cleanQuery) ||
        item.subCategory.toLowerCase().includes(cleanQuery) ||
        item.sellerName.toLowerCase().includes(cleanQuery);

      // Condition Match
      const matchesCondition = selectedCondition === 'ALL' || item.condition === selectedCondition;

      return matchesCategory && matchesSearch && matchesCondition;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      return 0;
    });
  }, [activeCategory, searchQuery, selectedCondition, sortBy]);

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalCartPrice = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Header Banner with Cart & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-700/60 rounded-full border border-blue-400/30 text-xs font-bold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Official AgriVeda E-Commerce Marketplace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Agricultural Marketplace & Storefront
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 font-medium">
            Buy & rent tractors, machinery, certified seeds, fertilizers & genuine spare parts directly from verified dealers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSparePartRequestModal(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span>Request Spare Part</span>
          </button>

          <button
            onClick={() => setShowCartModal(true)}
            className="relative p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 transition-all cursor-pointer"
            title="View Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* E-Commerce Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search tractors, seeds, fertilizers, hydraulic hoses, sprayers..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Condition Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Condition (New & Used)</option>
              <option value="NEW">Brand New Only</option>
              <option value="USED">Used / Rental Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Rating: Highest Rated</option>
              <option value="distance">Distance: Nearest First</option>
            </select>
          </div>
        </div>

        {/* Amazon-style Category Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3 scrollbar-none">
          {[
            { id: 'all', label: '🛒 All Products', icon: Store },
            { id: 'equipment', label: '🚜 Equipment & Tractors', icon: Tractor },
            { id: 'seeds', label: '🌱 Seeds & Variety', icon: Sprout },
            { id: 'fertilizers', label: '🧪 Fertilizers & Inputs', icon: FlaskConical },
            { id: 'spare_parts', label: '🔧 Spare Parts', icon: Wrench },
            { id: 'irrigation', label: '💧 Drip & Pumps', icon: Droplets },
          ].map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Personalized Recommendations Banner for Farmer */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-emerald-950">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-600 text-white rounded-xl">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-emerald-900 block">Personalized for Your Farm ({profile.primaryCrop || 'Tomato'} • {profile.location || 'Kovilpatti'})</span>
            <span className="text-emerald-700">Showing certified seeds, fertilizers & spare parts available near your registered farm parcel.</span>
          </div>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('nearby')}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer"
          >
            Find Nearby Shops 📍
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map(product => {
          const isWishlisted = wishlist.includes(product.id);
          const isCompared = compareItems.some(i => i.id === product.id);

          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group relative"
            >
              {/* Card Image & Badges */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 flex items-center justify-center">
                {product.isImageUnavailable || product.imageSourceBadge === 'Demo Image' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-center space-y-1.5">
                    <div className="w-10 h-10 rounded-2xl bg-white text-slate-500 flex items-center justify-center shadow-xs border border-slate-200">
                      <Camera className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="text-[11px] font-black text-slate-700 leading-tight">
                      Product image unavailable — upload exact image
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 text-[9px] font-extrabold rounded-md">
                      📷 Upload Exact Photo
                    </span>
                  </div>
                ) : (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                    isWishlisted ? 'bg-rose-500 text-white' : 'bg-slate-900/40 text-white hover:bg-slate-900/60'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>

                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider border shadow-xs ${
                    product.condition === 'NEW'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-amber-100 text-amber-900 border-amber-200'
                  }`}>
                    {product.condition}
                  </span>

                  {product.isRentAvailable && (
                    <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-xs">
                      Rent Available
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>{product.brand}</span>
                    <div className="flex items-center gap-1 text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{product.rating} ({product.reviewCount})</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="text-sm font-extrabold text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer leading-tight"
                  >
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{product.sellerName} ({product.distanceKm} km away)</span>
                  </p>
                </div>

                {/* Price Box */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through ml-2">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    {product.discountPercentage && (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {product.rentRateText && (
                    <p className="text-xs font-bold text-blue-700 bg-blue-50 p-1.5 rounded-xl text-center">
                      Rental Option: {product.rentRateText}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => addToCart(product, 'buy')}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>

                    <a
                      href={`tel:${product.sellerPhone}`}
                      className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Seller</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compare Floating Bar */}
      {compareItems.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 z-40 bg-slate-900 text-white p-4 rounded-3xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom-2">
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-white">Compare Products ({compareItems.length}/3)</h4>
            <p className="text-[10px] text-slate-400">Comparing specifications & prices</p>
          </div>

          <div className="flex items-center gap-2">
            {compareItems.map(item => (
              <span key={item.id} className="px-2 py-1 bg-slate-800 text-[10px] font-bold rounded-lg truncate max-w-[100px]">
                {item.title}
              </span>
            ))}
          </div>

          <button
            onClick={() => setCompareItems([])}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold ml-auto cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedProduct.isImageUnavailable || selectedProduct.imageSourceBadge === 'Demo Image' ? (
                  <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-12 h-12 bg-white text-slate-500 rounded-2xl flex items-center justify-center border border-slate-200 shadow-xs">
                      <Camera className="w-6 h-6 text-slate-600" />
                    </div>
                    <h4 className="text-xs font-black text-slate-900">Product image unavailable — upload exact image</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Original photograph not verified by manufacturer/vendor yet.</p>
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black rounded-full">
                      📷 Vendor Image Pending
                    </span>
                  </div>
                ) : (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.title}
                    className="w-full h-64 object-cover rounded-2xl border border-slate-200"
                  />
                )}

                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full border border-blue-200 uppercase">
                    {selectedProduct.brand} • {selectedProduct.category}
                  </span>

                  <h3 className="text-xl font-black text-slate-900">{selectedProduct.title}</h3>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-2xl font-black text-slate-900">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1 text-xs font-semibold">
                    <p><span className="text-slate-400">Seller:</span> {selectedProduct.sellerName}</p>
                    <p><span className="text-slate-400">Location:</span> {selectedProduct.sellerLocation} ({selectedProduct.distanceKm} km)</p>
                    <p><span className="text-slate-400">Stock Available:</span> {selectedProduct.stockCount} units</p>
                  </div>
                </div>
              </div>

              {/* Specifications Table */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-black uppercase text-slate-900">Technical Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                    <div key={key} className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">{key}</span>
                      <span className="font-extrabold text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                    setShowCartModal(true);
                  }}
                  className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>

                <a
                  href={`tel:${selectedProduct.sellerPhone}`}
                  className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contact Dealer</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8 relative p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <span>Shopping Cart ({totalCartCount})</span>
              </h3>
              <button onClick={() => setShowCartModal(false)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Your cart is empty</p>
                <p className="text-xs text-slate-400">Add equipment, seeds, or spare parts to start order.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
                    <img src={item.product.imageUrl} alt={item.product.title} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-slate-900 truncate">{item.product.title}</h4>
                      <p className="text-slate-500 font-semibold">₹{item.product.price.toLocaleString('en-IN')} × {item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-rose-500 hover:text-rose-700 font-bold cursor-pointer">
                      Remove
                    </button>
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-sm font-black text-slate-900">
                    <span>Total Amount Payable:</span>
                    <span className="text-blue-700">₹{totalCartPrice.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    onClick={() => {
                      alert('Order placed successfully! Verified AgriVeda seller will dispatch your order.');
                      setCart([]);
                      setShowCartModal(false);
                    }}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer"
                  >
                    Confirm & Place Order (Cash on Delivery / UPI)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spare Part Photo Upload & Assistance Request Modal */}
      {showSparePartRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden my-8 relative p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-600" />
                <span>Request Custom Spare Part</span>
              </h3>
              <button onClick={() => setShowSparePartRequestModal(false)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {requestSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>{requestSuccessMsg}</p>
                <button
                  onClick={() => {
                    setRequestSuccessMsg('');
                    setShowSparePartRequestModal(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setRequestSuccessMsg('Your spare part request & photo have been submitted to nearby verified spare part retailers and technicians.');
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Tractor / Machine Model</label>
                  <input
                    type="text"
                    required
                    value={requestTractorModel}
                    onChange={(e) => setRequestTractorModel(e.target.value)}
                    placeholder="e.g. Mahindra 575 DI / John Deere 5050D..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Part Name / Description</label>
                  <input
                    type="text"
                    required
                    value={requestPartName}
                    onChange={(e) => setRequestPartName(e.target.value)}
                    placeholder="e.g. Hydraulic Hose 2m / Dual Clutch Plate..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2 bg-slate-50 cursor-pointer hover:bg-slate-100">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Upload Broken Part Photo</p>
                  <p className="text-[10px] text-slate-400">PNG, JPG or Camera snap</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-md cursor-pointer"
                >
                  Send Request to Nearby Retailers & Technicians
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
