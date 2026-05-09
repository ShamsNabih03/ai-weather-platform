import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

function WeatherHistory() {
  const [history, setHistory] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchHistory = async () => {
    const res = await axios.get(`${BASE_URL}/db`);
    setHistory(res.data);
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/db/${id}`);
    fetchHistory();
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setEditData(row);
  };

  const handleUpdate = async () => {
    await axios.put(`${BASE_URL}/db/${editId}`, editData);
    setEditId(null);
    fetchHistory();
  };

  const handleExport = (format) => {
    window.open(`${BASE_URL}/export/${format}`, '_blank');
  };

  return (
    <div>
      <div style={styles.exportRow}>
        <span>Export:</span>
        {['json', 'csv', 'pdf'].map(fmt => (
          <button key={fmt} style={styles.exportBtn} onClick={() => handleExport(fmt)}>
            {fmt.toUpperCase()}
          </button>
        ))}
      </div>

      {history.length === 0 && (
        <p style={styles.empty}>No searches yet. Search for a city to get started!</p>
      )}

      {history.map(row => (
        <div key={row.id} style={styles.card}>
          {editId === row.id ? (
            <div style={styles.editForm}>
              <input style={styles.input} value={editData.location}
                onChange={e => setEditData({ ...editData, location: e.target.value })} />
              <input style={styles.input} type="number" value={editData.temperature}
                onChange={e => setEditData({ ...editData, temperature: e.target.value })} />
              <input style={styles.input} value={editData.description}
                onChange={e => setEditData({ ...editData, description: e.target.value })} />
              <button style={styles.saveBtn} onClick={handleUpdate}>💾 Save</button>
              <button style={styles.cancelBtn} onClick={() => setEditId(null)}>Cancel</button>
            </div>
          ) : (
            <div style={styles.row}>
              <div>
                <strong>{row.location}, {row.country}</strong>
                <span style={styles.meta}> — {row.temperature}°C, {row.description}</span>
                <span style={styles.date}> | {row.created_at}</span>
              </div>
              <div style={styles.actions}>
                <button style={styles.editBtn} onClick={() => handleEdit(row)}>✏️ Edit</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(row.id)}>🗑 Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  exportRow: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' },
  exportBtn: { padding: '6px 14px', borderRadius: '15px', border: '1px solid #90caf9', background: 'transparent', color: '#90caf9', cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#b0bec5', marginTop: '30px' },
  card: { background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '15px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.15)' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
  meta: { color: '#90caf9' },
  date: { color: '#78909c', fontSize: '0.85rem' },
  actions: { display: 'flex', gap: '8px' },
  editBtn: { padding: '5px 12px', borderRadius: '10px', border: 'none', background: '#1565c0', color: 'white', cursor: 'pointer' },
  deleteBtn: { padding: '5px 12px', borderRadius: '10px', border: 'none', background: '#c62828', color: 'white', cursor: 'pointer' },
  editForm: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' },
  input: { padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem' },
  saveBtn: { padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#2e7d32', color: 'white', cursor: 'pointer' },
  cancelBtn: { padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#555', color: 'white', cursor: 'pointer' },
};

export default WeatherHistory;