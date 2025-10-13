// Introduce module and establish database connection
const express = require('express');
const db = require('../event_db');
const router = express.Router();
const conn = db.getconnection();
conn.connect();

// get all events
router.get('/', (req, res, next) => {
  // create sql for select event fields that suspended should be 1 and order by start date
  const sql = `
    SELECT id, name, category_id, start_datetime, end_datetime,
           location_city, location_venue, image_url, ticket_price
    FROM events
    WHERE suspended = 0
    ORDER BY start_datetime DESC
  `;

  conn.execute(sql, (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

// search events
router.get('/search', (req, res, next) => {
  // get parameters from query
  const { date_from, date_to, city, category_id } = req.query;

  const where = ['suspended = 0'];
  const params = [];

  // add to where statement and push to params if date_from or date_to exist
  if (date_from && date_to) {
    where.push('NOT ( end_datetime < ? OR start_datetime > ? )');
    params.push(date_from, date_to);
  } else if (date_from) {
    where.push('end_datetime >= ?');
    params.push(date_from);
  } else if (date_to) {
    where.push('start_datetime <= ?');
    params.push(date_to);
  }

  // add to where statement and push to params if city exist
  if (city) {
    where.push('location_city LIKE ?');
    params.push('%' + city + '%');
  }

  // add to where statement and push to params if category_id exist
  if (category_id) {
    where.push(`category_id = ?`);
    params.push(category_id);
  }

  // create sql to search
  const sql = `
    SELECT id, name, category_id, start_datetime, end_datetime,
           location_city, location_venue, image_url, ticket_price
    FROM events
    WHERE ${where.join(' AND ')}
    ORDER BY start_datetime ASC
  `;

  conn.execute(sql, params, (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

// get event by id
router.get('/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id, 10);
  // check params id is number, return 400 response if id invalid
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({
      data: null,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid id'
      }
    });
  }

  // SQL: Query the activity details for the specified id
  const sql = `
    SELECT id, category_id, name, short_description, description,
           start_datetime, end_datetime, location_city, location_venue, address_line,
           ticket_price, goal_amount, progress_amount, image_url, suspended
    FROM events
    WHERE id = ?
  `;

  conn.execute(sql, [id], (err, rows) => {
    if (err) return next(err);
    res.json({ data: rows[0], error: null });
  });
});

module.exports = router;
