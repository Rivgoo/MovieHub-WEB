import React, { useState, useCallback } from 'react';

import Layout from '../../../shared/components/Layout.tsx';
import SearchForm from './blocks/SearchForm/SearchForm.tsx';
import FilterBar from './blocks/FilterBar/FilterBar.tsx';
import FilmGrid from './blocks/FilmGrid/FilmGrid.tsx';
import { ContentFilterResponse } from '../../../core/api/types/types.content.ts';

const FilmSearchPage: React.FC = () => {
  const [films, setFilms] = useState<ContentFilterResponse | undefined>(
    undefined
  );
  const handleSearchResults = useCallback(
    (results: ContentFilterResponse | null) => {
      setFilms(results ?? undefined);
    },
    [setFilms]
  );

  return (
    <Layout>
      <SearchForm onSearchResults={handleSearchResults} />
      <FilterBar />
      <FilmGrid films={films} filters={[]} />
    </Layout>
  );
};

export default FilmSearchPage;
