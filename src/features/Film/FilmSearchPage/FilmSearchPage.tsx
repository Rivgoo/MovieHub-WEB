import React from 'react';
import Layout from '../../../shared/components/Layout/Layout.tsx';
import MetaTags from '../../../shared/components/MetaTag/MetaTags';
import { Container, useMediaQuery } from '@mui/material';
import theme from '../../../theme/theme.tsx';
import HeroSection from './sections/HeroSection/HeroSection.tsx';
import FilterSection from './sections/FilterSection/FilterSection.tsx';
import FilmGridSection from './sections/FilmGridSection/FilmGridSection.tsx';

const FilmSearchPage: React.FC = () => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Layout>
      <MetaTags
        title="Пошук фільмів - Знайдіть ідеальний фільм | MovieHub"
        description="Шукайте фільми за назвою, жанром, роком випуску та іншими критеріями..."
      />
      <Container>
        <HeroSection />
        <FilterSection />
        <FilmGridSection />
      </Container>
    </Layout>
  );
};
export default FilmSearchPage;
