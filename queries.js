const promise = require('bluebird');
const moment = require('moment');

const options = {
  promiseLib: promise,
};

const pgp = require('pg-promise')(options);

// Modify connectionstring.js.example
const connectionString = require('./connectionstring.js');

const db = pgp(connectionString);

/**
 * Validates date and time supplied in URL
 *
 * @param {string} date date given in URL
 * @param {string} time time given in URL
 * @returns {Promise} Returns date string for database if valid, rejects with
 * error message if invalid
 */
function validateDateTime(date, time) {
  const timestamp = moment(`${date} ${time}`, 'YYYY-MM-DD hh-mm');
  if (timestamp.isValid()) {
    return Promise.resolve(timestamp.format('YYYY-MM-DD hh:mm'));
  }
  return Promise.reject('Invalid timestamp');
}

/**
 * Gets Rainfall data for given date and time within 15 minute interval
 *
 * @param {} req HTTP request
 * @param {} res HTTP response
 */
function getReadingsDateTime(req, res) {
  validateDateTime(req.params.date, req.params.time)
    .then((timestamp) => {
      db.manyOrNone(
        `SELECT lat, long, value FROM station_values \
         RIGHT JOIN (SELECT value, station FROM time_values \
         WHERE value != 0 AND \
         timestamp >= '${timestamp}' \
         AND timestamp <= '${timestamp}'::timestamp + INTERVAL '15 minutes') as db \
         ON station_values.station = db.station`
      )
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
 * Gets river levels for a given date and time within 15 minute interval for
 * Discrete areas of 0.1degrees latitudinally and 0.2 degrees longitudinally
 *
 * @param {} req HTTP request
 * @param {} res HTTP response
 */
function getLevelsDateTimeAreas(req, res) {
  validateDateTime(req.params.date, req.params.time)
    .then((timestamp) => {
      db.manyOrNone(
        `SELECT areas.lat, areas.long, sum(value)/count(*) as value from areas \
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
            AND timestamp >= '${timestamp}'::timestamp \
            AND timestamp < '${timestamp}'::timestamp + INTERVAL '15 minutes') as lv \
         ON (areas.lat <= lv.lat \
             AND areas.lat + 0.1 > lv.lat \
             AND areas.long <= lv.long \
             AND areas.long + 0.2 > lv.long) \
         WHERE areas.lat is not null group by areas.lat, areas.long`
      )
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
 * Gets river levels for a given date and time within 15 minute interval
 *
 * @param {} req HTTP request
 * @param {} res HTTP response
 */
function getLevelsDateTime(req, res) {
  validateDateTime(req.params.date, req.params.time)
    .then((timestamp) => {
      db.manyOrNone(
        `SELECT lat, long, val / divisor as value \
         FROM (SELECT timestamp, lat, long, (value - avgvalue) as val, (typicalmax - avgvalue) as divisor, avgvalue, value from level_values  LEFT JOIN level_station_values ON (level_values.station = level_station_values.station)) as perc where divisor > 0 AND timestamp >= '${timestamp}'::timestamp AND timestamp < '${timestamp}'::timestamp + INTERVAL '15 minutes'`
      )
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
 * Gets tidal data for a given date and time within 15 minute interval
 *
 * @param {} req HTTP request
 * @param {} res HTTP response
 */
function getTideDateTime(req, res) {
  validateDateTime(req.params.date, req.params.time)
    .then((timestamp) => {
      db.manyOrNone(
        `SELECT lat, long, val / divisor as value \
         FROM (SELECT timestamp, lat, long, avgvalue, value, \
           (value - typicalmin) as val, \
           (typicalmax - typicalmin) as divisor \
           FROM tide_values \
           LEFT JOIN tide_station_values \
           ON (tide_values.station = tide_station_values.station)) as perc \
         WHERE divisor > 0 \
         AND timestamp >= '${timestamp}'::timestamp \
         AND timestamp < '${timestamp}'::timestamp + INTERVAL '15 minutes'`
      )
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

module.exports = {
  getReadingsDateTime,
  getLevelsDateTimeAreas,
  getLevelsDateTime,
  getTideDateTime,
};
