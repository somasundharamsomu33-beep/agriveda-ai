import React, { useState } from "react";
import {
  Layers,
  Search,
  Loader2,
  Droplets,
  Sprout,
  Store,
  Stethoscope,
  SunMedium,
  Download,
  Code2,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  fetchAgriInfrastructure,
  executeOverpassQuery,
  type AgriInfrastructureCategory,
  type OverpassGeoJSONCollection,
  type OverpassGeoJSONFeature,
} from "../../lib/overpass";
import type { MapViewport } from "../ui/map";

interface OverpassExplorerProps {
  viewport: MapViewport;
  onDataLoaded: (data: OverpassGeoJSONCollection) => void;
  activeData: OverpassGeoJSONCollection | null;
  onClearData: () => void;
  selectedFeature: OverpassGeoJSONFeature | null;
  onCloseFeatureDetails: () => void;
}

export const OverpassExplorer: React.FC<OverpassExplorerProps> = ({
  viewport,
  onDataLoaded,
  activeData,
  onClearData,
  selectedFeature,
  onCloseFeatureDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomQL, setShowCustomQL] = useState(false);
  const [customQLQuery, setCustomQLQuery] = useState(
    `[out:json][timeout:25];\n(\n  way["waterway"~"canal|ditch"](around:20000, 30.9010, 75.8056);\n  way["landuse"="farmland"](around:20000, 30.9010, 75.8056);\n);\nout body geom 60;`
  );

  const [selectedCategories, setSelectedCategories] = useState<AgriInfrastructureCategory[]>([
    "canals",
    "farmlands",
    "mandis",
    "veterinary",
  ]);

  const toggleCategory = (cat: AgriInfrastructureCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Scan current map viewport (+- 0.35 deg bbox based on zoom)
  const handleScanViewport = async () => {
    setIsLoading(true);
    try {
      const [lng, lat] = viewport.center;
      // Compute bbox span dynamically based on map zoom
      const span = Math.max(0.08, 2.5 / Math.pow(2, Math.max(1, (viewport.zoom || 10) - 8)));
      const bbox: [number, number, number, number] = [
        lat - span,
        lng - span * 1.2,
        lat + span,
        lng + span * 1.2,
      ];

      const res = await fetchAgriInfrastructure(bbox, selectedCategories);
      onDataLoaded(res);
    } catch (err) {
      console.error("Overpass scan error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCustomQL = async () => {
    if (!customQLQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await executeOverpassQuery(customQLQuery);
      onDataLoaded(res);
      setShowCustomQL(false);
    } catch (err) {
      console.error("Custom Overpass QL error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportGeoJSON = () => {
    if (!activeData || activeData.features.length === 0) return;
    const blob = new Blob([JSON.stringify(activeData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overpass-agri-infrastructure-${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoryConfigs: {
    id: AgriInfrastructureCategory;
    label: string;
    icon: any;
    color: string;
    activeColor: string;
  }[] = [
    {
      id: "canals",
      label: "Irrigation Canals",
      icon: Droplets,
      color: "text-cyan-400 border-cyan-500/30",
      activeColor: "bg-cyan-600 text-white",
    },
    {
      id: "farmlands",
      label: "Farmland Parcels",
      icon: Sprout,
      color: "text-emerald-400 border-emerald-500/30",
      activeColor: "bg-emerald-600 text-white",
    },
    {
      id: "mandis",
      label: "APMC Mandis",
      icon: Store,
      color: "text-amber-400 border-amber-500/30",
      activeColor: "bg-amber-600 text-white",
    },
    {
      id: "veterinary",
      label: "Veterinary Care",
      icon: Stethoscope,
      color: "text-purple-400 border-purple-500/30",
      activeColor: "bg-purple-600 text-white",
    },
    {
      id: "solar_pumps",
      label: "Solar Agri Pumps",
      icon: SunMedium,
      color: "text-yellow-400 border-yellow-500/30",
      activeColor: "bg-yellow-600 text-white",
    },
  ];

  const totalFeatures = activeData?.features.length || 0;

  return (
    <>
      {/* Floating Toolbar Trigger Button */}
      <div className="absolute top-4 right-16 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition-all shadow-xl backdrop-blur-md border ${
            isOpen || totalFeatures > 0
              ? "bg-cyan-600 border-cyan-400 text-white shadow-cyan-500/20 ring-2 ring-cyan-400/30"
              : "bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
          title="OpenStreetMap Overpass API Infrastructure Explorer"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Layers className="w-4 h-4 text-cyan-400" />
          )}
          <span className="hidden sm:inline">Overpass OSM Explorer</span>
          {totalFeatures > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black">
              {totalFeatures}
            </span>
          )}
        </button>
      </div>

      {/* Overpass Drawer / Popover Panel */}
      {isOpen && (
        <div className="absolute top-16 right-4 z-30 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-3xl shadow-2xl p-4 text-white space-y-3.5 animate-in fade-in slide-in-from-top-2 font-sans">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Overpass API Explorer
                </h3>
                <p className="text-[10px] text-slate-400">
                  Live OpenStreetMap Agri Infrastructure
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Filters */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-300">
              Select Infrastructure Categories:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {categoryConfigs.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all text-left ${
                      isSelected
                        ? `${cat.activeColor} border-transparent shadow-xs`
                        : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleScanViewport}
              disabled={isLoading}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Query Live Overpass API in Viewport</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCustomQL((prev) => !prev)}
                className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Custom QL</span>
              </button>

              {totalFeatures > 0 && (
                <>
                  <button
                    onClick={handleExportGeoJSON}
                    className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-slate-700"
                    title="Export GeoJSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onClearData}
                    className="py-1.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold border border-red-500/30"
                    title="Clear Overpass Layers"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats Breakdown */}
          {totalFeatures > 0 && (
            <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Loaded OSM Features:</span>
                <strong className="text-cyan-400 font-mono">{totalFeatures} Objects</strong>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Current Viewport Center:</span>
                <strong className="text-slate-300 font-mono">
                  {viewport.center[1].toFixed(3)}°N, {viewport.center[0].toFixed(3)}°E
                </strong>
              </div>
            </div>
          )}

          {/* Custom Overpass QL Editor Modal */}
          {showCustomQL && (
            <div className="pt-2 border-t border-slate-800 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span>Overpass QL Code:</span>
                <span className="text-[9px] font-mono text-cyan-400">OSM Turbo Syntax</span>
              </div>
              <textarea
                value={customQLQuery}
                onChange={(e) => setCustomQLQuery(e.target.value)}
                rows={5}
                className="w-full p-2 bg-slate-950 text-xs font-mono text-cyan-300 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button
                onClick={handleRunCustomQL}
                disabled={isLoading}
                className="w-full py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Execute Overpass QL</span>
              </button>
            </div>
          )}

          {/* Footer note */}
          <div className="text-[9px] text-slate-500 text-center">
            Queries OpenStreetMap live infrastructure via Overpass API mirrors
          </div>
        </div>
      )}

      {/* Selected OSM Feature Inspector Popup */}
      {selectedFeature && (
        <div className="absolute bottom-6 left-6 z-30 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-3xl p-4 text-white shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2 font-sans">
          <div className="flex items-start justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {selectedFeature.properties.category}
              </span>
              <h4 className="text-sm font-bold text-white mt-1">
                {selectedFeature.properties.name}
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                OSM {selectedFeature.properties.osm_type} #{selectedFeature.properties.osm_id}
              </span>
            </div>
            <button
              onClick={onCloseFeatureDetails}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Raw OSM Tags Breakdown */}
          <div className="max-h-36 overflow-y-auto space-y-1 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px] font-mono">
            {Object.entries(selectedFeature.properties.tags || {}).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-2 border-b border-slate-900 pb-0.5">
                <span className="text-cyan-400 font-semibold">{k}:</span>
                <span className="text-slate-300 truncate max-w-[170px]">{String(v)}</span>
              </div>
            ))}
          </div>

          <div className="pt-1 flex gap-2">
            <a
              href={`https://www.openstreetmap.org/${selectedFeature.properties.osm_type}/${selectedFeature.properties.osm_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>View on OpenStreetMap.org</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
