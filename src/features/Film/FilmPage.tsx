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
import { Fade } from '@mui/material';

const FilmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const footerRef = useRef<HTMLElement | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleSelectSession = () => {
    console.log('Обрати сеанс для фільму ID:', id);
    if (id) navigate(`/session-search?ContentId=${id}`);
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
    if (!currentFooterRef || window.innerHeight < 300) return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setShowFloatingButton(false);
            } else {
                setShowFloatingButton(true);
            }
        });
    };

    const observerOptions: IntersectionObserverInit = {
        root: null,
       
        rootMargin: '0px', 
        threshold: 0.01 
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(currentFooterRef);

    return () => {
        if (currentFooterRef) {
            observer.unobserve(currentFooterRef);
        }
    };
}, []);

  return (
    <Layout>
      <Box>
        <HeroSection />
        <ContentSection />
        <ActorsSection />
      </Box>

      <Fade in={showFloatingButton} timeout={300}>
           <Button
              variant="contained"
              onClick={handleSelectSession}
              startIcon={<ConfirmationNumberOutlinedIcon />}
              sx={{
                position: 'fixed',
                zIndex: theme.zIndex.fab,
                width: 'auto',
                minWidth: 'auto',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: '50px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0px 8px 18px rgba(218, 98, 28, 0.35)',
                '&:hover': {
                   bgcolor: 'primary.dark',
                   boxShadow: '0px 10px 22px rgba(218, 98, 28, 0.45)',
                },
                fontSize: '1.15rem',
                py: 1.7,
                px: 3.5,
                bottom: theme.spacing(15),
                left: '50%',
                right: 'auto',
                transform: 'translateX(-50%)',
                 [theme.breakpoints.up('sm')]: {
                    right: theme.spacing(4),
                    left: 'auto',
                    transform: 'none',
                    bottom: theme.spacing(4),
                    fontSize: '1.2rem',
                    py: 2,
                    px: 5,
                 },
                 '& .MuiButton-startIcon': {
                     fontSize: { xs: '1.5rem', sm: '1.7rem' },
                     mr: { xs: 1, sm: 1.2 },
                     verticalAlign: 'middle'
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