
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import Layout from '../../shared/components/Layout';
import { useTheme } from '@mui/material/styles';
import HeroSection from './sections/HeroSection/HeroSection';
import ContentSection from './sections/ContentSection/ContentSection';
import ActorsSection from './sections/ActorsSection/ActorsSection';

const FilmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSelectSession = () => {
    console.log('Обрати сеанс для фільму ID:', id);
     if (id) navigate(`/session-search?filmId=${id}`);
  };

  return (
    <Layout>
  
      <HeroSection />
      <ContentSection onSelectSession={handleSelectSession} />
      <ActorsSection />

    
      <Button
          variant="contained"
          onClick={handleSelectSession}
          sx={{
              position: 'fixed',
              bottom: theme.spacing(4.5), 
              right: theme.spacing(4.5), 
              zIndex: theme.zIndex.fab,
              width: 'auto',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '50px', 
              
              py: 1.8,        
              px: 4.5,        
              fontSize: '1.15rem',
              fontWeight: 600,
              letterSpacing: '0.5px', 
              
              minWidth: 'auto',
              boxShadow: '0px 8px 18px rgba(218, 98, 28, 0.35)', 
              '&:hover': {
                 bgcolor: 'primary.dark',
                 boxShadow: '0px 10px 22px rgba(218, 98, 28, 0.45)', 
              },
          }}
      >
          
          <ConfirmationNumberOutlinedIcon sx={{
              fontSize: '1.6rem',
              mr: 1.1,           
              verticalAlign: 'middle'
          }}/>
          Обрати сеанс
      </Button>
    </Layout>
  );
};

export default FilmPage;