import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import Layout from '../../shared/components/Layout';
import axios from 'axios';

interface Film {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  duration: number;
}

const FilmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await axios.get(`/api/v1/contents/${id}`);
        setFilm(response.data);
      } catch (err) {
        setError('Не вдалося завантажити інформацію про фільм.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFilm();
  }, [id]);

  return (
    <Layout>
      <Container
        maxWidth="sm"
        sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : film ? (
            <>
              <Typography variant="h4" gutterBottom>
                {film.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Рік випуску: {film.releaseYear}
              </Typography>
              <Typography variant="body2">{film.description}</Typography>
            </>
          ) : null}
        </Paper>
      </Container>
    </Layout>
  );
};

export default FilmPage;
