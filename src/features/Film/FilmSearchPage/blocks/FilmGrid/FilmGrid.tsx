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
import TodayIcon from '@mui/icons-material/Today';
import StarRateIcon from '@mui/icons-material/StarRate';

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
          err.response?.data?.detail || err.message || 'Failed to fetch films'
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
        <Typography sx={{ mt: 1 }}>PЗавантаження фільмів...</Typography>
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
        <Typography>No films found matching your criteria.</Typography>
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
                <Box sx={styles.filmInfoContainer}>
                  <Box sx={styles.filmInfoItem}>
                    <TodayIcon sx={styles.filmInfoIcon} />
                    <Typography sx={styles.filmInfoText}>
                      {film.releaseYear}
                    </Typography>
                  </Box>
                  <Box sx={styles.filmInfoItem}>
                    <StarRateIcon sx={styles.filmInfoIcon} />
                    <Typography sx={styles.filmInfoText}>
                      {film.rating?.toFixed(1) ?? 'N/A'}
                    </Typography>
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
            siblingCount={0}
            showFirstButton={!isSmallScreen}
            showLastButton={!isSmallScreen}
          />
        </Box>
      )}
    </Container>
  );
};
export default FilmGrid;
