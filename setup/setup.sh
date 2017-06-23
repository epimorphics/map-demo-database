./download.sh
psql -f newsetup.sql
./insert.sh
psql -f postinsert.sql
