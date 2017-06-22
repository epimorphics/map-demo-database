SETUP,

Clone the repository, run npm install

With Postgres setup;


DOWNLOADING DATA,

Supplied are some scripts to help you download data,

Run download.sh to download data, these will be saved to two files
  readings.csv, stations.csv

INSERT INTO DB,

  Now run
    psql -a -f newsetup.sql

  This will setup five tables
    station_values
    stations
    time_values
    tempstationscsv
    tempvaluescsv

  Now run ./insert.sh

  This inserts the data from the csvs into the temporary tables

  And finally run
    psql -a -f postinsert.sql;

Running REST server

  run
    npm start

  Your server is now running on port 3000
