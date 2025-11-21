import { useEffect, useState, useMemo } from 'react';
import { api } from './services/api';
import type { Country, FilterState } from './types';
import { WorldMap } from './components/WorldMap';
import { FilterBar } from './components/FilterBar';
import { CountryDialog } from './components/CountryDialog';
import { Footer } from './components/Footer';
import { Loader2 } from 'lucide-react';

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    region: '',
    subregion: '',
    minPopulation: 0,
    maxPopulation: 0,
  });

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadCountries = async () => {
      setLoading(true);
      const data = await api.getAllCountries();
      setCountries(data);
      setLoading(false);
    };
    loadCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch = country.name.common.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRegion = filters.region ? country.region === filters.region : true;
      return matchesSearch && matchesRegion;
    });
  }, [countries, filters]);



  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-4 text-lg font-medium">Loading World Data...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground">
      <FilterBar filters={filters} setFilters={setFilters} />

      <div className="flex-1 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <WorldMap
          countries={filteredCountries}
          onCountryClick={handleCountryClick}
        />
      </div>

      <CountryDialog
        country={selectedCountry}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <Footer />
    </div>
  );
}

export default App;
