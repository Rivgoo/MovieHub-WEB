import React, { useState } from 'react';

import Layout from '../../../shared/components/Layout.tsx';
import SearchForm from './blocks/SearchForm/SearchForm.tsx';
import FilterBar from './blocks/FilterBar/FilterBar.tsx';
import FilmGrid from './blocks/FilmGrid/FilmGrid.tsx';
import { ContentFilterResponse } from '../../../core/api/types/types.content.ts';

const FilmSearchPage: React.FC = () => {
  const [films, setFilms] = useState<ContentFilterResponse | undefined>(
    undefined
  );

  return (
    <Layout>
      <SearchForm onSearchResults={setFilms} />
      <FilterBar />
      <FilmGrid films={films} filters={[]} />
    </Layout>
  );
};

export default FilmSearchPage;
