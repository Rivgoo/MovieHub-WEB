import { useEffect, useState } from 'react';
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
  Pagination,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { searchContent } from '../../../../../core/api/requests/request.content';
import getFilmGridStyles from './FilmGrid.styles';
import { ContentDto } from '../../../../../core/api/types/types.content';
import { GlowButton } from '../../../../../shared/components/Buttons';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
// import StandardPagination from '../../../../../shared/components/Pagination/StandardPagination';

const PLACEHOLDER_POSTER_URL = '/placeholder-poster.png';

interface Props {
  searchQuery: string | undefined;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const FilmGrid: React.FC<Props> = ({
  searchQuery,
  currentPage,
  onPageChange,
}) => {
  const theme = useTheme();
  const styles = getFilmGridStyles(theme);
  const navigate = useNavigate();
  const [films, setFilms] = useState<ContentDto[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchFilms = async () => {
      if (searchQuery === undefined) {
        setFilms([]);
        setTotalPages(0);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await searchContent(searchQuery);
        setFilms(response.items);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        setError(
          err.response?.data?.detail ||
            err.message ||
            'Помилка отримання фільмів'
        );
        setFilms([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchFilms();
  }, [searchQuery]);

  const handleFilmChoosing = (id: number) => {
    navigate(`/film/${id}`);
  };

  const handlePageChangeInternal = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    onPageChange(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
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

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 5,
        }}>
        <Typography color="error">{error}</Typography>
        <GlowButton
          variant="contained"
          onClick={() => onPageChange(1)}
          sx={{ mt: 2 }}>
          Retry
        </GlowButton>
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
                image={film.posterUrl || PLACEHOLDER_POSTER_URL}
                alt={film.title}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_POSTER_URL;
                }}
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
      {totalPages > 1 && (
        <Box sx={styles.filmPagesList}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChangeInternal}
            color="primary"
            shape="rounded"
            boundaryCount={1}
            siblingCount={1}
            size={isSmallScreen ? 'small' : 'large'}
          />
          {/* <StandardPagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChangeInternal}
          /> */}
        </Box>
      )}
    </Container>
  );
};
export default FilmGrid;
