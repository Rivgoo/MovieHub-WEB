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
import Chip, { ChipProps } from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TheatersIcon from '@mui/icons-material/Theaters';
import DateRangeIcon from '@mui/icons-material/DateRange';
import UpdateIcon from '@mui/icons-material/Update';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EventSeatIcon from '@mui/icons-material/EventSeat';

import { searchBookings, cancelBooking } from '../../core/api/requests/request.booking';
import { BookingDto, BookingStatus } from '../../core/api/types/types.booking';
import { getSessionById } from '../../core/api/requests/request.session';
import { SessionDto } from '../../core/api/types/types.session';
import { getContentById } from '../../core/api/requests/request.content';
import { ContentDto } from '../../core/api/types/types.content';
import { getCinemaHallById } from '../../core/api/requests/request.cinemahall';
import { CinemaHallDto } from '../../core/api/types/types.cinemahall';
import { useAuth } from '../../core/auth/useAuth';
import { useTheme, Theme } from '@mui/material/styles';
import { SxProps } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import StandardPagination from '../../shared/components/Pagination/StandardPagination';
import MetaTags from './../../shared/components/MetaTag/MetaTags';

import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

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
  Canceled: 'Скасовано',
};

const bookingStatusColors: Record<BookingStatus, string> = {
    Pending: '#ae570f',
    Confirmed: '#4b6436',
    Canceled: '#60211d',
};

const bookingStatusIcons: Record<BookingStatus, React.ReactElement> = {
    Pending: <HourglassEmptyIcon fontSize="small" />,
    Confirmed: <CheckCircleOutlineIcon fontSize="small" />,
    Canceled: <CancelOutlinedIcon fontSize="small" />,
};

type MuiChipStandardColor = Exclude<ChipProps['color'], undefined>;


function isMuiChipStandardColor(value: string): value is MuiChipStandardColor {
    const muiStandardColors: MuiChipStandardColor[] = [
        "default", "primary", "secondary", "error", "info", "success", "warning"
    ];
    return muiStandardColors.includes(value as MuiChipStandardColor);
}

const PAGE_SIZE = 5;

