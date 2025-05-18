import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Container,
  Paper,
  MobileStepper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';
import { HeroMovieDto } from '../../../core/api/types/types.home';
import styles from './HomeHeroSlider.module.css';

interface HomeHeroSliderProps {
  movies: HeroMovieDto[];
  autoplayInterval?: number;
}

const HomeHeroSlider: React.FC<HomeHeroSliderProps> = ({ movies, autoplayInterval = 7000 }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = movies.length;

  const handleNext = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % maxSteps);
  }, [maxSteps]);

  const handleBack = () => {
    setActiveStep((prev) => (prev - 1 + maxSteps) % maxSteps);
  };

  useEffect(() => {
    if (autoplayInterval && maxSteps > 1) {
      const timer = setInterval(handleNext, autoplayInterval);
      return () => clearInterval(timer);
    }
  }, [handleNext, autoplayInterval, maxSteps]);

  if (!movies || maxSteps === 0) {
    return (
      <Paper
        elevation={0}
        square
        className={styles['homehero-sliderWrapper']}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: { xs: '50vh', md: '70vh' },
        }}
      >
        <Typography>Немає фільмів для слайдера</Typography>
      </Paper>
    );
  }

  const currentMovie = movies[activeStep];

  const handleGoToSession = (e: React.MouseEvent, Id: string | number) => {
    e.stopPropagation();
    navigate(`/film/${Id}`);
  };

  const formatDuration = (totalMinutes: number | undefined): string => {
    if (!totalMinutes || totalMinutes <= 0) return 'N/A';
    return `${totalMinutes} хв`;
  };

  const handleBannerClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/film/${currentMovie.id}`);
  };

  return (
    <Paper elevation={0} square className={styles['homehero-sliderWrapper']}>
      <Box
        className={styles['homehero-slideItem']}
        onClick={handleBannerClick}
        sx={{
          backgroundImage: currentMovie.backdropUrl
            ? `url(${currentMovie.backdropUrl})`
            : `url('https://dummyimage.com/1280x720/303030/fff.png&text=Фон+Фільму')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className={styles['homehero-slideItem_before']} />

        <Container
          maxWidth="lg"
          className={styles['homehero-slideContentContainer']}
          sx={{ zIndex: 2 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              width: '100%',
              gap: 0.5,
            }}
          >
            <Box className={styles['homehero-slideTextBlock']}>
              <Typography variant="h2" component="h1" className={styles['homehero-slideTitle']}>
                {currentMovie.title}
              </Typography>

              <Box className={styles['homehero-slideMeta']}>
                {currentMovie.rating !== undefined && currentMovie.rating > 0 && (
                  <Box className={styles['homehero-slideMetaItem']}>
                    <StarBorderIcon
                      sx={{ fontSize: '1.1rem', mr: 0.5, verticalAlign: 'bottom' }}
                    />
                    {currentMovie.rating.toFixed(1)}/10
                  </Box>
                )}
                {currentMovie.durationMinutes && currentMovie.durationMinutes > 0 && (
                  <Box className={styles['homehero-slideMetaItem']}>
                    <AccessTimeIcon
                      sx={{ fontSize: '1.1rem', mr: 0.5, verticalAlign: 'bottom' }}
                    />
                    {formatDuration(currentMovie.durationMinutes)}
                  </Box>
                )}
              </Box>
            </Box>

          <Box>
            <Button
                variant="contained" 
                startIcon={<ConfirmationNumberOutlinedIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.2rem' } }} />}
                onClick={(e) => handleGoToSession(e, currentMovie.id)}
                sx={{
                  borderRadius: '25px',
                  padding: { xs: '0.6rem 1.5rem', sm: '0.75rem 2rem' },
                  fontSize: { xs: '0.9rem', sm: '1rem' }, 
                  fontWeight: 'bold',
                  textTransform: 'none',
                  backgroundColor: theme.palette.primary.main,
                  color: 'var(--text-light)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
            
              >
                Обрати сеанс
              </Button>
        </Box>
      </Box>
        </Container>
      </Box>

      {maxSteps > 1 && (
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          variant="dots"
          className={styles['homehero-mobileStepperControls']}
          nextButton={
            <IconButton
              size="small"
              onClick={handleNext}
              className={styles['homehero-stepperNavButton']}
            >
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
          }
          backButton={
            <IconButton
              size="small"
              onClick={handleBack}
              className={styles['homehero-stepperNavButton']}
            >
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
          }
        />
      )}
    </Paper>
  );
};

export default HomeHeroSlider;
