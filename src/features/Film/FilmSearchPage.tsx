import React, { FormEvent, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  useTheme,
  IconButton,
  Alert,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import Layout from '../../shared/components/Layout';
import getStyles from './FilmSearchPage.styles.ts';
import { SearchSharp } from '@mui/icons-material';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { ApiErrorResponse } from '../../core/api/types';

const FilmSearchPage: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:900px)');

  const [movieQuery, setMovieQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: FormEvent | React.MouseEvent) => {
    e?.preventDefault?.();
    setError(null);
    setIsSubmitting(true);

    try {
      const searchResponse = await axios.get(
        `/api/v1/contents/filter?SearchTerms=${encodeURIComponent(movieQuery)}`
      );
      const results = searchResponse.data.items;

      // Testing response
      // const results = [
      //   {
      //     id: 0,
      //     title: 'Hello',
      //     description: 'string',
      //     rating: 100,
      //     releaseYear: 2000,
      //     trailerUrl: 'string',
      //     posterUrl: 'string',
      //     durationMinutes: 0,
      //     genreIds: [0],
      //     actorIds: [0],
      //     createdAt: '2025-04-30T15:00:34.159Z',
      //     updatedAt: '2025-04-30T15:00:34.159Z',
      //   },
      // ];

      // console.log('Отримано результати пошуку:', results);

      if (!results || results.length === 0) {
        setError('Фільм не знайдено');
        return;
      }

      const film = results[0];
      // console.log('Переходимо до фільму:', film);
      navigate(`/film/${film.id}`);
    } catch (err) {
      console.error('FilmSearchPage: search failed', err);
      let errorMessage = 'Сталася помилка при пошуку. Спробуйте ще раз.';

      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ApiErrorResponse>;
        if (axiosError.response?.data?.description) {
          errorMessage = axiosError.response.data.description;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={styles.wrapper}>
        <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="text.secondary"
            sx={styles.title}>
            Пошук фільму
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={styles.subText}>
            {isSmallScreen
              ? 'Будь ласка, спробуйте ще раз'
              : 'Ми просимо вибачення, але ваші пошукові терміни не дали результатів. Будь ласка, спробуйте ще раз, використовуючи нові пошукові терміни.'}
          </Typography>

          <TextField
            margin="normal"
            placeholder="Введіть назву фільму..."
            required
            fullWidth
            name="search"
            type="text"
            id="search"
            value={movieQuery}
            onChange={(e) => setMovieQuery(e.target.value)}
            sx={styles.inputArea}
            disabled={isSubmitting}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    edge="end"
                    sx={{ color: theme.palette.primary.light }}>
                    <SearchSharp />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={styles.errorBox}>
              {error}
            </Alert>
          )}

          {isSubmitting && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={24} color="primary" />
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default FilmSearchPage;
