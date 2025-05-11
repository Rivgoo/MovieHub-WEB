import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import { searchBookings } from '../../core/api/requests/request.booking';
import { BookingDto, BookingStatus } from '../../core/api/types/types.booking';
import { getSessionById } from '../../core/api/requests/request.session';
import { SessionDto } from '../../core/api/types/types.session';
import { getContentById } from '../../core/api/requests/request.content';
import { ContentDto } from '../../core/api/types/types.content';
import { getCinemaHallById } from '../../core/api/requests/request.cinemahall';
import { CinemaHallDto } from '../../core/api/types/types.cinemahall';
import { useAuth } from '../../core/auth/useAuth';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface EnrichedBooking {
  booking: BookingDto;
  session?: SessionDto;
  content?: ContentDto;
  cinemaHall?: CinemaHallDto;
  loadError?: string;
}

const bookingStatusTranslations: Record<BookingStatus, string> = {
  Pending: 'Очікується',
  Confirmed: 'Підтверджено',
  Cancelled: 'Скасовано',
};

const bookingStatusColors: Record<BookingStatus, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    Pending: 'warning',
    Confirmed: 'success',
    Cancelled: 'error',
};

const BookingPage: React.FC = () => {
  const [enrichedBookings, setEnrichedBookings] = useState<EnrichedBooking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchBookingDetails = useCallback(async (booking: BookingDto): Promise<EnrichedBooking> => {
    try {
      const sessionData = await getSessionById(booking.sessionId);
      const [contentData, cinemaHallData] = await Promise.all([
        getContentById(sessionData.contentId).catch(e => {
          console.error(`Failed to fetch content ${sessionData.contentId} for booking ${booking.id}:`, e);
          return undefined;
        }),
        getCinemaHallById(sessionData.cinemaHallId).catch(e => {
          console.error(`Failed to fetch cinema hall ${sessionData.cinemaHallId} for booking ${booking.id}:`, e);
          return undefined;
        })
      ]);
      return { booking, session: sessionData, content: contentData, cinemaHall: cinemaHallData };
    } catch (e) {
      console.error(`Failed to fetch session details for booking ${booking.id}:`, e);
      return { booking, loadError: "Не вдалося завантажити деталі сеансу" };
    }
  }, []);

  useEffect(() => {
    const fetchUserBookingsAndDetails = async () => {
      if (!user) {
        setError("Будь ласка, увійдіть, щоб переглянути ваші бронювання.");
        setIsLoading(false);
        setEnrichedBookings([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      setEnrichedBookings([]);

      try {
        const queryParams = `PageIndex=0&PageSize=100`;
        const response = await searchBookings(queryParams);
        
        if (response.items && response.items.length > 0) {
          const detailedBookingsPromises = response.items.map(booking => fetchBookingDetails(booking));
          const settledBookings = await Promise.all(detailedBookingsPromises);
          setEnrichedBookings(settledBookings);
        } else {
          setEnrichedBookings([]);
        }

      } catch (err) {
        console.error("Error fetching user bookings list:", err);
        setError("Не вдалося завантажити список бронювань. Спробуйте пізніше.");
        setEnrichedBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserBookingsAndDetails();
  }, [user, fetchBookingDetails]);

  const handleStatusFilterChange = (event: SelectChangeEvent<BookingStatus | 'all'>) => {
    setStatusFilter(event.target.value as BookingStatus | 'all');
  };

  const filteredBookings = useMemo(() => {
    let result = enrichedBookings;
    if (statusFilter !== 'all') {
      result = result.filter(eb => eb.booking.status === statusFilter);
    }
    return result;
  }, [enrichedBookings, statusFilter]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
  };


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
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        color="text.primary"
        sx={{ fontWeight: 600, textAlign: 'center', mb: 3 }}
      >
        Ваші бронювання
      </Typography>

      {/* Фільтри */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 180, flexGrow: 1, maxWidth: {xs: '100%', sm: '250px'} }} size="small">
          <InputLabel id="status-filter-label" sx={{color: 'text.primary', '&.Mui-focused': {color: 'primary.main'}}}>Статус</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Статус"
            onChange={handleStatusFilterChange}
            sx={{
                color: 'text.primary',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main'},
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                '& .MuiSelect-icon': { color: 'text.primary' },
            }}
            MenuProps={{ PaperProps: { sx: { bgcolor: 'background.paper', color: 'text.primary' }}}}
          >
            <MenuItem value="all">Всі статуси</MenuItem>
            {(Object.keys(bookingStatusTranslations) as BookingStatus[]).map(statusKey => (
              <MenuItem key={statusKey} value={statusKey}>
                {bookingStatusTranslations[statusKey]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !isLoading && (
        <Alert severity="error" sx={{ width: '100%', justifyContent: 'center' }}>{error}</Alert>
      )}

      {!isLoading && !error && filteredBookings.length === 0 && (
        <Typography variant="body1" color="text.primary" sx={{ textAlign: 'center', py: 5 }}>
          {enrichedBookings.length > 0 && statusFilter !== 'all' ? "Немає бронювань з таким статусом." : "У вас ще немає активних бронювань."}
        </Typography>
      )}

      {!isLoading && !error && filteredBookings.length > 0 && (
        <List sx={{ width: '100%' }}>
          {filteredBookings.map(({ booking, session, content, cinemaHall, loadError }) => (
            <React.Fragment key={booking.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1.5,
                  borderRadius: theme.shape.borderRadius,
                  p: 2,
                  boxShadow: 1,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: `0px 0px 12px ${theme.palette.primary.main}50`,
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div" color="primary.main">
                      {content ? (
                        <Link component="button" variant="h6" onClick={() => navigate(`/film/${content.id}`)} sx={{color: 'primary.main', textDecorationColor: theme.palette.primary.main + '99', textAlign: 'left'}}>
                            {content.title}
                        </Link>
                        ) : `Бронювання ID: ${booking.id}`
                      }
                    </Typography>
                  }
                  secondary={
                    <>
                      {loadError && <Typography color="error" variant="caption" display="block">{loadError}</Typography>}
                      
                      {session && (
                        <Typography component="div" variant="body2" color="text.primary" sx={{mt: 0.5}}>
                           Сеанс: {formatDate(session.startTime)}
                           {cinemaHall && ` - ${cinemaHall.name}`}
                        </Typography>
                      )}
                      {!session && !loadError &&
                        <Typography component="span" variant="body2" color="text.primary" display="block" sx={{mt: 0.5}}>
                            Сеанс: {booking.sessionId}
                        </Typography>
                      }
                      {session && (
                        <Typography component="span" variant="body2" color="text.primary" display="block" sx={{fontSize: '0.8rem'}}>
                          Кінозал: {session.cinemaHallId}
                        </Typography>
                      )}
                      
                      <Typography component="span" variant="body2" color="text.primary" display="block">
                        Місце: Ряд {booking.rowNumber}, Місце {booking.seatNumber}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.primary" display="block">
                        Дата бронювання: {formatDate(booking.createdAt)}
                      </Typography>
                      {booking.updatedAt !== booking.createdAt &&
                        <Typography component="span" variant="body2" color="text.primary" display="block" sx={{fontSize: '0.75rem'}}>
                            Оновлено: {formatDate(booking.updatedAt)}
                        </Typography>
                      }
                    </>
                  }
                />
                <Chip
                  label={bookingStatusTranslations[booking.status] || booking.status}
                  color={bookingStatusColors[booking.status] || 'default'}
                  size="small"
                  sx={{ ml: 'auto', alignSelf: 'center', fontWeight: 'medium' }}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default BookingPage;