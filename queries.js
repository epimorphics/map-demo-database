const promise = require('bluebird');
const moment = require('moment');

const options = {
  promiseLib: promise,
};

const pgp = require('pg-promise')(options);
const PS = require('pg-promise').PreparedStatement;

// Modify connectionstring.js.example
const connectionString = require('./connectionstring.js');
const db = pgp(connectionString);

// Database Queries
const getReadings = new PS('get-readings',
  'SELECT lat, long, value FROM station_values \
   RIGHT JOIN (SELECT value, station FROM time_values \
   WHERE value != 0 AND \
   timestamp >= $1 \
   AND timestamp <= $1::timestamp + INTERVAL \'15 minutes\') as db \
   ON station_values.station = db.station');

const getLevelsAreas = new PS('get-levels-areas',
  'SELECT areas.lat, areas.long, sum(value)/count(*) as value from areas \
   RIGHT JOIN \
   (SELECT lat, long, val / divisor as value FROM \
      (SELECT timestamp, lat, long, \
        (value - avgvalue) as val, \
        (typicalmax - avgvalue) as divisor, \
        avgvalue, value from level_values \
        RIGHT JOIN level_station_values \
        ON (level_values.station = level_station_values.station)) as perc \
      where value > avgvalue \
      AND divisor > 0 \
      AND timestamp >= $1::timestamp \
      AND timestamp < $1::timestamp + INTERVAL \'15 minutes\') as lv \
   ON (areas.lat <= lv.lat \
       AND areas.lat + 0.1 > lv.lat \
       AND areas.long <= lv.long \
       AND areas.long + 0.2 > lv.long) \
   WHERE areas.lat is not null group by areas.lat, areas.long');

const getLevels = new PS('get-levels',
  'SELECT lat, long, val / divisor as value \
   FROM (SELECT timestamp, lat, long, avgvalue, value, \
   (value - avgvalue) as val, (typicalmax - avgvalue) as divisor \
   from level_values \
   LEFT JOIN level_station_values \
   ON (level_values.station = level_station_values.station)) as perc \
   WHERE divisor > 0 AND timestamp >= $1::timestamp \
   AND timestamp < $1::timestamp + INTERVAL \'15 minutes\'');

const getTide = new PS('get-tide',
  'SELECT lat, long, val / divisor as value \
   FROM (SELECT timestamp, lat, long, avgvalue, value, \
     (value - typicalmin) as val, \
     (typicalmax - typicalmin) as divisor \
     FROM tide_values \
     LEFT JOIN tide_station_values \
     ON (tide_values.station = tide_station_values.station)) as perc \
   WHERE divisor > 0 \
   AND timestamp >= $1::timestamp \
   AND timestamp < $1::timestamp + INTERVAL \'15 minutes\'')

/**
 * Validates date and time supplied in URL
 *
 * @param {string} date date given in URL
 * @param {string} time time given in URL
 * @returns {Promise} Returns date string for database if valid, rejects with
 * error message if invalid
 */
function validateDateTime(date, time) {
  const timestamp = moment(`${date} ${time}`, 'YYYY-MM-DD HH-mm');
  if (timestamp.isValid()) {
    return Promise.resolve(timestamp.format('YYYY-MM-DD HH:mm'));
  }
  return Promise.reject('Invalid timestamp');
}

/**
 * Most queries simply take a date time string, valides it and then applies
 * this to a database query. This helper function performs this task for
 * multiple different queries
 *
 * @param {PreparedStatement} query takes one parameter, a timestamp string
 * @param {} req HTTP Request
 * @param {} res HTTP Response
 */
function getGenericDataDateTime(query, req, res) {
  validateDateTime(req.params.date, req.params.time)
    .then((timestamp) => {
      query.values = [timestamp];
      db.manyOrNone(query)
        .then((data) => {
          res.status(200)
            .json({
              status: 'success',
              data,
              message: 'gotReading',
            });
        });
    })
    .catch(() => {
      res.status(404)
        .json({
          status: 'failure',
          data: [],
          message: 'Invalid date',
        });
    });
}

/**
 * Gets Rainfall data for given date and time within 15 minute interval
 */
function getReadingsDateTime(req, res) {
  getGenericDataDateTime(getReadings, req, res);
}

/**
 * Gets river levels for a given date and time within 15 minute interval for
 * Discrete areas of 0.1degrees latitudinally and 0.2 degrees longitudinally
 */
function getLevelsDateTimeAreas(req, res) {
  getGenericDataDateTime(getLevelsAreas, req, res);
}

/**
 * Gets river levels for a given date and time within 15 minute interval
 */
function getLevelsDateTime(req, res) {
  getGenericDataDateTime(getLevelsAreas, req, res);
}

/**
 * Gets tidal data for a given date and time within 15 minute interval
 */
function getTideDateTime(req, res) {
  getGenericDataDateTime(getTide, req, res);
}

function getStations(req, res) {
  db.manyOrNone(
    `SELECT station, lat, long FROM station_values
     UNION SELECT station, lat, long FROM level_station_values
     UNION SELECT station, lat, long FROM tide_station_values
     ORDER BY station
    `
  )
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data,
          message: 'gotReading',
        });
    });
}

module.exports = {
  getReadingsDateTime,
  getLevelsDateTimeAreas,
  getLevelsDateTime,
  getTideDateTime,
  getStations,
};
