import React, { useEffect, useMemo, useState } from 'react';
import { BadgeIndianRupee, CheckCircle2, ChevronRight, Crown, Handshake, MapPin, Search, Send, ShoppingBasket, Tractor, Users } from 'lucide-react';
import { MarketplaceProduct, PriceQuote, UserProfile } from '../types';
import { createPriceQuote, getMarketplaceListings, getMyQuotes, MarketplaceListing } from '../lib/marketplace';

const produce: MarketplaceProduct[] = [
  { id: 'p1', name: 'Farm Fresh Tomato', category: 'Vegetables', seller: 'Ravi Farmers Group', location: 'Vellore · 8 km', price: 28, retailPrice: 38, unit: 'kg', availableQty: 850, rating: 4.8, image: '🍅', certified: true },
  { id: 'p2', name: 'Premium Banana', category: 'Fruits', seller: 'Green Valley Farm', location: 'Katpadi · 12 km', price: 32, retailPrice: 45, unit: 'dozen', availableQty: 420, rating: 4.7, image: '🍌', certified: true },
  { id: 'p3', name: 'Turmeric Fingers', category: 'Spices', seller: 'Amirtha Collective', location: 'Vellore · 15 km', price: 165, retailPrice: 220, unit: 'kg', availableQty: 200, rating: 4.9, image: '🫚' },
  { id: 'p4', name: 'Toor Dal', category: 'Dry goods', seller: 'Kaveri Farm Hub', location: 'Arcot · 20 km', price: 118, retailPrice: 145, unit: 'kg', availableQty: 350, rating: 4.6, image: '🫘' },
];

const inputs: MarketplaceProduct[] = [
  { id: 'i1', name: 'Urea 45 kg', category: 'Fertilizer', seller: 'Sri Balaji Agri Store', location: 'Vellore · 4 km', price: 266, unit: 'bag', availableQty: 90, rating: 4.8, image: '🧺', subsidy: 'Government notified price; subsidy included' },
  { id: 'i2', name: 'DAP 50 kg', category: 'Fertilizer', seller: 'Kisan Inputs', location: 'Katpadi · 7 km', price: 1350, unit: 'bag', availableQty: 55, rating: 4.6, image: '🌱', subsidy: 'Government notified price; subsidy included' },
  { id: 'i3', name: 'Certified Paddy Seeds', category: 'Seeds', seller: 'Tamil Seeds Centre', location: 'Vellore · 5 km', price: 68, unit: 'kg', availableQty: 250, rating: 4.7, image: '🌾', certified: true },
  { id: 'i4', name: 'Mini Power Tiller', category: 'Equipment', seller: 'Agro Machine Point', location: 'Ranipet · 18 km', price: 82500, unit: 'unit', availableQty: 4, rating: 4.5, image: '🚜', subsidy: 'Eligible equipment may receive scheme support—verify with dealer' },
];

const initialQuotes: PriceQuote[] = [
  { id: 'q1', product: 'Farm Fresh Tomato', quantity: '300 kg', buyer: 'FreshKart Retail', quotedPrice: 30, status: 'Responded' },
  { id: 'q2', product: 'Turmeric Fingers', quantity: '100 kg', buyer: 'Mahalakshmi Traders', quotedPrice: 172, status: 'Open' },
];

const categories = ['All', 'Vegetables', 'Fruits', 'Spices', 'Dry goods', 'Fertilizer', 'Seeds', 'Equipment'];

