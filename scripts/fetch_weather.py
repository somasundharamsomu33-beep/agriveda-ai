import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry
import json
import sys

def get_weather(lat, lon):
    # Setup the Open-Meteo API client with cache and retry on error
    cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)

    # API configuration
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ["temperature_2m", "relative_humidity_2m", "rain"],
        "hourly": ["temperature_2m", "relative_humidity_2m", "rain"],
        "daily": ["temperature_2m_max", "temperature_2m_min", "rain_sum"],
        "timezone": "auto"
    }

    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]

    # Current values
    current = response.Current()
    current_data = {
        "temperature_2m": round(float(current.Variables(0).Value()), 2),
        "relative_humidity_2m": round(float(current.Variables(1).Value()), 2),
        "rain": round(float(current.Variables(2).Value()), 2),
        "time": int(current.Time())
    }

    # Hourly values
    hourly = response.Hourly()
    hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
    hourly_relative_humidity_2m = hourly.Variables(1).ValuesAsNumpy()
    hourly_rain = hourly.Variables(2).ValuesAsNumpy()

    hourly_data = {"time": range(hourly.Time(), hourly.TimeEnd(), hourly.Interval())}
    
    # Convert hourly to Pandas dataframe
    dt_hourly = pd.date_range(
        start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
        end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
        freq=pd.Timedelta(seconds=hourly.Interval()),
        inclusive="left"
    )
    dt_hourly = dt_hourly.tz_convert(response.Timezone().decode('utf-8'))
    
    hourly_df = pd.DataFrame(data={
        "date": dt_hourly.strftime("%Y-%m-%d %H:%M:%S"),
        "temperature_2m": hourly_temperature_2m,
        "relative_humidity_2m": hourly_relative_humidity_2m,
        "rain": hourly_rain
    })

    # Daily values
    daily = response.Daily()
    daily_temp_max = daily.Variables(0).ValuesAsNumpy()
    daily_temp_min = daily.Variables(1).ValuesAsNumpy()
    daily_rain = daily.Variables(2).ValuesAsNumpy()

    daily_data = {"time": range(daily.Time(), daily.TimeEnd(), daily.Interval())}
    dt_daily = pd.date_range(
        start=pd.to_datetime(daily.Time(), unit="s", utc=True),
        end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
        freq=pd.Timedelta(seconds=daily.Interval()),
        inclusive="left"
    )
    dt_daily = dt_daily.tz_convert(response.Timezone().decode('utf-8'))
    
    daily_df = pd.DataFrame(data={
        "date": dt_daily.strftime("%Y-%m-%d"),
        "temperature_max": daily_temp_max,
        "temperature_min": daily_temp_min,
        "rain_sum": daily_rain
    })

    return {
        "success": True,
        "metadata": {
            "latitude": lat,
            "longitude": lon,
            "elevation": float(response.Elevation()),
            "timezone": response.Timezone().decode('utf-8') if response.Timezone() else None,
            "timezone_abbreviation": response.TimezoneAbbreviation().decode('utf-8') if response.TimezoneAbbreviation() else None,
            "utc_offset_seconds": int(response.UtcOffsetSeconds())
        },
        "current": current_data,
        "daily": daily_df.to_dict(orient="records"),
        "hourly": hourly_df.head(24).to_dict(orient="records")
    }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Please provide latitude and longitude"}))
        sys.exit(1)
        
    lat = float(sys.argv[1])
    lon = float(sys.argv[2])
    
    result = get_weather(lat, lon)
    print(json.dumps(result))
