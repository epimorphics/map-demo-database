BEGIN;
insert into time_values(timestamp, station, value)
SELECT timestamp, stations.id as station, value from temptimecsv LEFT JOIN stations ON (temptimecsv.stationref = stations.stationref);
insert into level_values(timestamp, station, value)
SELECT DISTINCT timestamp, stations.id as station, value from templevelcsv LEFT JOIN stations ON (templevelcsv.stationref = stations.stationref);
insert into tide_values(timestamp, station, value)
SELECT DISTINCT timestamp, stations.id as station, value from temptidecsv LEFT JOIN stations ON (temptidecsv.stationref = stations.stationref);

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

DROP TABLE temptimecsv;
DROP TABLE templevelcsv;
DROP TABLE temptidecsv;
COMMIT;
