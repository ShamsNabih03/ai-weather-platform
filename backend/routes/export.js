// Import Express framework
// Express is used to create backend APIs and handle routes
const express = require('express');

// Create router object for organizing API routes
const router = express.Router();

// Import SQLite database connection
// This allows executing SQL queries on the database
const db = require('../db');

// Import json2csv parser
// Used to convert JSON data into CSV format
const { Parser } = require('json2csv');

// Import PDFKit library
// Used to generate PDF files dynamically
const PDFDocument = require('pdfkit');

// Route: GET /api/export/json
// This route exports weather history as a JSON file
router.get('/json', (req, res) => {

  // Retrieve all weather search records from database
  const rows = db
    .prepare('SELECT * FROM weather_searches')
    .all();

  // Set file download name
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=weather_data.json'
  );

  // Send JSON response
  res.json(rows);
});

// Route: GET /api/export/csv
// This route exports weather history as CSV file
router.get('/csv', (req, res) => {

  // Retrieve all records from database
  const rows = db
    .prepare('SELECT * FROM weather_searches')
    .all();

  // Create CSV parser object
  const parser = new Parser();

  // Convert JSON data into CSV format
  const csv = parser.parse(rows);

  // Set response headers for CSV file download
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=weather_data.csv'
  );

  // Define content type as CSV
  res.setHeader('Content-Type', 'text/csv');

  // Send generated CSV file
  res.send(csv);
});

// Route: GET /api/export/pdf
// This route exports weather history as PDF document
router.get('/pdf', (req, res) => {

  // Retrieve all records from database
  const rows = db
    .prepare('SELECT * FROM weather_searches')
    .all();

  // Create new PDF document
  const doc = new PDFDocument();

  // Set file download name
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=weather_data.pdf'
  );

  // Define content type as PDF
  res.setHeader('Content-Type', 'application/pdf');

  // Pipe PDF output directly to response
  doc.pipe(res);

  // Add PDF title
  doc
    .fontSize(16)
    .text('Weather Search History', {
      align: 'center'
    });

  // Add spacing
  doc.moveDown();

  // Loop through each weather record
  rows.forEach((row, i) => {

    // Add formatted weather information into PDF
    doc
      .fontSize(11)
      .text(
        `${i + 1}. ${row.location}, ${row.country} | ` +
        `${row.temperature}°C | ${row.description} | ` +
        `${row.date_from}`
      );

    // Small spacing between rows
    doc.moveDown(0.3);
  });

  // Finalize PDF document
  doc.end();
});

module.exports = router;