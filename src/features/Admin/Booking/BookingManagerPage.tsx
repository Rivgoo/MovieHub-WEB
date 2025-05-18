import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AdminLayout from '../AdminLayout';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import StandardPagination from '../../../shared/components/Pagination/StandardPagination';
import {
  searchBookings,
  deleteBooking,
  cancelBooking,
} from '../../../core/api/requests/request.booking';
import { getSessionById } from '../../../core/api/requests/request.session';
import { getContentById } from '../../../core/api/requests/request.content';
import { getCinemaHallById } from '../../../core/api/requests/request.cinemahall';
import { BookingDto, BookingStatus } from '../../../core/api/types/types.booking';
import { SessionDto } from '../../../core/api/types/types.session';
import { ContentDto } from '../../../core/api/types/types.content';
import { CinemaHallDto } from '../../../core/api/types/types.cinemahall';
import { BorderButton } from '../../../shared/components/Buttons';
import './BookingManagerPage.css';

import EventIcon from '@mui/icons-material/Event';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import ChairIcon from '@mui/icons-material/Chair';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';


const PAGE_SIZE = 10;

interface EnrichedBooking {
  booking: BookingDto;
  session?: SessionDto;
  content?: ContentDto;
  cinemaHall?: CinemaHallDto;
  fetchError?: string;
}

const bookingStatusTranslations: Record<BookingStatus, string> = {
  Pending: 'Очікується',
  Confirmed: 'Підтверджено',
  Canceled: 'Скасовано',
};

const BookingManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [enrichedBookings, setEnrichedBookings] = useState<EnrichedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

  const [bookingToDelete, setBookingToDelete] = useState<BookingDto | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  const [bookingToConfirmCancel, setBookingToConfirmCancel] = useState<BookingDto | null>(null);
  const [isConfirmCancelModalOpen, setIsConfirmCancelModalOpen] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);

  const fetchBookingDetails = useCallback(async (booking: BookingDto): Promise<EnrichedBooking> => {
    try {
      const session = await getSessionById(booking.sessionId);
      const [content, cinemaHall] = await Promise.all([
        getContentById(session.contentId).catch(() => undefined),
        getCinemaHallById(session.cinemaHallId).catch(() => undefined),
      ]);
      return { booking, session, content, cinemaHall };
    } catch (e) {
      console.error(`Failed to fetch details for booking ${booking.id}:`, e);
      return { booking, fetchError: "Не вдалося завантажити деталі сеансу" };
    }
  }, []);

  const fetchBookings = useCallback(async (page: number, filter: BookingStatus | 'all') => {
    setIsLoading(true);
    setError(null);
    try {
      let queryParams = `PageIndex=${page}&PageSize=${PAGE_SIZE}&OrderField=CreatedAt&OrderType=OrderByDescending`;
      if (filter !== 'all') {
        queryParams += `&Status=${filter}`;
      }

      const response = await searchBookings(queryParams);
      if (response.items && response.items.length > 0) {
        const detailedBookingsPromises = response.items.map(b => fetchBookingDetails(b));
        const settledBookings = await Promise.all(detailedBookingsPromises);
        setEnrichedBookings(settledBookings);
      } else {
        setEnrichedBookings([]);
      }
      setTotalPages(response.totalPages || 0);
      if (page > (response.totalPages || 0) && (response.totalPages || 0) > 0 && response.totalPages > 0) {
        setCurrentPage(response.totalPages);
      } else if (response.totalPages === 0 && page !== 1) {
        setCurrentPage(1);
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.description || err.message || 'Помилка завантаження бронювань';
      console.error("Fetch bookings error:", err);
      setError(errorMessage);
      setEnrichedBookings([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [fetchBookingDetails]);

  useEffect(() => {
    fetchBookings(currentPage, statusFilter);
  }, [currentPage, statusFilter, fetchBookings]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
     window.scrollTo(0, 0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<BookingStatus | 'all'>) => {
    setStatusFilter(event.target.value as BookingStatus | 'all');
    setCurrentPage(1);
  };

  const handleDeleteAction = (booking: BookingDto) => {
    setBookingToDelete(booking);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (bookingToDelete) {
      setIsProcessingAction(true);
      setError(null);
      try {
        await deleteBooking(bookingToDelete.id);
        if (enrichedBookings.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1); 
        } else {
            fetchBookings(currentPage, statusFilter); 
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.description || 'Помилка видалення бронювання';
        console.error("Delete booking error:", err);
        setError(errorMessage);
      } finally {
        setIsProcessingAction(false);
        setIsConfirmDeleteModalOpen(false);
        setBookingToDelete(null);
      }
    }
  };

  const handleCancelAction = (bookingDto: BookingDto) => {
    setBookingToConfirmCancel(bookingDto);
    setIsConfirmCancelModalOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (bookingToConfirmCancel) {
      setIsProcessingAction(true);
      setError(null);
      try {
        await cancelBooking(bookingToConfirmCancel.id);
        fetchBookings(currentPage, statusFilter); 
      } catch (err: any) {
        const errorMessage = err.response?.data?.description || 'Помилка скасування бронювання. Можливо, недостатньо прав.';
        console.error("Cancel booking error:", err, err.response); 
        setError(errorMessage);
      } finally {
        setIsProcessingAction(false);
        setIsConfirmCancelModalOpen(false);
        setBookingToConfirmCancel(null);
      }
    }
  };


  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; 
        return date.toLocaleString('uk-UA', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
        });
    } catch(e){
        return dateString; 
    }
  };
  
  const sortedBookings = useMemo(() => {
    return [...enrichedBookings].sort((a,b) => {
        const creationDiff = new Date(b.booking.createdAt).getTime() - new Date(a.booking.createdAt).getTime();
        if (creationDiff !== 0) return creationDiff;
        const sessionAStart = a.session?.startTime ? new Date(a.session.startTime).getTime() : 0;
        const sessionBStart = b.session?.startTime ? new Date(b.session.startTime).getTime() : 0;
        return sessionBStart - sessionAStart;
    });
  }, [enrichedBookings]);

  const renderBookingItem = (
    label: string, 
    value: React.ReactNode, 
    icon?: React.ReactNode,
    isLink: boolean = false,
    onClick?: () => void
  ) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8, color: theme.palette.text.primary}}>
        {icon && <Box sx={{mr: 1, display: 'inline-flex', color: theme.palette.primary.main }}>{icon}</Box>}
        <Typography variant="body2" component="span" sx={{ fontWeight: 500, minWidth: '90px', color: theme.palette.primary.light }}>
            {label}:
        </Typography>
        {isLink ? 
            <MuiLink onClick={onClick} sx={{ cursor: 'pointer' }} className="admin-details-link">
                <Typography variant="body2" component="span" sx={{ color: 'inherit', wordBreak: 'break-word' }}>{value}</Typography>
            </MuiLink>
            :
            <Typography variant="body2" component="span" sx={{ color: 'text.primary', wordBreak: 'break-word' }}>{value}</Typography>
        }
    </Box>
);

  const commonButtonStyles = (colorType: 'warning' | 'error') => ({
    fontSize: '0.75rem',
    padding: '2px 6px',
    textTransform: 'none',
    borderRadius: '0.55rem',
    borderColor: theme.palette[colorType].main,
    color: theme.palette[colorType].main,
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
    '&:hover': {
        borderColor: theme.palette[colorType].dark,
        backgroundColor: theme.palette[colorType].main,
        color: theme.palette[colorType].contrastText,
    }
  });


  const TableView = () => (
    <Box sx={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <TableContainer component={Paper} sx={{ 
            backgroundColor: 'var(--admin-dark)', 
            minWidth: {xs: '900px', md: '100%'} 
        }}>
        <Table aria-label="bookings table" size="small">
            <TableHead sx={{ backgroundColor: 'var(--admin-list-item-color)'}}>
            <TableRow>
                <TableCell sx={{color: 'text.primary', fontWeight: 'bold', textAlign: 'center'}}>ID</TableCell>
                <TableCell sx={{color: 'text.primary', fontWeight: 'bold', textAlign: 'center'}}>Фільм</TableCell>
                <TableCell sx={{color: 'text.primary', fontWeight: 'bold', textAlign: 'center'}}>Кінозал</TableCell>
                <TableCell sx={{color: 'text.primary', fontWeight: 'bold', textAlign: 'center'}}>Час сеансу</TableCell>
                <TableCell sx={{color: 'text.primary', fontWeight: 'bold', textAlign: 'center'}}>Місце</TableCell>
                <TableCell sx={{color: 'text.primary', fontWeight: 'bold', textAlign: 'center'}}>User ID</TableCell>
                <TableCell sx={{color: 'text.primary', fontWeight: 'bold', textAlign: 'center'}}>Статус</TableCell>
                <TableCell sx={{color: 'text.primary', fontWeight: 'bold', textAlign: 'center'}}>Заброньовано</TableCell>
                <TableCell align="right" sx={{color: 'text.primary', fontWeight: 'bold', textAlign: 'center', minWidth: '150px'}}>Дії</TableCell> 
            </TableRow>
            </TableHead>
            <TableBody>
            {sortedBookings.map(({ booking, session, content, cinemaHall, fetchError }) => (
                <TableRow key={booking.id} sx={{ '&:hover': { backgroundColor: 'var(--admin-list-item-hover-color)'}}}>
                <TableCell sx={{color: 'text.primary', textAlign: 'center'}}>{booking.id}</TableCell>
                <TableCell sx={{color: 'text.primary'}}>
                    {fetchError && !content ? <Typography variant="caption" color="error">{fetchError}</Typography> : 
                    content ? (
                        <MuiLink
                        className="admin-details-link"
                        onClick={() => navigate(`/film/${content.id}`)} sx={{cursor: 'pointer'}}>
                        {content.title}
                        </MuiLink>
                    ) : session ? `ID контенту: ${session.contentId}` : 'Завантаження...'}
                </TableCell>
                <TableCell sx={{color: 'text.primary'}}>{fetchError && !cinemaHall ? '' : cinemaHall ? cinemaHall.name : session ? `ID залу: ${session.cinemaHallId}` : 'Завантаження...'}</TableCell>
                <TableCell sx={{color: 'text.primary', textAlign: 'center'}}>{fetchError && !session ? '' : session ? formatDate(session.startTime) : 'Завантаження...'}</TableCell>
                <TableCell sx={{color: 'text.primary', textAlign: 'center'}}>{`Р${booking.rowNumber}, М${booking.seatNumber}`}</TableCell>
                <TableCell sx={{color: 'text.primary', textAlign: 'center'}}>
                    <MuiLink 
                        className="admin-details-link"
                        onClick={() => navigate(`/admin/user-manager/edit/${booking.userId}`)} sx={{cursor: 'pointer'}}>
                    {booking.userId.substring(0,8)}...
                    </MuiLink>
                </TableCell>
                <TableCell sx={{textAlign: 'center'}}>
                    <Chip
                    label={bookingStatusTranslations[booking.status] || booking.status}
                    size="small"
                    className={`booking-status-chip ${booking.status}`} 
                    sx={{color: 'white'}} 
                    />
                </TableCell>
                <TableCell sx={{color: 'text.primary', textAlign: 'center'}}>{formatDate(booking.createdAt)}</TableCell>
                <TableCell align="right" sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center', py: '6px', minWidth: '150px' }}>
                    {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleCancelAction(booking)} 
                        disabled={isProcessingAction && bookingToConfirmCancel?.id === booking.id}
                        sx={commonButtonStyles('warning')}
                    >
                        {isProcessingAction && bookingToConfirmCancel?.id === booking.id ? <CircularProgress size={14} color="inherit"/> : 'Скасувати'}
                    </Button>
                    )}
                    <BorderButton 
                      variant="outlined"
                      size="small"
                      onClick={() => handleDeleteAction(booking)}
                      disabled={isProcessingAction}
                      sx={commonButtonStyles('error')}
                    >
                    Видалити
                    </BorderButton>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </Box>
  );

  const CardView = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2}}>
      {sortedBookings.map(({ booking, session, content, cinemaHall, fetchError }) => (
        <Box
          key={booking.id}
          sx={{
            width: { xs: '100%', sm: `calc(50% - ${theme.spacing(1)})` }, 
            display: 'flex', 
          }}
        >
          <Card sx={{ 
            backgroundColor: 'var(--admin-list-item-color)', 
            color: 'text.primary', 
            width: '100%', 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
            borderRadius: '8px'
          }}>
            <CardContent sx={{pb: 1}}>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 1, fontSize: '1.1rem' }}>
                Бронювання ID: {booking.id}
              </Typography>
              <Divider sx={{mb: 1.5, borderColor: alpha(theme.palette.common.white, 0.2)}}/>

              {fetchError && !content &&
                <Alert severity="error" variant="outlined" icon={false} sx={{p:0.5, fontSize: '0.8rem', mb:1, color: theme.palette.error.light, borderColor: theme.palette.error.light}}>
                    {fetchError}
                </Alert>
              }

              {renderBookingItem("Фільм", content ? content.title : (session ? `ID: ${session.contentId}` : 'N/A'), <MovieIcon fontSize="small"/>, !!content, () => content && navigate(`/film/${content.id}`))}
              {renderBookingItem("Кінозал", cinemaHall ? cinemaHall.name : (session ? `ID: ${session.cinemaHallId}` : 'N/A'), <TheatersIcon fontSize="small"/>)}
              {renderBookingItem("Сеанс", session ? formatDate(session.startTime) : 'N/A', <EventIcon fontSize="small"/>)}
              {renderBookingItem("Місце", `Ряд ${booking.rowNumber}, Місце ${booking.seatNumber}`, <ChairIcon fontSize="small"/>)}
              {renderBookingItem("User", booking.userId.substring(0,12) + "...", <PersonIcon fontSize="small"/>, true, () => navigate(`/admin/user-manager/edit/${booking.userId}`))}
              {renderBookingItem("Статус", 
                <Chip
                  label={bookingStatusTranslations[booking.status] || booking.status}
                  size="small"
                  className={`booking-status-chip ${booking.status}`} 
                  sx={{color: 'white', height: 'auto', lineHeight: 1.4, py: '2px', px: '6px'}}
                />, <InfoIcon fontSize="small"/>
              )}
              {renderBookingItem("Заброньовано", formatDate(booking.createdAt), <CalendarTodayIcon fontSize="small"/>)}
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', pt: 0, px: 2, pb: 1.5, gap: 1 }}>
              {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleCancelAction(booking)}
                  disabled={isProcessingAction && bookingToConfirmCancel?.id === booking.id}
                  sx={commonButtonStyles('warning')}
                >
                  {isProcessingAction && bookingToConfirmCancel?.id === booking.id ? <CircularProgress size={14} color="inherit"/> : 'Скасувати'}
                </Button>
              )}
              <BorderButton
                variant="outlined"
                size="small"
                onClick={() => handleDeleteAction(booking)}
                disabled={isProcessingAction}
                sx={commonButtonStyles('error')}
              >
                Видалити
              </BorderButton>
            </CardActions>
          </Card>
        </Box>
      ))}
    </Box>
  );


  return (
    <AdminLayout pageTitle="Керування бронюваннями">
      <Box className="booking-manager-page" sx={{ color: theme.palette.text.primary }}>
        <Box sx={{ 
            display: 'flex', 
            flexDirection: {xs: 'column', sm: 'row'},
            justifyContent: 'space-between', 
            alignItems: {xs: 'stretch', sm: 'center'},
            mb: 2.5,
            gap: {xs: 1.5, sm: 2}
        }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: theme.palette.primary.light, textAlign: {xs: 'center', sm: 'left'} }}>
            Бронювання
          </Typography>
          <FormControl sx={{ minWidth: 200, width: {xs: '100%', sm: 'auto'} }} size="small">
            <InputLabel id="status-filter-label" sx={{color: theme.palette.primary.light, '&.Mui-focused': {color: theme.palette.primary.main}}}>
                Фільтр за статусом
            </InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Фільтр за статусом"
              onChange={handleStatusFilterChange}
              sx={{
                color: theme.palette.primary.light,
                borderRadius: '8px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.primary.light, 0.3) },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.light },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
                '& .MuiSelect-icon': { color: theme.palette.primary.light },
              }}
              MenuProps={{ PaperProps: { sx: { 
                bgcolor: theme.palette.background.paper,
                color: theme.palette.primary.light,
                borderRadius: '8px',
                border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`
              }}}}
            >
              <MenuItem value="all" sx={{color: theme.palette.text.primary}}>Всі статуси</MenuItem>
              {(Object.keys(bookingStatusTranslations) as BookingStatus[]).map(statusKey => (
                <MenuItem key={statusKey} value={statusKey} sx={{color: theme.palette.text.primary}}>
                  {bookingStatusTranslations[statusKey]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, bgcolor: theme.palette.error.main, color: theme.palette.error.contrastText }}>{error}</Alert>}

        {isLoading && !isProcessingAction && enrichedBookings.length === 0 ? (
          <Box display="flex" justifyContent="center" py={5}><CircularProgress sx={{color: theme.palette.primary.main }}/></Box>
        ) : !isLoading && sortedBookings.length === 0 ? (
          <Typography sx={{ textAlign: 'center', mt: 3, color: theme.palette.text.secondary }}>
            {statusFilter === 'all' ? 'Бронювань не знайдено.' : 'Бронювань з таким статусом не знайдено.'}
          </Typography>
        ) : (
          <>
            {isMobile ? <CardView /> : <TableView />}
            
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
      </Box>
      {isConfirmDeleteModalOpen && bookingToDelete && (
        <ConfirmModal
          message={`Ви впевнені, що хочете видалити бронювання ID: ${bookingToDelete.id}?`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsConfirmDeleteModalOpen(false);
            setBookingToDelete(null);
          }}
        />
      )}
      {isConfirmCancelModalOpen && bookingToConfirmCancel && (
        <ConfirmModal
          message={`Ви впевнені, що хочете скасувати бронювання ID: ${bookingToConfirmCancel.id}?`}
          onConfirm={confirmCancelBooking}
          onCancel={() => {
            setIsConfirmCancelModalOpen(false);
            setBookingToConfirmCancel(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default BookingManagerPage;