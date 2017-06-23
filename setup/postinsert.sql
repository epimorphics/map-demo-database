BEGIN;
INSERT INTO stations(stationref)
SELECT stationref from tempstationcsv;
insert into time_values(timestamp, station, value)
SELECT timestamp, stations.id as station, value from temptimecsv LEFT JOIN stations ON (temptimecsv.stationref = stations.stationref);
insert into station_values(label, lat, long, station)
SELECT label, lat, long, stations.id as station from tempstationcsv LEFT JOIN stations ON (tempstationcsv.stationref = stations.stationref);
DROP TABLE temptimecsv;
DROP TABLE tempstationcsv;
COMMIT;
