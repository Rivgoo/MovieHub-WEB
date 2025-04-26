import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Layout from '../../shared/components/Layout';

const AboutPage: React.FC = () => {
  return (
    <Layout>
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
            About MovieHub
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            MovieHub is a movie discovery platform that allows users to explore
            and find their favorite movies. With a user-friendly interface and a
            vast database of movies, you can easily search for movies, read
            reviews, and get recommendations based on your preferences.
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
};

export default AboutPage;
