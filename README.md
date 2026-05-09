# 🌤 Weather App — PM Accelerator Technical Assessment

**Developed by:** Shams Nabih Quraytum
**Assessment:** AI Engineer Intern — Full Stack Weather Application

---

## 📌 About PM Accelerator

PM Accelerator is a product management training program that helps aspiring and experienced PMs accelerate their careers through hands-on projects, mentorship, and a strong professional community. Learn more on their [LinkedIn page](https://www.linkedin.com/company/product-manager-accelerator).

---

## 🚀 Features

### Frontend (React)
- 🔍 Search weather by city name, zip code, or coordinates
- 📍 Auto-detect current location via GPS
- 🌡️ Current weather display (temperature, humidity, wind, feels like)
- 📅 5-day forecast with daily breakdown
- 🗺️ Interactive map powered by Leaflet + OpenStreetMap
- 🎥 YouTube videos of the searched location
- 📆 Historical weather by custom date range
- 🗂️ Search history with edit and delete
- 📤 Export data as JSON, CSV, or PDF
- ⚠️ Full error handling for invalid locations and failed requests

### Backend (Node.js + Express)
- RESTful API architecture
- SQLite database with full CRUD operations
- Integration with Open-Meteo API (free, no key needed)
- Integration with YouTube Data API v3
- Reverse geocoding via OpenStreetMap Nominatim
- Data export in JSON, CSV, and PDF formats

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Axios, Leaflet.js, react-leaflet |
| Backend | Node.js, Express.js |
| Database | SQLite (better-sqlite3) |
| Weather API | Open-Meteo (free, no key needed) |
| Maps | Leaflet.js + OpenStreetMap (free) |
| Videos | YouTube Data API v3 |
| Exports | json2csv, pdfkit |

---

## 📁 Project Structure
weather-app/
├── backend/
│   ├── routes/
│   │   ├── weather.js       # Weather & forecast API routes
│   │   ├── database.js      # CRUD operations
│   │   ├── export.js        # JSON, CSV, PDF export
│   │   └── youtube.js       # YouTube API integration
│   ├── db.js                # SQLite database setup
│   ├── server.js            # Express server entry point
│   ├── .env                 # Environment variables (not committed)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.js
│   │   │   ├── CurrentWeather.js
│   │   │   ├── Forecast.js
│   │   │   ├── MapView.js
│   │   │   ├── YoutubeVideos.js
│   │   │   ├── DateRangeSearch.js
│   │   │   └── WeatherHistory.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
---

## ⚙️ How to Run the Project

### Prerequisites
- Node.js (v16 or higher)
- npm

### 1. Clone the repository
```bash
git clone https://github.com/ShamsNabih03/ai-weather-platform-
cd weather-app
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```env
PORT=5000
YOUTUBE_API_KEY=your_youtube_api_key_here
```

Start the backend server:
```bash
node server.js
```

### 3. Set up the frontend
Open a new terminal:
```bash
cd frontend
npm install
npm start
```

### 4. Open the app
Go to 👉 `http://localhost:3000`

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| PORT | Backend server port (default 5000) | No |
| YOUTUBE_API_KEY | YouTube Data API v3 key | Yes |

> Note: No API key is needed for weather data — we use Open-Meteo which is completely free and open.

---

## 📤 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/weather/current | Get current weather by location or coordinates |
| GET | /api/weather/forecast | Get 5-day forecast |
| GET | /api/weather/history | Get historical weather by date range |
| GET | /api/db | Get all saved searches |
| PUT | /api/db/:id | Update a saved search |
| DELETE | /api/db/:id | Delete a saved search |
| GET | /api/youtube/search | Get YouTube videos for a location |
| GET | /api/export/json | Export data as JSON |
| GET | /api/export/csv | Export data as CSV |
| GET | /api/export/pdf | Export data as PDF |

---

## 🎥 Demo Video

[Link to demo video](#) — *(add your video link here)*

---

## 📦 Requirements

Backend dependencies are listed in `backend/package.json`.  
Frontend dependencies are listed in `frontend/package.json`.

Install all dependencies by running `npm install` in both the `backend` and `frontend` folders.
