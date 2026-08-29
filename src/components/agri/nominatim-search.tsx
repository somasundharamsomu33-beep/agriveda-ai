import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  X,
  Loader2,
  Navigation,
  Globe,
  ExternalLink,
  Compass,
  Layers,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
  Building2,
  Store,
  Landmark,
} from "lucide-react";
import {
  searchNominatim,
  reverseGeocodeNominatim,
  formatNominatimPlaceName,
  type NominatimSearchResult,
} from "../../lib/nominatim";

interface NominatimSearchProps {
  onSelectPlace: (place: NominatimSearchResult) => void;
  onClearPlace?: () => void;
  selectedPlace?: NominatimSearchResult | null;
  mapCenter?: [number, number];
  onRouteToPlace?: (coords: [number, number], label: string) => void;
}

export const NominatimSearch: React.FC<NominatimSearchProps> = ({
  onSelectPlace,
  onClearPlace,
  selectedPlace,
  mapCenter,
  onRouteToPlace,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showInspector, setShowInspector] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Perform search with 300ms debounce
  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (text.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      let searchQuery = text.trim();
      if (activeCategory === "mandi") searchQuery += " mandi market APMC";
      else if (activeCategory === "village") searchQuery += " village";
      else if (activeCategory === "bank") searchQuery += " bank branch";

      const searchOpts: any = { countrycodes: "in", limit: 8 };
      if (mapCenter) {
        // Bias search towards current map viewport (+- 1.5 degrees)
        const [lng, lat] = mapCenter;
        searchOpts.viewbox = [lng - 1.5, lat - 1.5, lng + 1.5, lat + 1.5];
      }

      const res = await searchNominatim(searchQuery, searchOpts);
      setResults(res);
      setIsLoading(false);
      setIsOpen(true);
    }, 280);
  };

  const handleSelectResult = (place: NominatimSearchResult) => {
    onSelectPlace(place);
    setQuery(place.name || place.display_name.split(",")[0]);
    setIsOpen(false);
    setShowInspector(true);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setShowInspector(false);
    onClearPlace?.();
  };

  const quickCategories = [
    { id: "all", label: "All Places", icon: Globe },
    { id: "mandi", label: "Mandis & Markets", icon: Store },
    { id: "village", label: "Villages / Panchayats", icon: MapPin },
    { id: "bank", label: "Bank Branches", icon: Building2 },
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-md text-slate-100 font-sans z-50">
      
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          ) : (
            <Search className="w-4 h-4 text-emerald-400" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search village, mandi, district or bank..."
          className="w-full pl-9 pr-16 py-2 bg-slate-900/90 hover:bg-slate-900 text-xs font-semibold text-white placeholder:text-slate-400 rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all shadow-lg backdrop-blur-md"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {selectedPlace && (
            <button
              onClick={() => setShowInspector((prev) => !prev)}
              className={`p-1 rounded-lg text-xs font-bold transition-colors ${
                showInspector
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-emerald-400 hover:bg-slate-700"
              }`}
              title="Toggle Place Details Inspector"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Auto-suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900/98 backdrop-blur-2xl border border-slate-700 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-1 max-h-80 flex flex-col ring-1 ring-white/10">
          
          {/* Category Filter Pills */}
          <div className="p-2 border-b border-slate-800 flex items-center gap-1 overflow-x-auto bg-slate-950/60">
            {quickCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    if (query) handleQueryChange(query);
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all shrink-0 ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Results List */}
          <div className="overflow-y-auto p-1.5 space-y-1">
            {results.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                {isLoading ? "Searching OpenStreetMap Nominatim..." : "No matching Indian places found."}
              </div>
            ) : (
              results.map((place) => {
                const formatted = formatNominatimPlaceName(place);
                return (
                  <button
                    key={place.place_id}
                    onClick={() => handleSelectResult(place)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-800/80 transition-colors flex items-start gap-2.5 group"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-emerald-600/30 text-emerald-400 shrink-0 mt-0.5 transition-colors">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">
                          {formatted.primary}
                        </span>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-slate-700 shrink-0">
                          {formatted.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {formatted.secondary}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 mt-1 transition-colors" />
                  </button>
                );
              })
            )}
          </div>

          {/* Attribution Footer */}
          <div className="p-1.5 bg-slate-950/80 border-t border-slate-800 text-[9px] text-slate-500 flex items-center justify-between px-3">
            <span>Powered by OpenStreetMap Nominatim</span>
            <span className="text-emerald-400 font-mono">OSM Geocoding API</span>
          </div>
        </div>
      )}

      {/* Place Details Inspector Card (When place is active) */}
      {selectedPlace && showInspector && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-3.5 shadow-2xl z-40 text-white space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between border-b border-slate-800 pb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {formatNominatimPlaceName(selectedPlace).badge}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  OSM ID: {selectedPlace.osm_type}/{selectedPlace.osm_id}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1">
                {formatNominatimPlaceName(selectedPlace).primary}
              </h3>
            </div>
            <button
              onClick={() => setShowInspector(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Structured Coordinates & Address Hierarchy */}
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-[11px] flex items-center justify-between">
              <span className="text-slate-400">Coordinates:</span>
              <span className="text-emerald-400 font-bold">
                {parseFloat(selectedPlace.lat).toFixed(5)}° N, {parseFloat(selectedPlace.lon).toFixed(5)}° E
              </span>
            </div>

            <p className="text-[11px] text-slate-300 line-clamp-2">
              📍 {selectedPlace.display_name}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1 border-t border-slate-800">
            {onRouteToPlace && (
              <button
                onClick={() =>
                  onRouteToPlace(
                    [parseFloat(selectedPlace.lon), parseFloat(selectedPlace.lat)],
                    formatNominatimPlaceName(selectedPlace).primary
                  )
                }
                className="flex-1 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Route Here</span>
              </button>
            )}
            <a
              href={`https://www.openstreetmap.org/${selectedPlace.osm_type}/${selectedPlace.osm_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-all"
            >
              <span>OSM</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
