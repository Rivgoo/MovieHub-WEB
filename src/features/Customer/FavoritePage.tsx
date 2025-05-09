import React, { useEffect, useState, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';

import { searchContent } from '../../core/api/requests/request.content';
import { ContentDto } from '../../core/api/types/types.content';
import { useAuth } from '../../core/auth/useAuth';
import { useTheme }
    from '@mui/material/styles';

const FavoritePage: React.FC = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<ContentDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setError("Будь ласка, увійдіть, щоб переглянути вподобані фільми.");
        setIsLoading(false);
        setFavoriteMovies([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = `IsFavorited=true&PageIndex=0&PageSize=100`;
        const response = await searchContent(queryParams);
        setFavoriteMovies(response.items);
      } catch (err) {
        console.error("Error fetching favorite movies:", err);
        setError("Не вдалося завантажити список вподобаних фільмів. Спробуйте пізніше.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  const filteredMovies = useMemo(() => {
    if (!searchTerm) {
      return favoriteMovies;
    }
    return favoriteMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [favoriteMovies, searchTerm]);

  const handleMovieClick = (movieId: number) => {
    navigate(`/film/${movieId}`);
  };

  const cardWidthXs = '100%';
  const cardWidthSm = 'calc(50% - 12px)';
  const cardWidthMd = 'calc(33.333% - 16px)';
  const cardWidthLg = 'calc(25% - 18px)';
  const spacingValue = theme.spacing(3);

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '400px',
      }}
    >
      <Typography>
        Вподобані фільми
      </Typography>

      <TextField/>

      {isLoading && ( <Box> <CircularProgress /> </Box> )}
      {error && !isLoading && ( <Alert>{error}</Alert> )}
      {!isLoading && !error && filteredMovies.length === 0 && ( <Typography/> )}
      {!isLoading && !error && filteredMovies.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacingValue,
          }}
        >
          {filteredMovies.map((movie) => (
            <Box
              key={movie.id}
              sx={{
                width: {
                  xs: cardWidthXs,
                  sm: cardWidthSm,
                  md: cardWidthMd,
                  lg: cardWidthLg,
                },
                display: 'flex', 
              }}
            >
              <Card
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'background.paper',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: `0px 0px 15px ${theme.palette.primary.main}70`,
                  },
                  cursor: 'pointer'
                }}
                onClick={() => handleMovieClick(movie.id)}
              >
                <CardMedia
                  component="img"
                  image={movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Image"}
                  alt={movie.title}
                  sx={{
                    aspectRatio: '2/3',
                    objectFit: 'cover'
                  }}
                />
                <CardContent sx={{ flexGrow: 1, color: 'text.primary', p: 1.5, display: 'flex', flexDirection: 'column' }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{fontSize: '1.1rem', fontWeight: 'bold', minHeight: '3.3em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                    <Typography variant="body2" color="text.secondary">
                      {movie.releaseYear}
                    </Typography>
                    {movie.rating > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon sx={{ color: 'warning.main', mr: 0.5, fontSize: '1.1rem' }} />
                        <Typography variant="body2" color="text.primary" sx={{fontWeight: 'medium'}}>
                            {movie.rating.toFixed(1)}
                        </Typography>
                        </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default FavoritePage;