const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search', async (req, res) => {
  const { location } = req.query;
  if (!location) return res.status(400).json({ error: 'Location is required' });

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        q: `${location} city travel weather`,
        part: 'snippet',
        type: 'video',
        maxResults: 3,
        key: process.env.YOUTUBE_API_KEY,
      }
    });

    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle,
    }));

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch YouTube videos.' });
  }
});

module.exports = router;