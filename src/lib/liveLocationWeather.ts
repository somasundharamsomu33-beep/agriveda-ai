import { useState, useEffect, useCallback } from 'react';
import { WeatherInfo } from '../types';

export interface DayForecast {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  rainChance: number;
  precipitationMm: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sprayRisk: 'LOW' | 'MODERATE' | 'HIGH';
  advisory: string;
}

export interface LiveLocationWeatherState {
  weather: WeatherInfo | null;
  sevenDayForecast: DayForecast[];
  coords: [number, number] | null; // [lon, lat]
  locationName: string;
  isLiveLocation: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  refresh: () => Promise<void>;
  requestLiveLocation: () => Promise<void>;
}

// Convert Open-Meteo WMO Weather Codes to descriptive conditions and emojis
export function getWmoCondition(code: number): { condition: string; icon: string; advisory: string; sprayRisk: 'LOW' | 'MODERATE' | 'HIGH' } {
  if (code === 0) {
    return { condition: 'Clear Sky / Sunny', icon: '☀️', advisory: 'Ideal for harvesting, threshing & solar grain drying.', sprayRisk: 'LOW' };
  }
  if (code === 1 || code === 2) {
    return { condition: 'Partly Cloudy', icon: '⛅', advisory: 'Good conditions for foliar nutrient sprays and intercultural weeding.', sprayRisk: 'LOW' };
  }
  if (code === 3) {
    return { condition: 'Overcast & Cloudy', icon: '☁️', advisory: 'Moderate humidity. Monitor for early signs of fungal blast in paddy.', sprayRisk: 'LOW' };
  }
  if (code === 45 || code === 48) {
    return { condition: 'Fog & Mist', icon: '🌫️', advisory: 'High morning moisture. Postpone chemical pesticide spraying.', sprayRisk: 'MODERATE' };
  }
  if (code >= 51 && code <= 55) {
    return { condition: 'Light Drizzle', icon: '🌦️', advisory: 'Light precipitation. Ensure drainage channels in low-lying crop beds.', sprayRisk: 'MODERATE' };
  }
  if (code >= 61 && code <= 65) {
    return { condition: 'Rain Showers', icon: '🌧️', advisory: 'Active rainfall. Halt all chemical applications and protect harvested grain.', sprayRisk: 'HIGH' };
  }
  if (code >= 71 && code <= 77) {
    return { condition: 'Cool / Frosty', icon: '🌨️', advisory: 'Apply light evening irrigation to protect young crops from cold shock.', sprayRisk: 'MODERATE' };
  }
  if (code >= 80 && code <= 82) {
    return { condition: 'Heavy Rain Showers', icon: '⛈️', advisory: 'High rain probability. Check field bunds and drainage outlets immediately.', sprayRisk: 'HIGH' };
  }
  if (code >= 95) {
    return { condition: 'Thunderstorm', icon: '⚡', advisory: 'Severe weather alert. Move farm machinery and livestock to covered shelters.', sprayRisk: 'HIGH' };
  }
  return { condition: 'Mild Weather', icon: '🌤️', advisory: 'Standard seasonal agricultural conditions.', sprayRisk: 'LOW' };
}

