import React, { useState, useMemo, useEffect } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MarkerLabel,
  MapControls,
  MapRoute,
  MapGeoJSON,
  type MapViewport,
} from "./ui/map";
import {
  Building2,
  Sprout,
  GraduationCap,
  Landmark,
  Calculator,
  Navigation,
  Search,
  Layers,
  Compass,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Send,
  IndianRupee,
  Phone,
  FileText,
  Activity,
  Award,
  Globe,
  Filter,
  UserCheck,
  BadgeCheck,
  ExternalLink,
  FlaskConical,
  Lock,
  ChevronRight,
  Route,
} from "lucide-react";
import {
  LOAN_OFFICES,
  FARMERS_DATA,
  RESEARCH_INSTITUTES,
  AGRI_LOAN_SCHEMES,
  AGRO_CLIMATIC_ZONES_GEOJSON,
  calculateDistanceKm,
  findOfficesWithinRadius,
  type LoanOffice,
  type FarmerProfile,
  type ResearchInstitute,
} from "../data/agri-data";
import { FarmerView } from "./agri/farmer-view";
import { LoanOfficerView } from "./agri/loan-officer-view";
import { ResearcherView } from "./agri/researcher-view";
import { InstituteView } from "./agri/institute-view";
import { LoanCalculatorModal } from "./agri/loan-calculator-modal";
import { ApplyLoanModal } from "./agri/apply-loan-modal";
import {
  getDijkstraOnRoadRoute,
  getMultiStopInspectionCircuit,
} from "../lib/dijkstra-routing";
import { UserProfile, UserRole } from "../types";

export type AgriRoleCategory = "farmer" | "loan-officer" | "researcher" | "institute";

const REGION_PRESETS = [
  { name: "All India", center: [78.9629, 21.5937] as [number, number], zoom: 4.8, pitch: 20, bearing: 0 },
  { name: "Punjab Hub", center: [75.8056, 30.9010] as [number, number], zoom: 10.5, pitch: 45, bearing: -10 },
  { name: "Maharashtra Belt", center: [73.7898, 19.9975] as [number, number], zoom: 10, pitch: 40, bearing: 15 },
  { name: "UP Ganga Basin", center: [82.9863, 25.3356] as [number, number], zoom: 10, pitch: 35, bearing: 0 },
  { name: "Karnataka Agri", center: [76.8951, 12.5222] as [number, number], zoom: 10.5, pitch: 45, bearing: 20 },
  { name: "Tamil Nadu Delta", center: [79.1378, 10.7870] as [number, number], zoom: 10.5, pitch: 40, bearing: -20 },
  { name: "Gujarat Corridor", center: [72.9289, 22.5645] as [number, number], zoom: 11, pitch: 40, bearing: 10 },
];

interface MapsViewProps {
  profile: UserProfile;
  initialRole?: AgriRoleCategory;
}

