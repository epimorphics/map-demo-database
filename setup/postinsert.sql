BEGIN;
INSERT INTO stations(stationref)
SELECT stationref from tempstationcsv;
INSERT INTO stations(stationref)
SELECT stationref from templevelstationcsv;
insert into time_values(timestamp, station, value)
SELECT timestamp, stations.id as station, value from temptimecsv LEFT JOIN stations ON (temptimecsv.stationref = stations.stationref);
insert into level_values(timestamp, station, value)
SELECT timestamp, stations.id as station, value from templevelcsv LEFT JOIN stations ON (templevelcsv.stationref = stations.stationref);
INSERT into station_values(label, lat, long, station)
SELECT label, lat, long, stations.id as station from tempstationcsv LEFT JOIN stations ON (tempstationcsv.stationref = stations.stationref);
INSERT into level_station_values(label, lat, long, station, typicalmin, typicalmax)
SELECT label, lat, long, stations.id as station, typicalmin, typicalmax from templevelstationcsv LEFT JOIN stations ON (templevelstationcsv.stationref = stations.stationref);
DROP TABLE temptimecsv;
DROP TABLE tempstationcsv;
DROP TABLE templevelstationcsv;
COMMIT;
