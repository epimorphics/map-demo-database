cat readings.csv | psql -c "COPY temptimecsv(timestamp, stationref, value) FROM stdin DELIMITER ',' CSV;"
cat stations.csv | psql -c "COPY tempstationcsv(label, lat, long, stationref) FROM stdin DELIMITER ',' CSV;"
cat levelstations.csv | psql -c "COPY templevelstationcsv(label, lat, long, stationref, typicalmin, typicalmax) FROM stdin DELIMITER ',' CSV;"
cat riverlevels.csv | psql -c "COPY templevelcsv(timestamp, stationref, value) FROM stdin DELIMITER ',' CSV;"

