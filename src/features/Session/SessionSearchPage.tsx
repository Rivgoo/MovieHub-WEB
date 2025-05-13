import React from 'react';
import Container from '@mui/material/Container';
import Layout from '../../shared/components/Layout';
import Hero from './sections/HeroSection/Hero';
import FilterSessionSearch from './sections/Filters/FilterSessionSearch';
import DateFilter from './sections/DateFilterSection/DateFilter';
import { Box, useMediaQuery } from '@mui/material';
import FilmScheduleGrid from './sections/FilmScheduleGrid/FilmScheduleGrid';
import theme from '../../theme/theme';
import ModalFilters from './sections/ModalFiltersSection/ModalFilters';
import FilmAdaptiveScheduleGridItem from './sections/AdaptiveFilmGrid/FilmScheduleGrid';

const SessionSearchPage: React.FC = () => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Layout>
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
