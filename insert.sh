cat readings.csv | psql -c "COPY temptimecsv(timestamp, stationref, value) FROM stdin DELIMITER ',' CSV;"
cat stations.csv | psql -c "COPY tempstationcsv(label, lat, long, stationref) FROM stdin DELIMITER ',' CSV;"
