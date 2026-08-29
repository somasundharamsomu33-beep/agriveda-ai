// Leaflet-Style Geodesic Distance & Farm Parcel Acreage Measurement Math for AgriVeda AI

const EARTH_RADIUS_METERS = 6378137;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculate Great-Circle Distance between two [lng, lat] coordinates in meters
 */
export function calculateGeodesicDistanceMeters(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Calculate total continuous path length in meters for an array of [lng, lat] points
 */
export function calculatePathDistanceMeters(coords: [number, number][]): number {
  if (coords.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    total += calculateGeodesicDistanceMeters(coords[i], coords[i + 1]);
  }
  return total;
}

/**
 * Calculate Geodesic Area of a closed polygon in Square Meters (Spherical Excess formula)
 */
export function calculatePolygonAreaSqMeters(coords: [number, number][]): number {
  if (coords.length < 3) return 0;

  let totalAngle = 0;
  const len = coords.length;

  for (let i = 0; i < len; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % len];
    const p3 = coords[(i + 2) % len];

    const bearing1 = calculateBearing(p2, p1);
    const bearing2 = calculateBearing(p2, p3);

    let angle = bearing2 - bearing1;
    if (angle < 0) angle += 360;
    if (angle > 360) angle -= 360;

    totalAngle += angle;
  }

  // Spherical excess: E = Total Interior Angles - (n - 2) * 180
  const excessDegrees = Math.abs(totalAngle - (len - 2) * 180);
  const excessRadians = toRadians(excessDegrees);

  const areaSqMeters = excessRadians * Math.pow(EARTH_RADIUS_METERS, 2);
  return areaSqMeters;
}

/**
 * Helper to calculate initial bearing between two points
 */
function calculateBearing(p1: [number, number], p2: [number, number]): number {
  const [lng1, lat1] = p1;
  const [lng2, lat2] = p2;

  const y = Math.sin(toRadians(lng2 - lng1)) * Math.cos(toRadians(lat2));
  const x =
    Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
    Math.sin(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.cos(toRadians(lng2 - lng1));

  const bearing = (toDegrees(Math.atan2(y, x)) + 360) % 360;
  return bearing;
}

/**
 * Format acreage measurements into Indian & International agricultural land units
 */
export function formatAcreageMeasurements(sqMeters: number): {
  acres: number;
  acresFormatted: string;
  hectares: number;
  hectaresFormatted: string;
  bigha: number;
  bighaFormatted: string;
  guntha: number;
  gunthaFormatted: string;
  sqMetersFormatted: string;
} {
  const acres = sqMeters / 4046.8564224;
  const hectares = sqMeters / 10000;
  const bigha = sqMeters / 2500; // Standard Pucca Bigha approx
  const guntha = sqMeters / 101.17; // South India Guntha

  return {
    acres: parseFloat(acres.toFixed(2)),
    acresFormatted: `${acres.toFixed(2)} Acres`,
    hectares: parseFloat(hectares.toFixed(2)),
    hectaresFormatted: `${hectares.toFixed(2)} Ha`,
    bigha: parseFloat(bigha.toFixed(2)),
    bighaFormatted: `${bigha.toFixed(2)} Bigha`,
    guntha: parseFloat(guntha.toFixed(1)),
    gunthaFormatted: `${guntha.toFixed(1)} Guntha`,
    sqMetersFormatted: `${Math.round(sqMeters).toLocaleString()} m²`,
  };
}

/**
 * Format distance measurements into readable string
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}
