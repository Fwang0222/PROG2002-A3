// Import the required modules
const express = require('express');
const router = express.Router();
const db = require('../event_db.js');

const conn = db.getconnection();
conn.connect();

// delete registration
router.delete('/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({
      data: null,
      error: { code: 'BAD_REQUEST', message: 'Invalid id' },
    });
  }

  // execute delete sql
  conn.execute(`DELETE FROM registrations WHERE id = ?`, [id], (err, result) => {
    if (err) return next(err);

    res.json({
      data: { id },
      error: null
    });
  });
});

module.exports = router;
