import React from 'react';
import { Input } from './ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { X, Globe } from 'lucide-react';
import type { FilterState } from '../types';

interface FilterBarProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, search: e.target.value }));
    };

    const handleClearSearch = () => {
        setFilters((prev) => ({ ...prev, search: '' }));
    };

    const handleRegionChange = (value: string) => {
        setFilters((prev) => ({ ...prev, region: value === 'all' ? '' : value }));
    };

    return (
        <div className="w-full bg-slate-800 border-b border-slate-700 py-2 px-4 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto">
                {/* Mobile Layout: Two Rows */}
                <div className="md:hidden space-y-2">
                    {/* Row 1: Title */}
                    <div className="flex items-center justify-center gap-2 text-white">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <h1 className="text-base font-semibold tracking-tight">World Atlas Explorer</h1>
                    </div>
                    {/* Row 2: Search and Filter */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Search..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="pr-7 h-8 text-sm bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-500"
                            />
                            {filters.search && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                        <Select value={filters.region || 'all'} onValueChange={handleRegionChange}>
                            <SelectTrigger className="w-[120px] h-8 text-sm bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="Region" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600 text-white">
                                <SelectItem value="all">All Regions</SelectItem>
                                <SelectItem value="Africa">Africa</SelectItem>
                                <SelectItem value="Americas">Americas</SelectItem>
                                <SelectItem value="Asia">Asia</SelectItem>
                                <SelectItem value="Europe">Europe</SelectItem>
                                <SelectItem value="Oceania">Oceania</SelectItem>
                                <SelectItem value="Antarctic">Antarctic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Desktop Layout: Three Columns */}
                <div className="hidden md:grid grid-cols-3 items-center gap-4">
                    {/* Left: Search */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-full max-w-[240px]">
                            <Input
                                placeholder="Search countries..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="pr-8 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-500"
                            />
                            {filters.search && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Center: App Name */}
                    <div className="flex items-center justify-center gap-2 text-white">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <h1 className="text-lg font-semibold tracking-tight whitespace-nowrap">World Atlas Explorer</h1>
                    </div>

                    {/* Right: Region Filter */}
                    <div className="flex items-center justify-end gap-2">
                        <Select value={filters.region || 'all'} onValueChange={handleRegionChange}>
                            <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="Filter by Region" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600 text-white">
                                <SelectItem value="all">All Regions</SelectItem>
                                <SelectItem value="Africa">Africa</SelectItem>
                                <SelectItem value="Americas">Americas</SelectItem>
                                <SelectItem value="Asia">Asia</SelectItem>
                                <SelectItem value="Europe">Europe</SelectItem>
                                <SelectItem value="Oceania">Oceania</SelectItem>
                                <SelectItem value="Antarctic">Antarctic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
};
