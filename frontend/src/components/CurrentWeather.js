import React from 'react';

function CurrentWeather({ data }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.city}>{data.location}, {data.country}</h2>
      <p style={styles.iconEmoji}>{data.icon}</p>
      <p style={styles.temp}>{Math.round(data.temperature)}°C</p>
      <p style={styles.desc}>{data.description}</p>
      <div style={styles.details}>
        <div style={styles.detail}>
          <span>💧 Humidity</span>
          <strong>{data.humidity}%</strong>
        </div>
        <div style={styles.detail}>
          <span>🌬 Wind</span>
          <strong>{data.wind_speed} km/h</strong>
        </div>
        <div style={styles.detail}>
          <span>🌡 Feels Like</span>
          <strong>{Math.round(data.feels_like)}°C</strong>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  city: { fontSize: '1.8rem', marginBottom: '10px' },
  iconEmoji: { fontSize: '4rem', margin: '10px 0' },
  temp: { fontSize: '3rem', fontWeight: 'bold', margin: '10px 0' },
  desc: { fontSize: '1.1rem', color: '#90caf9', textTransform: 'capitalize', marginBottom: '20px' },
  details: { display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' },
  detail: { display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' },
};

export default CurrentWeather;