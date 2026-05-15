// =========================================================
// IMPORT REQUIRED MODULES
// =========================================================

// Import Express framework
// Express is used to create backend APIs and routes
const express = require('express');

// Import Axios library
// Axios is used to send HTTP requests to external weather APIs
const axios = require('axios');

// Create Express router
// Router helps organize API endpoints into separate files
const router = express.Router();

// Import SQLite database connection
// Used for storing weather search history
const db = require('../db');

// This function converts a city name into:
// - latitude
// - longitude
// - country
// using Open-Meteo geocoding API

async function getCoordinates(location) {

  // Send GET request to geocoding API
  const res = await axios.get(
    'https://geocoding-api.open-meteo.com/v1/search',
    {
      params: {
        name: location,
        count: 1,
        language: 'en',
        format: 'json'
      }
    }
  );

  // Check if location exists
  if (!res.data.results || res.data.results.length === 0) {
    throw new Error('Location not found');
  }

  // Return first matching result
  return res.data.results[0];
}

// Open-Meteo returns numeric weather codes
// This function converts codes into readable weather descriptions

function getWeatherInfo(code) {

  const map = {

    0: {
      description: 'Clear Sky',
      icon: '☀️'
    },

    1: {
      description: 'Mainly Clear',
      icon: '🌤'
    },

    2: {
      description: 'Partly Cloudy',
      icon: '⛅'
    },

    3: {
      description: 'Overcast',
      icon: '☁️'
    },

    45: {
      description: 'Foggy',
      icon: '🌫'
    },

    48: {
      description: 'Icy Fog',
      icon: '🌫'
    },

    51: {
      description: 'Light Drizzle',
      icon: '🌦'
    },

    53: {
      description: 'Drizzle',
      icon: '🌦'
    },

    55: {
      description: 'Heavy Drizzle',
      icon: '🌧'
    },

    61: {
      description: 'Slight Rain',
      icon: '🌧'
    },

    63: {
      description: 'Rain',
      icon: '🌧'
    },

    65: {
      description: 'Heavy Rain',
      icon: '🌧'
    },

    71: {
      description: 'Slight Snow',
      icon: '🌨'
    },

    73: {
      description: 'Snow',
      icon: '❄️'
    },

    75: {
      description: 'Heavy Snow',
      icon: '❄️'
    },

    80: {
      description: 'Slight Showers',
      icon: '🌦'
    },

    81: {
      description: 'Showers',
      icon: '🌧'
    },

    82: {
      description: 'Heavy Showers',
      icon: '🌧'
    },

    95: {
      description: 'Thunderstorm',
      icon: '⛈'
    },

    99: {
      description: 'Heavy Thunderstorm',
      icon: '⛈'
    },
  };

  // Return matching weather info
  // If code is unknown return default object
  return map[code] || {
    description: 'Unknown',
    icon: '🌡'
  };
}

// Route:
// GET /api/weather/current

// Supports:
// - city name
// - latitude + longitude