export const MarketplaceView: React.FC<{ profile: UserProfile; userId?: string }> = ({ profile, userId }) => {
  const [catalogue, setCatalogue] = useState<'produce' | 'inputs'>('produce');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [quotes, setQuotes] = useState(initialQuotes);
  const [showQuote, setShowQuote] = useState<MarketplaceProduct | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [notice, setNotice] = useState('');
  const [remoteListings, setRemoteListings] = useState<MarketplaceListing[]>([]);
  const isVendor = profile.role === 'retail_vendor' || profile.role === 'wholesale_vendor' || profile.role === 'input_vendor';
  const isPro = profile.plan === 'pro';
  const products = remoteListings.length > 0 ? remoteListings.filter(product => catalogue === 'inputs' ? ['Fertilizer', 'Seeds', 'Equipment'].includes(product.category) : !['Fertilizer', 'Seeds', 'Equipment'].includes(product.category)) : catalogue === 'produce' ? produce : inputs;
  const visibleProducts = useMemo(() => products.filter(p => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase())), [products, category, query]);

  useEffect(() => {
    getMarketplaceListings().then(setRemoteListings).catch(() => undefined);
    if (userId) getMyQuotes(userId).then(remoteQuotes => remoteQuotes.length && setQuotes(remoteQuotes)).catch(() => undefined);
  }, [userId]);

  const submitQuote = async () => {
    if (!showQuote || !quotePrice) return;
    try {
      if (userId && (showQuote as MarketplaceListing).ownerId) await createPriceQuote(userId, profile, showQuote, Number(quotePrice));
      setQuotes(prev => [{ id: `q${Date.now()}`, product: showQuote.name, quantity: '100 kg', buyer: profile.name || 'Nearby buyer', quotedPrice: Number(quotePrice), status: 'Open' }, ...prev]);
      setNotice(userId ? 'Quote sent. The seller will be notified and can respond in this app.' : 'Quote saved on this device. Sign in to send it to the seller.');
      setShowQuote(null); setQuotePrice('');
    } catch {
      setNotice('Your quote could not be sent yet. Please check your connection and sign in again.');
    }
  };

  return <div className="space-y-5 pb-8">
    <section className="rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-lime-700 text-white p-5 sm:p-7 shadow-xl overflow-hidden relative">
      <div className="absolute right-0 bottom-0 text-9xl opacity-10">🌾</div>
      <div className="relative max-w-2xl">
        <div className="flex items-center gap-2 text-emerald-100 text-xs font-bold uppercase tracking-wider"><Handshake className="w-4 h-4" /> Direct farm-to-market trade</div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black">AgriVeda Marketplace</h1>
        <p className="mt-2 text-sm text-emerald-50">Buy nearby retail, source wholesale, or sell together as a farmer group—with clear daily prices.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => { setCatalogue('produce'); setCategory('All'); }} className="px-4 py-2 rounded-xl bg-white text-emerald-800 text-xs font-extrabold">Farm produce</button>
          <button onClick={() => { setCatalogue('inputs'); setCategory('All'); }} className="px-4 py-2 rounded-xl bg-emerald-950/25 border border-white/25 text-xs font-extrabold">Farm inputs & equipment</button>
        </div>
      </div>
    </section>

    <section className="grid sm:grid-cols-3 gap-3">
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><div className="text-emerald-700 flex items-center gap-2"><Users className="w-5 h-5"/><span className="text-xs font-extrabold">Farmer Groups</span></div><p className="mt-2 text-sm font-bold">Pool crops for larger orders</p><button onClick={() => setNotice('Farmer group matching will connect growers with the same crop and harvest window.')} className="mt-2 text-xs text-emerald-700 font-bold">Find a group <ChevronRight className="inline w-3 h-3"/></button></div>
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><div className="text-amber-700 flex items-center gap-2"><BadgeIndianRupee className="w-5 h-5"/><span className="text-xs font-extrabold">Today’s price slab</span></div><p className="mt-2 text-sm font-bold">Retail ₹38 · Wholesale ₹28</p><p className="text-[11px] text-slate-500 mt-1">Tomato / kg · updates daily</p></div>
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"><div className="text-blue-700 flex items-center gap-2"><Tractor className="w-5 h-5"/><span className="text-xs font-extrabold">Finance & schemes</span></div><p className="mt-2 text-sm font-bold">Equipment loans & support</p><button onClick={() => setNotice('Loan and subsidy eligibility needs to be verified with your bank, dealer, or government portal.')} className="mt-2 text-xs text-blue-700 font-bold">Check options <ChevronRight className="inline w-3 h-3"/></button></div>
    </section>

    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h2 className="font-black text-slate-900">A–Z catalogue</h2><p className="text-xs text-slate-500">{catalogue === 'produce' ? 'Fresh produce from farmers and collectives' : 'Fertilizer, seeds, equipment and accessories'}</p></div><div className="relative"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products" className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"/></div></div>
      <div className="flex gap-2 overflow-x-auto py-4">{categories.filter(c => c === 'All' || products.some(p => p.category === c)).map(c => <button key={c} onClick={() => setCategory(c)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold ${category === c ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>{c}</button>)}</div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">{visibleProducts.map(product => <article key={product.id} className="rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"><div className="h-28 bg-gradient-to-br from-emerald-50 to-amber-50 flex items-center justify-center text-5xl">{product.image}</div><div className="p-3"><div className="flex items-start justify-between gap-2"><h3 className="font-bold text-sm text-slate-900">{product.name}</h3>{product.certified && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>}</div><p className="text-[11px] text-slate-500 mt-1">{product.seller}</p><p className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/>{product.location}</p><div className="mt-3 flex items-end justify-between"><div><p className="text-lg font-black text-slate-900">₹{product.price}<span className="text-[11px] font-medium">/{product.unit}</span></p>{product.retailPrice && <p className="text-[10px] text-slate-500">Retail reference ₹{product.retailPrice}</p>}</div><span className="text-[10px] text-amber-600 font-bold">★ {product.rating}</span></div>{product.subsidy && <p className="mt-2 bg-amber-50 rounded-lg px-2 py-1 text-[10px] text-amber-800">{product.subsidy}</p>}<button onClick={() => setShowQuote(product)} className="mt-3 w-full py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold">{catalogue === 'produce' ? 'Ask for quote' : 'Contact vendor'}</button></div></article>)}</div>
    </section>

    <section className="grid lg:grid-cols-2 gap-5">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5"><div className="flex items-center justify-between"><div><h2 className="font-black text-slate-900">Quote centre</h2><p className="text-xs text-slate-500">Requests and vendor responses</p></div><Send className="w-5 h-5 text-emerald-700"/></div><div className="mt-4 space-y-2">{quotes.map(q => <div key={q.id} className="p-3 rounded-xl bg-slate-50 flex items-center justify-between gap-2"><div><p className="text-xs font-bold">{q.product} · {q.quantity}</p><p className="text-[11px] text-slate-500">{q.buyer}</p></div><div className="text-right"><p className="text-sm font-black">₹{q.quotedPrice}/kg</p><span className={`text-[10px] font-bold ${q.status === 'Open' ? 'text-amber-600' : 'text-emerald-700'}`}>{q.status}</span></div></div>)}</div></div>
      <div className="rounded-3xl border border-violet-100 bg-violet-50 p-5"><div className="flex justify-between"><div><div className="flex items-center gap-2 text-violet-800"><Crown className="w-5 h-5"/><h2 className="font-black">Vendor Pro</h2></div><p className="text-xs text-violet-700 mt-1">For high-volume buyers and input vendors</p></div>{isPro && <span className="text-xs font-bold text-violet-800">Active</span>}</div><ul className="mt-4 space-y-2 text-xs text-violet-950"><li>• Daily price slabs by quantity and delivery area</li><li>• Farmer group sourcing and priority quotes</li><li>• Stock, catalogue and buyer lead tools</li></ul><button onClick={() => setNotice(isPro ? 'Your Vendor Pro tools are ready.' : 'Vendor Pro request saved. Complete business verification before activation.')} className="mt-4 px-4 py-2 rounded-xl bg-violet-700 text-white text-xs font-bold">{isPro ? 'Open Pro tools' : isVendor ? 'Request Pro access' : 'Become a vendor'}</button></div>
    </section>

    {notice && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl text-xs shadow-xl flex items-center gap-3"><span>{notice}</span><button onClick={() => setNotice('')} className="font-bold">Close</button></div>}
    {showQuote && <div className="fixed inset-0 z-50 p-4 bg-slate-900/60 flex items-center justify-center"><div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl"><div className="flex items-center gap-2 text-emerald-700"><ShoppingBasket className="w-5 h-5"/><h3 className="font-black text-slate-900">Quote for {showQuote.name}</h3></div><p className="mt-2 text-xs text-slate-500">Enter your offer price. The seller can accept, decline, or counter it.</p><label className="block mt-4 text-xs font-bold">Your offer (₹ / {showQuote.unit})</label><input autoFocus type="number" value={quotePrice} onChange={e => setQuotePrice(e.target.value)} placeholder={`Market price ₹${showQuote.price}`} className="mt-1 w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"/><div className="flex gap-2 mt-4"><button onClick={() => setShowQuote(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-xs font-bold">Cancel</button><button onClick={submitQuote} className="flex-1 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold">Send quote</button></div></div></div>}
  </div>;
};