// Fallback 7-day forecast
export const defaultWeeklyForecast: DayForecast[] = [
  { day: 'Today', date: 'Live', tempMax: 33, tempMin: 24, condition: 'Partly Cloudy', icon: '⛅', rainChance: 15, precipitationMm: 0, windSpeedMax: 12, uvIndexMax: 8, sprayRisk: 'LOW', advisory: 'Optimal morning spraying window.' },
  { day: 'Tomorrow', date: 'Day +1', tempMax: 34, tempMin: 25, condition: 'Sunny / Clear', icon: '☀️', rainChance: 10, precipitationMm: 0, windSpeedMax: 14, uvIndexMax: 9, sprayRisk: 'LOW', advisory: 'High sunshine; irrigate evening.' },
  { day: 'Day 3', date: 'Day +2', tempMax: 32, tempMin: 23, condition: 'Cloudy Spells', icon: '☁️', rainChance: 35, precipitationMm: 2.1, windSpeedMax: 16, uvIndexMax: 7, sprayRisk: 'MODERATE', advisory: 'Scattered breeze; check pest traps.' },
  { day: 'Day 4', date: 'Day +3', tempMax: 30, tempMin: 22, condition: 'Light Rain', icon: '🌦️', rainChance: 65, precipitationMm: 8.5, windSpeedMax: 18, uvIndexMax: 5, sprayRisk: 'HIGH', advisory: 'Postpone pesticide spraying.' },
  { day: 'Day 5', date: 'Day +4', tempMax: 31, tempMin: 23, condition: 'Scattered Showers', icon: '🌧️', rainChance: 50, precipitationMm: 4.2, windSpeedMax: 15, uvIndexMax: 6, sprayRisk: 'MODERATE', advisory: 'Maintain field drainage channels.' },
  { day: 'Day 6', date: 'Day +5', tempMax: 33, tempMin: 24, condition: 'Sunny / Clearing', icon: '🌤️', rainChance: 20, precipitationMm: 0, windSpeedMax: 11, uvIndexMax: 8, sprayRisk: 'LOW', advisory: 'Great for foliar fertilizer application.' },
  { day: 'Day 7', date: 'Day +6', tempMax: 34, tempMin: 25, condition: 'Warm & Clear', icon: '☀️', rainChance: 10, precipitationMm: 0, windSpeedMax: 10, uvIndexMax: 9, sprayRisk: 'LOW', advisory: 'Ideal grain harvest and field drying.' }
];

export async function fetchLiveWeatherByCoords(lat: number, lon: number): Promise<{
  weather: WeatherInfo;
  sevenDayForecast: DayForecast[];
  locationName: string;
}> {
  // 1. Fetch live 7-day forecast from Open-Meteo
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto`;

  let openMeteoData: any = null;
  try {
    const res = await fetch(url);
    if (res.ok) {
      openMeteoData = await res.json();
    }
  } catch (err) {
    console.warn('Open-Meteo live weather fetch failed, using fallback:', err);
  }

  // 2. Reverse Geocode to get City / Village Name
  let resolvedLocation = `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
  try {
    const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      const city = geoData.locality || geoData.city || geoData.principalSubdivisionDistrict || '';
      const state = geoData.principalSubdivision || '';
      if (city || state) {
        resolvedLocation = [city, state].filter(Boolean).join(', ');
      }
    }
  } catch {
    // fallback location string already set
  }

  if (!openMeteoData || !openMeteoData.current || !openMeteoData.daily) {
    return {
      weather: {
        location: resolvedLocation,
        temperature: 31,
        condition: 'Partly Cloudy',
        humidity: 68,
        windSpeed: 14,
        rainChance: 25,
        uvIndex: 7,
        soilMoisture: 72,
        forecast: defaultWeeklyForecast.slice(0, 3).map(d => ({
          day: d.day,
          temp: d.tempMax,
          condition: d.condition,
          icon: d.icon,
          rainChance: d.rainChance
        })),
        weeklyTrend: [
          { day: 'Mon', temp: 31, humidity: 65, rainfall: 0 },
          { day: 'Tue', temp: 33, humidity: 62, rainfall: 0 },
          { day: 'Wed', temp: 30, humidity: 75, rainfall: 4.5 },
          { day: 'Thu', temp: 32, humidity: 70, rainfall: 1.2 },
          { day: 'Fri', temp: 34, humidity: 58, rainfall: 0 },
          { day: 'Sat', temp: 33, humidity: 60, rainfall: 0 },
          { day: 'Sun', temp: 31, humidity: 68, rainfall: 0 }
        ],
        alerts: [
          {
            id: 'alert-1',
            severity: 'warning',
            title: 'Optimal Irrigation Window',
            description: 'High heat forecast in 48 hours. Schedule early morning drip cycles.',
            action: 'Schedule Drip'
          }
        ]
      },
      sevenDayForecast: defaultWeeklyForecast,
      locationName: resolvedLocation
    };
  }

  // Parse Open-Meteo 7-Day Daily Forecast
  const daily = openMeteoData.daily;
  const current = openMeteoData.current;
  const currentConditionMeta = getWmoCondition(current.weather_code || 0);

  const sevenDayForecast: DayForecast[] = daily.time.map((dateStr: string, idx: number) => {
    const d = new Date(dateStr);
    const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const wmo = getWmoCondition(daily.weather_code[idx] || 0);

    return {
      day: dayName,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tempMax: Math.round(daily.temperature_2m_max[idx]),
      tempMin: Math.round(daily.temperature_2m_min[idx]),
      condition: wmo.condition,
      icon: wmo.icon,
      rainChance: Math.round(daily.precipitation_probability_max?.[idx] ?? 0),
      precipitationMm: Math.round((daily.precipitation_sum?.[idx] ?? 0) * 10) / 10,
      windSpeedMax: Math.round(daily.wind_speed_10m_max?.[idx] ?? 12),
      uvIndexMax: Math.round(daily.uv_index_max?.[idx] ?? 6),
      sprayRisk: wmo.sprayRisk,
      advisory: wmo.advisory
    };
  });

  const weeklyTrend = sevenDayForecast.map(item => ({
    day: item.day,
    temp: item.tempMax,
    humidity: current.relative_humidity_2m || 65,
    rainfall: item.precipitationMm
  }));

  const weather: WeatherInfo = {
    location: resolvedLocation,
    temperature: Math.round(current.temperature_2m),
    condition: currentConditionMeta.condition,
    humidity: Math.round(current.relative_humidity_2m),
    windSpeed: Math.round(current.wind_speed_10m),
    rainChance: Math.round(daily.precipitation_probability_max?.[0] ?? 0),
    uvIndex: Math.round(daily.uv_index_max?.[0] ?? 7),
    soilMoisture: Math.min(95, Math.max(35, Math.round(current.relative_humidity_2m * 0.95))),
    forecast: sevenDayForecast.slice(0, 4).map(d => ({
      day: d.day,
      temp: d.tempMax,
      condition: d.condition,
      icon: d.icon,
      rainChance: d.rainChance
    })),
    weeklyTrend,
    alerts: [
      {
        id: 'alert-live-1',
        severity: currentConditionMeta.sprayRisk === 'HIGH' ? 'alert' : currentConditionMeta.sprayRisk === 'MODERATE' ? 'warning' : 'info',
        title: `${currentConditionMeta.condition} • Live Advisory`,
        description: currentConditionMeta.advisory,
        action: 'View Advisory'
      }
    ]
  };

  return {
    weather,
    sevenDayForecast,
    locationName: resolvedLocation
  };
}

