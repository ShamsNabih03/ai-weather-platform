import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon bug in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapView({ location, country, lat, lon }) {
  if (!lat || !lon) return null;

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>📍 Location Map — {location}, {country}</h3>
      <MapContainer
        center={[lat, lon]}
        zoom={10}
        style={styles.map}
        key={`${lat}-${lon}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>
            {location}, {country}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: '25px',
  },
  title: {
    marginBottom: '12px',
    color: '#90caf9',
    fontSize: '1.1rem',
  },
  map: {
    height: '350px',
    width: '100%',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.2)',
  }
};

export default MapView;