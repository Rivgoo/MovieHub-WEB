import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; 
import Layout from '../../shared/components/Layout/Layout';
import { useTheme } from '@mui/material/styles';
import HeroSection from './sections/HeroSection/HeroSection';
import ContentSection from './sections/ContentSection/ContentSection';
import ActorsSection from './sections/ActorsSection/ActorsSection';
import { Container, CircularProgress, Alert, Snackbar, IconButton as MuiIconButton } from '@mui/material';
import { getProcessedFilmDetailsById } from '../../core/api/filmApi';
import { ProcessedFilmDetails } from '../../core/api/types/types.film';
import { useAuth } from '../../core/auth/useAuth';
import { addToFavoritesAPI, removeFromFavoritesAPI, checkIfFavoriteAPI } from '../../core/api/favoriteApi';
import MetaTags from '../../shared/components/MetaTag/MetaTags';
import SessionsSection from './sections/SessionsSection/SessionsSection';

const FilmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user, token } = useAuth();
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
            const favoriteStatus = await checkIfFavoriteAPI(filmData.id);
            if (isMounted) {
              setIsCurrentlyFavorite(favoriteStatus);
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
      return (
        <Layout>
          <MetaTags title="Помилка завантаження фільму" description="Не вдалося завантажити інформацію про фільм."/>
          <Container sx={{ py: 5 }}><Alert severity="error" sx={{ mt: 2 }}>{error}</Alert></Container>
        </Layout>
      );
  }
  if (!filmDetails && !loading) {
      return (
        <Layout>
           <MetaTags title="Фільм не знайдено" description="Деталі фільму не знайдено на MovieHub."/>
          <Container sx={{ py: 5 }}><Alert severity="info" sx={{ mt: 2 }}>Деталі фільму не знайдено.</Alert></Container>
        </Layout>
      );
  }

  return (
    <Layout>
      <MetaTags
        title={filmDetails ? `${filmDetails.title} (${filmDetails.releaseDate}) | MovieHub` : "Завантаження фільму | MovieHub"}
        description={filmDetails ? `Опис фільму "${filmDetails.title}": ${filmDetails.overview.substring(0, 160)}...` : "Завантажуємо деталі фільму на MovieHub."}
        ogType="video.movie"
      />
  
      {loading && (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 128px)' }}>
          <CircularProgress />
        </Container>
      )}
      {error && !filmDetails && (
        <Container sx={{ py: 5 }}>
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        </Container>
      )}
      {!loading && !error && filmDetails && (
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
          <ContentSection filmData={filmDetails} />
          <ActorsSection actors={filmDetails.actors} />
          <SessionsSection/>
        </Box>
      )}

    

<Snackbar
  open={snackbarOpen}
  autoHideDuration={user ? 3000 : 6000}
  onClose={handleCloseSnackbar}
  message={snackbarMessage}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  sx={{

    bottom: { xs: '20px', sm: '24px' }, 
    transition: 'bottom 0.3s ease-in-out', 
  }}
  action={
    !user && snackbarMessage.includes("Будь ласка, увійдіть") ? (
      <React.Fragment>
        <Button sx={{ color: theme.palette.secondary.light, mr: 1 }} size="small" onClick={handleLoginRedirect}>Увійти</Button>
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