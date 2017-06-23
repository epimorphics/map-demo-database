#start of rainfall data
#d=2017-02-08
d=2017-06-10
dmax=$(date +%Y-%m-%d)
touch readings.tmp
while [ "$d" != "$dmax" ]; do
  url=http://environment.data.gov.uk/flood-monitoring/archive/readings-full-${d}.csv
  curl $url -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-GB,en-US;q=0.8,en;q=0.6' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' -H 'Referer: http://environment.data.gov.uk/flood-monitoring/archive' -H 'Cookie: seen_cookie_message=yes; _wims-ui_session=UlBVMGJiVDR4Y2lZN3NGdTJ6TDA3TEZHditPeUVnZDBobjJVazBMQlc2MzZRRVVrVXZuMTFBV1Q3NjRTaThlYU0zQWZjbkVZdlFHOHhBckFZQkdoUzVPTGJLeUFPZlVwTGhJb0NKbzZTNDlsTUJtc3owM1ZERXlQU0gxeVZySEhRcGlucGQxL0lCYkkvUlpscTIvMG9RPT0tLUVka0dDRGx2eW5OU3d4cFlYeHJvRXc9PQ%3D%3D--fa1927541e59db5a1459b48f2bc83bac418a29ab; _ga=GA1.4.1711839452.1497518874; _ga=GA1.3.1711839452.1497518874; _gid=GA1.3.1467271034.1497886132' -H 'Connection: keep-alive' --compressed >> readings.tmp
  d=$(date -I -d "$d + 1 day")
done
cat readings.tmp | grep "Tipping" | grep -v "|" > readings.csv
cut -d, -f1,6,13 readings.csv > readings.tmp
cat readings.tmp > readings.csv
rm readings.tmp
node stations.js > stations.csv
