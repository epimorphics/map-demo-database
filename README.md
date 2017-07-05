SETUP,

Clone the repository, run npm install

With Postgres setup;

Download epidata.db
  create database for the application
    CREATE DATABASE {dbname}
  load dump using
    pg_restore -d {dbname} epidata.db

If you do not have access to the dump, you can create a database using the supplied shell scripts
Create the following files
  readings.csv: file consisting of merged csv files from the environments agency archives
  stations.csv, levelstations.csv, tidestations.csv:
    These can be created by running *stations.sh
Place these files into ./setup then

Run "npm run-script setup"

  This will:
    create the 3 tables required
    load csv data from readings.csv and stations.csv into database

UPDATE

If the data needs updating
place up to date csv data into ./update

Run "npm run-script update" to add this data to the database


TEARDOWN

If you wish to remove all data

Run npm run-script teardown

Running REST server

  run
    npm start

  Your server is now running on port 3000