export const MapsView: React.FC<MapsViewProps> = ({
  profile,
  initialRole,
}) => {
  // Determine starting role from user profile or fallback
  const getMappedRole = (role?: UserRole): AgriRoleCategory => {
    if (role === "loan-officer") return "loan-officer";
    if (role === "researcher" || role === "student" || role === "agronomist") return "researcher";
    if (role === "institute" || role === "business") return "institute";
    return "farmer";
  };

  const defaultRole = initialRole || getMappedRole(profile?.role);
  const [activeRole, setActiveRole] = useState<AgriRoleCategory>(defaultRole);

  // Sync with profile role changes if profile updates
  useEffect(() => {
    if (profile?.role) {
      setActiveRole(getMappedRole(profile.role));
    }
  }, [profile?.role]);

  // Selection states
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile>(FARMERS_DATA[0]);
  const [selectedOffice, setSelectedOffice] = useState<LoanOffice>(LOAN_OFFICES[0]);
  const [selectedInstitute, setSelectedInstitute] = useState<ResearchInstitute | null>(null);
  const [activePopupType, setActivePopupType] = useState<"farmer" | "office" | "institute" | null>("farmer");
  const [activePopupId, setActivePopupId] = useState<string | null>(FARMERS_DATA[0].id);

  // Radius & Filtering (Default 30 km)
  const [radiusKm, setRadiusKm] = useState<number>(30);
  const [showAgroZones, setShowAgroZones] = useState(true);
  const [showFarmersLayer, setShowFarmersLayer] = useState(true);
  const [showOfficesLayer, setShowOfficesLayer] = useState(true);
  const [showInstitutesLayer, setShowInstitutesLayer] = useState(true);

  // Active Route Coordinates
  const [activeRouteCoords, setActiveRouteCoords] = useState<[number, number][] | null>([
    FARMERS_DATA[0].coords,
    LOAN_OFFICES[0].coords,
  ]);
  const [activeRouteLabel, setActiveRouteLabel] = useState<string>(
    "Direct Dijkstra Navigation: Punjab Model Farm ➔ State Bank of India ADB"
  );

  // Modals
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyOfficeId, setApplyOfficeId] = useState<string | undefined>(undefined);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeStyleName, setActiveStyleName] = useState<"standard" | "darkMatter" | "osm">("standard");

  // Dynamic farmer state updates
  const [farmersList, setFarmersList] = useState<FarmerProfile[]>(FARMERS_DATA);

  // Map Viewport
  const [viewport, setViewport] = useState<MapViewport>({
    center: [75.8056, 30.9010],
    zoom: 9.2,
    bearing: -10,
    pitch: 35,
  });

  const customStyles = useMemo(() => {
    if (activeStyleName === "darkMatter") {
      return {
        dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        light: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      };
    }
    if (activeStyleName === "osm") {
      return {
        dark: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
        light: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      };
    }
    return undefined;
  }, [activeStyleName]);

  // Navigate farmer to bank branch via Dijkstra On-Road Shortest Path
  const handleFarmerNavigateToOffice = async (office: LoanOffice) => {
    setSelectedOffice(office);
    setActivePopupType("office");
    setActivePopupId(office.id);

    const midLng = (selectedFarmer.coords[0] + office.coords[0]) / 2;
    const midLat = (selectedFarmer.coords[1] + office.coords[1]) / 2;
    setViewport({
      center: [midLng, midLat],
      zoom: 11.5,
      bearing: 15,
      pitch: 45,
    });

    setActiveRouteLabel(`Calculating Dijkstra On-Road Route to ${office.name.split("-")[0].trim()}...`);

    try {
      const result = await getDijkstraOnRoadRoute(selectedFarmer.coords, office.coords);
      setActiveRouteCoords(result.coordinates);
      setActiveRouteLabel(
        `🛣️ On-Road Shortest Path (Dijkstra): ${selectedFarmer.name} ➔ ${office.name.split("-")[0].trim()} (${result.summary})`
      );
    } catch {
      setActiveRouteCoords([selectedFarmer.coords, office.coords]);
      setActiveRouteLabel(`Route: ${selectedFarmer.name} ➔ ${office.name}`);
    }
  };

  // Plan field inspection tour via Dijkstra Multi-Stop Graph Circuit
  const handlePlanInspectionRoute = async (inspectionFarmers: FarmerProfile[]) => {
    if (inspectionFarmers.length === 0) return;

    setViewport({
      center: selectedOffice.coords,
      zoom: 8.8,
      bearing: 10,
      pitch: 40,
    });

    setActiveRouteLabel(`Computing Dijkstra Multi-Stop Circuit in ${selectedOffice.state}...`);

    try {
      const result = await getMultiStopInspectionCircuit(
        selectedOffice.coords,
        inspectionFarmers.map((f) => f.coords)
      );
      setActiveRouteCoords(result.coordinates);
      setActiveRouteLabel(
        `🚗 Dijkstra Inspection Circuit (${selectedOffice.state}): ${selectedOffice.name.split("-")[0].trim()} ➔ ${inspectionFarmers.length} Farms (${result.summary})`
      );
    } catch {
      const route: [number, number][] = [
        selectedOffice.coords,
        ...inspectionFarmers.map((f) => f.coords),
        selectedOffice.coords,
      ];
      setActiveRouteCoords(route);
      setActiveRouteLabel(
        `Field Inspection Circuit: ${selectedOffice.name} ➔ ${inspectionFarmers.length} Applicant Farms`
      );
    }
  };

  // Handle farmer approval status update
  const handleUpdateFarmerStatus = (
    farmerId: string,
    newStatus: "Approved" | "Under Review" | "Pending Verification" | "Disbursed" | "Eligible to Apply"
  ) => {
    setFarmersList((prev) =>
      prev.map((f) => (f.id === farmerId ? { ...f, applicationStatus: newStatus } : f))
    );
    if (selectedFarmer.id === farmerId) {
      setSelectedFarmer((prev) => ({ ...prev, applicationStatus: newStatus }));
    }
  };

  // Handle zone highlight in researcher view
  const handleHighlightZone = (zoneId: string) => {
    const feature = AGRO_CLIMATIC_ZONES_GEOJSON.features.find(
      (f) => f.properties?.zoneId === zoneId
    );
    if (feature && feature.geometry.type === "Polygon") {
      const firstCoord = feature.geometry.coordinates[0][0];
      setViewport({
        center: [firstCoord[0], firstCoord[1]],
        zoom: 7.5,
        bearing: 0,
        pitch: 30,
      });
    }
  };

  // Handle institute state/district selection
  const handleSelectInstituteState = (district: string, state: string) => {
    const matchingOffice = LOAN_OFFICES.find(
      (o) => o.state.toLowerCase() === state.toLowerCase()
    );
    if (matchingOffice) {
      setSelectedOffice(matchingOffice);
      setActivePopupId(matchingOffice.id);
      setActivePopupType("office");
      setViewport({
        center: matchingOffice.coords,
        zoom: 9.5,
        bearing: 10,
        pitch: 35,
      });
    }
  };

  const roleCategories = [
    {
      id: "farmer" as AgriRoleCategory,
      label: "Farmer Portal",
      sub: "Loans, Schemes & Branches",
      icon: Sprout,
      color: "from-emerald-500 to-green-600",
      activeBg: "bg-emerald-600 text-white shadow-emerald-500/20",
    },
    {
      id: "loan-officer" as AgriRoleCategory,
      label: "Loan Officer GIS",
      sub: "Inspections & Risk Circuit",
      icon: Building2,
      color: "from-blue-500 to-indigo-600",
      activeBg: "bg-blue-600 text-white shadow-blue-500/20",
    },
    {
      id: "researcher" as AgriRoleCategory,
      label: "Researcher & Agro-Zones",
      sub: "GeoJSON Soil & Climate",
      icon: GraduationCap,
      color: "from-teal-500 to-cyan-600",
      activeBg: "bg-teal-600 text-white shadow-teal-500/20",
    },
    {
      id: "institute" as AgriRoleCategory,
      label: "Institute & NABARD",
      sub: "Credit Deployment Analytics",
      icon: Landmark,
      color: "from-amber-500 to-orange-600",
      activeBg: "bg-amber-600 text-white shadow-amber-500/20",
    },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-8.5rem)] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col bg-slate-950 font-sans">
      
      {/* Top Header Bar & Exclusive Role Switcher */}
      <header className="z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg ring-2 ring-white/10">
            <Navigation className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                MapCN <span className="text-emerald-400">Agri-GIS</span>
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Geospatial
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Agricultural Credit, Agro-Climatic Intelligence & Inspection Routing
            </p>
          </div>
        </div>

        {/* Exclusive Category Tabs (Auto-selected based on Login) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-x-auto max-w-full">
          {roleCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeRole === cat.id;
            const isUserLoggedInRole = profile?.role && getMappedRole(profile.role) === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveRole(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? `${cat.activeBg} shadow-md`
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{cat.label}</span>
                {isUserLoggedInRole && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" title="Your Logged-in Role" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Tools & Basemap Selector */}
        <div className="flex items-center gap-2">
          {/* Active User Persona Badge */}
          {profile?.name && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium">{profile.name}</span>
              <span className="text-[10px] font-black text-emerald-400 uppercase">({activeRole})</span>
            </div>
          )}

          {/* Style Selector */}
          <select
            value={activeStyleName}
            onChange={(e) => setActiveStyleName(e.target.value as any)}
            aria-label="Select Basemap Style"
            className="bg-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="standard">Positron (Light)</option>
            <option value="darkMatter">Dark Matter</option>
            <option value="osm">Voyager (OSM)</option>
          </select>

          {/* Region Quick Zoom Presets */}
          <select
            onChange={(e) => {
              const preset = REGION_PRESETS.find((p) => p.name === e.target.value);
              if (preset) {
                setViewport({
                  center: preset.center,
                  zoom: preset.zoom,
                  pitch: preset.pitch,
                  bearing: preset.bearing,
                });
              }
            }}
            defaultValue="All India"
            aria-label="Select Regional Preset"
            className="bg-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 hidden sm:block"
          >
            {REGION_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                📍 {p.name}
              </option>
            ))}
          </select>

          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title={sidebarOpen ? "Collapse Panel" : "Expand Panel"}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Map */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex">
        
        {/* Left Sidebar Panel (Role-Specific Dedicated View) */}
        <div
          className={`z-20 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 transition-all duration-300 flex flex-col shrink-0 overflow-y-auto ${
            sidebarOpen ? "w-full sm:w-96 md:w-[420px]" : "w-0 p-0 border-none overflow-hidden"
          }`}
        >
          <div className="p-4 space-y-4 text-slate-100 flex-1">
            
            {/* Category Indicator Banner */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  {activeRole === "farmer" && <Sprout className="w-4 h-4 text-emerald-400" />}
                  {activeRole === "loan-officer" && <Building2 className="w-4 h-4 text-blue-400" />}
                  {activeRole === "researcher" && <GraduationCap className="w-4 h-4 text-teal-400" />}
                  {activeRole === "institute" && <Landmark className="w-4 h-4 text-amber-400" />}
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">
                    {roleCategories.find((c) => c.id === activeRole)?.label}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {roleCategories.find((c) => c.id === activeRole)?.sub}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Active Category
              </span>
            </div>

            {/* Render Category Exclusive Component */}
            {activeRole === "farmer" && (
              <FarmerView
                selectedFarmer={selectedFarmer}
                onSelectFarmer={(f) => {
                  setSelectedFarmer(f);
                  setActivePopupType("farmer");
                  setActivePopupId(f.id);
                  setViewport({
                    center: f.coords,
                    zoom: 11,
                    bearing: 0,
                    pitch: 35,
                  });
                }}
                onNavigateToOffice={handleFarmerNavigateToOffice}
                onOpenCalculator={() => setCalcModalOpen(true)}
                onOpenApply={(officeId) => {
                  setApplyOfficeId(officeId);
                  setApplyModalOpen(true);
                }}
                radiusKm={radiusKm}
                onRadiusChange={setRadiusKm}
              />
            )}

            {activeRole === "loan-officer" && (
              <LoanOfficerView
                selectedOffice={selectedOffice}
                onSelectOffice={(o) => {
                  setSelectedOffice(o);
                  setViewport({
                    center: o.coords,
                    zoom: 11,
                    bearing: 10,
                    pitch: 40,
                  });
                }}
                onFocusFarmer={(f) => {
                  setSelectedFarmer(f);
                  setActivePopupType("farmer");
                  setActivePopupId(f.id);
                  setViewport({
                    center: f.coords,
                    zoom: 11.5,
                    bearing: 10,
                    pitch: 40,
                  });
                }}
                onPlanInspectionRoute={handlePlanInspectionRoute}
                onUpdateFarmerStatus={handleUpdateFarmerStatus}
              />
            )}

            {activeRole === "researcher" && (
              <ResearcherView
                onHighlightZone={handleHighlightZone}
                showAgroZones={showAgroZones}
                onToggleAgroZones={setShowAgroZones}
                onSelectInstitute={(inst) => {
                  setSelectedInstitute(inst);
                  setActivePopupType("institute");
                  setActivePopupId(inst.id);
                  setViewport({
                    center: inst.coords,
                    zoom: 12,
                    bearing: 10,
                    pitch: 35,
                  });
                }}
              />
            )}

            {activeRole === "institute" && (
              <InstituteView
                onSelectStateDistrict={handleSelectInstituteState}
              />
            )}

          </div>
        </div>

        {/* Main Geospatial Map Stage */}
        <div className="relative flex-1 w-full h-full bg-slate-950">
          
          {/* Active Navigation Route Info Ribbon */}
          {activeRouteCoords && activeRouteCoords.length > 0 && (
            <div className="absolute top-4 left-4 right-4 sm:right-auto z-10 max-w-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-2xl animate-in fade-in slide-in-from-top-2 text-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                  <Route className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">{activeRouteLabel}</span>
                </div>
                <button
                  onClick={() => {
                    setActiveRouteCoords(null);
                    setActiveRouteLabel("");
                  }}
                  className="text-slate-400 hover:text-white text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 shrink-0"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Map Controls */}
          <Map
            viewport={viewport}
            onViewportChange={setViewport}
            styles={customStyles}
            className="w-full h-full"
          >
            <MapControls position="top-right" showZoom showCompass showLocate />

            {/* Agro-Climatic Zones Layer Overlay */}
            {showAgroZones && (
              <MapGeoJSON
                id="agro-climatic-zones"
                data={AGRO_CLIMATIC_ZONES_GEOJSON}
                fillPaint={{
                  "fill-color": [
                    "case",
                    ["==", ["get", "zoneId"], "zone-indo-gangetic"],
                    "#22c55e",
                    ["==", ["get", "zoneId"], "zone-deccan-black"],
                    "#3b82f6",
                    ["==", ["get", "zoneId"], "zone-cauvery-coastal"],
                    "#8b5cf6",
                    "#f59e0b",
                  ],
                  "fill-opacity": 0.12,
                }}
                linePaint={{
                  "line-color": [
                    "case",
                    ["==", ["get", "zoneId"], "zone-indo-gangetic"],
                    "#16a34a",
                    ["==", ["get", "zoneId"], "zone-deccan-black"],
                    "#2563eb",
                    ["==", ["get", "zoneId"], "zone-cauvery-coastal"],
                    "#7c3aed",
                    "#d97706",
                  ],
                  "line-width": 1.5,
                }}
                fillHoverPaint={{
                  "fill-opacity": 0.28,
                }}
                interactive={true}
              />
            )}

            {/* Active Navigation Route Layer */}
            {activeRouteCoords && (
              <MapRoute
                id="active-navigation-route"
                coordinates={activeRouteCoords}
                color={activeRole === "loan-officer" ? "#d97706" : "#3b82f6"}
                width={4.5}
                dashArray={[2, 1]}
              />
            )}

            {/* Farmer Farm Markers */}
            {showFarmersLayer &&
              farmersList.map((farmer) => {
                const isSelected = selectedFarmer?.id === farmer.id;
                return (
                  <MapMarker
                    key={farmer.id}
                    longitude={farmer.coords[0]}
                    latitude={farmer.coords[1]}
                    onClick={() => {
                      setSelectedFarmer(farmer);
                      setActivePopupType("farmer");
                      setActivePopupId(farmer.id);
                    }}
                  >
                    <MarkerContent>
                      <div
                        className={`relative group cursor-pointer transition-transform duration-200 ${
                          isSelected ? "scale-125 z-30" : "scale-100 hover:scale-110 z-10"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-xl border-2 transition-all ${
                            farmer.applicationStatus === "Approved"
                              ? "bg-emerald-600 border-emerald-300 text-white"
                              : farmer.applicationStatus === "Under Review" || farmer.applicationStatus === "Pending Verification"
                              ? "bg-amber-500 border-amber-200 text-white"
                              : "bg-slate-800 border-slate-600 text-emerald-400"
                          }`}
                        >
                          <Sprout className="w-5 h-5" />
                        </div>
                        <MarkerTooltip>{farmer.name} • {farmer.primaryCrop}</MarkerTooltip>
                      </div>
                    </MarkerContent>

                    {activePopupType === "farmer" && activePopupId === farmer.id && (
                      <MarkerPopup closeOnClick={false} offset={18}>
                        <div className="p-3.5 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl text-white max-w-xs space-y-2">
                          <div className="flex items-start gap-2.5">
                            <img
                              src={farmer.photoUrl}
                              alt={farmer.name}
                              className="w-12 h-12 rounded-xl object-cover border border-emerald-400 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-black text-sm text-emerald-400">{farmer.name}</div>
                              <span
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                                  farmer.applicationStatus === "Approved"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : "bg-amber-500/20 text-amber-300"
                                }`}
                              >
                                {farmer.applicationStatus}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs space-y-1 text-slate-300">
                            <div>📍 {farmer.district}, {farmer.state}</div>
                            <div>🌾 Crop: <span className="font-bold text-white">{farmer.primaryCrop}</span> ({farmer.cultivableAcres} Acres)</div>
                            <div>📊 Credit Score: <span className="font-bold text-emerald-400">{farmer.creditScore}</span> ({farmer.riskCategory} Risk)</div>
                          </div>
                          <div className="pt-1 flex gap-2">
                            <button
                              onClick={() => handleFarmerNavigateToOffice(selectedOffice)}
                              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                            >
                              <Navigation className="w-3.5 h-3.5" /> Navigate
                            </button>
                          </div>
                        </div>
                      </MarkerPopup>
                    )}
                  </MapMarker>
                );
              })}

            {/* Bank Branch Markers */}
            {showOfficesLayer &&
              LOAN_OFFICES.map((office) => {
                const isSelected = selectedOffice?.id === office.id;
                return (
                  <MapMarker
                    key={office.id}
                    longitude={office.coords[0]}
                    latitude={office.coords[1]}
                    onClick={() => {
                      setSelectedOffice(office);
                      setActivePopupType("office");
                      setActivePopupId(office.id);
                    }}
                  >
                    <MarkerContent>
                      <div
                        className={`relative group cursor-pointer transition-transform duration-200 ${
                          isSelected ? "scale-125 z-30" : "scale-100 hover:scale-110 z-10"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl border-2 border-blue-300">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <MarkerTooltip>{office.name}</MarkerTooltip>
                      </div>
                    </MarkerContent>

                    {activePopupType === "office" && activePopupId === office.id && (
                      <MarkerPopup closeOnClick={false} offset={18}>
                        <div className="p-3.5 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl text-white max-w-xs space-y-2">
                          <div className="border-b border-slate-800 pb-2">
                            <div className="font-black text-sm text-blue-400">{office.name}</div>
                            <div className="text-[11px] text-slate-400">{office.type} ({office.categoryName})</div>
                          </div>
                          <div className="text-xs space-y-1 text-slate-300">
                            <div>📍 {office.address}</div>
                            <div>📞 {office.contactPhone}</div>
                            <div>⚡ Interest Subvention: <span className="font-bold text-emerald-400">Available</span></div>
                          </div>
                          <div className="pt-2 flex gap-2">
                            <button
                              onClick={() => {
                                setApplyOfficeId(office.id);
                                setApplyModalOpen(true);
                              }}
                              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                            >
                              Apply Loan
                            </button>
                            <button
                              onClick={() => handleFarmerNavigateToOffice(office)}
                              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                            >
                              <Navigation className="w-3.5 h-3.5" /> Route
                            </button>
                          </div>
                        </div>
                      </MarkerPopup>
                    )}
                  </MapMarker>
                );
              })}

            {/* Research Institutes Markers */}
            {showInstitutesLayer &&
              RESEARCH_INSTITUTES.map((inst) => (
                <MapMarker
                  key={inst.id}
                  longitude={inst.coords[0]}
                  latitude={inst.coords[1]}
                  onClick={() => {
                    setSelectedInstitute(inst);
                    setActivePopupType("institute");
                    setActivePopupId(inst.id);
                  }}
                >
                  <MarkerContent>
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-lg border border-teal-300 hover:scale-110 transition-transform">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </MarkerContent>
                </MapMarker>
              ))}

          </Map>

          {/* Quick Floating Layer Toggles */}
          <div className="absolute bottom-6 right-6 z-10 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-2 text-white">
            <button
              onClick={() => setShowFarmersLayer((p) => !p)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                showFarmersLayer ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              <Sprout className="w-3.5 h-3.5" /> Farms
            </button>
            <button
              onClick={() => setShowOfficesLayer((p) => !p)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                showOfficesLayer ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Banks
            </button>
            <button
              onClick={() => setShowAgroZones((p) => !p)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                showAgroZones ? "bg-teal-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Agro Zones
            </button>
          </div>

        </div>

      </div>

      {/* Loan Calculator Modal */}
      <LoanCalculatorModal
        isOpen={calcModalOpen}
        onClose={() => setCalcModalOpen(false)}
        initialAcres={selectedFarmer.cultivableAcres}
        initialCrop={selectedFarmer.primaryCrop}
        onApplyDirect={(amt) => {
          setCalcModalOpen(false);
          setApplyModalOpen(true);
        }}
      />

      {/* Apply Loan Modal */}
      <ApplyLoanModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        defaultOfficeId={applyOfficeId || selectedOffice.id}
        defaultCrop={selectedFarmer.primaryCrop}
        defaultAmount={selectedFarmer.requestedLoanAmount || 200000}
      />

    </div>
  );
};
