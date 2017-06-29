cat readings.csv | grep 'rainfall' | grep -v '|\|undefined\|NaN' | csvcut --columns=1,6,13 | psql -c "COPY temptimecsv(timestamp, stationref, value) FROM stdin DELIMITER ',' CSV;"
cat stations.csv | grep -v '|\|undefined\|NaN' | psql -c "COPY tempstationcsv(label, lat, long, stationref) FROM stdin DELIMITER ',' CSV;"
cat levelstations.csv | grep -v '|\|undefined\|NaN' | psql -c "COPY templevelstationcsv(label, lat, long, stationref, typicalmax, typicalmin, scalemax) FROM stdin DELIMITER ',' CSV;"
cat readings.csv | grep 'level' | csvcut --columns=1,6,13 | grep -v '|\|undefined\|NaN' | psql -c "COPY templevelcsv(timestamp, stationref, value) FROM stdin DELIMITER ',' CSV;"

