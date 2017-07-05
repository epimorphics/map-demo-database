var promise = require('bluebird');
var moment = require('moment');

var options = {
  promiseLib: promise,
}

var pgp = require('pg-promise')(options);

// Modify connectionstring.js.example
var connectionString = require('./connectionstring.js');
var db = pgp(connectionString);

function getReadingsDateTime(req, res, next) {
  const timestamp = `${req.params.date} ${moment(req.params.time, 'hh-mm').format('hh:mm:ss')}`;
  db.manyOrNone(`SELECT lat, long, value FROM station_values RIGHT JOIN (SELECT value, station FROM time_values WHERE value != 0 AND timestamp >= '${timestamp}' AND timestamp <= '${timestamp}'::timestamp + INTERVAL '15 minutes') as db ON station_values.station = db.station`)
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data,
          message: 'gotReading'
        });
    });
}

function getLevelsDateTime(req, res, next) {
  const timestamp = `${req.params.date} ${moment(req.params.time, 'hh-mm').format('hh:mm:ss')}`;
  db.manyOrNone(`SELECT areas.lat, areas.long, sum(value)/count(*) as value from areas RIGHT JOIN (SELECT lat, long, val / divisor as value FROM (SELECT timestamp, lat, long, (value - avgvalue) as val, (typicalmax - avgvalue) as divisor, avgvalue, value from level_values RIGHT JOIN level_station_values ON (level_values.station = level_station_values.station)) as perc where value > avgvalue AND divisor > 0 AND timestamp >= '${timestamp}'::timestamp AND timestamp < '${timestamp}'::timestamp + INTERVAL '15 minutes') as lv on (areas.lat <= lv.lat AND areas.lat + 0.1 > lv.lat AND areas.long <= lv.long AND areas.long + 0.2 > lv.long) WHERE areas.lat is not null group by areas.lat, areas.long`)
 // db.manyOrNone(`SELECT lat, long, val / divisor as value FROM (SELECT timestamp, lat, long, (value - avgvalue) as val, (typicalmax - avgvalue) as divisor, avgvalue, value from level_values  LEFT JOIN level_station_values ON (level_values.station = level_station_values.station)) as perc where divisor > 0 AND timestamp >= '${timestamp}'::timestamp AND timestamp < '${timestamp}'::timestamp + INTERVAL '15 minutes'`)
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data,
          message: 'gotReading'
        });
    });
}

function getTideDateTime(req, res, next) {
  const timestamp = `${req.params.date} ${moment(req.params.time, 'hh-mm').format('hh:mm:ss')}`;
  db.manyOrNone(`SELECT lat, long, val / divisor as value FROM (SELECT timestamp, lat, long, (value - typicalmin) as val, (typicalmax - typicalmin) as divisor, avgvalue, value from tide_values LEFT JOIN tide_station_values ON (tide_values.station = tide_station_values.station)) as perc where divisor > 0 AND timestamp >= '${timestamp}'::timestamp AND timestamp < '${timestamp}'::timestamp + INTERVAL '15 minutes'`)
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data,
          message: 'gotReading'
        });
    });
}

module.exports = {
  getReadingsDateTime: getReadingsDateTime,
  getLevelsDateTime: getLevelsDateTime,
  getTideDateTime: getTideDateTime,
};
