const express = require('express');
const router = express.Router();
const db = require('../db.js');

router.get('/:id', function (req, res) {
  
    db.getConn()
        .then(conn => {
            conn.query(`SELECT * FROM images WHERE uuid = ?;`, [req.params.id])
                .then((rows) => {
                    if (rows.length > 0) {
                        res.json({data: rows[0]});
                    }
                    else res.json({data: null});
                })
                .then((res) => { conn.end(); })
                .catch(err => { console.warn(err); conn.end(); })
        })
        .catch(err => console.warn(err));

});

module.exports = router;