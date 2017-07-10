const express = require('express');

const router = express.Router();
const db = require('../queries.js');

router.get('/api/reading/:date/:time', db.getReadingsDateTime);
router.get('/api/levels/:date/:time', db.getLevelsDateTime);
router.get('/api/tide/:date/:time', db.getTideDateTime);
router.get('/api/stations', db.getStations);

module.exports = router;
