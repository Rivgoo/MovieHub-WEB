import React, { useState } from 'react';

import Layout from '../../../shared/components/Layout.tsx';
import SearchForm from './blocks/SearchForm/SearchForm.tsx';
import FilmGrid from './blocks/FilmGrid/FilmGrid.tsx';

const FilmSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  return (
    <Layout>
      <SearchForm setSearchQuery={setSearchQuery} />
      <FilmGrid searchQuery={searchQuery} />
    </Layout>
  );
};

export default FilmSearchPage;
