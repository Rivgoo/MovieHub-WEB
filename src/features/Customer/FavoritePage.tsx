import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate, useLocation } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

import { searchContent, removeFromFavorites } from '../../core/api/requests/request.content';
import { ContentDto } from '../../core/api/types/types.content';
import { useAuth } from '../../core/auth/useAuth';
import { useTheme } from '@mui/material/styles';
import StandardPagination from '../../shared/components/Pagination/StandardPagination';

const formatDuration = (totalMinutes: number | undefined): string => {
  if (totalMinutes === undefined || totalMinutes <= 0) return '';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let durationString = '';
  if (hours > 0) {
    durationString += `${hours} год `;
  }
  if (minutes > 0) {
    durationString += `${minutes} хв`;
  }
  return durationString.trim();
};

const PAGE_SIZE = 8;

const FavoritePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  
  const isMounted = useRef(false);

  const getInitialStateFromUrl = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    const pageString = urlParams.get('page');
    let pageNumber = 1;
    if (pageString !== null) {
      const parsedPage = parseInt(pageString, 10);
      if (!isNaN(parsedPage)) pageNumber = parsedPage;
    }
    const search = urlParams.get('search') || '';
    return { page: Math.max(1, pageNumber), search };
  }, [location.search]);

  const [favoriteMovies, setFavoriteMovies] = useState<ContentDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>(getInitialStateFromUrl().search);
  const [searchInput, setSearchInput] = useState<string>(getInitialStateFromUrl().search);
  const [currentPage, setCurrentPage] = useState<number>(getInitialStateFromUrl().page);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const { page: urlPage, search: urlSearch } = getInitialStateFromUrl();
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
      setSearchInput(urlSearch); 
    }
  }, [location.search, getInitialStateFromUrl]);


  useEffect(() => {
    if (!isMounted.current) return;

    const params = new URLSearchParams();
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    const newSearchString = params.toString();
    const currentUrlParams = new URLSearchParams(location.search).toString();

    if (newSearchString !== currentUrlParams) {
      navigate(`${location.pathname}${newSearchString ? `?${newSearchString}` : ''}`, { replace: true });
    }
  }, [currentPage, searchTerm, navigate, location.pathname, location.search]);


  const fetchFavoriteMovies = useCallback(async (pageToFetch: number, currentSearchTerm: string) => {
    if (!user) {
      setError("Будь ласка, увійдіть, щоб переглянути вподобані фільми.");
      setFavoriteMovies([]);
      setTotalPages(0);
      setIsLoading(false);
      return;
    }
    
    console.log(`Fetching favorites: page=${pageToFetch}, search="${currentSearchTerm}"`);
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('IsFavorited', 'true');
      params.set('PageIndex', (pageToFetch).toString());
      params.set('PageSize', PAGE_SIZE.toString());
      if (currentSearchTerm.trim()) {
        params.set('SearchTerms', currentSearchTerm.trim());
      }
      
      const response = await searchContent(params.toString());
      
      setFavoriteMovies(response.items || []);
      const newTotalPages = response.totalPages || 0;
      setTotalPages(newTotalPages);

    } catch (err: any) {
      console.error("Error fetching favorite movies:", err);
      let errorMessage = "Не вдалося завантажити список вподобаних фільмів. Спробуйте пізніше.";
      if (err.response && err.response.status === 400 && err.response.data?.errors?.PageIndex) {
         errorMessage = `Помилка запиту: невірний номер сторінки (${pageToFetch}).`;
      } else if (err.response && err.response.status === 404 && pageToFetch > 1) {
        errorMessage = `Сторінка ${pageToFetch} для пошуку "${currentSearchTerm}" не знайдена.`;
      }
      setError(errorMessage);
      setFavoriteMovies([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isMounted.current) {
        if (user) {
            fetchFavoriteMovies(currentPage, searchTerm);
        } else {
            setFavoriteMovies([]);
            setTotalPages(0);
            setIsLoading(false);
            setError("Будь ласка, увійдіть, щоб переглянути вподобані фільми.");
        }
    } else {
        const { page: urlPage, search: urlSearch } = getInitialStateFromUrl();
        if(currentPage === urlPage && searchTerm === urlSearch) {
            isMounted.current = true;
            if (user) fetchFavoriteMovies(currentPage, searchTerm);
        }
    }
  }, [user, currentPage, searchTerm, fetchFavoriteMovies, getInitialStateFromUrl]);


  useEffect(() => {
    if (!isLoading && isMounted.current) {
      if (totalPages > 0 && currentPage > totalPages) {
        console.log(`Correcting currentPage from ${currentPage} to ${totalPages}.`);
        setCurrentPage(totalPages);
      } else if (totalPages === 0 && currentPage !== 1) {
        console.log(`Correcting currentPage to 1 as totalPages is 0.`);
        setCurrentPage(1);
      }
    }
  }, [totalPages, currentPage, isLoading]);


  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    if (value !== currentPage) {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    }
  };
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchTerm) {
        setCurrentPage(1);
        setSearchTerm(searchInput);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, searchTerm]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };


  const handleMovieClick = (movieId: number) => {
    navigate(`/film/${movieId}`);
  };

  const handleRemoveFromFavorites = async (movie: ContentDto) => {
    if (!user || isRemoving === movie.id) return;
    
    setIsRemoving(movie.id);
    try {
      await removeFromFavorites(movie.id);
      fetchFavoriteMovies(currentPage, searchTerm); 
    } catch (err) {
      console.error(`Error removing movie "${movie.title}" from favorites:`, err);
      setError(`Не вдалося видалити фільм "${movie.title}" з обраних.`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsRemoving(null);
    }
  };
  
  const spacingValue = theme.spacing(2);
  const cardWidthXs = `calc(50% - (${spacingValue} / 2))`;
  const cardWidthSm = `calc(33.333% - (${spacingValue} * (2/3)))`;
  const cardWidthMd = `calc(25% - (${spacingValue} * (3/4)))`;
  const cardWidthLg = `calc(25% - (${spacingValue} * (3/4)))`;

  const iconDetailSx = { color: theme.palette.primary.main, mr: 0.5, fontSize: '1rem' };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '400px',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        color="text.primary"
        sx={{ fontWeight: 600, textAlign: 'center', mb: 2 }}
      >
        Вподобані фільми
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Пошук за назвою..."
        value={searchInput} 
        onChange={handleSearchInputChange}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
            input: { color: 'text.primary', padding: '12px 14px' },
          },
        }}
      />

      {isLoading && !isRemoving && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !isLoading && (
        <Alert severity="error" sx={{ width: '100%', justifyContent: 'center', mt: 1, mb: 1 }}>{error}</Alert>
      )}

      {!isLoading && !error && favoriteMovies.length === 0 && (
        <Typography variant="body1" color="text.primary" sx={{ textAlign: 'center', py: 5 }}>
          {searchTerm.trim() 
            ? "За вашим запитом нічого не знайдено серед вподобаних." 
            : "У вас ще немає вподобаних фільмів."}
        </Typography>
      )}

      {!isLoading && !error && favoriteMovies.length > 0 && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacingValue,
              mb: 2,
            }}
          >
            {favoriteMovies.map((movie) => (
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
                    position: 'relative',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                     '&:hover': {
                        borderColor: theme.palette.primary.main,
                    }
                  }}
                >
                  <Box 
                    onClick={() => handleMovieClick(movie.id)} 
                    sx={{
                        width: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        flexGrow: 1, 
                        cursor: 'pointer'
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Image"}
                      alt={movie.title}
                      sx={{
                        aspectRatio: '2/3',
                        objectFit: 'cover',
                        borderTopLeftRadius: '7px',
                        borderTopRightRadius: '7px',
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, color: 'text.primary', p: 1.5, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="div"
                        sx={{
                            fontWeight: '500',
                            lineHeight: 1.3,
                            minHeight: '2.6em', 
                            maxHeight: '2.6em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {movie.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', pt: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                           {movie.durationMinutes && movie.durationMinutes > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon sx={iconDetailSx} />
                              <Typography variant="caption" color="text.primary" sx={{ lineHeight: 1.2 }}>
                                {formatDuration(movie.durationMinutes)}
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon sx={iconDetailSx} />
                            <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.2 }}>
                              {movie.releaseYear}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                           {movie.rating != null && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <StarIcon sx={{ color: 'warning.main', mr: 0.25, fontSize: '1rem' }} />
                                    <Typography variant="body2" color="text.primary" sx={{fontWeight: 'medium', fontSize: '0.8rem'}}>
                                        {(Number(movie.rating) > 10 ? Number(movie.rating) / 10 : Number(movie.rating)).toFixed(1)}
                                    </Typography>
                                </Box>
                            )}
                          {movie.ageRating != null && movie.ageRating >= 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PersonIcon sx={iconDetailSx} />
                              <Typography variant="caption" color="text.primary" sx={{ lineHeight: 1.2 }}>
                                {movie.ageRating === 0 ? "Для всіх" : `${movie.ageRating}+`}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Box>
                  <IconButton
                    aria-label="remove from favorites"
                    onClick={() => handleRemoveFromFavorites(movie)}
                    disabled={isRemoving === movie.id}
                    sx={{
                      position: 'absolute',
                      top: theme.spacing(0.5),
                      right: theme.spacing(0.5),
                      color: theme.palette.primary.main,
                      backgroundColor: 'rgba(0,0,0,0.4)',
                       '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: theme.palette.error.main,
                        },
                       '&.Mui-disabled': {
                           backgroundColor: 'rgba(0,0,0,0.2)',
                           color: 'rgba(255,255,255,0.3)'
                       }
                    }}
                  >
                    {isRemoving === movie.id ? <CircularProgress size={20} color="inherit" /> : <FavoriteIcon fontSize="small" />}
                  </IconButton>
                </Card>
              </Box>
            ))}
          </Box>
          {totalPages > 1 && ( 
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb:1 }}>
              <StandardPagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default FavoritePage;