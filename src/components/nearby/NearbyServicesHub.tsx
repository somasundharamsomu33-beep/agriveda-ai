import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Navigation, 
  Star, 
  Clock, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal, 
  Tractor, 
  Wrench, 
  Sprout, 
  FlaskConical, 
  Settings2, 
  Store,
  Locate,
  List,
  Map as MapIcon
} from 'lucide-react';
import { UserProfile } from '../../types';
import { SAMPLE_SERVICE_CENTERS, ServiceCenterListing } from '../../data/marketplaceFullData';

interface NearbyServicesHubProps {
  profile: UserProfile;
  onNavigateTab?: (tab: any) => void;
}

export const NearbyServicesHub: React.FC<NearbyServicesHubProps> = ({
  profile,
  onNavigateTab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(50);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Location Permission State
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatusMsg, setLocationStatusMsg] = useState<string>('📍 Centered on your farm location (' + (profile.location || 'Kovilpatti, TN') + ')');

  const handleRequestLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setLocationStatusMsg(`📍 Live GPS Location acquired (${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E)`);
        },
        () => {
          setIsLocating(false);
          setLocationStatusMsg('⚠️ Location access unavailable. Showing default farm location.');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  const filteredServices = useMemo(() => {
    return SAMPLE_SERVICE_CENTERS.filter(item => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'equipment' && (item.category === 'tractor_dealer' || item.category === 'equipment_dealer' || item.category === 'rental_center')) ||
        (selectedCategory === 'fertilizer' && item.category === 'fertilizer_shop') ||
        (selectedCategory === 'seeds' && item.category === 'seed_shop') ||
        (selectedCategory === 'spare_parts' && item.category === 'spare_parts_shop') ||
        (selectedCategory === 'technician' && (item.category === 'technician' || item.category === 'service_center' || item.category === 'repair_shop'));

      const matchesDistance = item.distanceKm <= maxDistanceKm;

      const cleanQuery = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !cleanQuery ||
        item.businessName.toLowerCase().includes(cleanQuery) ||
        item.ownerName.toLowerCase().includes(cleanQuery) ||
        item.address.toLowerCase().includes(cleanQuery) ||
        item.availableServices.some(s => s.toLowerCase().includes(cleanQuery));

      return matchesCategory && matchesDistance && matchesSearch;
    });
  }, [selectedCategory, maxDistanceKm, searchQuery]);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/60 rounded-full border border-emerald-500/30 text-xs font-bold text-emerald-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>AgriVeda Location Services Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Nearby Agricultural Equipment, Input & Service Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Locate authorized tractor dealers, fertilizer shops, seed nurseries, spare part depots & emergency technicians near you.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRequestLocation}
            disabled={isLocating}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>📍 Use My Location</span>
          </button>
        </div>
      </div>

      {/* Location Status Notice */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-2 text-xs text-blue-900 font-bold">
        <span>{locationStatusMsg}</span>
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-blue-200 shadow-2xs">
          <span className="text-slate-500">Radius:</span>
          <select
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
            className="bg-transparent font-black text-blue-700 focus:outline-none cursor-pointer"
          >
            <option value={5}>Within 5 km</option>
            <option value={10}>Within 10 km</option>
            <option value={25}>Within 25 km</option>
            <option value={50}>Within 50 km</option>
          </select>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dealer, mechanic, fertilizer shop, tractor model..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span>List View</span>
              </button>

              <button
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('maps');
                  else setViewMode('map');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                <span>Map View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          {[
            { id: 'all', label: '📍 All Nearby Services' },
            { id: 'equipment', label: '🚜 Equipment & Dealers' },
            { id: 'fertilizer', label: '🧪 Fertilizer & Bio-Inputs' },
            { id: 'seeds', label: '🌱 Seed Shops' },
            { id: 'spare_parts', label: '⚙️ Spare Parts Stores' },
            { id: 'technician', label: '🔧 Technicians & Mechanics' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Service Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-extrabold text-[10px] rounded-md border border-blue-200">
                    {item.categoryLabel}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">{item.businessName}</h3>
                  <p className="text-xs text-slate-500 font-medium">Prop: {item.ownerName} • {item.address}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-black text-xs rounded-xl border border-emerald-200 block">
                    {item.distanceKm} km away
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-600 block mt-1">
                    {item.isOpen ? 'OPEN NOW ●' : 'CLOSED'}
                  </span>
                </div>
              </div>

              {/* Rating & Operating Hours */}
              <div className="flex items-center gap-4 text-xs font-bold text-slate-600 pt-1">
                <div className="flex items-center gap-1 text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{item.rating} ({item.reviewCount} Reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.openHours}</span>
                </div>
              </div>

              {/* Services Badges */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.availableServices.map((srv, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-md">
                    ✓ {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar (Call | WhatsApp | Directions) */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
              <a
                href={`tel:${item.phone}`}
                className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>

              <a
                href={`https://wa.me/${item.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
