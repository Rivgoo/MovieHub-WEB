
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Layout from '../../shared/components/Layout/Layout';
import HomeHeroSlider from '../../shared/components/HomeHeroSlider/HomeHeroSlider'; 
import MoviesCarousel from '../../shared/components/MoviesCarousel/MoviesCarousel';

import { getFeaturedMoviesForHero, getPopularMoviesList, getNowPlayingMoviesList } from '../../core/api/homePageApi'; 
import { HeroMovieDto, MovieCardDto } from '../../core/api/types/types.home'; 

const HomePage: React.FC = () => {
  const [heroMovies, setHeroMovies] = useState<HeroMovieDto[]>([]);
  const [popularMovies, setPopularMovies] = useState<MovieCardDto[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<MovieCardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      setError(null);
      try {
     
        const [heroData, popularData, nowPlayingData] = await Promise.all([
          getFeaturedMoviesForHero({ limit: 5 }), 
          getPopularMoviesList({ pageSize: 10 }),   
          getNowPlayingMoviesList({ pageSize: 10 }) 
        ]);

        setHeroMovies(heroData || []);
        setPopularMovies(popularData || []);
        setNowPlayingMovies(nowPlayingData || []);

      } catch (err: any) {
        console.error("Failed to fetch homepage data:", err);
        setError(err.message || "Не вдалося завантажити дані для головної сторінки.");
      } finally {
        setLoading(false);
      }
    };
    fetchHomePageData();
  }, []);

  if (loading) {
    return <Layout><Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 128px)' }}><CircularProgress /></Container></Layout>;
  }
  if (error) {
    return <Layout><Container sx={{ py: 5 }}><Alert severity="error">{error}</Alert></Container></Layout>;
  }

  return (
    <Layout>
    
      {heroMovies.length > 0 && <HomeHeroSlider movies={heroMovies} />}

    
      {popularMovies.length > 0 && (
        <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4 } }}>
     
         <MoviesCarousel title="Популярні фільми" movies={popularMovies} />
      </Container>
      )}

     
      {nowPlayingMovies.length > 0 && (
       
        <Box sx={{ bgcolor: 'secondary.main', py: { xs: 3, sm: 4 } }}>
            <Container maxWidth="xl">
              <MoviesCarousel title="Зараз у кіно" movies={nowPlayingMovies} />
        </Container>
        </Box>
      )}

   
    </Layout>
  );
};

export default HomePage;