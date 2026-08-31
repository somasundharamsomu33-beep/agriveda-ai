import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BadgeIndianRupee, CheckCircle2, ChevronRight, Crown, Handshake, MapPin, Search, Send, 
  ShoppingBasket, Tractor, Users, Filter, Plus, Building2, Store, Truck, ShieldCheck, 
  ArrowUpRight, Sparkles, Scale, AlertCircle, Info, RefreshCw, X, Layers, PhoneCall, Check, Tag,
  TrendingUp, TrendingDown, BarChart2, SlidersHorizontal, Zap, PackageCheck, Award, ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { MarketplaceProduct, PriceQuote, UserProfile } from '../types';
import { createMarketplaceListing, createPriceQuote, getMarketplaceListings, getMyQuotes, MarketplaceListing } from '../lib/marketplace';

// Mandi Price Trend Data for Interactive Framer Radar Chart
const mandiPriceTrends: Record<string, { name: string; unit: string; current: number; change: string; isUp: boolean; data: { day: string; price: number }[] }> = {
  paddy: {
    name: 'Seeraga Samba Paddy',
    unit: '₹/kg',
    current: 65,
    change: '+14.2%',
    isUp: true,
    data: [
      { day: '01 Aug', price: 56 },
      { day: '05 Aug', price: 58 },
      { day: '10 Aug', price: 60 },
      { day: '15 Aug', price: 62 },
      { day: '20 Aug', price: 65 }
    ]
  },
  ragi: {
    name: 'Organic Finger Millet (Ragi)',
    unit: '₹/kg',
    current: 42,
    change: '+8.5%',
    isUp: true,
    data: [
      { day: '01 Aug', price: 38 },
      { day: '05 Aug', price: 39 },
      { day: '10 Aug', price: 40 },
      { day: '15 Aug', price: 41 },
      { day: '20 Aug', price: 42 }
    ]
  },
  tomato: {
    name: 'Country Tomato (Nattu)',
    unit: '₹/kg',
    current: 28,
    change: '-6.5%',
    isUp: false,
    data: [
      { day: '01 Aug', price: 34 },
      { day: '05 Aug', price: 32 },
      { day: '10 Aug', price: 30 },
      { day: '15 Aug', price: 29 },
      { day: '20 Aug', price: 28 }
    ]
  },
  chilli: {
    name: 'Guntur Teja Red Chilli',
    unit: '₹/kg',
    current: 185,
    change: '+18.0%',
    isUp: true,
    data: [
      { day: '01 Aug', price: 155 },
      { day: '05 Aug', price: 162 },
      { day: '10 Aug', price: 170 },
      { day: '15 Aug', price: 178 },
      { day: '20 Aug', price: 185 }
    ]
  },
  dap: {
    name: 'Water Soluble DAP 18:46:0',
    unit: '₹/bag',
    current: 1350,
    change: '0.0% (Subsidized)',
    isUp: true,
    data: [
      { day: '01 Aug', price: 1350 },
      { day: '05 Aug', price: 1350 },
      { day: '10 Aug', price: 1350 },
      { day: '15 Aug', price: 1350 },
      { day: '20 Aug', price: 1350 }
    ]
  }
};

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
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'qty-high'>('popular');
  const [activeMandiCrop, setActiveMandiCrop] = useState<string>('paddy');
  
  const [quotes, setQuotes] = useState<PriceQuote[]>(initialQuotesList);
  const [localProduceList, setLocalProduceList] = useState<MarketplaceProduct[]>(initialProduceList);
  const [localInputsList, setLocalInputsList] = useState<MarketplaceProduct[]>(initialInputsList);

  const [showQuoteModal, setShowQuoteModal] = useState<MarketplaceProduct | null>(null);
  const [quotePriceInput, setQuotePriceInput] = useState('');
  const [quoteQuantityInput, setQuoteQuantityInput] = useState('100');
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('pickup');
  
  const [showSellModal, setShowSellModal] = useState(false);
  const [showCollectiveModal, setShowCollectiveModal] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<MarketplaceProduct | null>(null);
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
    let filtered = activeProducts.filter(p => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.seller.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTrade = tradeFilter === 'all' || p.tradeType === 'both' || p.tradeType === tradeFilter;
      return matchCategory && matchSearch && matchTrade;
    });

    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'qty-high') {
      filtered = [...filtered].sort((a, b) => b.availableQty - a.availableQty);
    }

    return filtered;
  }, [activeProducts, selectedCategory, searchQuery, tradeFilter, sortBy]);

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

  const selectedMandiData = mandiPriceTrends[activeMandiCrop] || mandiPriceTrends.paddy;

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      
      {/* Top Header Banner */}
      <motion.section 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-800"
      >
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Handshake className="w-3.5 h-3.5 text-amber-300" /> Direct Farm Marketplace
              </span>
              <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-emerald-800 text-emerald-100 border border-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Verified Seeds & Inputs
              </span>
            </div>

            {/* Quick Mandi Live Ticker Badge */}
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700/80 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300">Live Mandi Index:</span>
              <span className="text-emerald-400 font-mono font-black">₹2,840 / Qtl</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight flex items-center gap-3">
              <span>AgriVeda Marketplace Dashboard</span>
              <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse hidden sm:inline-block" />
            </h1>

            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              Connect directly with verified growers, wholesale buyers, and equipment vendors. Trade fresh farm harvest in bulk tonnage or retail with transparent daily Mandi prices.
            </p>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Tonnage Live</p>
              <p className="text-xl font-black text-white mt-0.5">8,320 <span className="text-xs font-semibold text-emerald-400">kg</span></p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Farmer Collectives</p>
              <p className="text-xl font-black text-white mt-0.5">45+ <span className="text-xs font-semibold text-amber-400">Pools</span></p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Average Savings</p>
              <p className="text-xl font-black text-white mt-0.5">+18.5% <span className="text-xs font-semibold text-blue-400">Margin</span></p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400">Active RFQ Requests</p>
              <p className="text-xl font-black text-white mt-0.5">{quotes.length} <span className="text-xs font-semibold text-purple-400">Quotes</span></p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSellModal(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>List Crop Harvest / Inputs for Sale</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCollectiveModal(true)}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Join Farmer Collective (Bulk Pool)</span>
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Interactive Framer Mandi Price Radar Chart */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
              <TrendingUp className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>Interactive Mandi Price Radar</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Real-time Regional Trends
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">Daily spot price trajectory in Mandis across Vellore, Salem, &amp; Guntur</p>
            </div>
          </div>

          {/* Crop Selector Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto scrollbar-none">
            {Object.keys(mandiPriceTrends).map(key => {
              const item = mandiPriceTrends[key];
              const isActive = activeMandiCrop === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveMandiCrop(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all ${
                    isActive ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Crop Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Selected Commodity</span>
            <p className="font-black text-slate-900 text-sm">{selectedMandiData.name}</p>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-black text-slate-900">₹{selectedMandiData.current}</span>
              <span className="text-xs font-semibold text-slate-500">{selectedMandiData.unit}</span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                selectedMandiData.isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {selectedMandiData.change}
              </span>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="md:col-span-3 h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedMandiData.data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2 rounded-xl text-xs font-bold shadow-lg border border-slate-800">
                          <p>{payload[0].payload.day}: <span className="text-emerald-400">₹{payload[0].value} / kg</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#priceGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>

      {/* Navigation & Filter Control Bar */}
      <section className="bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Main Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => { setCatalogue('produce'); setSelectedCategory('All'); }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
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
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                catalogue === 'inputs'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tractor className="w-4 h-4" />
              <span>Agri Inputs &amp; Machinery</span>
            </button>
          </div>

          {/* Trade Mode Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 hidden sm:inline">Trade:</span>
            {(['all', 'b2b', 'b2c'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setTradeFilter(mode)}
                className={`px-3 py-1.5 rounded-lg font-extrabold uppercase text-[10px] transition-all cursor-pointer ${
                  tradeFilter === mode
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'all' ? 'All Trade' : mode === 'b2b' ? '🏢 B2B Bulk' : '🛒 B2C Retail'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Product Catalogue Section */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
        
        {/* Search, Sort & Category Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{catalogue === 'produce' ? '🌾 Farm Fresh Produce Catalogue' : '🚜 Agri Inputs &amp; Machinery Hub'}</span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {visibleProducts.length} items
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {catalogue === 'produce' 
                ? 'Grains, millets, pulses, vegetables & spices directly from registered growers' 
                : 'Government certified fertilizers, pureline seeds, tools and farm machinery'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search crop, variety or seller..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            {/* Sort By Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="popular">Popularity / Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="qty-high">Quantity: Highest Available</option>
            </select>
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
        </div>

        {/* Animated Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map(product => (
              <motion.article 
                layout
                key={product.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between bg-white group border-slate-200/90"
              >
                <div>
                  {/* Header Image & Badge */}
                  <div className="h-32 bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-100 flex items-center justify-center text-6xl relative overflow-hidden">
                    <span className="transform group-hover:scale-110 transition-transform duration-300">{product.image}</span>
                    
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

                    {/* Stock Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>Stock Available</span>
                        <span className="text-slate-900 font-black">{product.availableQty} {product.unit}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(100, (product.availableQty / 3000) * 100)}%` }}
                        />
                      </div>
                    </div>

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

                      {product.minOrderQty && (
                        <div className="text-right">
                          <p className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            MOQ: {product.minOrderQty} {product.unit}
                          </p>
                        </div>
                      )}
                    </div>

                    {product.subsidy && (
                      <p className="text-[10px] font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        💡 {product.subsidy}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 pt-0 space-y-1.5">
                  <button
                    onClick={() => setShowQuoteModal(product)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{catalogue === 'produce' ? 'Send B2B / B2C Quote' : 'Contact Vendor / Order'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedProductDetail(product)}
                    className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-900 font-bold flex items-center justify-center gap-1"
                  >
                    <span>View Quality Specs &amp; Certificate</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Quote RFQ Centre & Pro Sourcing Desk */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* RFQ Centre */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-black text-slate-900 text-base">Request for Quotation (RFQ) Centre</h2>
              <p className="text-xs text-slate-500">Direct buyer offers and farmer/vendor response desk</p>
            </div>
            <Send className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-2.5">
            {quotes.map(q => (
              <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-slate-300 transition-all">
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
        <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900 text-white p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3 relative z-10">
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
            className="mt-5 w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer relative z-10"
          >
            {isPro ? 'Manage Vendor Pro Dashboard' : isVendor ? 'Request Pro Verification' : 'Register as Verified B2B Buyer / Vendor'}
          </button>
        </div>

      </section>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {notice && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-3 border border-slate-700"
          >
            <span>{notice}</span>
            <button onClick={() => setNotice('')} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quality Specs Detail Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 p-4 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-base">Crop Quality &amp; Lab Specs</h3>
              </div>
              <button onClick={() => setSelectedProductDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-sm font-black text-slate-900">{selectedProductDetail.name}</p>
                <p className="text-xs text-slate-500 font-medium">Seller: {selectedProductDetail.seller}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Moisture Content</span>
                  <span className="font-extrabold text-slate-800">11.8% (Optimal)</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Purity Grade</span>
                  <span className="font-extrabold text-slate-800">99.4% Clean Lot</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Certification</span>
                  <span className="font-extrabold text-emerald-700">FSSAI / NPOP Organic</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Storage Hub</span>
                  <span className="font-extrabold text-slate-800">Vellore Agri Warehouse</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowQuoteModal(selectedProductDetail);
                setSelectedProductDetail(null);
              }}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Proceed to Request Quote</span>
            </button>
          </div>
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
