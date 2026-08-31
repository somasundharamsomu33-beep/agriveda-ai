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
  ChevronLeft,
  Route,
  MapPin,
  Loader2,
  Droplets,
  Store,
  Stethoscope,
  SunMedium,
  Satellite,
  Mountain,
  Locate,
  Crosshair,
  Camera,
  Clock,
  X,
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
import { NominatimSearch } from "./agri/nominatim-search";
import { OverpassExplorer } from "./agri/overpass-explorer";
import { MeasureTool, type MeasureMode } from "./agri/measure-tool";
import {
  reverseGeocodeNominatim,
  formatNominatimPlaceName,
  type NominatimSearchResult,
} from "../lib/nominatim";
import type {
  OverpassGeoJSONCollection,
  OverpassGeoJSONFeature,
} from "../lib/overpass";
import {
  getDijkstraOnRoadRoute,
  getMultiStopInspectionCircuit,
} from "../lib/dijkstra-routing";
import { UserProfile, UserRole, LandPhotoSnap } from "../types";

export interface RouteDetails {
  originName: string;
  destName: string;
  originCoords: [number, number];
  destCoords: [number, number];
  distanceKm: number;
  durationMins: number;
  etaString: string;
  summary: string;
}

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
  targetFocusCoords?: [number, number] | null;
}

