import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import Layout from '../../../shared/components/Layout';
import axios from 'axios';
import getStyles from './FilmPage.styles';
import { useTheme } from '@mui/material';

import apiClient from '../../../core/api/client';

interface Film {
  id: number;
  title: string;
  description: string;
  rating: number;
  releaseYear: number;
  trailerUrl: string;
  posterUrl: string;
  durationMinutes: number;
  genreIds: number[];
  actorIds: number[];
  createdAt: string;
  updatedAt: string;
}
const FilmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await apiClient.get(`/contents/${id}`);
        setFilm(response.data);
      } catch (err) {
        let errorMessage = 'Не вдалося завантажити інформацію про фільм.';

        if (axios.isAxiosError(err) && err.response?.data) {
          const data = err.response.data as any;
          if (data.description) {
            errorMessage = data.description;
          }
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFilm();
  }, [id]);

  return (
    <Layout>
      <Container maxWidth="sm" sx={styles.wrapper}>
        <Paper elevation={3} sx={styles.paper}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error" sx={styles.errorBox}>
              {error}
            </Alert>
          ) : film ? (
            <>
              <Typography variant="h4" gutterBottom sx={styles.title}>
                {film.title}
              </Typography>
              <Typography variant="body1" sx={styles.infoText}>
                Рік випуску: {film.releaseYear}
              </Typography>
              <Typography variant="body2" sx={styles.description}>
                {film.description}
              </Typography>
            </>
          ) : null}
        </Paper>
      </Container>
    </Layout>
  );
};

export default FilmPage;
