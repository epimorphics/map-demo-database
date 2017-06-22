BEGIN;
CREATE TABLE stations (id serial PRIMARY KEY, stationref varchar(50));
CREATE TABLE time_values (id serial PRIMARY KEY, timestamp timestamp, value double precision, station int);
CREATE TABLE station_values (id serial PRIMARY KEY, label varchar(50), lat double precision, long double precision, station int);

DROP TABLE IF EXISTS temptimecsv;
DROP TABLE IF EXISTS tempstationcsv;
CREATE TABLE temptimecsv (id serial PRIMARY KEY, timestamp timestamp, stationref varchar(50), value double precision);
CREATE TABLE tempstationcsv (id serial PRIMARY KEY, label varchar(50), lat double precision, long double precision, stationref varchar(50));
COMMIT;
