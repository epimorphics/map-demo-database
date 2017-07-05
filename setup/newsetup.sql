BEGIN;
CREATE TABLE stations (id serial PRIMARY KEY, stationref varchar(50));
CREATE TABLE time_values (id serial PRIMARY KEY, timestamp timestamp, value double precision, station int);
CREATE TABLE level_values (id serial PRIMARY KEY, timestamp timestamp, value double precision, station int);
CREATE TABLE tide_values  (id serial PRIMARY KEY, timestamp timestamp, value double precision, station int);
CREATE TABLE station_values (id serial PRIMARY KEY, label varchar(50), lat double precision, long double precision, station int, typicalmin double precision, typicalmax double precision, avgvalue double precision);
CREATE TABLE level_station_values (id serial PRIMARY KEY, label varchar(50), lat double precision, long double precision, station int, typicalmin double precision, typicalmax double precision, avgvalue double precision);
CREATE TABLE tide_station_values (id serial PRIMARY KEY, label varchar(50), lat double precision, long double precision, station int, typicalmin double precision, typicalmax double precision, avgvalue double precision);

DROP TABLE IF EXISTS temptimecsv;
DROP TABLE IF EXISTS templevelcsv;
DROP TABLE IF EXISTS temptidecsv;
DROP TABLE IF EXISTS tempstationcsv;
DROP TABLE IF EXISTS templevelstationcsv;
DROP TABLE IF EXISTS temptidestationcsv;
CREATE TABLE temptimecsv (id serial PRIMARY KEY, timestamp timestamp, stationref varchar(50), value double precision);
CREATE TABLE templevelcsv (id serial PRIMARY KEY, timestamp timestamp, stationref varchar(50), value double precision);
CREATE TABLE temptidecsv (id serial PRIMARY KEY, timestamp timestamp, stationref varchar(50), value double precision);
CREATE TABLE tempstationcsv (id serial PRIMARY KEY, label varchar(50), lat double precision, long double precision, stationref varchar(50), typicalmin double precision, typicalmax double precision, avgvalue double precision);
CREATE TABLE templevelstationcsv (id serial PRIMARY KEY, label varchar(50), lat double precision, long double precision, stationref varchar(50), typicalmin double precision, typicalmax double precision, avgvalue double precision);
CREATE TABLE temptidestationcsv (id serial PRIMARY KEY, label varchar(50), lat double precision, long double precision, stationref varchar(50), typicalmin double precision, typicalmax double precision, avgvalue double precision);
CREATE INDEX timestamptimeindex on time_values (timestamp);
CREATE INDEX timestamplevelindex on level_values (timestamp);
CREATE INDEX timestamptideindex on tide_values(timestamp);
COMMIT;
