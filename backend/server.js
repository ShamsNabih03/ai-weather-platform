// Import Express framework
// Express is used to build backend APIs and server routes
const express = require('express');

// Import CORS middleware
// Allows frontend and backend to communicate securely
const cors = require('cors');

// Import dotenv package
// Used to load environment variables from .env file
const dotenv = require('dotenv');

// Load variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Enable Cross-Origin Resource Sharing
// Allows requests from frontend (React app)
app.use(cors());

// Enable JSON request parsing
// Allows backend to read JSON data from frontend requests
app.use(express.json());

// Weather API routes
const weatherRoutes = require('./routes/weather');

// Database CRUD routes
const dbRoutes = require('./routes/database');

// Export routes (PDF / CSV / JSON)
const exportRoutes = require('./routes/export');

// YouTube recommendation routes
const youtubeRoutes = require('./routes/youtube');

// Weather routes
// Example:
// /api/weather/current
app.use('/api/weather', weatherRoutes);

// Database routes
// Example:
// /api/db
app.use('/api/db', dbRoutes);

// Export routes
// Example:
// /api/export/pdf
app.use('/api/export', exportRoutes);

// YouTube routes
// Example:
// /api/youtube/search
app.use('/api/youtube', youtubeRoutes);

// Simple route to test if backend server is working
app.get('/', (req, res) => {

  res.json({
    message: 'Weather App Backend is running!'
  });
});

// Use PORT from environment variables
// If not available use port 5000
const PORT = process.env.PORT || 5000;

// Start backend server
app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);
});