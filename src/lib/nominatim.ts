// OpenStreetMap Nominatim Geocoding Client for AgriVeda AI MapCN

export interface NominatimAddress {
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  village?: string;
  hamlet?: string;
  town?: string;
  city?: string;
  municipality?: string;
  taluk?: string;
  county?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
  amenity?: string;
  building?: string;
  isolated_dwelling?: string;
  commercial?: string;
  industrial?: string;
  agricultural?: string;
  [key: string]: string | undefined;
}

export interface NominatimSearchResult {
  place_id: number | string;
  licence?: string;
  osm_type: "node" | "way" | "relation" | string;
  osm_id: number | string;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank?: number;
  importance: number;
  addresstype?: string;
  name?: string;
  display_name: string;
  boundingbox: [string, string, string, string]; // [minLat, maxLat, minLon, maxLon]
  address?: NominatimAddress;
  extratags?: Record<string, string>;
  geojson?: {
    type: string;
    coordinates: any;
  };
  icon?: string;
}

export interface NominatimSearchOptions {
  countrycodes?: string;
  limit?: number;
  addressdetails?: number;
  extratags?: number;
  namedetails?: number;
  polygon_geojson?: number;
  viewbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  bounded?: number;
}

const searchCache = new Map<string, NominatimSearchResult[]>();
const reverseCache = new Map<string, NominatimSearchResult>();

/**
 * Forward Geocoding: Search places, villages, mandis, districts, banks by name
 */
export async function searchNominatim(
  query: string,
  options: NominatimSearchOptions = {}
): Promise<NominatimSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = JSON.stringify({ q: trimmed, ...options });
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }

  const countrycodes = options.countrycodes || "in";
  const limit = options.limit || 8;
  const addressdetails = options.addressdetails ?? 1;
  const extratags = options.extratags ?? 1;
  const polygon_geojson = options.polygon_geojson ?? 1;

  // Build query params
  const params = new URLSearchParams({
    q: trimmed,
    format: "jsonv2",
    countrycodes,
    limit: limit.toString(),
    addressdetails: addressdetails.toString(),
    extratags: extratags.toString(),
    polygon_geojson: polygon_geojson.toString(),
  });

  if (options.viewbox) {
    // viewbox format: <min_lon>,<max_lat>,<max_lon>,<min_lat>
    const [minLng, minLat, maxLng, maxLat] = options.viewbox;
    params.append("viewbox", `${minLng},${maxLat},${maxLng},${minLat}`);
    if (options.bounded) {
      params.append("bounded", "1");
    }
  }

  // Attempt backend proxy first, fallback to public OSM Nominatim
  const endpoints = [
    `/api/nominatim/search?${params.toString()}`,
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data: NominatimSearchResult[] = await res.json();
        if (Array.isArray(data)) {
          searchCache.set(cacheKey, data);
          return data;
        }
      }
    } catch {
      // Continue to next endpoint fallback
    }
  }

  return [];
}

/**
 * Reverse Geocoding: Given [lng, lat], resolve full address hierarchy
 */
export async function reverseGeocodeNominatim(
  lng: number,
  lat: number,
  zoom: number = 18
): Promise<NominatimSearchResult | null> {
  const roundedLat = lat.toFixed(6);
  const roundedLng = lng.toFixed(6);
  const cacheKey = `${roundedLat},${roundedLng},${zoom}`;

  if (reverseCache.has(cacheKey)) {
    return reverseCache.get(cacheKey)!;
  }

  const params = new URLSearchParams({
    lat: roundedLat,
    lon: roundedLng,
    zoom: zoom.toString(),
    format: "jsonv2",
    addressdetails: "1",
    extratags: "1",
    polygon_geojson: "1",
  });

  const endpoints = [
    `/api/nominatim/reverse?${params.toString()}`,
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data: NominatimSearchResult = await res.json();
        if (data && data.display_name) {
          reverseCache.set(cacheKey, data);
          return data;
        }
      }
    } catch {
      // Continue to next endpoint fallback
    }
  }

  return null;
}

/**
 * Format place address to a concise, readable string
 */
export function formatNominatimPlaceName(place: NominatimSearchResult): {
  primary: string;
  secondary: string;
  badge: string;
} {
  const addr = place.address || {};
  const primary =
    place.name ||
    addr.village ||
    addr.town ||
    addr.city ||
    addr.road ||
    addr.county ||
    place.display_name.split(",")[0].trim();

  const secondaryParts: string[] = [];
  if (addr.village && addr.village !== primary) secondaryParts.push(addr.village);
  if (addr.state_district || addr.county) {
    const dist = addr.state_district || addr.county;
    if (dist && !secondaryParts.includes(dist)) secondaryParts.push(dist);
  }
  if (addr.state && !secondaryParts.includes(addr.state)) secondaryParts.push(addr.state);
  if (addr.postcode) secondaryParts.push(addr.postcode);

  const secondary = secondaryParts.join(", ") || place.display_name;

  let badge = place.type.replace(/_/g, " ");
  if (place.class === "boundary" && place.type === "administrative") badge = "Administrative Region";
  else if (place.class === "place" && (place.type === "village" || place.type === "hamlet")) badge = "Village / Hamlet";
  else if (place.class === "place" && (place.type === "town" || place.type === "city")) badge = "Town / City";
  else if (place.class === "amenity" && place.type === "bank") badge = "Bank Branch";
  else if (place.class === "amenity" && place.type === "marketplace") badge = "APMC Mandi / Market";
  else if (place.class === "landuse" && place.type === "farmland") badge = "Farmland / Plot";

  return { primary, secondary, badge };
}
