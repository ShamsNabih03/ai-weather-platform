// Import Express framework
// Express is used to build backend APIs and handle HTTP requests
const express = require('express');

// Create a router object
// Router helps organize routes into separate files
const router = express.Router();

// Import SQLite database connection
// This allows executing SQL queries
const db = require('../db');

// Route: GET /api/history
// This route retrieves all saved weather searches
router.get('/', (req, res) => {

  // Execute SQL query
  // SELECT * retrieves all columns
  // ORDER BY created_at DESC sorts results from newest to oldest
  const rows = db
    .prepare('SELECT * FROM weather_searches ORDER BY created_at DESC')
    .all();

  // Send retrieved data back to frontend as JSON
  res.json(rows);
});

// Route: PUT /api/history/:id
// :id represents dynamic record ID
router.put('/:id', (req, res) => {

  // Extract record ID from URL parameters
  const { id } = req.params;

  // Extract updated data sent from frontend
  const {
    location,
    temperature,
    description,
    humidity,
    wind_speed
  } = req.body;

  // Check if record exists in database
  const existing = db
    .prepare('SELECT * FROM weather_searches WHERE id = ?')
    .get(id);

  // If record does not exist return 404 error
  if (!existing) {
    return res.status(404).json({
      error: 'Record not found'
    });
  }

  // Execute UPDATE query
  // Replace old values with new values
  db.prepare(`
    UPDATE weather_searches
    SET
      location = ?,
      temperature = ?,
      description = ?,
      humidity = ?,
      wind_speed = ?
    WHERE id = ?
  `).run(
    location,
    temperature,
    description,
    humidity,
    wind_speed,
    id
  );

  // Send success response
  res.json({
    message: 'Record updated successfully'
  });
});

// Route: DELETE /api/history/:id
// Deletes a specific weather record using its ID
router.delete('/:id', (req, res) => {

  // Extract record ID from URL
  const { id } = req.params;

  // Check if record exists before deleting
  const existing = db
    .prepare('SELECT * FROM weather_searches WHERE id = ?')
    .get(id);

  // Return error if record does not exist
  if (!existing) {
    return res.status(404).json({
      error: 'Record not found'
    });
  }

  // Execute DELETE SQL query
  db.prepare('DELETE FROM weather_searches WHERE id = ?')
    .run(id);

  // Send success response
  res.json({
    message: 'Record deleted successfully'
  });
});

module.exports = router;