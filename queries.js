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
    .then((data, test) => {
      console.log(data, test);
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
  db.manyOrNone("SELECT lat, long, value FROM station_values RIGHT JOIN (SELECT value, station FROM time_values WHERE value != 0 AND timestamp >= '" + timestamp + "' AND timestamp <= '" + timestamp +"'::timestamp + INTERVAL '15 minutes') as db ON station_values.station = db.station")
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data,
          message: 'gotReading'
        });
    });
}


function getReadingsDateTimeGlobe(req, res, next) {
  const timestamp = `${req.params.date} ${moment(req.params.time, 'hh-mm').format('hh:mm:ss')}`;
  db.manyOrNone("SELECT lat, long, value FROM station_values RIGHT JOIN (SELECT value, station FROM time_values WHERE value != 0 AND timestamp >= '" + timestamp + "' AND timestamp <= '" + timestamp +"'::timestamp + INTERVAL '15 minutes') as db ON station_values.station = db.station")
    .then((data) => {
      let arraydata = data.map(point => ([point.lat, point.long, point.value]));
      let outData = [];
      for (let i = 0; i < arraydata.length; i++) {
        outData.push(arraydata[i][0]);
        outData.push(arraydata[i][1]);
        outData.push(arraydata[i][2]);
      }
      out = [
        [
          timestamp, outData
        ]
      ];
      res.status(200)
        .json(
          out
        );
    });
}

function getReadingsWeek(req, res, next) {
  const timestamp = `${req.params.date}`
  const countPromise = db.manyOrNone(`select timestamp, count(*) from time_values where (value != 0 AND timestamp >= '${timestamp}'::date AND timestamp <= '${timestamp}'::date + INTERVAL '1 day') group by timestamp ORDER BY timestamp;`)
  const valuePromise = db.manyOrNone(`select * from time_values where (value != 0 AND timestamp >= '${timestamp}'::date AND timestamp <= '${timestamp}'::date + INTERVAL '1 day') ORDER BY timestamp, id;`)
  promise.all([valuePromise, countPromise], (data) =>
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'gotReading'
      }));
}

function getLevelsDateTime(req, res, next) {
  const timestamp = `${req.params.date} ${moment(req.params.time, 'hh-mm').format('hh:mm:ss')}`;
  db.manyOrNone(`SELECT lat, long, val / divisor as percentage FROM (SELECT timestamp, lat, long, (value - avgvalue) as val, (typicalmax - avgvalue) as divisor, avgvalue, value from level_values  LEFT JOIN level_station_values ON (level_values.station = level_station_values.station)) as perc where value > avgvalue AND divisor > 0 AND timestamp >= '${timestamp}'::timestamp AND timestamp < '${timestamp}'::timestamp + INTERVAL '15 minutes' ORDER by percentage`)
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
  getReadingsDateTimeGlobe: getReadingsDateTimeGlobe,
  getReadingsWeek: getReadingsWeek,
  getLevelsDateTime: getLevelsDateTime,
};
