import React from 'react';
import Container from '@mui/material/Container';
import Hero from './sections/HeroSection/Hero';
import FilterSessionSearch from './sections/Filters/FilterSessionSearch';
import DateFilter from './sections/DateFilterSection/DateFilter';
import { Box, useMediaQuery } from '@mui/material';
import FilmScheduleGrid from './sections/FilmScheduleGrid/FilmScheduleGrid';
import theme from '../../theme/theme';
import ModalFilters from './sections/ModalFiltersSection/ModalFilters';
import FilmAdaptiveScheduleGridItem from './sections/AdaptiveFilmGrid/FilmAdaptiveScheduleGridItem';

import MetaTags from './../../shared/components/MetaTag/MetaTags';
import Layout from '../../shared/components/Layout/Layout';

const SessionSearchPage: React.FC = () => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Layout>
      <MetaTags
        title="Пошук сеансів - Розклад кінотеатрів | MovieHub"
        description="Знайдіть актуальні сеанси у вашому місті..."
      />
      <Container>
        <Hero />
        {!isSmallScreen ? (
          <>
            <FilterSessionSearch />
            <Box sx={{ display: 'flex', pt: '15px', gap: '15px' }}>
              <DateFilter />
              <FilmScheduleGrid />
            </Box>
          </>
        ) : (
          <>
            <FilmAdaptiveScheduleGridItem />
            <ModalFilters />
          </>
        )}
      </Container>
    </Layout>
  );
};

export default SessionSearchPage;
