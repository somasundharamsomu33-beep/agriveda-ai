import React, { useEffect, useMemo, useState } from 'react';
import { 
  BadgeIndianRupee, CheckCircle2, ChevronRight, Crown, Handshake, MapPin, Search, Send, 
  ShoppingBasket, Tractor, Users, Filter, Plus, Building2, Store, Truck, ShieldCheck, 
  ArrowUpRight, Sparkles, Scale, AlertCircle, Info, RefreshCw, X, Layers, PhoneCall, Check, Tag
} from 'lucide-react';
import { MarketplaceProduct, PriceQuote, UserProfile } from '../types';
import { createMarketplaceListing, createPriceQuote, getMarketplaceListings, getMyQuotes, MarketplaceListing } from '../lib/marketplace';

// Rich diverse mock catalogue spanning Grains, Millets, Pulses, Vegetables, Fruits, Spices, Inputs
const initialProduceList: MarketplaceProduct[] = [
  { 
    id: 'p-paddy', 
    name: 'Seeraga Samba Heritage Rice (Grade A)', 
    category: 'Grains & Millets', 
    seller: 'Vellore Farmer Producer Co.', 
    location: 'Vellore · 5 km', 
    price: 65, 
    retailPrice: 85, 
    unit: 'kg', 
    availableQty: 2400, 
    rating: 4.9, 
    image: '🌾', 
    certified: true,
    tradeType: 'b2b',
    minOrderQty: 100,
    harvestDate: 'Harvested 10 days ago',
    sellerRole: 'collective'
  },
  { 
    id: 'p-ragi', 
    name: 'Pure Organic Ragi (Finger Millet)', 
    category: 'Grains & Millets', 
    seller: 'Salem Dryland Millet Collective', 
    location: 'Salem · 45 km', 
    price: 42, 
    retailPrice: 58, 
    unit: 'kg', 
    availableQty: 1800, 
    rating: 4.9, 
    image: '🌱', 
    certified: true,
    tradeType: 'both',
    minOrderQty: 25,
    harvestDate: 'Fresh Current Crop',
    sellerRole: 'farmer'
  },
  { 
    id: 'p-moong', 
    name: 'Organic Green Gram (Moong Dal)', 
    category: 'Pulses', 
    seller: 'Dharmapuri Pulses Hub', 
    location: 'Dharmapuri · 30 km', 
    price: 95, 
    retailPrice: 125, 
    unit: 'kg', 
    availableQty: 1200, 
    rating: 4.8, 
    image: '🫘', 
    certified: true,
    tradeType: 'b2b',
    minOrderQty: 50,
    harvestDate: 'Sun-dried pure lot',
    sellerRole: 'farmer'
  },
  { 
    id: 'p1', 
    name: 'Farm Fresh Country Tomato (Nattu)', 
    category: 'Vegetables', 
    seller: 'Ravi Farmers Group', 
    location: 'Vellore · 8 km', 
    price: 28, 
    retailPrice: 38, 
    unit: 'kg', 
    availableQty: 850, 
    rating: 4.8, 
    image: '🍅', 
    certified: true,
    tradeType: 'b2c',
    minOrderQty: 5,
    harvestDate: 'Picked Today Morning',
    sellerRole: 'farmer'
  },
  { 
    id: 'p-chilli', 
    name: 'Guntur Teja Sun-Dried Red Chilli', 
    category: 'Spices', 
    seller: 'Andhra Indigenous Seed Savers', 
    location: 'Vellore · 12 km', 
    price: 185, 
    retailPrice: 230, 
    unit: 'kg', 
    availableQty: 600, 
    rating: 4.9, 
    image: '🌶️', 
    certified: true,
    tradeType: 'both',
    minOrderQty: 10,
    harvestDate: 'Premium Export Lot',
    sellerRole: 'vendor'
  },
  { 
    id: 'p2', 
    name: 'Premium Organic Nendran Banana', 
    category: 'Fruits', 
    seller: 'Green Valley Farm Trust', 
    location: 'Katpadi · 12 km', 
    price: 32, 
    retailPrice: 45, 
    unit: 'dozen', 
    availableQty: 420, 
    rating: 4.7, 
    image: '🍌', 
    certified: true,
    tradeType: 'b2c',
    minOrderQty: 2,
    harvestDate: 'Fresh Harvest',
    sellerRole: 'farmer'
  },
];

