const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes (we'll add these one by one)
const weatherRoutes = require('./routes/weather');
const dbRoutes = require('./routes/database');
const exportRoutes = require('./routes/export');
const youtubeRoutes = require('./routes/youtube');

app.use('/api/weather', weatherRoutes);
app.use('/api/db', dbRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/youtube', youtubeRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Weather App Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});