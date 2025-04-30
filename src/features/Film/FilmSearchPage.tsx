import React, { FormEvent, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import Layout from '../../shared/components/Layout';
import getStyles from './FilmSearchPage.styles.ts';
import { SearchSharp } from '@mui/icons-material';

const FilmSearchPage: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [movieQuery, setMovieQuery] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: пошук фільму
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
            Ми просимо вибачення, але ваші пошукові терміни не дали результатів.
            Будь ласка, спробуйте ще раз, використовуючи нові пошукові терміни.
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchSharp sx={{ color: theme.palette.primary.light }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Container>
    </Layout>
  );
};

export default FilmSearchPage;
