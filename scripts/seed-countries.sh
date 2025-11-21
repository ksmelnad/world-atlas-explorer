#!/usr/bin/env bash

# Seed script to fetch country data from restcountries.com API
# and save it to src/data/countries.json

set -e

echo "Fetching countries from API..."

# Create data directory if it doesn't exist
mkdir -p "$(dirname "$0")/../src/data"

# Fetch data with all necessary fields
curl -s 'https://restcountries.com/v3.1/all?fields=name,cca3,cca2,flags,region,population,capital,tld,ccn3,cioc,independent,status,unMember,currencies,idd,altSpellings,subregion,languages,translations,latlng,landlocked,borders,area,demonyms,flag,maps,gini,fifa,car,timezones,continents,coatOfArms,startOfWeek,capitalInfo,postalCode' \
  -o "$(dirname "$0")/../src/data/countries.json"

# Check if the file was created and contains data
if [ -s "$(dirname "$0")/../src/data/countries.json" ]; then
  echo "✓ Countries seeded successfully!"
  echo "✓ Data saved to src/data/countries.json"
else
  echo "✗ Error: Failed to fetch country data"
  exit 1
fi
