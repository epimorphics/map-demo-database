./download.sh
psql -f updatesetup.sql
./insert.sh
psql -f updateinsert.sql