const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const [allBookings, setAllBookings] = useState<EnrichedBooking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCancelling, setIsCancelling] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const initialUrlParams = new URLSearchParams(location.search);
  const initialPage = parseInt(initialUrlParams.get('page') || '1', 10);
  const initialStatus = (initialUrlParams.get('status') as BookingStatus | 'all') || 'all';

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>(initialStatus);
  const [totalPages, setTotalPages] = useState<number>(0);

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

  const fetchUserBookingsAndDetails = useCallback(async (page: number, filter: BookingStatus | 'all') => {
    if (!user) {
      setError("Будь ласка, увійдіть, щоб переглянути ваші бронювання.");
      setIsLoading(false);
      setAllBookings([]);
      setTotalPages(0);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      let queryParams = `PageIndex=${page}&PageSize=${PAGE_SIZE}&OrderField=CreatedAt&OrderType=OrderByDescending`;
      if (filter !== 'all') {
        queryParams += `&Status=${filter}`;
      }
      
      const response = await searchBookings(queryParams);
      
      if (response.items && response.items.length > 0) {
        const detailedBookingsPromises = response.items.map(booking => fetchBookingDetails(booking));
        const settledBookings = await Promise.all(detailedBookingsPromises);
        setAllBookings(settledBookings);
        setTotalPages(response.totalPages);
      } else {
        setAllBookings([]);
        setTotalPages(0);

        if (page > 1 && response.totalPages > 0 && page > response.totalPages) {
            setCurrentPage(response.totalPages);
        }
      }

    } catch (err) {
      console.error("Error fetching user bookings list:", err);
      setError("Не вдалося завантажити список бронювань. Спробуйте пізніше.");
      setAllBookings([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchBookingDetails]);

  useEffect(() => {
    fetchUserBookingsAndDetails(currentPage, statusFilter);
  }, [fetchUserBookingsAndDetails, currentPage, statusFilter]);
  
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    if (statusFilter !== 'all') {
      params.set('status', statusFilter);
    }
    const searchString = params.toString();
    if (location.search.substring(1) !== searchString) {
        navigate(`${location.pathname}${searchString ? `?${searchString}` : ''}`, { replace: true });
    }
  }, [currentPage, statusFilter, navigate, location.pathname, location.search]);


  const handleStatusFilterChange = (event: SelectChangeEvent<BookingStatus | 'all'>) => {
    setStatusFilter(event.target.value as BookingStatus | 'all');
    setCurrentPage(1);
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (isCancelling === bookingId) return;
    setIsCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      setAllBookings(prevBookings => 
        prevBookings.map(eb => 
          eb.booking.id === bookingId 
            ? { ...eb, booking: { ...eb.booking, status: 'Canceled' as BookingStatus, updatedAt: new Date().toISOString() } } // Оновлюємо updatedAt
            : eb
        )
      );
    } catch (err) {
      console.error(`Error cancelling booking ${bookingId}:`, err);
      setError(`Не вдалося скасувати бронювання ID: ${bookingId}. Можливо, час для скасування вичерпано або сеанс вже розпочався/завершився.`);
      setTimeout(() => setError(null), 7000);
    } finally {
      setIsCancelling(null);
    }
  };

  const canCancelBooking = (sessionStartTime?: string, bookingStatus?: BookingStatus): boolean => {
    if (!sessionStartTime || bookingStatus === 'Canceled') return false;
    const sessionTime = parseISO(sessionStartTime).getTime();
    const now = new Date().getTime();
    const oneHourInMs = 60 * 60 * 1000;
    return (sessionTime - now) > oneHourInMs;
  };

  const filteredBookingsToDisplay = useMemo(() => {
    let bookingsToProcess = [...allBookings];
    bookingsToProcess.sort((a, b) => {
        const sessionAStartTime = a.session?.startTime ? parseISO(a.session.startTime).getTime() : 0;
        const sessionBStartTime = b.session?.startTime ? parseISO(b.session.startTime).getTime() : 0;
        const now = new Date().getTime();

        const isASessionPast = sessionAStartTime < now;
        const isBSessionPast = sessionBStartTime < now;

        if (isASessionPast && !isBSessionPast) return 1;
        if (!isASessionPast && isBSessionPast) return -1;

        if (sessionAStartTime !== sessionBStartTime)
            return sessionBStartTime - sessionAStartTime;
        
        const dateA = parseISO(a.booking.createdAt).getTime();
        const dateB = parseISO(b.booking.createdAt).getTime();
        return dateB - dateA;
    });
    return bookingsToProcess;
  }, [allBookings]);

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      const hasTimeZoneInfo = /Z|[+-]\d{2}:\d{2}$/.test(dateString);
      const stringToParse = hasTimeZoneInfo ? dateString : `${dateString}Z`;
      const dateObject = parseISO(stringToParse);
      return format(dateObject, 'dd.MM.yyyy, HH:mm', { locale: uk });
    } catch (e) {
      console.error("Error formatting date:", e, "Original string:", dateString);
      return dateString;
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo(0,0);
  };

  const iconStyle = { mr: 0.75, color: 'text.primary', fontSize: '1.1rem', verticalAlign: 'middle' };

  const getChipStyling = (status: BookingStatus): { color: ChipProps['color'], sx: SxProps<Theme> } => {
    const colorString = bookingStatusColors[status];
    const baseSx: SxProps<Theme> = {
        p: '1rem', 
        fontWeight: 'medium',
        width: '100%',
    };

    if (isMuiChipStandardColor(colorString)) {
        return {
            color: colorString,
            sx: baseSx,
        };
    } else {
        return {
            color: 'default',
            sx: {
                ...baseSx,
                backgroundColor: colorString,
                color: theme.palette.getContrastText(colorString),
                '& .MuiChip-icon': {
                    color: theme.palette.getContrastText(colorString),
                },
            },
        };
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
      <MetaTags 
        title="Мої Бронювання - Мій Кабінет | MovieHub"
        description="Переглядайте історію ваших бронювань квитків на MovieHub..." 
      />
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        color="text.primary"
        sx={{ fontWeight: 600, textAlign: 'center', mb: 3 }}
      >
        Ваші бронювання
      </Typography>

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
                borderRadius: '8px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main'},
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                '& .MuiSelect-icon': { color: 'text.primary' },
            }}
            MenuProps={{ PaperProps: { sx: { bgcolor: 'background.paper', color: 'text.primary', borderRadius: '8px' }}}}
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

      {isLoading && !isCancelling && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !isLoading && (
        <Alert severity="error" sx={{ width: '100%', justifyContent: 'center', mb: 2 }}>{error}</Alert>
      )}

      {!isLoading && !error && filteredBookingsToDisplay.length === 0 && (
        <Typography variant="body1" color="text.primary" sx={{ textAlign: 'center', py: 5 }}>
          {allBookings.length > 0 && statusFilter !== 'all' 
            ? "Немає бронювань з таким статусом." 
            : "У вас ще немає бронювань."}
        </Typography>
      )}

      {!isLoading && !error && filteredBookingsToDisplay.length > 0 && (
        <>
          <List sx={{ width: '100%' }}>
            {filteredBookingsToDisplay.map(({ booking, session, content, cinemaHall, loadError }) => {
              const showCancelButton = 
                canCancelBooking(session?.startTime, booking.status);
              
              const chipStyling = getChipStyling(booking.status);

              return (
              <React.Fragment key={booking.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: 'background.paper',
                    mb: 1.5,
                    borderRadius: theme.shape.borderRadius,
                    p: 2,
                    boxShadow: 1,
                    textDecoration: 'none',
                    flexDirection: {xs: 'column', sm: 'row'},
                    transition: 'all 0.15s ease-in-out',
                    outline: `1px solid transparent`,
                    '&:hover': {
                      outline: `1px solid ${theme.palette.primary.main}`,
                      boxShadow: 3,
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div" color="primary.main" sx={{mb: 0.5}}>
                        {content ? (
                          <Link 
                            component="button"
                            variant="h6" 
                            onClick={() => navigate(`/film/${content.id}`)} 
                            sx={{
                              color: 'primary.main', 
                              fontWeight: 600,
                              textAlign: 'left',
                              p:0,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textDecoration: 'none',
                              transition: 'color 0.15s ease-in-out',
                              '&:hover': {
                                color: theme.palette.primary.light,
                              },
                            }}
                          >
                              {content.title}
                          </Link>
                          ) : `Бронювання ID: ${booking.id}`
                        }
                      </Typography>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <Box>
                        {loadError && <Typography color="error" variant="caption" component="div" sx={{mb: 0.5}}>{loadError}</Typography>}
                        
                        {session && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <AccessTimeIcon sx={iconStyle} />
                            <Typography component="span" variant="body2" color="text.primary">
                               <strong>Сеанс:</strong> {formatDate(session.startTime)}
                            </Typography>
                          </Box>
                        )}
                        {cinemaHall && (
                           <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <TheatersIcon sx={iconStyle} />
                            <Typography component="span" variant="body2" color="text.primary">
                               <strong>Кінозал:</strong> {cinemaHall.name}
                            </Typography>
                          </Box>
                        )}
                        {!session && !loadError && !cinemaHall &&
                          <Typography component="div" variant="body2" color="text.primary" sx={{mb: 0.5}}>
                              ID сеансу: {booking.sessionId} (деталі не завантажено)
                          </Typography>
                        }
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <EventSeatIcon sx={iconStyle} />
                          <Typography component="span" variant="body2" color="text.primary">
                            <strong>Місце:</strong> Ряд {booking.rowNumber}, Місце {booking.seatNumber}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <DateRangeIcon sx={iconStyle} />
                          <Typography component="span" variant="body2" color="text.primary">
                            <strong>Дата бронювання:</strong> {formatDate(booking.createdAt)}
                          </Typography>
                        </Box>
                        
                        {booking.updatedAt !== booking.createdAt &&
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <UpdateIcon sx={iconStyle} />
                            <Typography component="span" variant="body2" color="text.primary">
                              <strong>Оновлено:</strong> {formatDate(booking.updatedAt)}
                            </Typography>
                          </Box>
                        }
                      </Box>
                    }
                  />
                  <Box sx={{display: 'flex', flexDirection: 'column', alignItems: {xs: 'stretch', sm: 'flex-end'}, justifyContent: 'center', ml: {xs: 0, sm: 'auto'}, mt: {xs: 1.5, sm: 0}, width: {xs: '100%', sm: 'auto'}}}>
                    <Chip
                      icon={bookingStatusIcons[booking.status]}
                      label={bookingStatusTranslations[booking.status] || booking.status}
                      color={chipStyling.color}
                      size="small"
                      sx={{...chipStyling.sx, mb: showCancelButton ? 1 : 0 }}
                    />
                       {showCancelButton && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={isCancelling === booking.id}
                        sx={{ 
                          mt: {xs: 1, sm: 0.5}, 
                          width: '100%',
                          '&:hover': {
                            backgroundColor: theme.palette.error.main,
                            color: theme.palette.error.contrastText,  
                            borderColor: theme.palette.error.dark,
                          },
                        }}
                      >
                        {isCancelling === booking.id ? <CircularProgress size={18} color="inherit" /> : 'Скасувати'}
                      </Button>
                    )}
                  </Box>
                </ListItem>
              </React.Fragment>
            )})}
          </List>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
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

export default BookingPage;