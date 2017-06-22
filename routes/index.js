var express = require('express');
var router = express.Router();
var db = require('../queries.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/reading/:date', db.getReadingsDate);
router.get('/api/reading/:date/:time', db.getReadingsDateTime);

module.exports = router;
