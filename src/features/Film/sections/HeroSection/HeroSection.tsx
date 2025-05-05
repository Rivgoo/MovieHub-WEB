import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import styles from './HeroSection.module.css';

interface HeroSectionProps { 

 // Тут будуть пропси для даних: title, tagline, backdropUrl etc.
  // backdropUrl?: string;
 }

const HeroSection: React.FC<HeroSectionProps> = (props) => {

    // const { backdropUrl } = props; 
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePlayTrailer = () => {
    console.log('Play Trailer');
  };

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  
  return (
    <Box className={styles.heroWrapper}>
      <Container maxWidth="lg" className={styles.heroContentContainer}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
          <Box className={styles.textBlock}>
            <Typography variant="h2" component="h1" className={styles.heroTitle}>
              Назва Фільму
            </Typography>
            <Typography variant="h6" component="p" paragraph className={styles.heroTagline}>
              Короткий опис фільму...
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Tooltip title={isFavorite ? "Видалити з бажаного" : "Додати в бажане"}>
              <IconButton
                aria-label={isFavorite ? "Видалити з бажаного" : "Додати в бажане"}
                onClick={handleToggleFavorite}
                className={`${styles.actionButton} ${styles.favoriteButtonControl} ${isFavorite ? styles.favoriteActive : ''}`}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Дивитися трейлер">
              <IconButton
                aria-label="Дивитися трейлер"
                onClick={handlePlayTrailer}
                className={styles.actionButton}
              >
                <PlayCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
