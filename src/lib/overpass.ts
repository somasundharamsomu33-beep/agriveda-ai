// OpenStreetMap Overpass API Client & Agricultural GeoJSON Converter for AgriVeda AI

export type AgriInfrastructureCategory =
  | "canals"
  | "farmlands"
  | "mandis"
  | "veterinary"
  | "solar_pumps";

export interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
  geometry?: Array<{ lat: number; lon: number }>;
  nodes?: number[];
  members?: Array<{
    type: string;
    ref: number;
    role: string;
    geometry?: Array<{ lat: number; lon: number }>;
  }>;
}

export interface OverpassResponse {
  version: number;
  generator: string;
  elements: OverpassElement[];
}

export interface OverpassGeoJSONFeature {
  type: "Feature";
  id: string | number;
  geometry: {
    type: "Point" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon";
    coordinates: any;
  };
  properties: {
    osm_id: number;
    osm_type: string;
    category: AgriInfrastructureCategory | string;
    name?: string;
    tags: Record<string, string>;
    [key: string]: any;
  };
}

export interface OverpassGeoJSONCollection {
  type: "FeatureCollection";
  features: OverpassGeoJSONFeature[];
}

const overpassCache = new Map<string, OverpassGeoJSONCollection>();

/**
 * Build an Overpass QL Query for Agricultural Spatial Infrastructure
 */
export function buildAgriOverpassQL(
  bbox: [number, number, number, number], // [minLat, minLon, maxLat, maxLon]
  categories: AgriInfrastructureCategory[] = ["canals", "farmlands", "mandis", "veterinary"]
): string {
  const [minLat, minLon, maxLat, maxLon] = bbox;
  const bboxStr = `${minLat.toFixed(4)},${minLon.toFixed(4)},${maxLat.toFixed(4)},${maxLon.toFixed(4)}`;

  const queryParts: string[] = [];

  if (categories.includes("canals")) {
    queryParts.push(`
      way["waterway"~"canal|ditch|drain"](${bboxStr});
      relation["waterway"="canal"](${bboxStr});
      node["man_made"="water_well"](${bboxStr});
    `);
  }

  if (categories.includes("farmlands")) {
    queryParts.push(`
      way["landuse"~"farmland|orchard|greenhouse_horticulture"](${bboxStr});
      relation["landuse"="farmland"](${bboxStr});
    `);
  }

  if (categories.includes("mandis")) {
    queryParts.push(`
      node["amenity"="marketplace"](${bboxStr});
      way["amenity"="marketplace"](${bboxStr});
      node["shop"~"agrarian|farm"](${bboxStr});
    `);
  }

  if (categories.includes("veterinary")) {
    queryParts.push(`
      node["amenity"="veterinary"](${bboxStr});
      way["amenity"="veterinary"](${bboxStr});
      way["building"="warehouse"](${bboxStr});
    `);
  }

  if (categories.includes("solar_pumps")) {
    queryParts.push(`
      node["generator:source"="solar"](${bboxStr});
      node["power"="generator"](${bboxStr});
    `);
  }

  return `
    [out:json][timeout:25];
    (
      ${queryParts.join("\n")}
    );
    out body geom 80;
  `.trim();
}

/**
 * Convert Overpass JSON response into standard GeoJSON FeatureCollection
 */
export function convertOverpassToGeoJSON(
  data: OverpassResponse,
  fallbackCategory: string = "agri"
): OverpassGeoJSONCollection {
  const features: OverpassGeoJSONFeature[] = [];

  if (!data || !data.elements) {
    return { type: "FeatureCollection", features: [] };
  }

  for (const el of data.elements) {
    const tags = el.tags || {};
    let category: AgriInfrastructureCategory | string = fallbackCategory;

    if (tags.waterway || tags.man_made === "water_well") category = "canals";
    else if (tags.landuse === "farmland" || tags.landuse === "orchard" || tags.landuse === "greenhouse_horticulture") category = "farmlands";
    else if (tags.amenity === "marketplace" || tags.shop === "agrarian") category = "mandis";
    else if (tags.amenity === "veterinary" || tags.building === "warehouse") category = "veterinary";
    else if (tags["generator:source"] === "solar" || tags.power === "generator") category = "solar_pumps";

    const name = tags.name || tags["name:en"] || tags["name:hi"] || tags["name:ta"] || tags.operator || `${category.toUpperCase()} #${el.id}`;

    // 1. Node -> Point
    if (el.type === "node" && typeof el.lon === "number" && typeof el.lat === "number") {
      features.push({
        type: "Feature",
        id: `${el.type}-${el.id}`,
        geometry: {
          type: "Point",
          coordinates: [el.lon, el.lat],
        },
        properties: {
          osm_id: el.id,
          osm_type: el.type,
          category,
          name,
          tags,
        },
      });
    }

    // 2. Way -> LineString or Polygon
    else if (el.type === "way" && el.geometry && el.geometry.length >= 2) {
      const coords = el.geometry.map((pt) => [pt.lon, pt.lat]);
      const isClosed =
        coords.length >= 4 &&
        coords[0][0] === coords[coords.length - 1][0] &&
        coords[0][1] === coords[coords.length - 1][1];

      const isPolygon =
        isClosed &&
        (tags.landuse || tags.building || tags.area === "yes" || category === "farmlands");

      features.push({
        type: "Feature",
        id: `${el.type}-${el.id}`,
        geometry: {
          type: isPolygon ? "Polygon" : "LineString",
          coordinates: isPolygon ? [coords] : coords,
        },
        properties: {
          osm_id: el.id,
          osm_type: el.type,
          category,
          name,
          tags,
        },
      });
    }
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

/**
 * Execute Overpass query with backend proxy & public multi-mirror failover
 */
export async function executeOverpassQuery(
  query: string
): Promise<OverpassGeoJSONCollection> {
  const cacheKey = query.trim();
  if (overpassCache.has(cacheKey)) {
    return overpassCache.get(cacheKey)!;
  }

  const endpoints = [
    "/api/overpass/query",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];

  for (const url of endpoints) {
    try {
      const isInternalApi = url.startsWith("/api");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": isInternalApi ? "application/json" : "application/x-www-form-urlencoded",
        },
        body: isInternalApi ? JSON.stringify({ query }) : `data=${encodeURIComponent(query)}`,
      });

      if (res.ok) {
        const json = await res.json();
        // If internal API already converted to GeoJSON, return directly
        if (json.type === "FeatureCollection") {
          overpassCache.set(cacheKey, json);
          return json;
        }
        const geojson = convertOverpassToGeoJSON(json);
        overpassCache.set(cacheKey, geojson);
        return geojson;
      }
    } catch {
      // Continue to next mirror fallback
    }
  }

  return { type: "FeatureCollection", features: [] };
}

/**
 * Scan bounding box for live OpenStreetMap agricultural infrastructure
 */
export async function fetchAgriInfrastructure(
  bbox: [number, number, number, number], // [minLat, minLon, maxLat, maxLon]
  categories: AgriInfrastructureCategory[] = ["canals", "farmlands", "mandis", "veterinary"]
): Promise<OverpassGeoJSONCollection> {
  const query = buildAgriOverpassQL(bbox, categories);
  return executeOverpassQuery(query);
}
