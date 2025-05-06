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
import { GetContentByIdResponse } from '../../../core/api/types/types.content';

const FilmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<GetContentByIdResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await apiClient.get(`/contents/${id}`);
        setFilm(response.data);
        console.log(response.data);
        // setFilm({
        //   id: 0,
        //   title: 'Hello',
        //   description: 'string',
        //   rating: 100,
        //   releaseYear: 2000,
        //   trailerUrl: 'string',
        //   posterUrl: 'string',
        //   durationMinutes: 0,
        //   genreIds: [0],
        //   actorIds: [0],
        //   createdAt: '2025-04-30T15:00:34.159Z',
        //   updatedAt: '2025-04-30T15:00:34.159Z',
        // });
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
