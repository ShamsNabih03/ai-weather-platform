const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'weather.db'));

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS weather_searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL,
    date_from TEXT,
    date_to TEXT,
    temperature REAL,
    description TEXT,
    humidity INTEGER,
    wind_speed REAL,
    country TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

module.exports = db;