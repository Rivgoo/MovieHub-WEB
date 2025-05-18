import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import FilmGridSectionStyles from './FilmGridSection.styles';
import { ContentDto } from '../../../../../core/api/types/types.content';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchContent } from '../../../../../core/api/requests/request.content';

const FilmGridSection = () => {
  const theme = useTheme();
  const styles = FilmGridSectionStyles(theme);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [films, setFilms] = useState<ContentDto[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);

  useEffect(() => {
    const fetchFilteredFilms = async () => {
      setIsLoading(true);

      const queryParams = new URLSearchParams();
      queryParams.set('PageSize', '10');

      searchParams.forEach((value, key) => {
        if (value !== '') {
          queryParams.set(key, value);
        }
      });

      queryParams.set('PageIndex', pageNum.toString());

      console.log('QUERY:', queryParams.toString());

      try {
        const response = await searchContent(queryParams.toString());
        setFilms(response.items);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredFilms();
  }, [searchParams, pageNum]);

  const handleFilmChoosing = (id: number) => {
    navigate(`/film/${id}`);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 5,
        }}>
        <CircularProgress />
        <Typography sx={{ mt: 1 }}>Завантаження фільмів...</Typography>
      </Box>
    );
  }

  if (!films.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 5,
        }}>
        <Typography>Немає фільмів за цими критеріями</Typography>
      </Box>
    );
  }

  return (
    <Container sx={styles.filmGridWrapper}>
      <Box sx={styles.filmCardContainer}>
        {films.map((film) => (
          <Card key={film.id} sx={styles.filmCardItem}>
            <CardActionArea onClick={() => handleFilmChoosing(film.id)}>
              <CardMedia
                component="img"
                sx={styles.filmPoster}
                image={film.posterUrl}
                alt={film.title}
              />
              <CardContent sx={styles.filmCardContent}>
                <Typography variant="h6" component="div" sx={styles.filmTitle}>
                  {film.title}
                </Typography>
                <Box sx={styles.filmInfoContainer}>
                  <Box sx={styles.filmInfoContainer}>
                    <Box sx={styles.filmInfoContainerRows}>
                      {film.durationMinutes && (
                        <Box sx={styles.filmInfoItem}>
                          <AccessTimeIcon sx={styles.filmInfoIcon} />
                          <Typography variant="body2" sx={styles.filmInfoText}>
                            {film.durationMinutes} хв
                          </Typography>
                        </Box>
                      )}
                      <Box sx={styles.filmInfoItem}>
                        <StarOutlineIcon sx={styles.filmInfoIcon} />
                        <Typography variant="body2" sx={styles.filmInfoText}>
                          {typeof film.rating === 'number'
                            ? (film.rating / 10).toFixed(1)
                            : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={styles.filmInfoContainerRows}>
                      {film.releaseYear && (
                        <Box sx={styles.filmInfoItem}>
                          <CalendarTodayIcon sx={styles.filmInfoIcon} />
                          <Typography variant="body2" sx={styles.filmInfoText}>
                            {film.releaseYear}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={styles.filmInfoItem}>
                        <PersonIcon sx={styles.filmInfoIcon} />
                        <Typography variant="body2" sx={styles.filmInfoText}>
                          {typeof film.ageRating === 'number'
                            ? `${film.ageRating}+`
                            : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default FilmGridSection;
