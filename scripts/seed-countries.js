import https from 'https';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Use the v2/all endpoint which returns all data by default
const REST_COUNTRIES_API = 'https://restcountries.com/v2/all';
const OUTPUT_FILE = path.join(__dirname, '../src/data/countries.json');
function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                }
                else {
                    reject(new Error(`HTTP error! status: ${res.statusCode}, body: ${data}`));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}
async function seedCountries() {
    try {
        console.log('Fetching countries from API...');
        console.log(`API URL: ${REST_COUNTRIES_API}`);
        const data = await fetchData(REST_COUNTRIES_API);
        const countries = JSON.parse(data);
        console.log(`Fetched ${countries.length} countries.`);
        console.log(`Sample country fields:`, Object.keys(countries[0] || {}).join(', '));
        // Ensure the directory exists
        const outputDir = path.dirname(OUTPUT_FILE);
        await fs.mkdir(outputDir, { recursive: true });
        console.log(`Writing data to ${OUTPUT_FILE}...`);
        await fs.writeFile(OUTPUT_FILE, JSON.stringify(countries, null, 2));
        const stats = await fs.stat(OUTPUT_FILE);
        console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        console.log('Countries seeded successfully!');
    }
    catch (error) {
        console.error('Error seeding countries:', error);
        process.exit(1);
    }
}
seedCountries();
