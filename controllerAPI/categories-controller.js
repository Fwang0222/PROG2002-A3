// Import the required modules
const express = require('express');
const router = express.Router();
const db = require('../event_db.js');

const conn = db.getconnection();
conn.connect();

// get all categories
router.get('/', (req, res, next) => {
  const conn = db.getconnection();
  // SQL: Query all categories (sort by name)
  conn.query('SELECT id, name FROM categories ORDER BY name ASC', (err, rows) => {
    conn.end(); // Close the connection when finished
    if (err) return next(err); // Pass the error to next
    res.json(rows); // Successfully returns classified data
  });
});

module.exports = router;
