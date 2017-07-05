const express = require('express');

const router = express.Router();
const db = require('../queries.js');

router.get('/api/reading/:date/:time', db.getReadingsDateTime);
router.get('/api/levels/:date/:time', db.getLevelsDateTimeAreas);
router.get('/api/tide/:date/:time', db.getTideDateTime);

module.exports = router;
