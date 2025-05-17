import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import HorizontalScroller from '../Scroller/HorizontalScroller';
import MovieCard from '../MovieCard/MovieCard';
import { MovieCardDto } from '../../../core/api/types/types.home';
import styles from './MoviesCarousel.module.css';

interface MoviesCarouselProps {
  title: string;
  movies: MovieCardDto[] | null;
  loading?: boolean;
}

const MoviesCarousel: React.FC<MoviesCarouselProps> = ({ title, movies, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box className={styles.movieCarousel__carouselWrapper}>
        <Typography variant="h5" component="h3" className={styles.movieCarousel__carouselTitle}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <Typography sx={{color: 'text.secondary'}}>Завантаження фільмів...</Typography>
        </Box>
      </Box>
    );
  }

  if (!movies || movies.length === 0) { 
    return (
     <Box className={styles.movieCarousel__carouselWrapper}>
        <Typography variant="h5" component="h3" className={styles.movieCarousel__carouselTitle}>
          {title}
        </Typography>
        <Typography sx={{color: 'text.secondary', textAlign: 'center', py: 3}}>
             Наразі немає фільмів у цій категорії.
         </Typography>
     </Box>
    );
  }

  return (
    <Box className={styles.movieCarousel__carouselWrapper}>
      <Typography variant="h4" component="h2" className={styles.movieCarousel__carouselTitle}>
        {title}
      </Typography>
      <HorizontalScroller
        sx={{
          '& .horizontal-scroller-content': {
            gap: {
              xs: theme.spacing(1.5),
              sm: theme.spacing(2),
              md: theme.spacing(3)
            },
            paddingLeft: {
              xs: theme.spacing(1),
              sm: theme.spacing(2)
            },
            paddingRight: {
              xs: theme.spacing(5),
              sm: theme.spacing(6)
            },
          }
        }}
        scrollAmount={300}
      >
        {movies!.map((movie) => ( 
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </HorizontalScroller>
    </Box>
  );
};

export default MoviesCarousel;
