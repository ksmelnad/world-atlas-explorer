import React, { useMemo } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Sphere,
    Graticule,
} from 'react-simple-maps';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from './ui/hover-card';
import type { Country } from '../types';

// URL to the world map TopoJSON
const GEO_URL = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

interface WorldMapProps {
    countries: Country[];
    onCountryClick: (country: Country) => void;
}

// Helper function to get flag URL from country code
const getFlagUrl = (country: Country): string => {
    // Use flagcdn.com API with cca2 code
    if (country.cca2) {
        return `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`;
    }
    // Fallback to a placeholder or empty
    return '';
};

export const WorldMap: React.FC<WorldMapProps> = ({
    countries,
    onCountryClick,
}) => {
    // Create a map of ISO codes to country data for O(1) lookup
    // Also create a name-based map since TopoJSON uses country names
    const countryMap = useMemo(() => {
        const map = new Map<string, Country>();
        const nameMap = new Map<string, Country>();

        countries.forEach((c) => {
            // Map by ISO codes
            if (c.cca3) map.set(c.cca3, c);
            if (c.cca2) map.set(c.cca2, c);
            if (c.ccn3) map.set(c.ccn3, c);

            // Map by country names (normalized to lowercase for case-insensitive matching)
            nameMap.set(c.name.common.toLowerCase(), c);
            nameMap.set(c.name.official.toLowerCase(), c);
        });

        return { codeMap: map, nameMap };
    }, [countries]);

    return (
        <div className="w-full h-full bg-slate-900" data-tip="">
            <ComposableMap
                projectionConfig={{
                    rotate: [-10, 0, 0],
                    scale: 147,
                }}
                className="w-full h-full"
            >
                <ZoomableGroup center={[0, 0]} zoom={1}>
                    <Sphere stroke="#E4E5E6" strokeWidth={0.5} id="sphere" fill="transparent" />
                    <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
                    <Geographies geography={GEO_URL}>
                        {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo: any) => {
                                // Debug: Log the first geography object to see available properties
                                if (geo.rsmKey === '0') {
                                    console.log('Sample geography object:', geo);
                                    console.log('Available properties:', geo.properties);
                                }

                                // Try to find the country by name from TopoJSON properties
                                let country: Country | undefined;

                                if (geo.properties?.name) {
                                    const geoName = geo.properties.name.toLowerCase();
                                    country = countryMap.nameMap.get(geoName);

                                    // Handle special cases where TopoJSON names differ from our data
                                    if (!country) {
                                        // Try some common name variations
                                        if (geoName.includes('united states')) {
                                            country = countryMap.nameMap.get('united states of america');
                                        } else if (geoName === 'dem. rep. congo') {
                                            country = countryMap.nameMap.get('dr congo');
                                        } else if (geoName === 'dominican rep.') {
                                            country = countryMap.nameMap.get('dominican republic');
                                        } else if (geoName === 'eq. guinea') {
                                            country = countryMap.nameMap.get('equatorial guinea');
                                        } else if (geoName === 's. sudan') {
                                            country = countryMap.nameMap.get('south sudan');
                                        } else if (geoName === 'côte d\'ivoire') {
                                            country = countryMap.nameMap.get('ivory coast');
                                        }
                                    }
                                }

                                // Fallback: try ISO codes if available
                                if (!country) {
                                    country = countryMap.codeMap.get(geo.id) ||
                                        countryMap.codeMap.get(geo.properties?.ISO_A3) ||
                                        countryMap.codeMap.get(geo.properties?.ADM0_A3) ||
                                        countryMap.codeMap.get(geo.properties?.ISO_A2);
                                }

                                return (
                                    <HoverCard key={geo.rsmKey} openDelay={200} closeDelay={100}>
                                        <HoverCardTrigger asChild>
                                            <g
                                                onClick={() => {
                                                    if (country) {
                                                        onCountryClick(country);
                                                    }
                                                }}
                                                style={{ cursor: country ? 'pointer' : 'default' }}
                                            >
                                                <Geography
                                                    geography={geo}
                                                    style={{
                                                        default: {
                                                            fill: country ? (country.region === 'Africa' ? '#ffcc00' :
                                                                country.region === 'Asia' ? '#ff6666' :
                                                                    country.region === 'Europe' ? '#66ccff' :
                                                                        country.region === 'Americas' ? '#66ff66' :
                                                                            country.region === 'Oceania' ? '#cc66ff' : "#D6D6DA") : "#F5F4F6",
                                                            stroke: "#FFFFFF",
                                                            strokeWidth: 0.5,
                                                            outline: "none",
                                                            transition: "all 0.2s",
                                                        },
                                                        hover: {
                                                            fill: "#F53", // Highlight color
                                                            stroke: "#FFFFFF",
                                                            strokeWidth: 0.75,
                                                            outline: "none",
                                                        },
                                                        pressed: {
                                                            fill: "#E42",
                                                            stroke: "#FFFFFF",
                                                            strokeWidth: 0.75,
                                                            outline: "none",
                                                        },
                                                    }}
                                                />
                                            </g>
                                        </HoverCardTrigger>
                                        {country && (
                                            <HoverCardContent className="w-64 p-0 overflow-hidden border-none shadow-xl">
                                                <div className="flex flex-col">
                                                    <div className="relative h-24 bg-muted">
                                                        <img
                                                            src={getFlagUrl(country)}
                                                            alt={country.name.common}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2">
                                                            <h4 className="text-white font-bold text-lg leading-none">{country.name.common}</h4>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-card">
                                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                                            <div>
                                                                <span className="text-muted-foreground text-xs">Capital</span>
                                                                <p className="font-medium truncate">{country.capital?.[0] || 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground text-xs">Region</span>
                                                                <p className="font-medium">{country.region}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </HoverCardContent>
                                        )}
                                    </HoverCard>
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </div>
    );
};
