import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material';
import getSessionSearchDateFilterStyles from './DateFilter.styles';
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

export default function DateFilter({}: Props) {
  const theme = useTheme();
  const styles = getSessionSearchDateFilterStyles(theme);

  const [filmData, setFilmData] = useState<FilmSession[]>([
    {
      id: 0,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Harry',
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
    {
      id: 1,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Harry2',
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
    {
      id: 2,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Harry2',
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
    {
      id: 3,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Harry2',
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
    {
      id: 4,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Harry2',
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
    {
      id: 5,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Harry2',
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
    {
      id: 6,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Harry2',
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
    {
      id: 7,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Harry2',
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
    {
      id: 8,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Harry2',
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
    {
      id: 9,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Harry2',
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
    {
      id: 10,
      startTime: '2025-05-11T23:35:06.759Z',
      cinemaHallId: 0,
      status: 'Ongoing',
      ticketPrice: 0,
      contentId: 0,
      title: 'Harry2',
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
    <Box sx={styles.dateFilterBox}>
      {filmData.map((film) => (
        <Card key={film.id} sx={styles.filmCardItem}>
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
          <CardContent sx={styles.filmCardContent}>
            <Typography variant="h6" component="div" sx={styles.filmTitle}>
              {film.title}
            </Typography>
            <Box sx={styles.filmInfoContainer}></Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
