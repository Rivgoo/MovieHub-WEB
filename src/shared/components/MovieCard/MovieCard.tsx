import React from 'react';
import { Card, CardMedia, Typography, Box, Tooltip } from '@mui/material'; 
import { useNavigate } from 'react-router-dom';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { MovieCardDto } from '../../../core/api/types/types.home';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  movie: MovieCardDto;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/film/${movie.id}`);
  };

  const formatDuration = (totalMinutes: number | undefined): string => {
    if (totalMinutes === undefined || totalMinutes <= 0) return '';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours > 0 ? `${hours}год ` : ''}${minutes > 0 ? `${minutes}хв` : ''}`.trim();
  };

  const displayRating = movie.vote_average && movie.vote_average > 0
    ? (movie.vote_average > 10 ? movie.vote_average / 10 : movie.vote_average).toFixed(1) 
    : null;

  const displayDuration = formatDuration(movie.durationMinutes);

  return (
   <Card className={styles.movieCard} onClick={handleCardClick} title={movie.title}> 
  <CardMedia
    component="div"
    className={styles.movieCard__mediaBackground}
    image={movie.posterUrl || 'https://via.placeholder.com/200x300/222222/666666?text=Poster'}
  />
  <Box className={styles.movieCard__overlay} />
  <Box className={styles.movieCard__contentOverlay}>
    <Tooltip title={movie.title} placement="bottom-start" enterDelay={500}>
      <Typography
        variant="subtitle1"
        component="div"
        className={styles.movieCard__title}
      >
        {movie.title}
      </Typography>
    </Tooltip>
    <Box className={styles.movieCard__meta}>
      {displayRating && (
        <Box className={styles.movieCard__metaItem} title={`Рейтинг: ${displayRating}`}>
          <StarBorderIcon sx={{ fontSize: '0.9rem', mr: 0.25 }} />
          <Typography variant="caption">{displayRating}</Typography>
        </Box>
      )}
      {displayDuration && (
        <Box className={styles.movieCard__metaItem} title={`Тривалість: ${displayDuration}`}>
          <AccessTimeIcon sx={{ fontSize: '0.9rem', mr: 0.25 }} />
          <Typography variant="caption">{movie.durationMinutes} хв</Typography> 
        </Box>
      )}
    </Box>
  </Box>
</Card>

  );
};

export default MovieCard;