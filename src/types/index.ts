export interface Currency {
    code: string;
    name: string;
    symbol: string;
}

export interface Language {
    iso639_1?: string;
    iso639_2: string;
    name: string;
    nativeName?: string;
}

export interface Country {
    name: {
        common: string;
        official: string;
        nativeName?: { [key: string]: { official: string; common: string } };
    };
    tld?: string[];
    cca2: string;
    ccn3?: string;
    cca3: string;
    cioc?: string;
    independent?: boolean;
    status?: string;
    unMember?: boolean;
    currencies?: { [key: string]: { name: string; symbol: string } };
    idd?: { root: string; suffixes: string[] };
    capital?: string[];
    altSpellings?: string[];
    region: string;
    subregion?: string;
    languages?: { [key: string]: string };
    translations?: { [key: string]: { official: string; common: string } };
    latlng: number[];
    landlocked: boolean;
    borders?: string[];
    area: number;
    demonyms?: { [key: string]: { f: string; m: string } };
    flag: string;
    maps: { googleMaps: string; openStreetMaps: string };
    population: number;
    gini?: { [key: string]: number };
    fifa?: string;
    car?: { signs: string[]; side: string };
    timezones: string[];
    continents: string[];
    flags: { png: string; svg: string; alt?: string };
    coatOfArms: { png?: string; svg?: string };
    startOfWeek: string;
    capitalInfo?: { latlng: number[] };
    postalCode?: { format: string; regex: string };
}

export interface WikiSummary {
    title: string;
    extract: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
    content_urls?: {
        desktop: {
            page: string;
        };
    };
}

export interface FilterState {
    search: string;
    region: string;
    subregion: string;
    minPopulation: number;
    maxPopulation: number;
}
