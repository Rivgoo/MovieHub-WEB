import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import Layout from '../../shared/components/Layout/Layout';
import { useTheme } from '@mui/material/styles';
import HeroSection from './sections/HeroSection/HeroSection';
import ContentSection from './sections/ContentSection/ContentSection';
import ActorsSection from './sections/ActorsSection/ActorsSection';
import { Fade, Container, CircularProgress, Alert, Snackbar, IconButton as MuiIconButton } from '@mui/material'
import { getProcessedFilmDetailsById } from '../../core/api/filmApi';
import { ProcessedFilmDetails } from '../../core/api/types/types.film';
import { useAuth } from '../../core/auth/useAuth';
import { addToFavoritesAPI, removeFromFavoritesAPI, checkIfFavoriteAPI } from '../../core/api/favoriteApi';


const FilmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); 
  const theme = useTheme();
  const { user, token } = useAuth(); 

  const footerRef = useRef<HTMLElement | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(true);

  const [filmDetails, setFilmDetails] = useState<ProcessedFilmDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentlyFavorite, setIsCurrentlyFavorite] = useState(false);
  const [favoriteActionLoading, setFavoriteActionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);


  useEffect(() => {
      const footerElement = document.querySelector('footer');
      if (footerElement) footerRef.current = footerElement;
      else console.warn("Footer element not found for Intersection Observer.");
  }, []);
  useEffect(() => {
    const currentFooterRef = footerRef.current;
    if (!currentFooterRef || typeof IntersectionObserver === 'undefined' || window.innerHeight < 300) return;
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => setShowFloatingButton(!entry.isIntersecting));
    };
    const observer = new IntersectionObserver(observerCallback, { root: null, rootMargin: '0px', threshold: 0.01 });
    observer.observe(currentFooterRef);
    return () => { if (currentFooterRef) observer.unobserve(currentFooterRef); };
  }, []);

  useEffect(() => {
    if (!id) {
      setError("ID фільму не вказано в URL.");
      setLoading(false);
      return;
    }

    let isMounted = true; 

    const fetchFilmDataAndFavoriteStatus = async () => {
      setLoading(true);
      setError(null);
      setFilmDetails(null);
      setIsCurrentlyFavorite(false); 

      try {
     
        const filmData = await getProcessedFilmDetailsById(id);
        if (!isMounted) return;
        setFilmDetails(filmData);

      
        if (user && token && filmData && filmData.id) { 
          try {
            console.log(`Checking favorite status for film ID: ${filmData.id}`);
            const favoriteStatus = await checkIfFavoriteAPI(filmData.id); 
            if (isMounted) {
              setIsCurrentlyFavorite(favoriteStatus);
              console.log(`Film ID: ${filmData.id}, isFavorite status from API: ${favoriteStatus}`);
            }
          } catch (favStatusError) {
            console.error("Помилка отримання статусу обраного:", favStatusError);
           
            if (isMounted) setIsCurrentlyFavorite(false);
          }
        } else if (isMounted) {
        
          setIsCurrentlyFavorite(false);
        }

      } catch (err: any) {
        if (isMounted) setError(err.message || "Сталася невідома помилка при завантаженні фільму.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFilmDataAndFavoriteStatus();

    return () => { 
      isMounted = false;
    };
  }, [id, user, token]); 
  const handleSelectSession = () => {
    console.log('Обрати сеанс для фільму ID:', id);
    if (id) navigate(`/session-search?filmId=${id}`); 
  };


  const handleToggleFavorite = async () => {
    if (!user) {
      setSnackbarMessage("Будь ласка, увійдіть або зареєструйтеся, щоб додати фільм в обране.");
      setSnackbarOpen(true);
      return;
    }
    if (!filmDetails || favoriteActionLoading || !id) return;

    setFavoriteActionLoading(true);
    try {
      if (isCurrentlyFavorite) {
        await removeFromFavoritesAPI(id); 
        setSnackbarMessage(`"${filmDetails.title}" видалено з обраних.`);
      } else {
        await addToFavoritesAPI(id); 
        setSnackbarMessage(`"${filmDetails.title}" додано в обрані!`);
      }
      setIsCurrentlyFavorite(!isCurrentlyFavorite); 
      setSnackbarOpen(true);
    } catch (err: any) {
      console.error("Помилка зміни статусу обраного:", err);
      setSnackbarMessage(err.message || "Не вдалося оновити статус обраного. Спробуйте пізніше.");
      setSnackbarOpen(true);
      
    } finally {
      setFavoriteActionLoading(false);
    }
  };

  const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleLoginRedirect = () => {
    setSnackbarOpen(false);
    navigate('/login', { state: { from: location } });
  };
  const handleRegisterRedirect = () => {
    setSnackbarOpen(false);
    navigate('/registration', { state: { from: location } });
  };

  if (loading) {
      return ( <Layout><Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 128px)' }}><CircularProgress /></Container></Layout> );
  }
  if (error && !filmDetails) {
      return ( <Layout><Container sx={{ py: 5 }}><Alert severity="error" sx={{ mt: 2 }}>{error}</Alert></Container></Layout> );
  }
  if (!filmDetails && !loading) {
      return ( <Layout><Container sx={{ py: 5 }}><Alert severity="info" sx={{ mt: 2 }}>Деталі фільму не знайдено.</Alert></Container></Layout> );
  }

  return (
    <Layout>
      {filmDetails && (
        <Box>
          <HeroSection
            title={filmDetails.title}
            tagline={filmDetails.tagline}
            backdropUrl={filmDetails.backdropUrl}
            trailerUrl={filmDetails.trailerUrl}
            isFavorite={isCurrentlyFavorite}    
            onToggleFavorite={handleToggleFavorite} 
            favoriteLoading={favoriteActionLoading} 
          />
          <ContentSection
            filmData={filmDetails}
          />
          <ActorsSection
            actors={filmDetails.actors}
          />
        </Box>
      )}
    

      <Fade in={showFloatingButton} timeout={300}>
           <Button
              variant="contained"
              onClick={handleSelectSession}
              startIcon={<ConfirmationNumberOutlinedIcon />}
              sx={{ 
                 position: 'fixed', zIndex: theme.zIndex.fab, width: 'auto', minWidth: 'auto',
                 bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '50px',
                 fontWeight: 600, letterSpacing: '0.5px', textTransform: 'none',
                 whiteSpace: 'nowrap', boxShadow: '0px 8px 18px rgba(218, 98, 28, 0.35)',
                 '&:hover': { bgcolor: 'primary.dark', boxShadow: '0px 10px 22px rgba(218, 98, 28, 0.45)'},
                 fontSize: '1.15rem', py: 1.7, px: 3.5,
                 bottom: theme.spacing(15), left: '50%', right: 'auto', transform: 'translateX(-50%)',
                  [theme.breakpoints.up('sm')]: {
                     right: theme.spacing(4), left: 'auto', transform: 'none', bottom: theme.spacing(4),
                     fontSize: '1.2rem', py: 2, px: 5,
                  },
                  '& .MuiButton-startIcon': {
                      fontSize: { xs: '1.5rem', sm: '1.7rem' }, mr: { xs: 1, sm: 1.2 }, verticalAlign: 'middle'
                  }
              }}
            >
              Обрати сеанс
          </Button>
      </Fade>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={user ? 3000 : 7000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          !user && snackbarMessage.includes("Будь ласка, увійдіть") ? (
            <React.Fragment>
              <Button sx={{ color: theme.palette.secondary.light }} size="small" onClick={handleLoginRedirect}>Увійти</Button>
              <Button sx={{ color: theme.palette.secondary.light }} size="small" onClick={handleRegisterRedirect}>Реєстрація</Button>
              <MuiIconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            X
              </MuiIconButton>
            </React.Fragment>
          ) : (
            <MuiIconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
           X
            </MuiIconButton>
          )
        }
      />
    </Layout>
  );
};

export default FilmPage;