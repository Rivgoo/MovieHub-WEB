import React from 'react';
import Container from '@mui/material/Container';
import Layout from '../../shared/components/Layout';
import Hero from './sections/HeroSection/Hero';
import FilterSessionSearch from './sections/Filters/FilterSessionSearch';
import DateFilter from './sections/DateFilterSection/DateFilter';
import { Box } from '@mui/material';
import FilmScheduleGrid from './sections/FilmScheduleGrid/FilmScheduleGrid';

const SessionSearchPage: React.FC = () => {
  return (
    <Layout>
      <Container>
        <Hero />
        <FilterSessionSearch />
        <Box sx={{ display: 'flex', pt: '15px', gap: '15px' }}>
          <DateFilter />
          <FilmScheduleGrid />
        </Box>
      </Container>
    </Layout>
  );
};

export default SessionSearchPage;
