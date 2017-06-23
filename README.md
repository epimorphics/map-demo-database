SETUP,

Clone the repository, run npm install

With Postgres setup;

Run npm run-script setup

  This will:
    Download all rainfall and station data from the environments agency
    Format it all into csv
    create the 3 tables required
    load data into database

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
