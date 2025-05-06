import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Typography,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { searchContent } from '../../../../../core/api/requests/request.content';
import getFilmGridStyles from './FilmGrid.styles';
import {
  ContentDto,
  ContentFilterResponse,
} from '../../../../../core/api/types/types.content';
import { GlowButton } from '../../../../../shared/components/Buttons';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Props {
  films?: ContentFilterResponse;
  filters?: number[];
}

const FilmGrid: React.FC<Props> = ({ films: filmsFromProps, filters }) => {
  const theme = useTheme();
  const styles = getFilmGridStyles(theme);
  const navigate = useNavigate();

  console.log(filmsFromProps);

  const defaultState: ContentFilterResponse = {
    items: [],
    pageIndex: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  const [localFilms, setLocalFilms] =
    useState<ContentFilterResponse>(defaultState);
  const [currentPage, setCurrentPage] = useState(1);
  //const [isLoading, setIsLoading] = useState(false);

  const handleFilmChosing = (id: number) => {
    navigate(`/film/${id}`);
  };

  const handleNextPage = () => {
    if (localFilms.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (localFilms.hasPreviousPage) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNumPage = (page: number) => {
    setCurrentPage(page);
  };

  const getPageButtons = (
    total: number,
    current: number
  ): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    pages.push(1);

    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) pages.push('...');

    pages.push(total);

    return pages;
  };

  useEffect(() => {
    if (filmsFromProps !== undefined) {
      console.log('FilmGrid: Використання даних з props', filmsFromProps);
      setLocalFilms(filmsFromProps);
      setCurrentPage(filmsFromProps.pageIndex ?? 1);
      //setIsLoading(false);
      return;
    }

    const fetchFilmsLocally = async () => {
      //setIsLoading(true);
      try {
        const baseQuery = `pageSize=10&pageIndex=${currentPage}`;
        let finalQuery = `?${baseQuery}`;

        if (filters && filters.length > 0) {
          const filterQuery = filters.map((id) => `GenreIds=${id}`).join('&');
          finalQuery = `?${filterQuery}&${baseQuery}`;
          console.log('FilmGrid: Запит з фільтрами', finalQuery);
        } else {
          console.log('FilmGrid: Запит без фільтрів', finalQuery);
        }

        const result = await searchContent(finalQuery);
        setLocalFilms(result);
      } catch (error) {
        console.error('FilmGrid: Помилка завантаження фільмів:', error);
        setLocalFilms(defaultState);
      } finally {
        //setIsLoading(false);
      }
    };

    fetchFilmsLocally();
  }, [filmsFromProps, filters, currentPage]);

  return (
    <Container sx={styles.filmGridWrapper}>
      <Box sx={styles.filmCardContainer}>
        {Array.isArray(localFilms.items) &&
          localFilms.items.length > 0 &&
          localFilms.items.map((el: ContentDto) => (
            <Box key={el.id} sx={styles.filmCardItem}>
              <Card
                onClick={() => handleFilmChosing(el.id)}
                sx={{ height: '100%' }}>
                <CardActionArea sx={{ height: '100%' }}>
                  {el.posterUrl ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={el.posterUrl}
                      alt={`${el.title ?? 'Film'} poster`}
                      // sx={styles.filmPoster}
                    />
                  ) : (
                    <Box sx={styles.filmPosterAltBox}>
                      <Typography sx={styles.filmPosterAltText}>
                        No Poster
                      </Typography>
                    </Box>
                  )}
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={styles.filmTitle}>
                      {el.title ?? 'No Title'}
                    </Typography>
                    {el.durationMinutes && (
                      <Typography variant="body2" sx={styles.filmDuration}>
                        {el.durationMinutes} хв
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
      </Box>

      <Box sx={styles.filmPagesList}>
        <GlowButton
          disabled={!localFilms.hasPreviousPage}
          onClick={handlePrevPage}
          sx={styles.filmPageNavigationButton}>
          <ArrowBackIosIcon
            sx={
              localFilms.hasPreviousPage
                ? styles.filmPageNavigationButtonActive
                : styles.filmPageNavigationButtonDisable
            }
          />
        </GlowButton>
        {getPageButtons(localFilms.totalPages, currentPage).map((page, idx) =>
          typeof page === 'number' ? (
            <GlowButton
              key={idx}
              onClick={() => handleNumPage(page)}
              sx={{
                ...styles.filmPageNavigationButton,
                color:
                  page === localFilms.pageIndex
                    ? theme.palette.primary.main
                    : '#fff',
              }}>
              <Typography>{page}</Typography>
            </GlowButton>
          ) : (
            <Typography key={idx}>...</Typography>
          )
        )}
        <GlowButton
          disabled={!localFilms.hasNextPage}
          sx={styles.filmPageNavigationButton}
          onClick={handleNextPage}>
          <ArrowForwardIosIcon
            sx={
              localFilms.hasNextPage
                ? styles.filmPageNavigationButtonActive
                : styles.filmPageNavigationButtonDisable
            }
          />
        </GlowButton>
      </Box>
    </Container>
  );
};

export default FilmGrid;