export const MapsView: React.FC<MapsViewProps> = ({
  profile,
  initialRole,
  targetFocusCoords,
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
  const [selectedLandPhoto, setSelectedLandPhoto] = useState<LandPhotoSnap | null>(null);
  const [activePopupType, setActivePopupType] = useState<"farmer" | "office" | "institute" | "landPhoto" | null>("farmer");
  const [activePopupId, setActivePopupId] = useState<string | null>(FARMERS_DATA[0].id);

  // Nominatim OSM Search & Reverse Geocode states
  const [searchedPlace, setSearchedPlace] = useState<NominatimSearchResult | null>(null);
  const [reverseGeocodeCoords, setReverseGeocodeCoords] = useState<[number, number] | null>(null);
  const [reverseGeocodedPlace, setReverseGeocodedPlace] = useState<NominatimSearchResult | null>(null);

  // Overpass Real-Time OSM Agricultural Infrastructure states
  const [overpassData, setOverpassData] = useState<OverpassGeoJSONCollection | null>(null);
  const [selectedOverpassFeature, setSelectedOverpassFeature] = useState<OverpassGeoJSONFeature | null>(null);

  // Leaflet-Style Geodesic Measure Tool states
  const [measureMode, setMeasureMode] = useState<MeasureMode>("none");
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);

  // Radius & Filtering (Default 30 km)
  const [radiusKm, setRadiusKm] = useState<number>(30);
  const [showAgroZones, setShowAgroZones] = useState(true);
  const [showFarmersLayer, setShowFarmersLayer] = useState(true);
  const [showOfficesLayer, setShowOfficesLayer] = useState(true);
  const [showInstitutesLayer, setShowInstitutesLayer] = useState(true);

  // Active Route Coordinates & Detailed ETA Status
  const [activeRouteCoords, setActiveRouteCoords] = useState<[number, number][] | null>([
    FARMERS_DATA[0].coords,
    LOAN_OFFICES[0].coords,
  ]);
  const [activeRouteLabel, setActiveRouteLabel] = useState<string>(
    "Direct On-Road Route: Punjab Model Farm ➔ State Bank of India ADB"
  );
  const [activeRouteDetails, setActiveRouteDetails] = useState<RouteDetails | null>({
    originName: FARMERS_DATA[0].name,
    destName: LOAN_OFFICES[0].name.split("-")[0].trim(),
    originCoords: FARMERS_DATA[0].coords,
    destCoords: LOAN_OFFICES[0].coords,
    distanceKm: 8.4,
    durationMins: 14,
    etaString: `ETA in ~14 mins`,
    summary: `8.4 km • ~14 mins via State Road`,
  });

  // Modals
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [customCalculatedAcres, setCustomCalculatedAcres] = useState<number | undefined>(undefined);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyOfficeId, setApplyOfficeId] = useState<string | undefined>(undefined);

  // UI state
  const [activeStyleName, setActiveStyleName] = useState<"standard" | "satellite" | "topo" | "darkMatter" | "osm">("standard");

  // Dynamic farmer state updates
  const [farmersList, setFarmersList] = useState<FarmerProfile[]>(FARMERS_DATA);

  // Map Viewport
  const [viewport, setViewport] = useState<MapViewport>({
    center: [75.8056, 30.9010],
    zoom: 9.2,
    bearing: -10,
    pitch: 35,
  });

  // Real-time Live User Device Location Tracking
  const [userLiveCoords, setUserLiveCoords] = useState<[number, number] | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      // 1. Initial live location fetch
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLiveCoords([pos.coords.longitude, pos.coords.latitude]);
        },
        (err) => console.warn("Live GPS position notice:", err.message),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );

      // 2. Real-time watchPosition for continuous tracking
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLiveCoords([pos.coords.longitude, pos.coords.latitude]);
        },
        (err) => console.warn("Live GPS watch notice:", err.message),
        { enableHighAccuracy: true, maximumAge: 20000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleFlyToLiveLocation = () => {
    if (userLiveCoords) {
      setViewport({
        center: userLiveCoords,
        zoom: 14.5,
        bearing: 0,
        pitch: 25,
      });
    } else if (typeof navigator !== "undefined" && navigator.geolocation) {
      setIsLocatingUser(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setUserLiveCoords(coords);
          setIsLocatingUser(false);
          setViewport({
            center: coords,
            zoom: 14.5,
            bearing: 0,
            pitch: 25,
          });
        },
        () => setIsLocatingUser(false),
        { enableHighAccuracy: true }
      );
    }
  };

  // Center on targeted land snap or location when instructed by other views
  useEffect(() => {
    if (targetFocusCoords) {
      setViewport({
        center: targetFocusCoords,
        zoom: 15.2,
        bearing: 0,
        pitch: 30,
      });
    }
  }, [targetFocusCoords]);

  // Multi-source Tile Basemaps (Leaflet / ESRI Satellite / Topo / OSM / CartoDB)
  const customStyles = useMemo(() => {
    if (activeStyleName === "satellite") {
      return {
        dark: {
          version: 8 as const,
          sources: {
            "esri-satellite": {
              type: "raster" as const,
              tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
              tileSize: 256,
              attribution: "Esri, Maxar, Earthstar Geographics, USDA, USGS",
            },
          },
          layers: [
            { id: "esri-satellite-layer", type: "raster" as const, source: "esri-satellite", minzoom: 0, maxzoom: 19 },
          ],
        },
        light: {
          version: 8 as const,
          sources: {
            "esri-satellite": {
              type: "raster" as const,
              tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
              tileSize: 256,
              attribution: "Esri, Maxar, Earthstar Geographics, USDA, USGS",
            },
          },
          layers: [
            { id: "esri-satellite-layer", type: "raster" as const, source: "esri-satellite", minzoom: 0, maxzoom: 19 },
          ],
        },
      };
    }

    if (activeStyleName === "topo") {
      return {
        dark: {
          version: 8 as const,
          sources: {
            "opentopomap": {
              type: "raster" as const,
              tiles: ["https://a.tile.opentopomap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "OpenTopoMap, CC-BY-SA",
            },
          },
          layers: [
            { id: "opentopomap-layer", type: "raster" as const, source: "opentopomap", minzoom: 0, maxzoom: 17 },
          ],
        },
        light: {
          version: 8 as const,
          sources: {
            "opentopomap": {
              type: "raster" as const,
              tiles: ["https://a.tile.opentopomap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "OpenTopoMap, CC-BY-SA",
            },
          },
          layers: [
            { id: "opentopomap-layer", type: "raster" as const, source: "opentopomap", minzoom: 0, maxzoom: 17 },
          ],
        },
      };
    }

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

  // Derived Overpass GeoJSON Sub-layers
  const canalsGeoJSON = useMemo(() => {
    if (!overpassData) return { type: "FeatureCollection" as const, features: [] };
    return {
      type: "FeatureCollection" as const,
      features: overpassData.features.filter(
        (f) => f.properties.category === "canals" && (f.geometry.type === "LineString" || f.geometry.type === "MultiLineString")
      ),
    };
  }, [overpassData]);

  const farmlandsGeoJSON = useMemo(() => {
    if (!overpassData) return { type: "FeatureCollection" as const, features: [] };
    return {
      type: "FeatureCollection" as const,
      features: overpassData.features.filter(
        (f) => f.properties.category === "farmlands" && (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon")
      ),
    };
  }, [overpassData]);

  const overpassPointFeatures = useMemo(() => {
    if (!overpassData) return [];
    return overpassData.features.filter((f) => f.geometry.type === "Point");
  }, [overpassData]);

  // Handle Nominatim Forward Search selection
  const handleSelectNominatimPlace = (place: NominatimSearchResult) => {
    setSearchedPlace(place);
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    if (!isNaN(lat) && !isNaN(lng)) {
      setViewport({
        center: [lng, lat],
        zoom: 12.5,
        bearing: 0,
        pitch: 30,
      });
      setActivePopupType(null);
      setActivePopupId(null);
    }
  };

  // Handle Map Click: Either add measurement point or trigger Reverse Geocoding
  const handleMapClick = async (e: any) => {
    if (!e || !e.lngLat) return;
    const lng = e.lngLat.lng;
    const lat = e.lngLat.lat;

    // 1. If in Leaflet measurement mode, add vertex point
    if (measureMode !== "none") {
      setMeasurePoints((prev) => [...prev, [lng, lat]]);
      return;
    }

    // 2. Otherwise, trigger OpenStreetMap Reverse Geocoding
    setReverseGeocodeCoords([lng, lat]);
    setReverseGeocodedPlace(null);
    setActivePopupType(null);
    setActivePopupId(null);

    const res = await reverseGeocodeNominatim(lng, lat);
    setReverseGeocodedPlace(res);
  };

  // Route from Farmer (or live location) to custom coordinates with ETA
  const handleRouteToCustomCoords = async (targetCoords: [number, number], label: string) => {
    const originCoords = userLiveCoords || selectedFarmer.coords;
    const originLabel = userLiveCoords ? "Your Live GPS Location" : selectedFarmer.name;

    const midLng = (originCoords[0] + targetCoords[0]) / 2;
    const midLat = (originCoords[1] + targetCoords[1]) / 2;
    setViewport({
      center: [midLng, midLat],
      zoom: 11.5,
      bearing: 15,
      pitch: 40,
    });

    setActiveRouteLabel(`Calculating On-Road Route to ${label}...`);

    try {
      const result = await getDijkstraOnRoadRoute(originCoords, targetCoords, label);
      setActiveRouteCoords(result.coordinates);
      
      const etaDate = new Date(Date.now() + result.durationMinutes * 60 * 1000);
      const etaTime = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setActiveRouteDetails({
        originName: originLabel,
        destName: label,
        originCoords,
        destCoords: targetCoords,
        distanceKm: result.distanceKm,
        durationMins: result.durationMinutes,
        etaString: `ETA: ${etaTime} (in ~${result.durationMinutes} mins)`,
        summary: result.summary,
      });

      setActiveRouteLabel(
        `🛣️ Road Route: ${originLabel} ➔ ${label} (${result.distanceKm} km • ~${result.durationMinutes} mins • ETA: ${etaTime})`
      );
    } catch {
      setActiveRouteCoords([originCoords, targetCoords]);
      setActiveRouteDetails({
        originName: originLabel,
        destName: label,
        originCoords,
        destCoords: targetCoords,
        distanceKm: 5.2,
        durationMins: 10,
        etaString: "ETA in ~10 mins",
        summary: "Direct Navigation Route",
      });
      setActiveRouteLabel(`Route: ${originLabel} ➔ ${label}`);
    }
  };

  // Navigate farmer to bank branch via Dijkstra On-Road Shortest Path with ETA
  const handleFarmerNavigateToOffice = async (office: LoanOffice) => {
    setSelectedOffice(office);
    setActivePopupType("office");
    setActivePopupId(office.id);

    const originCoords = userLiveCoords || selectedFarmer.coords;
    const originLabel = userLiveCoords ? "Your Live GPS" : selectedFarmer.name;
    const officeShortName = office.name.split("-")[0].trim();

    const midLng = (originCoords[0] + office.coords[0]) / 2;
    const midLat = (originCoords[1] + office.coords[1]) / 2;
    setViewport({
      center: [midLng, midLat],
      zoom: 11.5,
      bearing: 15,
      pitch: 45,
    });

    setActiveRouteLabel(`Calculating On-Road Route to ${officeShortName}...`);

    try {
      const result = await getDijkstraOnRoadRoute(originCoords, office.coords, office.name);
      setActiveRouteCoords(result.coordinates);

      const etaDate = new Date(Date.now() + result.durationMinutes * 60 * 1000);
      const etaTime = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setActiveRouteDetails({
        originName: originLabel,
        destName: office.name,
        originCoords,
        destCoords: office.coords,
        distanceKm: result.distanceKm,
        durationMins: result.durationMinutes,
        etaString: `ETA: ${etaTime} (in ~${result.durationMinutes} mins)`,
        summary: result.summary,
      });

      setActiveRouteLabel(
        `🛣️ On-Road Path: ${originLabel} ➔ ${officeShortName} (${result.distanceKm} km • ~${result.durationMinutes} mins • ETA: ${etaTime})`
      );
    } catch {
      setActiveRouteCoords([originCoords, office.coords]);
      setActiveRouteDetails({
        originName: originLabel,
        destName: office.name,
        originCoords,
        destCoords: office.coords,
        distanceKm: 8.5,
        durationMins: 15,
        etaString: "ETA in ~15 mins",
        summary: "Direct Navigation Route",
      });
      setActiveRouteLabel(`Route: ${originLabel} ➔ ${office.name}`);
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

      const etaDate = new Date(Date.now() + result.durationMinutes * 60 * 1000);
      const etaTime = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setActiveRouteDetails({
        originName: selectedOffice.name.split("-")[0].trim(),
        destName: `${inspectionFarmers.length} Applicant Farms Circuit`,
        originCoords: selectedOffice.coords,
        destCoords: inspectionFarmers[0].coords,
        distanceKm: result.distanceKm,
        durationMins: result.durationMinutes,
        etaString: `ETA: ${etaTime} (Full Circuit: ~${result.durationMinutes} mins)`,
        summary: result.summary,
      });

      setActiveRouteLabel(
        `🚗 Inspection Circuit (${selectedOffice.state}): ${selectedOffice.name.split("-")[0].trim()} ➔ ${inspectionFarmers.length} Farms (${result.distanceKm} km • ETA: ${etaTime})`
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
      label: "My Farm Map",
      sub: "Loans, Schemes & Field GIS",
      icon: Sprout,
      color: "from-emerald-500 to-green-600",
      activeBg: "bg-emerald-700 text-white shadow-emerald-700/20",
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
      
      {/* Top Header Bar with Nominatim Search, Role Switcher & Basemap Presets */}
      <header className="z-40 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shrink-0">
        
        {/* Brand & Nominatim Search Component */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px] max-w-xl">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg ring-2 ring-white/10 shrink-0">
            <Navigation className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="flex-1">
            <NominatimSearch
              onSelectPlace={handleSelectNominatimPlace}
              onClearPlace={() => setSearchedPlace(null)}
              selectedPlace={searchedPlace}
              mapCenter={viewport.center}
              onRouteToPlace={handleRouteToCustomCoords}
            />
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
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

        {/* Right Tools: Leaflet Satellite/Basemap Switcher & Regional Quick Presets */}
        <div className="flex items-center gap-2">
          {/* Basemap Style Selector */}
          <select
            value={activeStyleName}
            onChange={(e) => setActiveStyleName(e.target.value as any)}
            aria-label="Select Basemap Style"
            className="bg-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="standard">Positron (Vector)</option>
            <option value="satellite">🛰️ ESRI Satellite (HD)</option>
            <option value="topo">⛰️ OpenTopoMap (Contours)</option>
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
            className="bg-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 hidden xl:block"
          >
            {REGION_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>
                📍 {p.name}
              </option>
            ))}
          </select>

        </div>
      </header>

      {/* Main Container: Sidebar + Map */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex">
        
        {/* Left Sidebar Panel (Role-Specific Dedicated View) */}
        <div className="z-20 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 flex flex-col shrink-0 w-full sm:w-96 md:w-[420px] overflow-y-auto">
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
          
          {/* Enhanced Active Navigation Route & ETA Guidance HUD */}
          {activeRouteCoords && activeRouteCoords.length > 0 && activeRouteDetails && (
            <div className="absolute top-4 left-4 right-4 sm:right-auto z-10 max-w-md bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 rounded-3xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 text-white space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                    <Route className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                      🛣️ On-Road Route Navigation
                    </span>
                    <h4 className="text-xs font-black text-white truncate">
                      {activeRouteDetails.originName} ➔ {activeRouteDetails.destName}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveRouteCoords(null);
                    setActiveRouteLabel("");
                    setActiveRouteDetails(null);
                  }}
                  className="text-slate-400 hover:text-white text-[11px] font-bold p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 shrink-0"
                  title="Clear Route"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ETA, Distance & Duration Metrics */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/80 rounded-2xl p-2.5 border border-slate-800 text-center">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">ETA Arrival</span>
                  <span className="text-xs font-black text-emerald-300">{activeRouteDetails.etaString.split(' ')[1] || 'Live'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Duration</span>
                  <span className="text-xs font-black text-amber-300">{activeRouteDetails.durationMins} mins</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Distance</span>
                  <span className="text-xs font-black text-sky-300">{activeRouteDetails.distanceKm} km</span>
                </div>
              </div>

              {/* Turn-by-Turn & External Navigation Button */}
              <div className="flex items-center gap-2 pt-0.5">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${activeRouteDetails.originCoords[1]},${activeRouteDetails.originCoords[0]}&destination=${activeRouteDetails.destCoords[1]},${activeRouteDetails.destCoords[0]}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 text-center"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-200" />
                  <span>Start Turn-by-Turn GPS</span>
                </a>
              </div>
            </div>
          )}

          {/* Leaflet-Style Geodesic Measure Tool Bar & HUD */}
          <MeasureTool
            measureMode={measureMode}
            onSetMeasureMode={setMeasureMode}
            points={measurePoints}
            onClearPoints={() => setMeasurePoints([])}
            onUndoPoint={() => setMeasurePoints((p) => p.slice(0, -1))}
            onApplyForAcreage={(acres) => {
              setCustomCalculatedAcres(acres);
              setCalcModalOpen(true);
            }}
          />

          {/* Overpass API Explorer Floating Component */}
          <OverpassExplorer
            viewport={viewport}
            onDataLoaded={setOverpassData}
            activeData={overpassData}
            onClearData={() => setOverpassData(null)}
            selectedFeature={selectedOverpassFeature}
            onCloseFeatureDetails={() => setSelectedOverpassFeature(null)}
          />

          {/* Map Canvas */}
          <Map
            viewport={viewport}
            onViewportChange={setViewport}
            onMapClick={handleMapClick}
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

            {/* Overpass Live Farmland Parcels Layer */}
            {farmlandsGeoJSON.features.length > 0 && (
              <MapGeoJSON
                id="overpass-farmlands-layer"
                data={farmlandsGeoJSON}
                fillPaint={{
                  "fill-color": "#22c55e",
                  "fill-opacity": 0.2,
                }}
                linePaint={{
                  "line-color": "#16a34a",
                  "line-width": 1.8,
                }}
                fillHoverPaint={{
                  "fill-opacity": 0.35,
                }}
                interactive={true}
              />
            )}

            {/* Overpass Live Irrigation Canals Layer */}
            {canalsGeoJSON.features.length > 0 && (
              <MapGeoJSON
                id="overpass-canals-layer"
                data={canalsGeoJSON}
                linePaint={{
                  "line-color": "#06b6d4",
                  "line-width": 3,
                }}
                interactive={true}
              />
            )}

            {/* Dynamic Nominatim Search Result Polygon */}
            {searchedPlace?.geojson && (
              <MapGeoJSON
                id="nominatim-searched-polygon"
                data={{
                  type: "Feature",
                  geometry: searchedPlace.geojson as any,
                  properties: { name: searchedPlace.name || searchedPlace.display_name },
                }}
                fillPaint={{
                  "fill-color": "#10b981",
                  "fill-opacity": 0.18,
                }}
                linePaint={{
                  "line-color": "#059669",
                  "line-width": 2.5,
                }}
              />
            )}

            {/* Leaflet-Style Measured Farm Parcel Area Polygon */}
            {measureMode === "area" && measurePoints.length >= 3 && (
              <MapGeoJSON
                id="measured-farm-polygon"
                data={{
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: [[...measurePoints, measurePoints[0]]],
                  },
                  properties: {},
                }}
                fillPaint={{
                  "fill-color": "#10b981",
                  "fill-opacity": 0.3,
                }}
                linePaint={{
                  "line-color": "#059669",
                  "line-width": 2.5,
                  "line-dasharray": [3, 1],
                }}
              />
            )}

            {/* Leaflet-Style Measured Distance / Perimeter Polyline */}
            {measurePoints.length >= 2 && (
              <MapRoute
                id="measured-distance-route"
                coordinates={measurePoints}
                color={measureMode === "area" ? "#10b981" : "#3b82f6"}
                width={3}
                dashArray={[2, 1]}
              />
            )}

            {/* Leaflet Measurement Vertex Pins */}
            {measurePoints.map((pt, idx) => (
              <MapMarker key={`measure-pt-${idx}`} longitude={pt[0]} latitude={pt[1]}>
                <MarkerContent>
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white border-2 border-white flex items-center justify-center text-[9px] font-black shadow-lg">
                    {idx + 1}
                  </div>
                </MarkerContent>
              </MapMarker>
            ))}

            {/* Real-time User Live Location Pulsing Blue Marker */}
            {userLiveCoords && (
              <MapMarker longitude={userLiveCoords[0]} latitude={userLiveCoords[1]}>
                <MarkerContent>
                  <div
                    onClick={handleFlyToLiveLocation}
                    className="relative flex items-center justify-center cursor-pointer group"
                    title="Live Device Location (You are here)"
                  >
                    {/* Outer Radiating Ping Wave */}
                    <span className="absolute w-9 h-9 rounded-full bg-blue-500/40 animate-ping pointer-events-none" />
                    {/* Secondary Semi-transparent Halo */}
                    <span className="absolute w-7 h-7 rounded-full bg-blue-500/25 border border-blue-400/50" />
                    {/* Inner Vibrant Blue Orb */}
                    <div className="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-2xl flex items-center justify-center ring-2 ring-blue-500/40">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </div>

                    {/* Live Location Floating Badge on Hover */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center px-2.5 py-1 bg-slate-900/95 backdrop-blur-md text-white text-[10px] font-black rounded-xl shadow-2xl border border-blue-500/50 whitespace-nowrap z-50 animate-in fade-in slide-in-from-bottom-1">
                      <div className="flex items-center gap-1 text-blue-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                        <span>You are here (Live GPS)</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {userLiveCoords[1].toFixed(4)}°N, {userLiveCoords[0].toFixed(4)}°E
                      </span>
                    </div>
                  </div>
                </MarkerContent>
              </MapMarker>
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

            {/* User Affiliated Land Photo Snap Markers */}
            {profile.landPhotos &&
              profile.landPhotos.map((photo) => (
                <MapMarker
                  key={photo.id}
                  longitude={photo.coords[0]}
                  latitude={photo.coords[1]}
                  onClick={() => {
                    setSelectedLandPhoto(photo);
                    setActivePopupType("landPhoto");
                    setActivePopupId(photo.id);
                  }}
                >
                  <MarkerContent>
                    <div className="relative group cursor-pointer hover:scale-125 transition-transform z-20">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-xl border-2 border-white ring-2 ring-amber-400/40">
                        <Camera className="w-4 h-4" />
                      </div>
                      <MarkerTooltip>📸 {photo.title}</MarkerTooltip>
                    </div>
                  </MarkerContent>

                  {activePopupType === "landPhoto" && activePopupId === photo.id && (
                    <MarkerPopup closeOnClick={false} offset={18}>
                      <div className="p-3 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-amber-500/40 shadow-2xl text-white max-w-xs space-y-2">
                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-700">
                          <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-amber-400">{photo.title}</h4>
                          {photo.notes && <p className="text-[11px] text-slate-300 font-medium">{photo.notes}</p>}
                          <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-800">
                            <span>GPS: {photo.coords[1].toFixed(4)}°N, {photo.coords[0].toFixed(4)}°E</span>
                            <span>{photo.timestamp}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRouteToCustomCoords(photo.coords, photo.title)}
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Navigate to Parcel
                        </button>
                      </div>
                    </MarkerPopup>
                  )}
                </MapMarker>
              ))}

            {/* Overpass Real-Time Point Infrastructure Markers */}
            {overpassPointFeatures.map((feat) => {
              const coords = feat.geometry.coordinates;
              const cat = feat.properties.category;
              return (
                <MapMarker
                  key={`overpass-${feat.id}`}
                  longitude={coords[0]}
                  latitude={coords[1]}
                  onClick={() => setSelectedOverpassFeature(feat)}
                >
                  <MarkerContent>
                    <div className="cursor-pointer group hover:scale-125 transition-transform z-20">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-lg border border-white ${
                          cat === "mandis"
                            ? "bg-amber-600"
                            : cat === "veterinary"
                            ? "bg-purple-600"
                            : cat === "solar_pumps"
                            ? "bg-yellow-600"
                            : "bg-cyan-600"
                        }`}
                      >
                        {cat === "mandis" && <Store className="w-3.5 h-3.5" />}
                        {cat === "veterinary" && <Stethoscope className="w-3.5 h-3.5" />}
                        {cat === "solar_pumps" && <SunMedium className="w-3.5 h-3.5" />}
                        {cat === "canals" && <Droplets className="w-3.5 h-3.5" />}
                        {cat === "farmlands" && <Sprout className="w-3.5 h-3.5" />}
                      </div>
                      <MarkerTooltip>{feat.properties.name}</MarkerTooltip>
                    </div>
                  </MarkerContent>
                </MapMarker>
              );
            })}

            {/* Nominatim Forward Searched Place Marker */}
            {searchedPlace && !isNaN(parseFloat(searchedPlace.lon)) && (
              <MapMarker
                longitude={parseFloat(searchedPlace.lon)}
                latitude={parseFloat(searchedPlace.lat)}
              >
                <MarkerContent>
                  <div className="relative group cursor-pointer animate-bounce z-40">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-2xl border-2 border-emerald-300 ring-4 ring-emerald-500/30">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </MarkerContent>
                <MarkerLabel position="top">
                  {searchedPlace.name || searchedPlace.display_name.split(",")[0]}
                </MarkerLabel>
              </MapMarker>
            )}

            {/* OpenStreetMap Reverse-Geocoded Click Point Marker & Popup */}
            {reverseGeocodeCoords && measureMode === "none" && (
              <MapMarker
                longitude={reverseGeocodeCoords[0]}
                latitude={reverseGeocodeCoords[1]}
              >
                <MarkerContent>
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-2xl border-2 border-white animate-pulse z-40">
                    <Compass className="w-4 h-4" />
                  </div>
                </MarkerContent>

                <MarkerPopup closeButton onClose={() => setReverseGeocodeCoords(null)} offset={15}>
                  <div className="p-3 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl text-white max-w-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                        Identified Location
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        OSM Reverse
                      </span>
                    </div>

                    {reverseGeocodedPlace ? (
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-white leading-snug">
                          {formatNominatimPlaceName(reverseGeocodedPlace).primary}
                        </h4>
                        <p className="text-[11px] text-slate-300 line-clamp-2">
                          📍 {reverseGeocodedPlace.display_name}
                        </p>
                        <div className="text-[10px] font-mono text-slate-400">
                          {reverseGeocodeCoords[1].toFixed(5)}°N, {reverseGeocodeCoords[0].toFixed(5)}°E
                        </div>
                        <div className="pt-1 flex gap-1.5">
                          <button
                            onClick={() =>
                              handleRouteToCustomCoords(
                                reverseGeocodeCoords,
                                formatNominatimPlaceName(reverseGeocodedPlace).primary
                              )
                            }
                            className="flex-1 py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1"
                          >
                            <Navigation className="w-3 h-3" /> Route Here
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Reverse geocoding point...</span>
                      </div>
                    )}
                  </div>
                </MarkerPopup>
              </MapMarker>
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

          {/* Quick Floating Layer & Click Inspector Toggles */}
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

            {/* Real-time User Live Location Finder */}
            <button
              onClick={handleFlyToLiveLocation}
              disabled={isLocatingUser}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                userLiveCoords
                  ? "bg-blue-600 text-white shadow-lg ring-1 ring-blue-400/50"
                  : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
              title="Center On Real-time Device GPS Location"
            >
              <Locate className={`w-3.5 h-3.5 ${isLocatingUser ? "animate-spin text-blue-300" : "text-blue-400"}`} />
              <span>Live Location</span>
            </button>
          </div>

          {/* Leaflet-Style Cursor Coordinates & HUD Inset */}
          <div className="absolute bottom-6 left-6 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400 shadow-xl">
            <span className="text-emerald-400 font-bold">
              {viewport.center[1].toFixed(4)}° N, {viewport.center[0].toFixed(4)}° E
            </span>
            <span>•</span>
            <span>Zoom {viewport.zoom.toFixed(1)}x</span>
            <span>•</span>
            <span className="capitalize text-slate-300 font-semibold">{activeStyleName}</span>
          </div>

        </div>

      </div>

      {/* Loan Calculator Modal */}
      <LoanCalculatorModal
        isOpen={calcModalOpen}
        onClose={() => setCalcModalOpen(false)}
        initialAcres={customCalculatedAcres || selectedFarmer.cultivableAcres}
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
