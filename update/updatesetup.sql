BEGIN;
DROP TABLE IF EXISTS temptimecsv;
CREATE TABLE temptimecsv (id serial PRIMARY KEY, timestamp timestamp, stationref varchar(50), value double precision);
COMMIT;
