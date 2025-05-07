import React, { useState, useCallback } from 'react';

import Layout from '../../../shared/components/Layout.tsx';
import SearchForm from './blocks/SearchForm/SearchForm.tsx';
import FilmGrid from './blocks/FilmGrid/FilmGrid.tsx';
import { ContentFilterResponse } from '../../../core/api/types/types.content.ts';

const FilmSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  return (
    <Layout>
      <SearchForm searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FilmGrid searchQuery={searchQuery} />
    </Layout>
  );
};

export default FilmSearchPage;
