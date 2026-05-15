// Import required modules
const express = require('express');
const axios = require('axios');

// Create router object
const router = express.Router();

// Route: GET /api/youtube/search
router.get('/search', async (req, res) => {

  // Extract location from query parameters
  const { location } = req.query;

  // Validate input
  if (!location) {
    return res.status(400).json({
      error: 'Location is required'
    });
  }

  try {

    // Send request to YouTube Data API
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          q: `${location} city travel weather`,
          part: 'snippet',
          type: 'video',
          maxResults: 3,
          key: process.env.YOUTUBE_API_KEY,
        }
      }
    );

    // Format returned video data
    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle,
    }));

    // Send videos to frontend
    res.json(videos);

  } catch (err) {

    // Handle server/API errors
    res.status(500).json({
      error: 'Failed to fetch YouTube videos.'
    });
  }
});

// Export router
module.exports = router;