const initialInputsList: MarketplaceProduct[] = [
  { 
    id: 'i1', 
    name: 'Neem-Coated Bio-Urea (45 kg Bag)', 
    category: 'Fertilizer', 
    seller: 'Sri Balaji Agri Input Store', 
    location: 'Vellore · 4 km', 
    price: 266, 
    unit: 'bag', 
    availableQty: 90, 
    rating: 4.8, 
    image: '🧺', 
    subsidy: 'Government Subsidy Applied (DBT Approved)',
    tradeType: 'both',
    sellerRole: 'vendor'
  },
  { 
    id: 'i2', 
    name: 'Water Soluble DAP 18:46:0 (50 kg Bag)', 
    category: 'Fertilizer', 
    seller: 'Kisan Inputs Direct Outlet', 
    location: 'Katpadi · 7 km', 
    price: 1350, 
    unit: 'bag', 
    availableQty: 55, 
    rating: 4.6, 
    image: '🌱', 
    subsidy: 'DBT Fertilizer Price Control Compliant',
    tradeType: 'both',
    sellerRole: 'vendor'
  },
  { 
    id: 'i3', 
    name: 'Certified KNS-2B Paddy Pureline Seeds', 
    category: 'Seeds', 
    seller: 'Tamil Nadu Farmers Seed Center', 
    location: 'Vellore · 5 km', 
    price: 68, 
    unit: 'kg', 
    availableQty: 450, 
    rating: 4.9, 
    image: '🌾', 
    certified: true,
    tradeType: 'both',
    sellerRole: 'vendor'
  },
  { 
    id: 'i4', 
    name: '7HP Diesel Mini Power Tiller & Weeder', 
    category: 'Equipment', 
    seller: 'Agro Machinery Hub', 
    location: 'Ranipet · 18 km', 
    price: 82500, 
    unit: 'unit', 
    availableQty: 4, 
    rating: 4.5, 
    image: '🚜', 
    subsidy: '50% SMAM Scheme Subsidy Eligible',
    tradeType: 'b2b',
    sellerRole: 'vendor'
  },
];

const initialQuotesList: PriceQuote[] = [
  { id: 'q1', product: 'Seeraga Samba Heritage Rice', quantity: '500 kg', buyer: 'Heritage Foods Wholesale Sourcing', quotedPrice: 68, status: 'Responded' },
  { id: 'q2', product: 'Farm Fresh Country Tomato', quantity: '300 kg', buyer: 'FreshKart Supermarkets', quotedPrice: 30, status: 'Responded' },
  { id: 'q3', product: 'Guntur Teja Sun-Dried Red Chilli', quantity: '100 kg', buyer: 'Mahalakshmi Spices Trading', quotedPrice: 190, status: 'Open' },
];

const categoryList = ['All', 'Grains & Millets', 'Pulses', 'Vegetables', 'Fruits', 'Spices', 'Fertilizer', 'Seeds', 'Equipment'];

