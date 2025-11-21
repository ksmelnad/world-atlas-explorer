import axios from 'axios';
import type { Country, WikiSummary } from '../types';
import countriesData from '../data/countries.json';

const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1/page/summary';

// Cast the imported JSON to the correct type
const countries: Country[] = countriesData as unknown as Country[];

console.log('[API] Using local JSON data with', countries.length, 'countries');

export const api = {
    getAllCountries: async (): Promise<Country[]> => {
        console.log('[API] getAllCountries called - returning local data');
        try {
            // Return data from local JSON file
            return countries;
        } catch (error) {
            console.error('Error loading countries:', error);
            return [];
        }
    },

    getCountryByCode: async (code: string): Promise<Country | null> => {
        try {
            // Find country in local data by cca3 code
            const country = countries.find(c => c.cca3.toLowerCase() === code.toLowerCase());
            return country || null;
        } catch (error) {
            console.error(`Error fetching country details for ${code}:`, error);
            return null;
        }
    },

    getCountryDetails: async (countryName: string): Promise<WikiSummary | null> => {
        try {
            // Wikipedia API expects underscores instead of spaces
            const formattedName = countryName.split(' ').join('_');
            const response = await axios.get<WikiSummary>(`${WIKIPEDIA_API}/${formattedName}`);
            return response.data;
        } catch (error) {
            console.warn(`Error fetching Wikipedia summary for ${countryName}:`, error);
            return null;
        }
    },
};