router.get('/current', async (req, res) => {

  // Extract query parameters
  const { location, lat, lon } = req.query;

  // Validate input
  if (!location && (!lat || !lon)) {

    return res.status(400).json({
      error: 'Location or coordinates are required'
    });
  }

  try {

    let place;
    if (lat && lon) {

      // Reverse geocoding:
      // Convert coordinates into city name

      const geoRes = await axios.get(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: {
            lat,
            lon,
            format: 'json'
          },

          headers: {
            'User-Agent': 'weather-app'
          }
        }
      );

      // Create location object
      place = {

        name:
          geoRes.data.address.city ||
          geoRes.data.address.town ||
          geoRes.data.address.village ||
          'Your Location',
        country: geoRes.data.address.country,
        latitude: lat,
        longitude: lon,
      };

    } else {
      // Convert city name into coordinates
      place = await getCoordinates(location);
    }

    // FETCH CURRENT WEATHER DATA

    const weatherRes = await axios.get(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {

          latitude: place.latitude,

          longitude: place.longitude,

          current_weather: true,

          hourly:
            'relativehumidity_2m,apparent_temperature,windspeed_10m',

          timezone: 'auto',

          forecast_days: 1,
        }
      }
    );

    // EXTRACT WEATHER DATA

    const current = weatherRes.data.current_weather;

    const hourly = weatherRes.data.hourly;

    // Convert weather code into readable text
    const { description, icon } =
      getWeatherInfo(current.weathercode);

    // CREATE FINAL RESPONSE OBJECT
    const result = {

      location: place.name,

      country: place.country,

      latitude: place.latitude,

      longitude: place.longitude,

      temperature: current.temperature,

      feels_like: hourly.apparent_temperature[0],

      humidity: hourly.relativehumidity_2m[0],

      wind_speed: current.windspeed,

      description,

      icon,

      date_from:
        new Date().toISOString().split('T')[0],

      date_to:
        new Date().toISOString().split('T')[0],
    };

    // SAVE SEARCH INTO DATABASE
    db.prepare(`
      INSERT INTO weather_searches
      (
        location,
        date_from,
        date_to,
        temperature,
        description,
        humidity,
        wind_speed,
        country
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      result.location,
      result.date_from,
      result.date_to,
      result.temperature,
      result.description,
      result.humidity,
      result.wind_speed,
      result.country
    );



    // Send weather result to frontend
    res.json(result);

  } catch (err) {

    // Handle invalid city
    if (err.message === 'Location not found') {

      res.status(404).json({
        error:
          'Location not found. Please try another city name.'
      });

    } else {

      // Handle general API/server errors
      res.status(500).json({
        error: 'Failed to fetch weather data.'
      });
    }
  }
});

// GET 5-DAY FORECAST

// Route:
// GET /api/weather/forecast

router.get('/forecast', async (req, res) => {

  const { location, lat, lon } = req.query;

  // Validate input
  if (!location && (!lat || !lon)) {

    return res.status(400).json({
      error: 'Location or coordinates are required'
    });
  }

  try {

    let place;

    // Use coordinates directly
    if (lat && lon) {

      place = {
        latitude: lat,
        longitude: lon,
        name: 'Your Location'
      };

    } else {

      // Convert city name into coordinates
      place = await getCoordinates(location);
    }

    const weatherRes = await axios.get(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {

          latitude: place.latitude,

          longitude: place.longitude,

          daily:
            'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max',

          timezone: 'auto',

          forecast_days: 5,
        }
      }
    );



    // Extract daily forecast
    const daily = weatherRes.data.daily;

    const forecast = daily.time.map((date, i) => {

      const { description, icon } =
        getWeatherInfo(daily.weathercode[i]);

      return {

        date,

        temperature: Math.round(
          (
            daily.temperature_2m_max[i] +
            daily.temperature_2m_min[i]
          ) / 2
        ),

        temp_max: daily.temperature_2m_max[i],

        temp_min: daily.temperature_2m_min[i],

        description,

        icon,

        wind_speed: daily.windspeed_10m_max[i],

        precipitation: daily.precipitation_sum[i],
      };
    });



    // Send forecast result
    res.json(forecast);

  } catch (err) {

    if (err.message === 'Location not found') {

      res.status(404).json({
        error:
          'Location not found. Please try another city name.'
      });

    } else {

      res.status(500).json({
        error: 'Failed to fetch forecast data.'
      });
    }
  }
});

// Route:
// GET /api/weather/history

router.get('/history', async (req, res) => {

  // Extract query parameters
  const {
    location,
    date_from,
    date_to
  } = req.query;

  // INPUT VALIDATION
  if (!location || !date_from || !date_to) {

    return res.status(400).json({
      error:
        'Location, date_from and date_to are required'
    });
  }



  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (
    !dateRegex.test(date_from) ||
    !dateRegex.test(date_to)
  ) {

    return res.status(400).json({
      error:
        'Dates must be in YYYY-MM-DD format'
    });
  }



  // Validate date range
  if (new Date(date_from) > new Date(date_to)) {

    return res.status(400).json({
      error:
        'Start date must be before end date'
    });
  }



  // Prevent future dates
  if (new Date(date_to) > new Date()) {

    return res.status(400).json({
      error:
        'End date cannot be in the future'
    });
  }



  try {

    // Convert city into coordinates
    const place = await getCoordinates(location);

    // FETCH HISTORICAL WEATHER DATA
    const weatherRes = await axios.get(
      'https://archive-api.open-meteo.com/v1/archive',
      {
        params: {

          latitude: place.latitude,

          longitude: place.longitude,

          start_date: date_from,

          end_date: date_to,

          daily:
            'temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max',

          timezone: 'auto',
        }
      }
    );



    const daily = weatherRes.data.daily;

    // FORMAT HISTORICAL DATA
    const results = daily.time.map((date, i) => ({

      date,

      temp_max:
        daily.temperature_2m_max[i],

      temp_min:
        daily.temperature_2m_min[i],

      temp_avg: Math.round(
        (
          daily.temperature_2m_max[i] +
          daily.temperature_2m_min[i]
        ) / 2
      ),

      precipitation:
        daily.precipitation_sum[i],

      wind_speed:
        daily.windspeed_10m_max[i],
    }));

    // SAVE SEARCH TO DATABASE

    db.prepare(`
      INSERT INTO weather_searches
      (
        location,
        date_from,
        date_to,
        temperature,
        description,
        humidity,
        wind_speed,
        country
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      place.name,
      date_from,
      date_to,
      results[0]?.temp_avg || 0,
      'Historical data',
      0,
      results[0]?.wind_speed || 0,
      place.country
    );

    // SEND FINAL RESPONSE

    res.json({

      location: place.name,

      country: place.country,

      date_from,

      date_to,

      results,
    });

  } catch (err) {

    if (err.message === 'Location not found') {

      res.status(404).json({
        error: 'Location not found.'
      });

    } else {

      res.status(500).json({
        error:
          'Failed to fetch historical weather data.'
      });
    }
  }
});

module.exports = router;