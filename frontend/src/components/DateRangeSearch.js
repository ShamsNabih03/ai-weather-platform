import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

function DateRangeSearch() {
  const [location, setLocation] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!location || !dateFrom || !dateTo) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    setResults(null);
    try {
      const res = await axios.get(`${BASE_URL}/weather/history`, {
        params: { location, date_from: dateFrom, date_to: dateTo }
      });
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  // Get today and one week ago as default dates
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>🌡️ Historical Weather by Date Range</h3>

      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="City name (e.g. Cairo)"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <div style={styles.dateRow}>
          <div style={styles.dateField}>
            <label style={styles.label}>From</label>
            <input
              style={styles.input}
              type="date"
              value={dateFrom}
              max={today}
              onChange={e => setDateFrom(e.target.value)}
            />
          </div>
          <div style={styles.dateField}>
            <label style={styles.label}>To</label>
            <input
              style={styles.input}
              type="date"
              value={dateTo}
              max={today}
              onChange={e => setDateTo(e.target.value)}
            />
          </div>
        </div>
        <button style={styles.button} onClick={handleSearch}>
          🔍 Search Historical Data
        </button>
      </div>

      {loading && <p style={styles.loading}>Fetching historical data...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {results && (
        <div style={styles.results}>
          <h4 style={styles.resultTitle}>
            📍 {results.location}, {results.country} — {results.date_from} to {results.date_to}
          </h4>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Date', '🌡 Avg °C', '↑ Max °C', '↓ Min °C', '🌧 Rain mm', '🌬 Wind km/h'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.results.map((row, i) => (
                  <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>{row.date}</td>
                    <td style={styles.td}>{row.temp_avg}°</td>
                    <td style={styles.td}>{row.temp_max}°</td>
                    <td style={styles.td}>{row.temp_min}°</td>
                    <td style={styles.td}>{row.precipitation}</td>
                    <td style={styles.td}>{row.wind_speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { marginTop: '35px' },
  title: { color: '#90caf9', fontSize: '1.1rem', marginBottom: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px', margin: '0 auto' },
  dateRow: { display: 'flex', gap: '15px' },
  dateField: { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 },
  label: { fontSize: '0.85rem', color: '#b0bec5' },
  input: {
    padding: '10px 15px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '0.95rem',
    width: '100%',
  },
  button: {
    padding: '12px',
    borderRadius: '25px',
    border: 'none',
    background: '#1565c0',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  loading: { textAlign: 'center', color: '#90caf9', marginTop: '15px' },
  error: { textAlign: 'center', color: '#ef9a9a', background: 'rgba(239,83,80,0.1)', border: '1px solid #ef5350', borderRadius: '10px', padding: '10px', marginTop: '10px' },
  results: { marginTop: '25px' },
  resultTitle: { color: '#90caf9', marginBottom: '15px', textAlign: 'center' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: 'rgba(21,101,192,0.5)', padding: '10px', textAlign: 'center', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' },
  td: { padding: '8px 12px', textAlign: 'center', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)' },
  rowEven: { background: 'rgba(255,255,255,0.05)' },
  rowOdd: { background: 'rgba(255,255,255,0.02)' },
};

export default DateRangeSearch;