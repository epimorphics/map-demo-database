BEGIN;
INSERT INTO stations(stationref)
SELECT DISTINCT stationref from tempstationcsv;
INSERT INTO stations(stationref)
SELECT DISTINCT stationref from templevelstationcsv;
insert into time_values(timestamp, station, value)
SELECT DISTINCT timestamp, stations.id as station, value from temptimecsv LEFT JOIN stations ON (temptimecsv.stationref = stations.stationref);
insert into level_values(timestamp, station, value)
SELECT DISTINCT timestamp, stations.id as station, value from templevelcsv LEFT JOIN stations ON (templevelcsv.stationref = stations.stationref);
INSERT into station_values(label, lat, long, station)
SELECT DISTINCT label, lat, long, stations.id as station from tempstationcsv LEFT JOIN stations ON (tempstationcsv.stationref = stations.stationref);
INSERT into level_station_values(label, lat, long, station, typicalmin, typicalmax, scalemax)
SELECT DISTINCT label, lat, long, stations.id as station, typicalmin, typicalmax, scalemax from templevelstationcsv LEFT JOIN stations ON (templevelstationcsv.stationref = stations.stationref);
UPDATE level_station_values SET typicalmin = i.min
FROM ( SELECT min(value) as min, station FROM level_values group by station) i
WHERE i.station = level_station_values.station;
UPDATE level_station_values SET typicalmax = i.max
FROM ( SELECT max(value) as max, station FROM level_values group by station) i
WHERE i.station = level_station_values.station;
UPDATE level_station_values SET avgvalue = i.avg
FROM ( SELECT avg(value) as avg, station FROM level_values group by station) i
WHERE i.station = level_station_values.station;
DROP TABLE temptimecsv;
DROP TABLE templevelcsv;
DROP TABLE tempstationcsv;
DROP TABLE templevelstationcsv;
COMMIT;