export function useLiveLocationWeather(): LiveLocationWeatherState {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [sevenDayForecast, setSevenDayForecast] = useState<DayForecast[]>(defaultWeeklyForecast);
  const [coords, setCoords] = useState<[number, number] | null>(null); // [lon, lat]
  const [locationName, setLocationName] = useState<string>('Detecting Live Location...');
  const [isLiveLocation, setIsLiveLocation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadWeatherForCoords = useCallback(async (lat: number, lon: number, isDeviceGps: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLiveWeatherByCoords(lat, lon);
      setWeather(data.weather);
      setSevenDayForecast(data.sevenDayForecast);
      setLocationName(data.locationName);
      setCoords([lon, lat]);
      setIsLiveLocation(isDeviceGps);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch live weather data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestLiveLocation = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      // Geolocation not supported, fallback to default (Vellore / Punjab agricultural belt)
      await loadWeatherForCoords(12.9165, 79.1325, false);
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await loadWeatherForCoords(latitude, longitude, true);
      },
      async (err) => {
        console.warn('Live location permission not granted or unavailable:', err.message);
        // Fallback default coordinates
        await loadWeatherForCoords(12.9165, 79.1325, false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, [loadWeatherForCoords]);

  useEffect(() => {
    requestLiveLocation();
  }, [requestLiveLocation]);

  return {
    weather,
    sevenDayForecast,
    coords,
    locationName,
    isLiveLocation,
    isLoading,
    error,
    lastUpdated,
    refresh: requestLiveLocation,
    requestLiveLocation
  };
}
