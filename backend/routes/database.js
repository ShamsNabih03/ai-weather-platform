const express = require('express');
const router = express.Router();
const db = require('../db');

// READ - get all saved searches
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM weather_searches ORDER BY created_at DESC').all();
  res.json(rows);
});

// UPDATE - update a record
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { location, temperature, description, humidity, wind_speed } = req.body;

  const existing = db.prepare('SELECT * FROM weather_searches WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Record not found' });

  db.prepare(`
    UPDATE weather_searches
    SET location=?, temperature=?, description=?, humidity=?, wind_speed=?
    WHERE id=?
  `).run(location, temperature, description, humidity, wind_speed, id);

  res.json({ message: 'Record updated successfully' });
});

// DELETE - delete a record
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM weather_searches WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Record not found' });

  db.prepare('DELETE FROM weather_searches WHERE id = ?').run(id);
  res.json({ message: 'Record deleted successfully' });
});

module.exports = router;