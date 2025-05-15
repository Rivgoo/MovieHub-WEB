import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Tooltip,
  IconButton as MuiIconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ChairIcon from '@mui/icons-material/Chair';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

import Layout from '../../shared/components/Layout';
import { PrimaryButton, BorderButton } from '../../shared/components/Buttons';
import { useAuth } from '../../core/auth/useAuth';

import { getSessionById } from '../../core/api/requests/request.session';
import { getContentById } from '../../core/api/requests/request.content';
import { getCinemaHallById } from '../../core/api/requests/request.cinemahall';
import {
  searchBookings,
  createBooking,
} from '../../core/api/requests/request.booking';

import { SessionDto } from '../../core/api/types/types.session';
import { ContentDto } from '../../core/api/types/types.content';
import { CinemaHallDto } from '../../core/api/types/types.cinemahall';
import { getApiErrorMessage } from '../../core/api/getApiErrorMessage';
import { ApiErrorResponse } from '../../core/api/types';
import { AxiosError } from 'axios';

import {
  getBookingSeatPageStaticStyles,
  getSeatDynamicStyles,
  getLegendColorBoxStyles,
} from './BookingSeatPage.styles';

import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

const PLACEHOLDER_POSTER_URL = '/placeholder-poster.png';

interface Seat {
  row: number;
  seat: number;
  isBooked: boolean;
  isSelected: boolean;
}

const BookingSeatPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const styles = getBookingSeatPageStaticStyles(theme);
  const { user, token } = useAuth();

  const [session, setSession] = useState<SessionDto | null>(null);
  const [content, setContent] = useState<ContentDto | null>(null);
  const [cinemaHall, setCinemaHall] = useState<CinemaHallDto | null>(null);
  const [bookedSeats, setBookedSeats] = useState<Set<string>>(new Set());
  const [seatsLayout, setSeatsLayout] = useState<Seat[][]>([]);
  const [selectedSeat, setSelectedSeat] = useState<{
    row: number;
    seat: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bookingSuccessDialogOpen, setBookingSuccessDialogOpen] =
    useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });

  const numericSessionId = useMemo(
    () => (sessionId ? parseInt(sessionId, 10) : null),
    [sessionId]
  );

  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return 'N/A';
    try {
      const hasTimeZoneInfo = /Z|[+-]\d{2}:\d{2}$/.test(dateStr);
      const stringToParse = hasTimeZoneInfo ? dateStr : `${dateStr}Z`;
      const dateObject = parseISO(stringToParse);
      return format(dateObject, 'dd MMMM yyyy, HH:mm', { locale: uk });
    } catch (e) {
      console.error('Error formatting date:', e, 'Original string:', dateStr);
      return dateStr;
    }
  };

  const fetchAllData = useCallback(async () => {
    if (!numericSessionId) {
      setError('Невірний ID сеансу.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setSession(null);
    setContent(null);
    setCinemaHall(null);
    setBookedSeats(new Set());
    setSelectedSeat(null);

    try {
      const sessionData = await getSessionById(numericSessionId);
      setSession(sessionData);

      const statusesToQuery: string[] = ['Pending', 'Confirmed'];
      const statusesQueryParam = statusesToQuery
        .map((status) => `Statuses=${status}`)
        .join('&');

      const bookingsQuery = `PageSize=850&SessionId=${numericSessionId}&${statusesQueryParam}`;

      const [contentData, cinemaHallData, bookingsResponse] = await Promise.all(
        [
          getContentById(sessionData.contentId).catch((err) => {
            console.error('Error fetching content:', err);
            throw new Error('Не вдалося завантажити інформацію про фільм.');
          }),
          getCinemaHallById(sessionData.cinemaHallId).catch((err) => {
            console.error('Error fetching cinema hall:', err);
            throw new Error('Не вдалося завантажити інформацію про кінозал.');
          }),
          searchBookings(bookingsQuery).catch((err) => {
            console.error('Error fetching bookings:', err);
            throw new Error(
              'Не вдалося завантажити інформацію про заброньовані місця.'
            );
          }),
        ]
      );
      setContent(contentData);
      setCinemaHall(cinemaHallData);
      const currentlyBookedSeats = new Set<string>();
      bookingsResponse.items?.forEach((b) =>
        currentlyBookedSeats.add(`${b.rowNumber}-${b.seatNumber}`)
      );
      setBookedSeats(currentlyBookedSeats);
    } catch (err: any) {
      const apiError = err as AxiosError<ApiErrorResponse>;
      setError(
        apiError.isAxiosError && apiError.response?.data?.code
          ? getApiErrorMessage(apiError, 'Помилка завантаження даних сеансу.')
          : err.message || 'Помилка завантаження даних сеансу.'
      );
      console.error('Fetch data error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [numericSessionId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (cinemaHall) {
      setSeatsLayout(
        cinemaHall.seatsPerRow.map((seatsInRow, rIdx) =>
          Array.from({ length: seatsInRow }, (_, sIdx) => ({
            row: rIdx + 1,
            seat: sIdx + 1,
            isBooked: bookedSeats.has(`${rIdx + 1}-${sIdx + 1}`),
            isSelected:
              selectedSeat?.row === rIdx + 1 && selectedSeat?.seat === sIdx + 1,
          }))
        )
      );
    } else {
      setSeatsLayout([]);
    }
  }, [cinemaHall, bookedSeats, selectedSeat]);

  const handleSeatClick = (row: number, seat: number, isBooked: boolean) => {
    if (isBooked) return;
    setSelectedSeat((prev) =>
      prev && prev.row === row && prev.seat === seat ? null : { row, seat }
    );
  };

  const handleBooking = async () => {
    if (!user || !token) {
      setSnackbar({
        open: true,
        message: 'Будь ласка, увійдіть, щоб забронювати місце.',
        severity: 'info',
      });
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!selectedSeat || !numericSessionId) {
      setSnackbar({
        open: true,
        message: 'Будь ласка, оберіть місце.',
        severity: 'warning',
      });
      return;
    }
    setIsBooking(true);
    setError(null);
    try {
      await createBooking({
        sessionId: numericSessionId,
        rowNumber: selectedSeat.row,
        seatNumber: selectedSeat.seat,
      });
      setBookingSuccessDialogOpen(true);
      setBookedSeats((prev) =>
        new Set(prev).add(`${selectedSeat.row}-${selectedSeat.seat}`)
      );
      setSelectedSeat(null);
    } catch (err: any) {
      const apiError = err as AxiosError<ApiErrorResponse>;
      let errMsg = getApiErrorMessage(
        apiError,
        'Не вдалося забронювати місце.'
      );
      if (
        apiError.isAxiosError &&
        apiError.response?.data?.code === 'Booking.SeatIsBooked'
      ) {
        errMsg = 'Це місце щойно забронювали. Оновлюємо схему...';

        const statusesToQuery: string[] = ['Pending', 'Confirmed'];
        const statusesQueryParam = statusesToQuery
          .map((status) => `Statuses=${status}`)
          .join('&');
        const bookingsQuery = `PageSize=850&SessionId=${numericSessionId}&${statusesQueryParam}`;

        searchBookings(bookingsQuery)
          .then((bookingsResponse) => {
            const currentlyBookedSeats = new Set<string>();
            bookingsResponse.items?.forEach((b) => {
              currentlyBookedSeats.add(`${b.rowNumber}-${b.seatNumber}`);
            });
            setBookedSeats(currentlyBookedSeats);
          })
          .catch((fetchErr) =>
            console.error('Error refetching bookings after conflict:', fetchErr)
          );

        setSelectedSeat(null);
      }
      setSnackbar({ open: true, message: errMsg, severity: 'error' });
      console.error('Booking error:', err);
    } finally {
      setIsBooking(false);
    }
  };

  const handleCloseSuccessDialog = () => setBookingSuccessDialogOpen(false);
  const handleGoToMyBookings = () => {
    setBookingSuccessDialogOpen(false);
    navigate('/account/booking');
  };
  const handleGoBack = () => {
    setBookingSuccessDialogOpen(false);
    if (location.state?.from) navigate(location.state.from);
    else if (content?.id) navigate(`/film/${content.id}`);
    else navigate(-1);
  };
  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formatDuration = (mins?: number) =>
    !mins || mins <= 0
      ? 'N/A'
      : `${Math.floor(mins / 60) > 0 ? `${Math.floor(mins / 60)} год ` : ''}${mins % 60 > 0 ? `${mins % 60} хв` : ''}`.trim() ||
        'N/A';

  if (isLoading)
    return (
      <Layout>
        <Container sx={styles.loadingContainer}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  if (error && !session)
    return (
      <Layout>
        <Container sx={styles.errorContainer}>
          <Alert severity="error" icon={<ErrorOutlineIcon />}>
            {error}
          </Alert>
          <PrimaryButton
            onClick={() => navigate('/')}
            sx={styles.backToHomeButton}>
            На головну
          </PrimaryButton>
        </Container>
      </Layout>
    );
  if (!session || !content || !cinemaHall)
    return (
      <Layout>
        <Container sx={styles.errorContainer}>
          <Alert severity="warning" icon={<InfoIcon />}>
            Не вдалося завантажити повну інформацію про сеанс.
          </Alert>
          <PrimaryButton
            onClick={() => navigate('/')}
            sx={styles.backToHomeButton}>
            На головну
          </PrimaryButton>
        </Container>
      </Layout>
    );

  return (
    <Layout>
      <Container maxWidth="xl" sx={styles.pageContainer}>
        <Paper elevation={3} sx={styles.mainPaper}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={styles.pageTitle}>
            <AssignmentAddIcon /> Бронювання квитків
          </Typography>
          {error && !isBooking && (
            <Alert
              severity="error"
              sx={styles.errorAlert}
              icon={<ErrorOutlineIcon />}>
              {error}
            </Alert>
          )}
          <Grid container spacing={{ xs: 1, md: 2 }} sx={styles.gridContainer}>
            <Grid size={{ xs: 12, md: 4 }} sx={styles.infoPanelGridItem}>
              {' '}
              <Box sx={styles.infoPanelPaper}>
                <Box sx={styles.posterBox}>
                  <img
                    src={content.posterUrl || PLACEHOLDER_POSTER_URL}
                    alt={content.title}
                    style={styles.posterImage as React.CSSProperties}
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        PLACEHOLDER_POSTER_URL)
                    }
                  />
                </Box>
                <Typography variant="h6" sx={styles.contentTitle}>
                  {content.title}
                </Typography>
                <Box sx={styles.detailsTextContainer}>
                  <Chip
                    label={`${content.ageRating === 0 ? 'Для всіх' : `Вікове обмежееня: ${content.ageRating}+`}`}
                    size="small"
                    sx={styles.ageRatingChip}
                  />
                  <Typography component="div">
                    <MovieIcon fontSize="small" sx={styles.detailIcon} />
                    <strong>Тривалість: </strong> ​{' '}
                    {formatDuration(content.durationMinutes)}
                  </Typography>
                  <Typography component="div">
                    <TheatersIcon fontSize="small" sx={styles.detailIcon} />
                    <strong>Кінозал: </strong> ​ {cinemaHall.name}
                  </Typography>
                  <Typography component="div">
                    <AccessTimeIcon fontSize="small" sx={styles.detailIcon} />
                    <strong>Час: </strong> ​{' '}
                    {formatDate(session.startTime)}{' '}
                  </Typography>
                  <Typography component="div">
                    <ConfirmationNumberIcon
                      fontSize="small"
                      sx={styles.detailIcon}
                    />
                    <strong>Ціна: </strong> ​ {session.ticketPrice.toFixed(2)}{' '}
                    грн
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }} sx={styles.seatingPanelGridItem}>
              <Box sx={styles.seatingPanelPaper}>
                <Typography variant="h6" sx={styles.seatingPanelTitle}>
                  Оберіть місце
                </Typography>
                <Box sx={styles.screenDisplayBox}>
                  <Box sx={styles.screenElement}>ЕКРАН</Box>
                </Box>
                <Box sx={styles.seatRowsContainer}>
                  {seatsLayout.map((row, rIdx) => (
                    <Box key={rIdx} sx={styles.seatRow}>
                      <Typography sx={styles.seatRowLabel}>
                        Р{rIdx + 1}
                      </Typography>
                      {row.map((seat) => (
                        <Tooltip
                          title={
                            seat.isBooked
                              ? 'Зайнято'
                              : `Ряд ${seat.row}, Місце ${seat.seat}`
                          }
                          key={`${seat.row}-${seat.seat}`}
                          placement="top">
                          <Box component="span" sx={styles.seatButtonWrapper}>
                            <Button
                              variant="contained"
                              onClick={() =>
                                handleSeatClick(
                                  seat.row,
                                  seat.seat,
                                  seat.isBooked
                                )
                              }
                              disabled={seat.isBooked}
                              sx={getSeatDynamicStyles(
                                theme,
                                seat.isBooked,
                                seat.isSelected
                              )}>
                              {seat.seat}
                            </Button>
                          </Box>
                        </Tooltip>
                      ))}
                    </Box>
                  ))}
                </Box>
                <Box sx={styles.legendContainer}>
                  <Box sx={styles.legendItem}>
                    <Box
                      sx={getLegendColorBoxStyles(theme.palette.grey[200])}
                    />
                    <Typography variant="caption" sx={styles.legendText}>
                      Вільне
                    </Typography>
                  </Box>
                  <Box sx={styles.legendItem}>
                    <Box
                      sx={getLegendColorBoxStyles(theme.palette.primary.main)}
                    />
                    <Typography variant="caption" sx={styles.legendText}>
                      Обране
                    </Typography>
                  </Box>
                  <Box sx={styles.legendItem}>
                    <Box sx={getLegendColorBoxStyles('#893f14')} />
                    <Typography variant="caption" sx={styles.legendText}>
                      Зайняте
                    </Typography>
                  </Box>
                </Box>
                {selectedSeat && (
                  <Paper elevation={3} sx={styles.selectedSeatInfoPaper}>
                    <Typography variant="h6" sx={styles.selectedSeatTitle}>
                      <BookOnlineIcon /> Ваше замовлення:
                    </Typography>
                    <Typography sx={styles.selectedSeatDetail}>
                      Фільм ⯈{' '}
                      <Box component="span" sx={styles.selectedSeatDetailValue}>
                        {content.title}
                      </Box>
                    </Typography>
                    <Typography sx={styles.selectedSeatDetail}>
                      Сеанс ⯈{' '}
                      <Box component="span" sx={styles.selectedSeatDetailValue}>
                        {formatDate(session.startTime)}
                      </Box>
                    </Typography>
                    <Typography sx={styles.selectedSeatDetail}>
                      Кінозал ⯈{' '}
                      <Box component="span" sx={styles.selectedSeatDetailValue}>
                        {cinemaHall.name}
                      </Box>
                    </Typography>
                    <Typography sx={{ ...styles.selectedSeatHighlight, mt: 1 }}>
                      <ChairIcon /> Ряд: {selectedSeat.row}, Місце:{' '}
                      {selectedSeat.seat}
                    </Typography>
                    <Typography sx={styles.selectedSeatHighlight}>
                      <LocalOfferIcon />
                      Ціна: {session.ticketPrice.toFixed(2)} грн
                    </Typography>
                  </Paper>
                )}
                <Box sx={styles.bookButtonContainer}>
                  <PrimaryButton
                    onClick={handleBooking}
                    disabled={
                      !selectedSeat || isBooking || seatsLayout.length === 0
                    }
                    startIcon={
                      isBooking ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <EventSeatIcon />
                      )
                    }
                    sx={styles.bookButton}>
                    {isBooking ? 'Бронювання...' : 'Забронювати'}
                  </PrimaryButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Dialog
        open={bookingSuccessDialogOpen}
        onClose={handleCloseSuccessDialog}
        PaperProps={{ sx: styles.successDialogPaper }}>
        <DialogTitle sx={styles.successDialogTitle}>
          <CheckCircleOutlineIcon sx={styles.successDialogIcon} />
          Бронювання успішне!
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={styles.successDialogContentText}>
            Ваше місце на фільм "{content.title}" о{' '}
            {formatDate(session.startTime)} успішно заброньовано.
            <br />
            Деталі у вашому кабінеті.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={styles.successDialogActions}>
          <BorderButton
            onClick={handleGoBack}
            sx={{ minWidth: { xs: '100px', sm: '120px' }, px: 2 }}>
            Повернутись
          </BorderButton>
          <PrimaryButton
            onClick={handleGoToMyBookings}
            autoFocus
            sx={{ minWidth: { xs: '130px', sm: '150px' }, px: 2 }}>
            Мої бронювання
          </PrimaryButton>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={styles.snackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={styles.snackbarAlert}
          iconMapping={{
            success: <CheckCircleOutlineIcon fontSize="inherit" />,
            error: <ErrorOutlineIcon fontSize="inherit" />,
            info: <InfoIcon fontSize="inherit" />,
            warning: <ErrorOutlineIcon fontSize="inherit" />,
          }}
          action={
            <MuiIconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </MuiIconButton>
          }>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};
export default BookingSeatPage;
