var promise = require('bluebird');
var moment = require('moment');

var options = {
  promiseLib: promise,
}

var pgp = require('pg-promise')(options);

// Modify connectionstring.js.example
var connectionString = require('./connectionstring.js');
var db = pgp(connectionString);

function getReadingsDate(req, res, next) {
  console.log(req.params.date);
  db.many("SELECT lat, long, value FROM station_values LEFT JOIN (SELECT SUM(value) as value, station FROM time_values WHERE timestamp <= ('" + req.params.date + "'::date + '1 day'::interval) AND timestamp >= '" + req.params.date + "'::date GROUP BY (station)) as db ON (db.station = station_values.station)")
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data,
          message: 'gotReading'
        });
    });
}

function getReadingsDateTime(req, res, next) {
  const timestamp = `${req.params.date} ${moment(req.params.time, 'hh-mm').format('hh:mm:ss')}`;
  db.manyOrNone("SELECT lat, long, value FROM station_values RIGHT JOIN (SELECT SUM(value) as value, station FROM time_values WHERE timestamp >= '" + timestamp + "' AND timestamp <= '" + timestamp +"'::timestamp + INTERVAL '15 minutes' AND value > 0.0 GROUP BY (station)) as db ON (db.station = station_values.station)")
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
  getReadingsDate: getReadingsDate,
  getReadingsDateTime: getReadingsDateTime,
};
