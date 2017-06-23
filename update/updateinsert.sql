BEGIN;
insert into time_values(timestamp, station, value)
SELECT timestamp, stations.id as station, value from temptimecsv LEFT JOIN stations ON (temptimecsv.stationref = stations.stationref);
DROP TABLE temptimecsv;
COMMIT;
