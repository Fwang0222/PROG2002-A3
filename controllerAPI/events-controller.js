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

    // Query registrations list
    const sqlRegs = `
      SELECT id, full_name, email, phone, tickets_qty,
             registration_datetime, amount_paid
      FROM registrations
      WHERE event_id = ?
      ORDER BY registration_datetime DESC
    `;

    conn.execute(sqlRegs, [id], (rErr, regRows) => {
      if (rErr) return next(rErr);

      return res.json({
        data: {
          ...rows[0],
          registrations: regRows || [],
        },
        error: null
      });
    });
  });
});

// Add registrations for event
router.post('/:id/registrations', (req, res, next) => {
  // validate path param
  const eventId = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(eventId) || eventId <= 0) {
    return res.status(400).json({
      data: null,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid event id'
      }
    });
  }

  // validate body
  const { full_name, email, phone, tickets_qty } = req.body || {};
  const qty = Number.parseInt(tickets_qty, 10);

  if (!full_name || !email || !Number.isFinite(qty) || qty < 1) {
    return res.status(400).json({
      data: null,
      error: {
        code: 'BAD_REQUEST',
        message: 'full_name, email, tickets_qty (>=1) are required'
      }
    });
  }

  // fetch event to get ticket_price & suspended
  const sqlEvent = `SELECT id, ticket_price, suspended FROM eventsWHERE id = ?`;

  conn.execute(sqlEvent, [eventId], (err, rows) => {
    if (err) return next(err);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found'
        }
      });
    }

    const event = rows[0];
    if (event.suspended === 1) {
      return res.status(400).json({
        data: null,
        error: {
          code: 'EVENT_SUSPENDED',
          message: 'Event is suspended'
        }
      });
    }

    // compute amount_paid on server side
    const amountPaid = Number((event.ticket_price * qty).toFixed(2));

    // insert registration
    const sqlInsert = `INSERT INTO registrations (event_id, full_name, email, phone, tickets_qty, amount_paid) VALUES (?, ?, ?, ?, ?, ?)`;

    conn.execute(sqlInsert, [eventId, full_name, email, phone, qty, amountPaid], (insErr, result) => {
      if (insErr) {
        // handle duplicate (event_id, email) unique violation
        if (insErr.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({
            data: null,
            error: {
              code: 'DUPLICATE_REGISTRATION',
              message: 'This email has already registered for this event'
            }
          });
        }
        return next(insErr);
      }

      // return created resource
      return res.status(201).json({
        data: {
          id: result.insertId,
          event_id: eventId,
          full_name,
          email: email,
          phone: phone,
          tickets_qty: qty,
          amount_paid: amountPaid
        },
        error: null
      });
    });
  });
});

module.exports = router;
