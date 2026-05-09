import React from 'react';

function Forecast({ data }) {
  return (
    <div style={styles.container}>
      {data.map((day, index) => (
        <div key={index} style={styles.card}>
          <p style={styles.date}>{day.date}</p>
          <p style={styles.icon}>{day.icon}</p>
          <p style={styles.temp}>{Math.round(day.temperature)}°C</p>
          <p style={styles.minmax}>↑{day.temp_max}° ↓{day.temp_min}°</p>
          <p style={styles.desc}>{day.description}</p>
          <p style={styles.detail}>🌬 {day.wind_speed} km/h</p>
          <p style={styles.detail}>🌧 {day.precipitation} mm</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '20px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    minWidth: '150px',
  },
  date: { fontSize: '0.9rem', color: '#90caf9', marginBottom: '8px' },
  icon: { fontSize: '2rem', margin: '5px 0' },
  temp: { fontSize: '1.5rem', fontWeight: 'bold' },
  minmax: { fontSize: '0.85rem', color: '#90caf9', margin: '3px 0' },
  desc: { fontSize: '0.8rem', color: '#b0bec5', textTransform: 'capitalize', margin: '5px 0' },
  detail: { fontSize: '0.85rem', color: '#b0bec5' },
};

export default Forecast;