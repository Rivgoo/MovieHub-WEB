import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { PrimaryButton } from '../../shared/components/Buttons';
import Layout from '../../shared/components/Layout';
import MetaTags from './../../shared/components/MetaTag/MetaTags';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Layout>
      <MetaTags 
        title="Сторінку не знайдено (404) | MovieHub" 
        description="На жаль, сторінка, яку ви шукаєте на MovieHub, не існує..." 
      />
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          pt: 6,
          pb: 9
        }}>
        <Paper
          elevation={5}
          sx={{
            p: { xs: 3, sm: 4 },
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: '16px',
          }}>

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            color="text.primary"
            sx={{ fontWeight: 700 }}>
            404
          </Typography>
          <Typography
            variant="h5"
            component="p"
            color="text.primary"
            sx={{ mb: 2 }}>
            Сторінку не знайдено
          </Typography>

          <Typography variant="body1" color="text.primary" sx={{ mb: 4 }}>
            На жаль, сторінка, яку ви шукаєте, не існує. Можливо, її було
            переміщено або видалено.
          </Typography>

          <PrimaryButton
            onClick={handleGoHome}
            sx={{ px: 4, py: 1, width: '80%' }}
          >
            Назад на сайт
          </PrimaryButton>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ErrorPage;