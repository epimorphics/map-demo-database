SETUP,

Clone the repository, run npm install

With Postgres setup;

Download readings.csv and stations.csv (these are quite small, around 300mb). Much better than downloading all csvs and parsing 7GB! Place them in the setup folder
Run npm run-script setup

  This will:
    create the 3 tables required
    load csv data from readings.csv and stations.csv into database

UPDATE

If the data needs updating

Run npm run-script update

  This will:
    Download all missing rainfall data
    format it to a csv
    add it to the table

TEARDOWN

If you wish to remove all data

Run npm run-script teardown

  This will:
    Remove the 3 tables and potentially temporary ones

Running REST server

  run
    npm start

  Your server is now running on port 3000
