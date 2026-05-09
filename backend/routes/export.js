const express = require('express');
const router = express.Router();
const db = require('../db');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// Export as JSON
router.get('/json', (req, res) => {
  const rows = db.prepare('SELECT * FROM weather_searches').all();
  res.setHeader('Content-Disposition', 'attachment; filename=weather_data.json');
  res.json(rows);
});

// Export as CSV
router.get('/csv', (req, res) => {
  const rows = db.prepare('SELECT * FROM weather_searches').all();
  const parser = new Parser();
  const csv = parser.parse(rows);
  res.setHeader('Content-Disposition', 'attachment; filename=weather_data.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

// Export as PDF
router.get('/pdf', (req, res) => {
  const rows = db.prepare('SELECT * FROM weather_searches').all();
  const doc = new PDFDocument();
  res.setHeader('Content-Disposition', 'attachment; filename=weather_data.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.fontSize(16).text('Weather Search History', { align: 'center' });
  doc.moveDown();
  rows.forEach((row, i) => {
    doc.fontSize(11).text(
      `${i + 1}. ${row.location}, ${row.country} | ${row.temperature}°C | ${row.description} | ${row.date_from}`
    );
    doc.moveDown(0.3);
  });
  doc.end();
});

module.exports = router;