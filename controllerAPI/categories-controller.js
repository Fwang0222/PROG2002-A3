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

// create new category
router.post('/', (req, res, next) => {
  const { name, description } = req.body;

  // require name
  if (!name) {
    res.status(400).json({
      data: null,
      error: { code: 'BAD_REQUEST', message: 'name is required' },
    });
  }
  // name length should lower than 100
  if (name.length > 100) {
    res.status(400).json({
      data: null,
      error: { code: 'BAD_REQUEST', message: 'name too long (max 100)' },
    });
  }
  // description length should lower than 255
  if (description && description.length > 255) {
    res.status(400).json({
      data: null,
      error: { code: 'BAD_REQUEST', message: 'description too long (max 255)' },
    });
  }

  const sql = `INSERT INTO categories (name, description) VALUES (?, ?)`;
  conn.execute(sql, [name, description], (err, result) => {
    if (err) {
      // Unique key conflict
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          data: null,
          error: {
            code: 'DUPLICATE_NAME',
            message: 'Category name already exists'
          },
        });
      }
      return next(err);
    }
    res.status(201).json({
      data: { id: result.insertId, name, description },
      error: null,
    });
  });
});

// update category
router.put('/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({
      data: null,
      error: { code: 'BAD_REQUEST', message: 'Invalid id' },
    });
  }

  const { name, description } = req.body;

  // name and description required
  if (!name) {
    return res.status(400).json({
      data: null,
      error: { code: 'BAD_REQUEST', message: 'Name required' },
    });
  }

  // name length should lower than 100
  if (name.length > 100) {
    res.status(400).json({
      data: null,
      error: { code: 'BAD_REQUEST', message: 'name too long (max 100)' },
    });
  }
  // description length should lower than 255
  if (description && description.length > 255) {
    res.status(400).json({
      data: null,
      error: { code: 'BAD_REQUEST', message: 'description too long (max 255)' },
    });
  }

  // update sql
  const sql = `UPDATE categories SET name = ?, description = ? WHERE id = ?`;

  conn.execute(sql, [name, description, id], (err, result) => {
    if (err) {
      // Unique key conflict
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          data: null,
          error: {
            code: 'DUPLICATE_NAME',
            message: 'Category name already exists'
          },
        });
      }
      return next(err);
    }
    // not affected any rows
    if (result.affectedRows === 0) {
      return res.status(404).json({
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: 'Category not found'
        },
      });
    } else {
      res.status(204).send()
    }
  });
});

module.exports = router;
