Backend database for map data visualisation

# Build Setup

``` bash
# install dependencies
npm install
```

# Database Setup
With Postgres installed and roles set

Download epidata.db dump

``` sql
-- create database for the application
CREATE DATABASE {dbname}
```

``` bash
# load dump into dbname
    pg_restore -d {dbname} epidata.db
```

If you do not have access to the dump, you can create a database using the supplied shell scripts
Create the following files
  readings.csv: file consisting of merged csv files from the environments agency archives
  stations.csv, levelstations.csv, tidestations.csv:
    These can be created by running *stations.sh
Place these files into ./setup then

``` bash
npm run-script setup
```

  This will:
    create the 3 tables required
    load csv data from readings.csv and stations.csv into database

# Update

If the data needs updating
place up to date csv data into ./update as readings.csv

Run "npm run-script update" to add this data to the database

# Teardown

``` bash
# remove all data
npm run-script teardown
```

# Running REST server

``` bash
npm start
```

Your server is now running on port 3000
