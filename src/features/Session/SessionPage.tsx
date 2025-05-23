import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Layout from '../../shared/components/Layout/Layout';
import MetaTags from './../../shared/components/MetaTag/MetaTags';

const FilmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout>
      <MetaTags  
        title="Інформація про сеанс | MovieHub" 
        description="Детальна інформація про обраний кіносеанс. Час, місце та фільм." 
      />
      <Container
        maxWidth="sm"
        sx={{
          mt: 4,
          mb: 4,
          display: 'flex',
          justifyContent: 'center',
          background: 'background.default',
        }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="text.secondary"
            sx={{ fontWeight: 600 }}>
            Session {id}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Session description.
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
};

export default FilmPage;
