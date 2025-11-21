import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from './ui/dialog';
import type { Country, WikiSummary } from '../types';
import { api } from '../services/api';
import { Separator } from './ui/separator';
import { Globe, Users, MapPin, Languages, Coins, Flag, Clock } from 'lucide-react';

// Helper function to get flag URL from country code
const getFlagUrl = (country: Country): string => {
    // Use flagcdn.com API with cca2 code
    if (country.cca2) {
        return `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`;
    }
    // Fallback to empty
    return '';
};

// Fallback for ScrollArea if not present
const ScrollAreaFallback = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`overflow-y-auto ${className}`}>{children}</div>
);

interface CountryDialogProps {
    country: Country | null;
    isOpen: boolean;
    onClose: () => void;
}

export const CountryDialog: React.FC<CountryDialogProps> = ({ country, isOpen, onClose }) => {
    const [wikiData, setWikiData] = useState<WikiSummary | null>(null);
    const [loading, setLoading] = useState(false);

    const [fullCountry, setFullCountry] = useState<Country | null>(null);

    useEffect(() => {
        if (country && isOpen) {
            setLoading(true);
            // Fetch Wikipedia data
            const wikiPromise = api.getCountryDetails(country.name.common);
            // Fetch full country data
            const countryPromise = api.getCountryByCode(country.cca3);

            Promise.all([wikiPromise, countryPromise]).then(([wiki, fullData]) => {
                setWikiData(wiki);
                if (fullData) setFullCountry(fullData);
                setLoading(false);
            });
        } else {
            setWikiData(null);
            setFullCountry(null);
        }
    }, [country, isOpen]);

    const displayCountry = fullCountry || country;

    if (!country) return null;

    // Helper function to format calling code
    const getCallingCode = () => {
        if (!displayCountry?.idd) return 'N/A';
        const { root, suffixes } = displayCountry.idd;
        if (!suffixes || suffixes.length === 0) return root || 'N/A';
        return `${root}${suffixes[0]}`;
    };

    // Helper function to get native names
    const getNativeNames = () => {
        const native = (displayCountry as any)?.name?.native || (displayCountry as any)?.name?.nativeName;
        if (!native) return null;
        return Object.entries(native).slice(0, 3).map(([lang, names]: [string, any]) => (
            <span key={lang} className="block text-sm">
                <span className="font-medium">{lang.toUpperCase()}:</span> {names.common}
            </span>
        ));
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-full sm:max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogTitle className="sr-only">{displayCountry?.name.common}</DialogTitle>
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
                    {/* Cover Image (Flag or Wiki Thumbnail) */}
                    <img
                        src={wikiData?.thumbnail?.source || getFlagUrl(displayCountry!)}
                        alt={displayCountry?.name.common}
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-bold text-white">{displayCountry?.name.common}</h2>
                            {(displayCountry as any)?.flag && (
                                <span className="text-4xl">{(displayCountry as any).flag}</span>
                            )}
                        </div>
                        <p className="text-white/80 text-lg">{displayCountry?.name.official}</p>
                    </div>
                </div>

                <ScrollAreaFallback className="flex-1 p-6">
                    <div className="space-y-6">
                        {/* All Information Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Geography */}
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">
                                    <Globe className="w-4 h-4" />
                                    Geography
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Region:</span> {displayCountry?.region}</p>
                                    {displayCountry?.subregion && (
                                        <p><span className="font-medium">Subregion:</span> {displayCountry.subregion}</p>
                                    )}
                                    <p><span className="font-medium">Capital:</span> {displayCountry?.capital?.join(', ') || 'N/A'}</p>
                                    {displayCountry?.area && (
                                        <p><span className="font-medium">Area:</span> {displayCountry.area.toLocaleString()} km²</p>
                                    )}
                                    {displayCountry?.latlng && (
                                        <p><span className="font-medium">Coordinates:</span> {displayCountry.latlng[0]}°, {displayCountry.latlng[1]}°</p>
                                    )}
                                    {(displayCountry as any)?.landlocked !== undefined && (
                                        <p><span className="font-medium">Landlocked:</span> {(displayCountry as any).landlocked ? 'Yes' : 'No'}</p>
                                    )}
                                    {(displayCountry as any)?.borders && (displayCountry as any).borders.length > 0 && (
                                        <p><span className="font-medium">Borders:</span> {(displayCountry as any).borders.join(', ')}</p>
                                    )}
                                </div>
                            </div>

                            {/* Demographics */}
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">
                                    <Users className="w-4 h-4" />
                                    Demographics
                                </h3>
                                <div className="space-y-1 text-sm">
                                    {displayCountry?.population && (
                                        <p><span className="font-medium">Population:</span> {displayCountry.population.toLocaleString()}</p>
                                    )}
                                    {displayCountry?.area && displayCountry?.population && (
                                        <p><span className="font-medium">Density:</span> {(displayCountry.population / displayCountry.area).toFixed(2)} /km²</p>
                                    )}
                                    {displayCountry?.demonyms?.eng && (
                                        <>
                                            <p><span className="font-medium">Demonym (M):</span> {displayCountry.demonyms.eng.m}</p>
                                            <p><span className="font-medium">Demonym (F):</span> {displayCountry.demonyms.eng.f}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Political */}
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">
                                    <Flag className="w-4 h-4" />
                                    Political
                                </h3>
                                <div className="space-y-1 text-sm">
                                    {(displayCountry as any)?.independent !== undefined && (
                                        <p><span className="font-medium">Independent:</span> {(displayCountry as any).independent ? 'Yes' : 'No'}</p>
                                    )}
                                    {(displayCountry as any)?.unMember !== undefined && (
                                        <p><span className="font-medium">UN Member:</span> {(displayCountry as any).unMember ? 'Yes' : 'No'}</p>
                                    )}
                                    {(displayCountry as any)?.status && (
                                        <p><span className="font-medium">Status:</span> {(displayCountry as any).status}</p>
                                    )}
                                    <p><span className="font-medium">ISO Codes:</span> {displayCountry?.cca2} / {displayCountry?.cca3}</p>
                                    {displayCountry?.ccn3 && (
                                        <p><span className="font-medium">Numeric Code:</span> {displayCountry.ccn3}</p>
                                    )}
                                </div>
                            </div>

                            {/* Languages */}
                            {displayCountry?.languages && Object.keys(displayCountry.languages).length > 0 && (
                                <div>
                                    <h3 className="flex items-center gap-2 font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">
                                        <Languages className="w-4 h-4" />
                                        Languages
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                        {Object.entries(displayCountry.languages).map(([code, name]) => (
                                            <p key={code}><span className="font-medium">{code.toUpperCase()}:</span> {name}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Currencies */}
                            {displayCountry?.currencies && Object.keys(displayCountry.currencies).length > 0 && (
                                <div>
                                    <h3 className="flex items-center gap-2 font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">
                                        <Coins className="w-4 h-4" />
                                        Currencies
                                    </h3>
                                    <div className="space-y-1 text-sm">
                                        {Object.entries(displayCountry.currencies).map(([code, curr]: [string, any]) => (
                                            <p key={code}><span className="font-medium">{code}:</span> {curr.name} ({curr.symbol})</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contact & Internet */}
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">
                                    <MapPin className="w-4 h-4" />
                                    Contact & Internet
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Calling Code:</span> {getCallingCode()}</p>
                                    {displayCountry?.tld && displayCountry.tld.length > 0 && (
                                        <p><span className="font-medium">TLD:</span> {displayCountry.tld.join(', ')}</p>
                                    )}
                                </div>
                            </div>

                            {/* Other Details */}
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">
                                    <Clock className="w-4 h-4" />
                                    Other Details
                                </h3>
                                <div className="space-y-1 text-sm">
                                    {(displayCountry as any)?.timezones && (displayCountry as any).timezones.length > 0 && (
                                        <p><span className="font-medium">Timezones:</span> {(displayCountry as any).timezones.slice(0, 3).join(', ')}{(displayCountry as any).timezones.length > 3 ? '...' : ''}</p>
                                    )}
                                    {(displayCountry as any)?.car?.side && (
                                        <p><span className="font-medium">Drives on:</span> {(displayCountry as any).car.side}</p>
                                    )}
                                    {(displayCountry as any)?.startOfWeek && (
                                        <p><span className="font-medium">Week starts:</span> {(displayCountry as any).startOfWeek}</p>
                                    )}
                                </div>
                            </div>

                            {/* Native Names */}
                            {getNativeNames() && (
                                <div>
                                    <h3 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider mb-2">
                                        Native Names
                                    </h3>
                                    <div className="space-y-1">
                                        {getNativeNames()}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* About Section - Now at the bottom */}
                        <Separator className="my-6" />
                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-xl font-semibold mb-2">About</h3>
                            {loading ? (
                                <div className="space-y-2 animate-pulse">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-4 bg-muted rounded w-full"></div>
                                    <div className="h-4 bg-muted rounded w-5/6"></div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground leading-relaxed">
                                    {wikiData?.extract || `No detailed summary available for ${displayCountry?.name.common}.`}
                                </p>
                            )}

                            {wikiData?.content_urls && (
                                <div className="mt-4">
                                    <a
                                        href={wikiData.content_urls.desktop.page}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm"
                                    >
                                        Read more on Wikipedia →
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollAreaFallback>
            </DialogContent>
        </Dialog>
    );
};
