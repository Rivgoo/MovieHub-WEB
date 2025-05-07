import React, { useEffect, useState } from 'react';

import Layout from '../../../shared/components/Layout.tsx';
import SearchForm from './blocks/SearchForm/SearchForm.tsx';
import FilmGrid from './blocks/FilmGrid/FilmGrid.tsx';

const FilmSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const [initialFilters, setInitialFilters] = useState<Record<string, string>>(
    {}
  );
  const [initialSearch, setInitialSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filters: Record<string, string> = {};

    const searchTerm = params.get('SearchTerms') || '';
    setInitialSearch(searchTerm);

    for (const [key, value] of params.entries()) {
      switch (key) {
        case 'MinRating':
          filters['availableRate'] = value;
          break;
        case 'GenreIds':
          filters['genreId'] = value;
          break;
        case 'HasSessions':
          filters['availableInCinema'] = value;
          break;
        case 'Duration':
        case 'MinDuration':
        case 'MaxDuration':
          filters['duration'] = mapDurationFromQuery(key, value);
          break;
        case 'MinReleaseYear':
          filters['releaseYear'] = String(Number(value) + 1);
          break;
        default:
          break;
      }
    }

    const cleanedQuery = location.search.startsWith('?')
      ? location.search
      : `?${location.search}`;
    setSearchQuery(cleanedQuery);
    setInitialFilters(filters);
  }, [location.search]);

  const mapDurationFromQuery = (key: string, val: string) => {
    if (key === 'MaxDuration' && val === '90') return 'short';
    if (key === 'Duration' && val === '120') return 'medium';
    if (key === 'MinDuration' && val === '150') return 'long';
    return '';
  };

  return (
    <Layout>
      <SearchForm
        setSearchQuery={setSearchQuery}
        initialFilters={initialFilters}
        initialSearch={initialSearch}
      />
      <FilmGrid searchQuery={searchQuery} />
    </Layout>
  );
};

export default FilmSearchPage;
