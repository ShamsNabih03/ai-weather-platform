import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherHistory from './components/WeatherHistory';
import MapView from './components/MapView';
import YoutubeVideos from './components/YoutubeVideos';
import DateRangeSearch from './components/DateRangeSearch';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('weather');

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌤 Weather App</h1>
        <p className="subtitle">Real-Time Weather Intelligence</p>
        
      </header>

      <SearchBar
        setWeather={setWeather}
        setForecast={setForecast}
        setError={setError}
        setLoading={setLoading}
      />

      {loading && <p className="loading">Fetching weather data...</p>}
      {error && <p className="error">{error}</p>}

      <div className="tabs">
        <button
          className={activeTab === 'weather' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('weather')}
        >
          🌡 Current Weather
        </button>
        <button
          className={activeTab === 'forecast' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('forecast')}
        >
          📅 5-Day Forecast
        </button>
        <button
          className={activeTab === 'history' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('history')}
        >
          🗂 Search History
        </button>
        <button className={activeTab === 'daterange' ? 'tab active' : 'tab'} onClick={() => setActiveTab('daterange')}>
          📆 Date Range
        </button>
      </div>

      {activeTab === 'weather' && weather && <CurrentWeather data={weather} />}
      {activeTab === 'forecast' && forecast.length > 0 && <Forecast data={forecast} />}
      {activeTab === 'history' && <WeatherHistory />}
      {activeTab === 'daterange' && <DateRangeSearch />}

      {weather && (
        <MapView
          location={weather.location}
          country={weather.country}
          lat={weather.latitude}
          lon={weather.longitude}
        />
      )}
      {weather && (
        <YoutubeVideos location={weather.location} />
      )}
    </div>
  );
}

export default App;