import React from 'react';

import Layout from '../../../shared/components/Layout.tsx';
import SearchForm from './blocks/SearchForm/SearchForm.tsx';
import FilterBar from './blocks/FilterBar/FilterBar.tsx';

const FilmSearchPage: React.FC = () => {
  return (
    <Layout>
      <SearchForm />
      <FilterBar />
    </Layout>
  );
};

export default FilmSearchPage;
