import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import Layout from '../../shared/components/Layout/Layout';
import { useTheme } from '@mui/material/styles';
import HeroSection from './sections/HeroSection/HeroSection';
import ContentSection from './sections/ContentSection/ContentSection';
import ActorsSection from './sections/ActorsSection/ActorsSection';
import { Fade, Container, CircularProgress, Alert } from '@mui/material'; 
import { getProcessedFilmDetailsById } from '../../core/api/filmApi';
import { ProcessedFilmDetails } from '../../core/api/types/types.film';

const FilmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const footerRef = useRef<HTMLElement | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(true);

  
  const [filmDetails, setFilmDetails] = useState<ProcessedFilmDetails | null>(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  const handleSelectSession = () => {
    console.log('Обрати сеанс для фільму ID:', id);
    
    if (id) navigate(`/session-search?contentId=${id}`);
  };


  useEffect(() => {
      const footerElement = document.querySelector('footer');
      if (footerElement) {
          footerRef.current = footerElement;
      } else {
          console.warn("Footer element not found for Intersection Observer. Button might not hide correctly.");
      }
  }, []);
  useEffect(() => {
    const currentFooterRef = footerRef.current;
    if (!currentFooterRef || typeof IntersectionObserver === 'undefined' || window.innerHeight < 300) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            setShowFloatingButton(!entry.isIntersecting);
        });
    };
    const observerOptions: IntersectionObserverInit = { root: null, rootMargin: '0px', threshold: 0.01 };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(currentFooterRef);
    return () => { if (currentFooterRef) observer.unobserve(currentFooterRef); };
}, []);


 useEffect(() => {
     if (!id) {
       setError("ID фільму не вказано в URL.");
       setLoading(false);
       return;
     }
     const fetchFilmData = async () => {
       setLoading(true);
       setError(null);
       setFilmDetails(null); 
       try {
         const data = await getProcessedFilmDetailsById(id);
         setFilmDetails(data);
       } catch (err: any) {
         setError(err.message || "Сталася невідома помилка при завантаженні фільму.");
         setFilmDetails(null);
       } finally {
         setLoading(false);
       }
     };
     fetchFilmData();
   }, [id]); 

 if (loading) {
     return (
       <Layout>
         <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 128px)' }}>
           <CircularProgress />
         </Container>
       </Layout>
     );
 }

 if (error) {
     return (
       <Layout>
         <Container sx={{ py: 5 }}>
           <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
         </Container>
       </Layout>
     );
 }

 if (!filmDetails) {
     
     return (
       <Layout>
         <Container sx={{ py: 5 }}>
           <Alert severity="info" sx={{ mt: 2 }}>Деталі фільму не знайдено або не вдалося завантажити.</Alert>
         </Container>
       </Layout>
     );
 }

  return (
    <Layout>
      <Box> 
        <HeroSection
          title={filmDetails.title}
          tagline={filmDetails.tagline}
          backdropUrl={filmDetails.backdropUrl}
          trailerUrl={filmDetails.trailerUrl}
        />
        <ContentSection
          filmData={filmDetails} 
        />
        <ActorsSection
          actors={filmDetails.actors} 
        />
      </Box>

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
    </Layout>
  );
};

export default FilmPage;