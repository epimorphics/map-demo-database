cat readings.csv | psql -c "COPY temptimecsv(timestamp, stationref, value) FROM stdin DELIMITER ',' CSV;"

