import React from 'react';
import Layout from '../../../shared/components/Layout/Layout.tsx';
import SearchForm from './blocks/SearchForm/SearchForm.tsx';
import FilmGrid from './blocks/FilmGrid/FilmGrid.tsx';
import MetaTags from '../../../shared/components/MetaTag/MetaTags';
import { useMediaQuery } from '@mui/material';
import theme from '../../../theme/theme.tsx';

const FilmSearchPage: React.FC = () => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Layout>
      <MetaTags
        title="Пошук фільмів - Знайдіть ідеальний фільм | MovieHub"
        description="Шукайте фільми за назвою, жанром, роком випуску та іншими критеріями..."
      />
    </Layout>
  );
};
export default FilmSearchPage;
