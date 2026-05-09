import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

function YoutubeVideos({ location }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location) return;
    const fetchVideos = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${BASE_URL}/youtube/search?location=${location}`);
        setVideos(res.data);
      } catch (err) {
        setError('Could not load videos.');
      }
      setLoading(false);
    };
    fetchVideos();
  }, [location]);

  if (!location) return null;

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>🎥 Videos — {location}</h3>
      {loading && <p style={styles.loading}>Loading videos...</p>}
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.grid}>
        {videos.map(video => (
          <a
            key={video.videoId}
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noreferrer"
            style={styles.card}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              style={styles.thumbnail}
            />
            <div style={styles.info}>
              <p style={styles.videoTitle}>{video.title}</p>
              <p style={styles.channel}>📺 {video.channel}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { marginTop: '25px' },
  title: { marginBottom: '15px', color: '#90caf9', fontSize: '1.1rem' },
  loading: { color: '#90caf9', textAlign: 'center' },
  error: { color: '#ef9a9a', textAlign: 'center' },
  grid: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.15)',
    width: '260px',
    textDecoration: 'none',
    color: 'white',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  thumbnail: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  info: { padding: '10px' },
  videoTitle: {
    fontSize: '0.85rem',
    marginBottom: '6px',
    lineHeight: '1.3',
  },
  channel: {
    fontSize: '0.75rem',
    color: '#90caf9',
  },
};

export default YoutubeVideos;