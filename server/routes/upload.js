const express = require('express');
const router = express.Router();
const db = require('../db.js');

// multer
var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, process.env.UPLOAD_DIR);
    },
    filename: function (request, file, callback) {
        callback(null, file.originalname)
    }
});
var upload = multer({ storage: storage });

router.post('/', upload.single('image'), function (req, res) {
  let options = JSON.parse(req.body.options);
  console.log(`${options.name} - ${options.exposure} - ${options.expiration} - ${req.file.originalname}`);
  res.status(204).end()

  if (options.expiration == -1) options.expiration = 0;
  else options.expiration += Math.floor(new Date() / 1000);

  db.getConn()
    .then(conn => {
        conn.query("INSERT INTO images (user, title, exposure, expiration, filename, uuid) VALUES (?, ?, ?, ?, ?, ?);",
                [1, options.name, options.exposure, options.expiration, req.file.originalname, 'NONE'])
            .then((res) => { console.log(res); conn.end(); })
            .catch(err => { console.warn(err); conn.end(); })
    })
    .catch(err => console.warn(err));
});

module.exports = router;