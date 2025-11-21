import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { Country } from '../types';

interface CountryHoverCardProps {
    country: Country;
    position: { x: number; y: number };
}

export const CountryHoverCard: React.FC<CountryHoverCardProps> = ({ country, position }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: position.y + 20,
                left: position.x + 20,
                zIndex: 50,
                pointerEvents: 'none',
            }}
        >
            <Card className="w-64 shadow-lg bg-card/95 backdrop-blur animate-in fade-in zoom-in duration-200">
                <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-3">
                        <img
                            src={country.flags.svg}
                            alt={`${country.name.common} flag`}
                            className="w-8 h-6 object-cover rounded shadow-sm"
                        />
                        <CardTitle className="text-lg font-bold leading-none">
                            {country.name.common}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-sm text-muted-foreground">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="font-semibold text-foreground">Region:</span> {country.region}
                        </div>
                        <div>
                            <span className="font-semibold text-foreground">Pop:</span>{' '}
                            {(country.population / 1000000).toFixed(1)}M
                        </div>
                        <div className="col-span-2">
                            <span className="font-semibold text-foreground">Capital:</span>{' '}
                            {country.capital?.[0] || 'N/A'}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
