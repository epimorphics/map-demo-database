var promise = require('bluebird');

var options = {
  promiseLib: promise,
}

var pgp = require('pg-promise')(options);

// Modify connectionstring.js.example
var connectionString = require('./connectionstring.js');
var db = pgp(connectionString);

function getReadings(req, res, next) {
  console.log(req.params.date);
  db.many("SELECT lat, long, value FROM station_values LEFT JOIN (SELECT count(*) as value, station FROM time_values WHERE timestamp <= ('" + req.params.date + "'::date + '2 days'::interval) AND timestamp >= '" + req.params.date + "'::date GROUP BY (station)) as db ON (db.station = station_values.station)")
  //db.many("SELECT count(*) as value, station FROM time_values WHERE timestamp >= ('2017-05-06'::date + '1 day'::interval) AND timestamp >= '2017-05-06'::date GROUP BY (station)")
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
  getReadings: getReadings
};
