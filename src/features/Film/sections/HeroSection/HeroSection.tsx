
import React from 'react'; 
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite'; 
import CircularProgress from '@mui/material/CircularProgress'; 
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  title?: string;
  tagline?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  isFavorite: boolean;         
  onToggleFavorite: () => void;  
  favoriteLoading: boolean;    
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  tagline,
  backdropUrl,
  trailerUrl,
  isFavorite,       
  onToggleFavorite,  
  favoriteLoading,    
}) => {


  const handlePlayTrailer = () => {
    if (trailerUrl) {
      window.open(trailerUrl, '_blank');
    } else {
      console.log('Play Trailer - URL не надано');
    }
  };

  

  return (
    <Box
      className={styles.heroSection_wrapper}
      sx={{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined }}
    >
      <Container maxWidth="lg" className={styles.heroSection_contentContainer}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
          <Box className={styles.heroSection_textBlock}>
            <Typography variant="h2" component="h1" className={styles.heroSection_title}>
              {title || "Назва Фільму..."}
            </Typography>
            {tagline && (
              <Typography variant="h6" component="p" paragraph className={styles.heroSection_tagline}>
                {tagline}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Tooltip title={isFavorite ? "Видалити з бажаного" : "Додати в бажане"}>
             
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  aria-label={isFavorite ? "Видалити з бажаного" : "Додати в бажане"}
                  onClick={onToggleFavorite} 
                  disabled={favoriteLoading} 
                  className={`${styles.heroSection_actionButton} ${styles.heroSection_favoriteButtonControl} ${isFavorite ? styles.heroSection_favoriteActive : ''}`}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
            
                {favoriteLoading && (
                  <CircularProgress
                    size={52} 
                    sx={{
                      color: 'primary.main', 
                      position: 'absolute',
                      top: 0,     
                      left: 0,
                      zIndex: 1, 
                    }}
                  />
                )}
              </Box>
            </Tooltip>
            <Tooltip title="Дивитися трейлер">
              <IconButton
                aria-label="Дивитися трейлер"
                onClick={handlePlayTrailer}
                className={styles.heroSection_actionButton}
                disabled={!trailerUrl || favoriteLoading} 
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