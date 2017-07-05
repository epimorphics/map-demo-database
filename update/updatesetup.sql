BEGIN;
DROP TABLE IF EXISTS temptimecsv;
DROP TABLE IF EXISTS templevelcsv;
DROP TABLE IF EXISTS temptidecsv;
CREATE TABLE temptimecsv (id serial PRIMARY KEY, timestamp timestamp, stationref varchar(50), value double precision);
CREATE TABLE templevelcsv (id serial PRIMARY KEY, timestamp timestamp, stationref varchar(50), value double precision);
CREATE TABLE temptidecsv (id serial PRIMARY KEY, timestamp timestamp, stationref varchar(50), value double precision);
COMMIT;
