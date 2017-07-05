pv readings.csv | grep 'rainfall' | grep -v '|\|undefined\|NaN' | csvcut --columns=1,6,13 | psql -c "COPY temptimecsv(timestamp, stationref, value) FROM stdin DELIMITER ',' CSV;"
pv stations.csv | grep -v '|\|undefined\|NaN' | psql -c "COPY tempstationcsv(label, lat, long, stationref) FROM stdin DELIMITER ',' CSV;"
pv levelstations.csv | grep -v '|\|undefined\|NaN\|measure' | psql -c "COPY templevelstationcsv(label, lat, long, stationref) FROM stdin DELIMITER ',' CSV;"
pv tidestations.csv | grep -v '|\|undefined\|NaN\|measure' | psql -c "COPY temptidestationcsv(label, lat, long, stationref) FROM stdin DELIMITER ',' CSV;"
pv readings.csv | grep 'level' | csvcut --columns=1,6,13 | grep -v '|\|undefined\|NaN\|measure' | psql -c "COPY templevelcsv(timestamp, stationref, value) FROM stdin DELIMITER ',' CSV;"
pv readings.csv | grep 'Tidal' | csvcut --columns=1,6,13 | grep -v '|\|undefined\|NaN\|measure' | psql -c "COPY temptidecsv(timestamp, stationref, value) FROM stdin DELIMITER ',' CSV;"