export const MarketplaceView: React.FC<{ profile: UserProfile; userId?: string }> = ({ profile, userId }) => {
  const [catalogue, setCatalogue] = useState<'produce' | 'inputs'>('produce');
  const [tradeFilter, setTradeFilter] = useState<'all' | 'b2b' | 'b2c'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [quotes, setQuotes] = useState<PriceQuote[]>(initialQuotesList);
  const [localProduceList, setLocalProduceList] = useState<MarketplaceProduct[]>(initialProduceList);
  const [localInputsList, setLocalInputsList] = useState<MarketplaceProduct[]>(initialInputsList);

  const [showQuoteModal, setShowQuoteModal] = useState<MarketplaceProduct | null>(null);
  const [quotePriceInput, setQuotePriceInput] = useState('');
  const [quoteQuantityInput, setQuoteQuantityInput] = useState('100');
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('pickup');
  
  const [showSellModal, setShowSellModal] = useState(false);
  const [showCollectiveModal, setShowCollectiveModal] = useState(false);
  const [notice, setNotice] = useState('');

  // Form state for posting new listing
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Vegetables');
  const [newPrice, setNewPrice] = useState('');
  const [newRetailPrice, setNewRetailPrice] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newQty, setNewQty] = useState('');
  const [newTradeType, setNewTradeType] = useState<'b2b' | 'b2c' | 'both'>('both');
  const [newCertified, setNewCertified] = useState(true);

  const isVendor = profile.role === 'retail_vendor' || profile.role === 'wholesale_vendor' || profile.role === 'input_vendor';
  const isPro = profile.plan === 'pro';

  useEffect(() => {
    getMarketplaceListings()
      .then(remote => {
        if (remote && remote.length > 0) {
          const produceItems = remote.filter(p => !['Fertilizer', 'Seeds', 'Equipment'].includes(p.category));
          const inputItems = remote.filter(p => ['Fertilizer', 'Seeds', 'Equipment'].includes(p.category));
          if (produceItems.length > 0) setLocalProduceList(prev => [...remote, ...prev]);
          if (inputItems.length > 0) setLocalInputsList(prev => [...inputItems, ...prev]);
        }
      })
      .catch(() => undefined);

    if (userId) {
      getMyQuotes(userId)
        .then(remoteQuotes => {
          if (remoteQuotes && remoteQuotes.length > 0) setQuotes(remoteQuotes);
        })
        .catch(() => undefined);
    }
  }, [userId]);

  const activeProducts = catalogue === 'produce' ? localProduceList : localInputsList;

  const visibleProducts = useMemo(() => {
    return activeProducts.filter(p => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.seller.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTrade = tradeFilter === 'all' || p.tradeType === 'both' || p.tradeType === tradeFilter;
      return matchCategory && matchSearch && matchTrade;
    });
  }, [activeProducts, selectedCategory, searchQuery, tradeFilter]);

  // Handle posting a new listing (Farmers & Vendors)
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newQty) return;

    const newListing: MarketplaceProduct = {
      id: `custom-prod-${Date.now()}`,
      name: newTitle,
      category: newCategory,
      seller: profile.name || 'AgriVeda Farmer Producer',
      location: profile.location || 'Vellore, Tamil Nadu',
      price: Number(newPrice),
      retailPrice: newRetailPrice ? Number(newRetailPrice) : Number(newPrice) * 1.25,
      unit: newUnit,
      availableQty: Number(newQty),
      rating: 5.0,
      image: newCategory === 'Grains & Millets' ? '🌾' : newCategory === 'Pulses' ? '🫘' : newCategory === 'Spices' ? '🌶️' : newCategory === 'Fruits' ? '🍌' : newCategory === 'Fertilizer' ? '🌱' : newCategory === 'Equipment' ? '🚜' : '🥦',
      certified: newCertified,
      tradeType: newTradeType,
      sellerRole: isVendor ? 'vendor' : 'farmer'
    };

    if (['Fertilizer', 'Seeds', 'Equipment'].includes(newCategory)) {
      setLocalInputsList(prev => [newListing, ...prev]);
    } else {
      setLocalProduceList(prev => [newListing, ...prev]);
    }

    if (userId) {
      try {
        await createMarketplaceListing(userId, profile, {
          name: newListing.name,
          category: newListing.category,
          price: newListing.price,
          retailPrice: newListing.retailPrice,
          unit: newListing.unit,
          availableQty: newListing.availableQty,
          rating: 5.0,
          image: newListing.image,
          certified: newListing.certified,
          tradeType: newListing.tradeType,
          saleMode: newListing.tradeType === 'b2b' ? 'wholesale' : newListing.tradeType === 'b2c' ? 'retail' : 'both',
          isActive: true
        });
      } catch (err) {
        console.error('Error saving listing to remote database:', err);
      }
    }

    setNotice(`🎉 Your listing "${newTitle}" is now live on the AgriVeda B2B/B2C Marketplace!`);
    setShowSellModal(false);
    setNewTitle('');
    setNewPrice('');
    setNewQty('');
  };

  // Submit quote RFQ
  const submitQuote = async () => {
    if (!showQuoteModal || !quotePriceInput) return;
    const finalPrice = Number(quotePriceInput);
    const finalQty = Number(quoteQuantityInput) || 100;

    if (userId && (showQuoteModal as MarketplaceListing).ownerId) {
      try {
        await createPriceQuote(userId, profile, showQuoteModal, finalPrice, finalQty);
      } catch (err) {
        console.error('Error creating price quote:', err);
      }
    }

    const newQuote: PriceQuote = {
      id: `q-${Date.now()}`,
      product: showQuoteModal.name,
      quantity: `${finalQty} ${showQuoteModal.unit}`,
      buyer: profile.name || 'Nearby Sourcing Partner',
      quotedPrice: finalPrice,
      status: 'Open'
    };

    setQuotes(prev => [newQuote, ...prev]);
    setNotice(`✅ Request for Quote (RFQ) of ₹${finalPrice}/${showQuoteModal.unit} for ${finalQty} ${showQuoteModal.unit} sent to ${showQuoteModal.seller}.`);
    setShowQuoteModal(null);
    setQuotePriceInput('');
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in max-w-6xl mx-auto">
      
      {/* Hero Banner with Multi-Role Trading Engine */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-2xl overflow-hidden relative border border-slate-800">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 select-none pointer-events-none">🚜</div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Handshake className="w-3.5 h-3.5" /> Multi-Role Trade Ecosystem
            </span>
            <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Certified Direct Sourcing
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            AgriVeda B2B & B2C Marketplace
          </h1>

          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            Connecting <strong className="text-emerald-400">Farmers</strong>, <strong className="text-amber-400">Wholesale Vendors</strong>, and <strong className="text-cyan-400">Direct Buyers</strong>. Sourcing fresh harvest in bulk tonnage or selling retail at transparent daily Mandi prices.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowSellModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>List Crop Harvest / Inputs for Sale</span>
            </button>

            <button
              onClick={() => setShowCollectiveModal(true)}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Join Farmer Collective (Bulk Pool)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Role & Catalogue Navigation Bar */}
      <section className="bg-slate-900 p-2 sm:p-3 rounded-2xl border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-3">
        {/* Main Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => { setCatalogue('produce'); setSelectedCategory('All'); }}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${
              catalogue === 'produce'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Farm Produce (Harvest)</span>
          </button>

          <button
            onClick={() => { setCatalogue('inputs'); setSelectedCategory('All'); }}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${
              catalogue === 'inputs'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tractor className="w-4 h-4" />
            <span>Agri Inputs & Machinery</span>
          </button>
        </div>

        {/* Trade Mode Filter (B2B Bulk vs B2C Retail) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Trade Mode:</span>
          {(['all', 'b2b', 'b2c'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setTradeFilter(mode)}
              className={`px-3 py-1.5 rounded-lg font-extrabold uppercase text-[10px] transition-all ${
                tradeFilter === mode
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === 'all' ? 'All Trade' : mode === 'b2b' ? '🏢 B2B Bulk' : '🛒 B2C Retail'}
            </button>
          ))}
        </div>
      </section>

      {/* Market Stats & Daily Price Slabs */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Farmer Collectives */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-wider">Farmer Groups</span>
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full">
              45+ Collectives
            </span>
          </div>
          <p className="text-sm font-black text-slate-900">Pool Harvest for Tonnage Supply</p>
          <p className="text-xs text-slate-500 mt-1">Combine paddy, ragi, or pulses with neighboring farmers to secure +18% higher B2B contracts.</p>
          <button
            onClick={() => setShowCollectiveModal(true)}
            className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Explore Farmer Pools</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Mandi Price Slabs */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <div className="flex items-center gap-2">
              <BadgeIndianRupee className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-wider">Daily Mandi Slab</span>
            </div>
            <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">
              Live Mandi Ticker
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-base font-black text-slate-900">Paddy ₹24.5/kg • Ragi ₹42/kg</p>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tomato ₹35/kg • Chilli ₹185/kg (Vellore &amp; Guntur Mandis)</p>
        </div>

        {/* Card 3: Vendor & Equipment Schemes */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-wider">Vendor &amp; B2B Portal</span>
            </div>
            <span className="text-[10px] font-extrabold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full">
              FSSAI / GST Verified
            </span>
          </div>
          <p className="text-sm font-black text-slate-900">Subsidized Machinery &amp; Inputs</p>
          <p className="text-xs text-slate-500 mt-1">Direct government notified prices for Neem Urea, DAP, and certified pureline seeds.</p>
          <button
            onClick={() => setNotice('Vendor Pro tools are active for verified B2B buyers and input sellers.')}
            className="mt-3 text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Verified Vendor Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

      {/* Main Product Catalogue */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
        
        {/* Search & Category Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>A–Z Product &amp; Crop Catalogue</span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {visibleProducts.length} items
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {catalogue === 'produce' 
                ? 'Fresh grains, millets, pulses, vegetables & spices directly from growers' 
                : 'Government certified fertilizers, seeds, tools and farm machinery'}
            </p>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by crop, variety or vendor..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoryList
            .filter(c => c === 'All' || activeProducts.some(p => p.category === c))
            .map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          {visibleProducts.map(product => (
            <article 
              key={product.id} 
              className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between bg-white group"
            >
              <div>
                {/* Header Image & Badge */}
                <div className="h-32 bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-100 flex items-center justify-center text-6xl relative group-hover:scale-105 transition-transform">
                  <span>{product.image}</span>
                  
                  {product.tradeType && (
                    <span className={`absolute top-2 left-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border shadow-xs ${
                      product.tradeType === 'b2b'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : product.tradeType === 'b2c'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-purple-600 text-white border-purple-500'
                    }`}>
                      {product.tradeType === 'b2b' ? '🏢 B2B Wholesale' : product.tradeType === 'b2c' ? '🛒 B2C Retail' : '🌐 B2B + B2C'}
                    </span>
                  )}

                  {product.certified && (
                    <span className="absolute top-2 right-2 p-1 bg-white/90 backdrop-blur-xs rounded-full shadow-xs text-emerald-600" title="Certified Organic / FSSAI Quality">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{product.seller}</span>
                  </p>

                  <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{product.location}</span>
                  </p>

                  {product.harvestDate && (
                    <p className="text-[10px] font-bold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded-md">
                      🌱 {product.harvestDate}
                    </p>
                  )}

                  {/* Price & Minimum Order */}
                  <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
                    <div>
                      <p className="text-lg font-black text-slate-900">
                        ₹{product.price}<span className="text-xs font-normal text-slate-500">/{product.unit}</span>
                      </p>
                      {product.retailPrice && product.retailPrice !== product.price && (
                        <p className="text-[10px] text-slate-400 line-through">Retail ₹{product.retailPrice}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-extrabold text-slate-600">Stock: {product.availableQty} {product.unit}</p>
                      {product.minOrderQty && (
                        <p className="text-[10px] text-amber-700 font-bold">MOQ: {product.minOrderQty} {product.unit}</p>
                      )}
                    </div>
                  </div>

                  {product.subsidy && (
                    <p className="text-[10px] font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      💡 {product.subsidy}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => setShowQuoteModal(product)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{catalogue === 'produce' ? 'Send B2B / B2C Quote' : 'Contact Vendor / Order'}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Quote Centre & Pro Sourcing */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Quote Centre */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-black text-slate-900 text-base">Request for Quotation (RFQ) Centre</h2>
              <p className="text-xs text-slate-500">Direct buyer offers and farmer/vendor responses</p>
            </div>
            <Send className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-2.5">
            {quotes.map(q => (
              <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-900">{q.product}</p>
                  <p className="text-[11px] text-slate-500 font-semibold">Quantity: {q.quantity} • Buyer: {q.buyer}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">₹{q.quotedPrice}/unit</p>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    q.status === 'Open' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {q.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Pro & Sourcing Verification */}
        <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-900 via-slate-900 to-purple-950 text-white p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <Crown className="w-5 h-5" />
                <h2 className="font-black text-white text-base">AgriVeda Vendor Pro &amp; Bulk B2B Sourcing</h2>
              </div>
              {isPro && <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-emerald-500 text-slate-950 rounded-full">Pro Verified</span>}
            </div>

            <p className="text-xs text-purple-200 leading-relaxed font-medium">
              Designed for institutional buyers, supermarket chains, input distributors, and contract farming collectives.
            </p>

            <ul className="space-y-2 text-xs text-purple-100 font-semibold pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Daily regional Mandi price slabs by quantity &amp; location</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Priority farmer group pooling (50+ Tonnes guaranteed harvest)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>GSTIN verification &amp; escrow payment protection</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setNotice(isPro ? 'Your Vendor Pro tools are fully active.' : 'Vendor Pro verification saved. Our trade desk will contact you within 24 hours.')}
            className="mt-5 w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md"
          >
            {isPro ? 'Manage Vendor Pro Dashboard' : isVendor ? 'Request Pro Verification' : 'Register as Verified B2B Buyer / Vendor'}
          </button>
        </div>

      </section>

      {/* Floating Notification */}
      {notice && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="p-1 hover:bg-slate-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quote / RFQ Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 p-4 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <ShoppingBasket className="w-5 h-5" />
                <h3 className="font-black text-slate-900 text-base">Send Quote / RFQ</h3>
              </div>
              <button onClick={() => setShowQuoteModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <p className="text-sm font-black text-slate-900">{showQuoteModal.name}</p>
              <p className="text-xs text-slate-500 font-medium">Seller: {showQuoteModal.seller} ({showQuoteModal.location})</p>
              <p className="text-xs font-extrabold text-emerald-700">Listed Price: ₹{showQuoteModal.price} / {showQuoteModal.unit}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Quantity ({showQuoteModal.unit})</label>
                <input
                  type="number"
                  value={quoteQuantityInput}
                  onChange={e => setQuoteQuantityInput(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Offered Price (₹ / {showQuoteModal.unit})</label>
                <input
                  type="number"
                  value={quotePriceInput}
                  onChange={e => setQuotePriceInput(e.target.value)}
                  placeholder={`Market price ₹${showQuoteModal.price}`}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {quotePriceInput && quoteQuantityInput && (
                <div className="p-3 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-800 flex justify-between">
                  <span>Estimated Total Offer:</span>
                  <span className="font-black text-sm">₹{(Number(quotePriceInput) * Number(quoteQuantityInput)).toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowQuoteModal(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={submitQuote}
                className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-sm"
              >
                Send Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post New Listing Modal (Farmers & Vendors) */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 p-4 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
          <form onSubmit={handleCreateListing} className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <Plus className="w-5 h-5" />
                <h3 className="font-black text-slate-900 text-base">List Harvest / Product for Sale</h3>
              </div>
              <button type="button" onClick={() => setShowSellModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product / Crop Title</label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Organic Seeraga Samba Rice or Fresh Tomatoes"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Grains & Millets">Grains &amp; Millets</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Spices">Spices</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trade Mode</label>
                  <select
                    value={newTradeType}
                    onChange={e => setNewTradeType(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="both">Both (B2B + B2C)</option>
                    <option value="b2b">🏢 B2B Bulk Wholesale</option>
                    <option value="b2c">🛒 B2C Retail</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wholesale Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    placeholder="e.g. 65"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Retail Ref Price (₹)</label>
                  <input
                    type="number"
                    value={newRetailPrice}
                    onChange={e => setNewRetailPrice(e.target.value)}
                    placeholder="e.g. 85"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                  <select
                    value={newUnit}
                    onChange={e => setNewUnit(e.target.value)}
                    className="w-full px-2.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="kg">per kg</option>
                    <option value="quintal">per quintal</option>
                    <option value="ton">per ton</option>
                    <option value="bag">per bag</option>
                    <option value="unit">per unit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Available Quantity</label>
                <input
                  required
                  type="number"
                  value={newQty}
                  onChange={e => setNewQty(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="certCheck"
                  checked={newCertified}
                  onChange={e => setNewCertified(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="certCheck" className="text-xs font-bold text-slate-700">
                  Certified Organic / FSSAI Compliant Lot
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowSellModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-sm"
              >
                Publish Listing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Farmer Collective Sourcing Modal */}
      {showCollectiveModal && (
        <div className="fixed inset-0 z-50 p-4 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <Users className="w-5 h-5" />
                <h3 className="font-black text-slate-900 text-base">Active Farmer Collectives &amp; Harvest Pools</h3>
              </div>
              <button onClick={() => setShowCollectiveModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-emerald-950 text-sm">Vellore Paddy Growers Collective</h4>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-emerald-600 text-white rounded-md">45 Tonnes Pooled</span>
                </div>
                <p className="text-xs text-emerald-800">18 Farmers combined harvest of Seeraga Samba Rice for corporate bulk order.</p>
                <button
                  onClick={() => {
                    setNotice('🎉 You have requested to join the Vellore Paddy Growers Collective!');
                    setShowCollectiveModal(false);
                  }}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs mt-1"
                >
                  Join Pool (+18% Better Profit)
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-amber-950 text-sm">Salem Millet &amp; Ragi Producer Hub</h4>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-amber-600 text-white rounded-md">28 Tonnes Pooled</span>
                </div>
                <p className="text-xs text-amber-800">12 Dryland farmers pooling organic Finger Millet for direct retail chains.</p>
                <button
                  onClick={() => {
                    setNotice('🎉 You have requested to join the Salem Millet Producer Hub!');
                    setShowCollectiveModal(false);
                  }}
                  className="w-full py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs mt-1"
                >
                  Join Pool (+15% Better Profit)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
