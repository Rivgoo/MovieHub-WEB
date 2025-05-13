import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material';
import getFilmAdaptiveScheduleGridItemStyles from './FilmAdaptiveScheduleGridItem.styles';
import { useState } from 'react';
type Props = {};

interface FilmSession {
  id: number;
  startTime: string;
  cinemaHallId: number;
  status: string;
  ticketPrice: number;
  contentId: number;
  title: string;
  description: string;
  rating: number;
  releaseYear: number;
  trailerUrl: string;
  bannerUrl: string;
  posterUrl: string;
  durationMinutes: number;
  genreIds: number[];
}

export default function FilmAdaptiveScheduleGridItem({}: Props) {
  const theme = useTheme();
  const styles = getFilmAdaptiveScheduleGridItemStyles(theme);

  const [filmData, setFilmData] = useState<FilmSession[]>([
    {
      id: 0,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Гарря Шпротер і камені в нирках',
      description: 'string',
      rating: 0,
      releaseYear: 0,
      trailerUrl: 'string',
      bannerUrl: 'string',
      posterUrl:
        'https://movieposter.runasp.net/content/posters/106_poster_54ab740f4fec4f6281b8f41a6d562499.jpg',
      durationMinutes: 0,
      genreIds: [0],
    },
  ]);

  return (
    <Box>
      {filmData.map((film) => (
        <Card key={film.id} sx={styles.filmCardItem}>
          <CardActionArea sx={styles.filmPoster}>
            <CardMedia
              component="img"
              sx={styles.filmPoster}
              image={film.posterUrl || '/placeholder-poster.jpg'}
              alt={film.title}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-poster.jpg';
              }}
            />
          </CardActionArea>
          <CardContent sx={styles.filmCardContent}>
            <Typography variant="h6" component="div" sx={styles.filmTitle}>
              {film.title}
            </Typography>

            <Box sx={styles.sessionPriceInfo}>
              <Typography sx={styles.sessionPriceText}>Від 120 грн</Typography>
            </Box>

            <Box sx={styles.filmInfoContainer}>
              {Array.from({ length: 9 }).map((_, idx) => (
                <Typography
                  key={idx}
                  variant="body2"
                  component="div"
                  sx={styles.sessionPriceText}>
                  10:00
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
