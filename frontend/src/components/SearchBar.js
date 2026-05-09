import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

function SearchBar({ setWeather, setForecast, setError, setLoading }) {
  const [location, setLocation] = useState('');

  const fetchWeatherByCoords = async (lat, lon) => {
    setError('');
    setLoading(true);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather/current?lat=${lat}&lon=${lon}`),
        axios.get(`${BASE_URL}/weather/forecast?lat=${lat}&lon=${lon}`)
      ]);
      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setWeather(null);
      setForecast([]);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!location.trim()) {
      setError('Please enter a location.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather/current?location=${location}`),
        axios.get(`${BASE_URL}/weather/forecast?location=${location}`)
      ]);
      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setWeather(null);
      setForecast([]);
    }
    setLoading(false);
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (err) => {
        setLoading(false);
        setError('Could not get your location. Please allow location access and try again.');
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter city, zip code, or coordinates..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button style={styles.button} onClick={handleSearch}>
          🔍 Search
        </button>
        <button style={styles.gpsButton} onClick={handleGPS}>
          📍 My Location
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { marginBottom: '10px' },
  container: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  input: {
    padding: '12px 20px',
    borderRadius: '25px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '1rem',
    width: '350px',
    outline: 'none',
  },
  button: {
    padding: '12px 25px',
    borderRadius: '25px',
    border: 'none',
    background: '#1565c0',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  gpsButton: {
    padding: '12px 25px',
    borderRadius: '25px',
    border: 'none',
    background: '#2e7d32',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  }
};

export default SearchBar;