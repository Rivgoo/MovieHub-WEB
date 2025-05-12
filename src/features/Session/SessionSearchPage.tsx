import React from 'react';
import Container from '@mui/material/Container';
import Layout from '../../shared/components/Layout';
import Hero from './sections/HeroSection/Hero';
import FilterSessionSearch from './sections/Filters/FilterSessionSearch';
import DateFilter from './sections/DateFilterSection/DateFilter';

const SessionSearchPage: React.FC = () => {
  return (
    <Layout>
      <Container>
        <Hero />
        <FilterSessionSearch />
        <DateFilter />
      </Container>
    </Layout>
  );
};

export default SessionSearchPage;
