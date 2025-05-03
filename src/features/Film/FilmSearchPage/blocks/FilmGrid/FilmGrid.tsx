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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { searchContent } from '../../../../../core/api/requests/request.content';
import getStyles from './FilmGrid.styles';
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

const FilmGrid: React.FC<Props> = ({ films, filters }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();

  const defaultState: ContentFilterResponse = {
    items: [],
    pageIndex: 1,
    pageSize: 20,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  };

  const [localFilms, setLocalFilms] = useState<ContentFilterResponse>(
    films ?? defaultState
  );
  const [currentPage, setCurrentPage] = useState(1);

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
    const fetchFilms = async () => {
      try {
        const baseQuery = `pageSize=20&pageIndex=${currentPage}`;
        let result;

        if (!filters || filters.length === 0) {
          result = await searchContent(`?${baseQuery}`);
        } else {
          const filterQuery = filters.map((id) => `GenreIds=${id}`).join('&');
          result = await searchContent(`?${filterQuery}&${baseQuery}`);
        }

        setLocalFilms(result);
      } catch (error) {
        setLocalFilms(defaultState);
      }
    };

    fetchFilms();
  }, [filters, currentPage]);

  return (
    <Container sx={styles.wrapper}>
      <Box sx={styles.cardContainer}>
        {Array.isArray(localFilms.items) &&
          localFilms.items.length > 0 &&
          localFilms.items.map((el: ContentDto) => (
            <Box key={el.id} sx={styles.cardItem}>
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
                    />
                  ) : (
                    <Box sx={styles.posterAltBox}>
                      <Typography sx={styles.posterAltText}>
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

      <Box sx={styles.pagesList}>
        <GlowButton
          disabled={!localFilms.hasPreviousPage}
          onClick={handlePrevPage}
          sx={styles.pageNavigationButton}>
          <ArrowBackIosIcon
            sx={
              localFilms.hasPreviousPage
                ? styles.pageNavigationButtonActive
                : styles.pageNavigationButtonDisable
            }
          />
        </GlowButton>
        {getPageButtons(localFilms.totalPages, currentPage).map((page, idx) =>
          typeof page === 'number' ? (
            <GlowButton
              key={idx}
              onClick={() => handleNumPage(page)}
              sx={{
                ...styles.pageNavigationButton,
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
          sx={styles.pageNavigationButton}
          onClick={handleNextPage}>
          <ArrowForwardIosIcon
            sx={
              localFilms.hasNextPage
                ? styles.pageNavigationButtonActive
                : styles.pageNavigationButtonDisable
            }
          />
        </GlowButton>
      </Box>
    </Container>
  );
};

export default FilmGrid;

//   const [response, setResponse] = useState({
//     items: [
//       {
//         id: 1,
//         title: 'string1',
//         description: 'string',
//         rating: 10,
//         releaseYear: 2020,
//         trailerUrl: 'string',
//         posterUrl:
//           'https://movieposter.runasp.net/content/posters/1_b89945f537fc4ad2a85c3bdd5935252d.jpg',
//         durationMinutes: 120,
//         genreIds: [1, 2],
//         actorIds: [1, 2],
//         createdAt: 'string',
//         updatedAt: 'string',
//       },
//       {
//         id: 2,
//         title: 'Content 2',
//         description: 'Description for Content 2',
//         rating: 65,
//         releaseYear: 2007,
//         trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//         posterUrl:
//           'https://movieposter.runasp.net/content/posters/2_db4866a650f842a693b2679a896a80b4.jpg',
//         durationMinutes: 189,
//         genreIds: [],
//         actorIds: [],
//         createdAt: '2025-04-24T18:16:13.620535',
//         updatedAt: '2025-04-24T18:16:13.632179',
//       },
//       {
//         id: 3,
//         title: 'string3',
//         description: 'string',
//         rating: 10,
//         releaseYear: 2020,
//         trailerUrl: 'string',
//         posterUrl:
//           'https://movieposter.runasp.net/content/posters/1_b89945f537fc4ad2a85c3bdd5935252d.jpg',
//         durationMinutes: 120,
//         genreIds: [1, 2],
//         actorIds: [1, 2],
//         createdAt: 'string',
//         updatedAt: 'string',
//       },
//       {
//         id: 4,
//         title: 'string4',
//         description: 'string',
//         rating: 10,
//         releaseYear: 2020,
//         trailerUrl: 'string',
//         posterUrl:
//           'https://movieposter.runasp.net/content/posters/1_b89945f537fc4ad2a85c3bdd5935252d.jpg',
//         durationMinutes: 120,
//         genreIds: [1, 2],
//         actorIds: [1, 2],
//         createdAt: 'string',
//         updatedAt: 'string',
//       },
//       {
//         id: 5,
//         title: 'string5',
//         description: 'string',
//         rating: 10,
//         releaseYear: 2020,
//         trailerUrl: 'string',
//         posterUrl:
//           'https://movieposter.runasp.net/content/posters/1_b89945f537fc4ad2a85c3bdd5935252d.jpg',
//         durationMinutes: 120,
//         genreIds: [1, 2],
//         actorIds: [1, 2],
//         createdAt: 'string',
//         updatedAt: 'string',
//       },
//       {
//         id: 6,
//         title: 'string6',
//         description: 'string',
//         rating: 10,
//         releaseYear: 2020,
//         trailerUrl: 'string',
//         posterUrl:
//           'https://movieposter.runasp.net/content/posters/1_b89945f537fc4ad2a85c3bdd5935252d.jpg',
//         durationMinutes: 120,
//         genreIds: [1, 2],
//         actorIds: [1, 2],
//         createdAt: 'string',
//         updatedAt: 'string',
//       },
//     ],
//     pageIndex: 0,
//     pageSize: 0,
//     totalCount: 0,
//     totalPages: 0,
//     hasPreviousPage: true,
//     hasNextPage: true,
//   });
