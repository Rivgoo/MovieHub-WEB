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

import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

import getStyles from './FilmGrid.styles';
import { ContentDto } from '../../../../../core/api/types/types.content';
import {
  getAllContents,
  searchContent,
} from '../../../../../core/api/requests.content';

interface Props {
  films?: ContentDto[];
  filters?: number[];
}

const FilmGrid: React.FC<Props> = ({ films, filters }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();

  const [localFilms, setLocalFilms] = useState<ContentDto[]>(films ?? []);

  const handleFilmChosing = (id: number) => {
    navigate(`/film/${id}`);
  };

  useEffect(() => {
    const fetchFilms = async () => {
      if (!films || films.length === 0) {
        try {
          if (!filters || filters.length === 0) {
            const result = await getAllContents();
            setLocalFilms(result);
          } else {
            const query = filters.map((id) => `GenreIds=${id}`).join('&');
            const result = await searchContent(`?${query}`);
            setLocalFilms(result);
          }
        } catch (error) {
          setLocalFilms([]);
        }
      } else {
        setLocalFilms(films);
      }
    };

    fetchFilms();
  }, [films, filters]);

  return (
    <Container sx={styles.wrapper}>
      {/* <Grid
        container
        sx={styles.grid}
        spacing={{ xs: 2, md: 1 }}
        columns={{ xs: 12, sm: 12, md: 16 }}>
        {localFilms.map((el) => (
          <Card
            key={el.id}
            sx={styles.gridItem}
            onClick={() => handleFilmChosing(el.id)}>
            <CardActionArea>
              {el.posterUrl ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={el.posterUrl}
                  alt={`${el.title ?? 'Film'} poster`}
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    backgroundColor: '#555',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>
                    No Poster
                  </Typography>
                </Box>
              )}
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {el.title ?? 'No Title'}
                </Typography>
                {el.durationMinutes && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {el.durationMinutes} хв
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Grid> */}
      <Box sx={styles.cardContainer}>
        {localFilms.map((el) => (
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
                  <Box
                    sx={{
                      height: 200,
                      backgroundColor: '#555',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>
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
