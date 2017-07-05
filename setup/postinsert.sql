BEGIN;

INSERT INTO stations(stationref)
SELECT DISTINCT stationref from tempstationcsv;
INSERT INTO stations(stationref)
SELECT DISTINCT stationref from templevelstationcsv;
INSERT INTO stations(stationref)
SELECT DISTINCT stationref from temptidestationcsv;

INSERT INTO time_values(timestamp, station, value)
SELECT DISTINCT timestamp, stations.id as station, value from temptimecsv LEFT JOIN stations ON (temptimecsv.stationref = stations.stationref);
INSERT INTO level_values(timestamp, station, value)
SELECT DISTINCT timestamp, stations.id as station, value from templevelcsv LEFT JOIN stations ON (templevelcsv.stationref = stations.stationref);
INSERT INTO tide_values(timestamp, station, value)
SELECT DISTINCT timestamp, stations.id as station, value from temptidecsv LEFT JOIN stations ON (temptidecsv.stationref = stations.stationref);

INSERT into station_values(label, lat, long, station)
SELECT DISTINCT label, lat, long, stations.id as station from tempstationcsv LEFT JOIN stations ON (tempstationcsv.stationref = stations.stationref);
INSERT into level_station_values(label, lat, long, station)
SELECT DISTINCT label, lat, long, stations.id as station from templevelstationcsv LEFT JOIN stations ON (templevelstationcsv.stationref = stations.stationref);
INSERT into tide_station_values(label, lat, long, station)
SELECT DISTINCT label, lat, long, stations.id as station from temptidestationcsv LEFT JOIN stations ON (temptidestationcsv.stationref = stations.stationref);

UPDATE level_station_values SET typicalmin = i.min
FROM ( SELECT min(value) as min, station FROM level_values group by station) i
WHERE i.station = level_station_values.station;
UPDATE level_station_values SET typicalmax = i.max
FROM ( SELECT max(value) as max, station FROM level_values group by station) i
WHERE i.station = level_station_values.station;
UPDATE level_station_values SET avgvalue = i.avg
FROM ( SELECT avg(value) as avg, station FROM level_values group by station) i
WHERE i.station = level_station_values.station;

UPDATE station_values SET typicalmin = i.min
FROM ( SELECT min(value) as min, station FROM time_values group by station) i
WHERE i.station = station_values.station;
UPDATE station_values SET typicalmax = i.max
FROM ( SELECT max(value) as max, station FROM time_values group by station) i
WHERE i.station = station_values.station;
UPDATE station_values SET avgvalue = i.avg
FROM ( SELECT avg(value) as avg, station FROM time_values group by station) i
WHERE i.station = station_values.station;

UPDATE tide_station_values SET typicalmin = i.min
FROM ( SELECT min(value) as min, station FROM tide_values group by station) i
WHERE i.station = tide_station_values.station;
UPDATE tide_station_values SET typicalmax = i.max
FROM ( SELECT max(value) as max, station FROM tide_values group by station) i
WHERE i.station = tide_station_values.station;
UPDATE tide_station_values SET avgvalue = i.avg
FROM ( SELECT avg(value) as avg, station FROM tide_values group by station) i
WHERE i.station = tide_station_values.station;

CREATE VIEW areas AS
SELECT CAST(lat as double precision), CAST(long as double precision)
FROM (SELECT * FROM generate_series(-4.1, 1.6, 0.1) long) as t1
CROSS JOIN (SELECT * FROM generate_series(50, 55, 0.1) lat) as t2;

DROP TABLE temptimecsv;
DROP TABLE templevelcsv;
DROP TABLE tempstationcsv;
DROP TABLE templevelstationcsv;
COMMIT;
