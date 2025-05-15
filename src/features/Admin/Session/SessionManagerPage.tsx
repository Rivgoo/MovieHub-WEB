import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  useTheme,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import AdminLayout from '../AdminLayout';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import StandardPagination from '../../../shared/components/Pagination/StandardPagination';
import SessionModal from './SessionModal';
import {
  searchSessionsWithContent,
  deleteSession,
  getSessionById,
} from '../../../core/api/requests/request.session';
import { getAllCinemaHalls } from '../../../core/api/requests/request.cinemahall';
import {
  SessionContentDto,
  SessionStatus,
  SessionDto,
} from '../../../core/api/types/types.session';
import { CinemaHallDto } from '../../../core/api/types/types.cinemahall';
import { PrimaryButton } from '../../../shared/components/Buttons';
import { StandardInput } from '../../../shared/components/InputComponents';
import { getApiErrorMessage } from '../../../core/api/getApiErrorMessage';
import { alpha } from '@mui/material/styles';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

const PAGE_SIZE = 20;

interface EnrichedSession {
  sessionContent: SessionContentDto;
  cinemaHallName?: string;
}

const buildUrlQuery = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  for (const key in params) {
    if (
      key !== 'ContentId' &&
      params[key] !== undefined &&
      params[key] !== null &&
      String(params[key]).trim() !== '' &&
      params[key] !== 'all'
    ) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).forEach((val) => query.append(key, val));
      } else {
        query.append(key, String(params[key]));
      }
    }
  }
  return query.toString();
};

const parseUrlQuery = (search: string): Record<string, any> => {
  const params = new URLSearchParams(search);
  const result: Record<string, any> = {};
  params.forEach((value, key) => {
    if (key === 'PageIndex' || key === 'CinemaHallId') {
      const numVal = parseInt(value, 10);
      result[key] = isNaN(numVal) ? value : numVal;
    } else if (key !== 'ContentId') {
      result[key] = value;
    }
  });
  return result;
};

const sessionStatusTranslations: Record<SessionStatus, string> = {
  Ongoing: 'Триває',
  Ended: 'Завершено',
  Scheduled: 'Заплановано',
};

const SessionManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [enrichedSessions, setEnrichedSessions] = useState<EnrichedSession[]>(
    []
  );
  const [cinemaHalls, setCinemaHalls] = useState<CinemaHallDto[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInitialLookups, setIsLoadingInitialLookups] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>(
    'all'
  );
  const [cinemaHallFilter, setCinemaHallFilter] = useState<string>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<SessionDto | null>(null);
  const [sessionToDelete, setSessionToDelete] =
    useState<SessionContentDto | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  useEffect(() => {
    const fetchInitialLookups = async () => {
      setIsLoadingInitialLookups(true);
      try {
        const hallsData = await getAllCinemaHalls();
        setCinemaHalls(hallsData || []);
      } catch (err) {
        console.error('Error fetching initial lookups (cinema halls):', err);
        setError('Помилка завантаження даних для фільтрів (кінозали).');
      } finally {
        setIsLoadingInitialLookups(false);
      }
    };
    fetchInitialLookups();
  }, []);

  const fetchSessions = useCallback(
    async (page: number, currentFilters: Record<string, any>) => {
      setIsLoading(true);
      setError(null);

      const queryParams: Record<string, any> = {
        PageIndex: page,
        PageSize: PAGE_SIZE,
        OrderField: ['StartTime'],
        OrderType: ['OrderByDescending'],
        ...currentFilters,
      };

      if (queryParams.ContentId) {
        delete queryParams.ContentId;
      }

      const cleanedQueryParams: Record<string, any> = {};
      for (const key in queryParams) {
        if (
          queryParams[key] !== undefined &&
          queryParams[key] !== null &&
          String(queryParams[key]).trim() !== '' &&
          queryParams[key] !== 'all'
        ) {
          cleanedQueryParams[key] = queryParams[key];
        }
      }

      const urlQueryString = buildUrlQuery(cleanedQueryParams);

      if (location.search.substring(1) !== urlQueryString) {
        navigate(`${location.pathname}?${urlQueryString}`, { replace: true });
      }

      try {
        const queryStringForAPI = urlQueryString ? `?${urlQueryString}` : '';
        const response = await searchSessionsWithContent(queryStringForAPI);

        const enriched = (response.items || []).map((sc) => ({
          sessionContent: sc,
          cinemaHallName:
            cinemaHalls.find((ch) => ch.id === sc.cinemaHallId)?.name ||
            `ID: ${sc.cinemaHallId}`,
        }));

        setEnrichedSessions(enriched);
        setTotalPages(response.totalPages || 0);

        if (
          page > (response.totalPages || 0) &&
          (response.totalPages || 0) > 0 &&
          response.totalPages > 0
        ) {
          setCurrentPage(response.totalPages);
        } else if (response.totalPages === 0 && page !== 1) {
          setCurrentPage(1);
        }
      } catch (err: any) {
        setError(getApiErrorMessage(err, 'Помилка завантаження сеансів'));
        setEnrichedSessions([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    },
    [cinemaHalls, navigate, location.pathname, location.search]
  );

  useEffect(() => {
    const params = parseUrlQuery(location.search);
    const newPage = params.PageIndex || 1;
    const newSearchTerm = params.SearchTerms || '';
    const newStatusFilter = (params.Status as SessionStatus | 'all') || 'all';
    const newCinemaHallFilter = String(params.CinemaHallId || 'all');

    setCurrentPage(newPage);
    setSearchTerm(newSearchTerm);
    setStatusFilter(newStatusFilter);
    setCinemaHallFilter(newCinemaHallFilter);

    if (!isLoadingInitialLookups) {
      fetchSessions(newPage, {
        SearchTerms: newSearchTerm,
        Status: newStatusFilter,
        CinemaHallId: newCinemaHallFilter,
      });
    }
  }, [location.search, isLoadingInitialLookups, fetchSessions]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const currentFilters = {
      SearchTerms: searchTerm,
      Status: statusFilter,
      CinemaHallId: cinemaHallFilter,
    };
    const urlQueryString = buildUrlQuery({
      PageIndex: value,
      PageSize: PAGE_SIZE,
      ...currentFilters,
    });
    navigate(`${location.pathname}?${urlQueryString}`);
    window.scrollTo(0, 0);
  };

  const handleFilterChange = () => {
    const currentFilters = {
      SearchTerms: searchTerm,
      Status: statusFilter,
      CinemaHallId: cinemaHallFilter,
    };
    const urlQueryString = buildUrlQuery({
      PageIndex: 1,
      PageSize: PAGE_SIZE,
      ...currentFilters,
    });
    navigate(`${location.pathname}?${urlQueryString}`);
  };

  const handleOpenModalToAdd = () => {
    setSessionToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenModalToEdit = async (sessionId: number) => {
    try {
      const sessionData = await getSessionById(sessionId);
      setSessionToEdit(sessionData);
      setIsModalOpen(true);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          'Не вдалося завантажити дані сеансу для редагування.'
        )
      );
    }
  };

  const handleSuccessfulSave = () => {
    const currentFilters = {
      SearchTerms: searchTerm,
      Status: statusFilter,
      CinemaHallId: cinemaHallFilter,
    };
    fetchSessions(currentPage, currentFilters);
  };

  const handleDeleteAction = (session: SessionContentDto) => {
    setSessionToDelete(session);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (sessionToDelete) {
      setIsLoading(true);
      try {
        await deleteSession(sessionToDelete.id);
        const currentFilters = {
          SearchTerms: searchTerm,
          Status: statusFilter,
          CinemaHallId: cinemaHallFilter,
        };
        if (enrichedSessions.length === 1 && currentPage > 1) {
          fetchSessions(currentPage - 1, currentFilters);
        } else {
          fetchSessions(currentPage, currentFilters);
        }
      } catch (err: any) {
        setError(getApiErrorMessage(err, 'Помилка видалення сеансу'));
      } finally {
        setIsConfirmDeleteModalOpen(false);
        setSessionToDelete(null);
      }
    }
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      const hasTimeZoneInfo = /Z|[+-]\d{2}:\d{2}$/.test(dateString);
      const stringToParse = hasTimeZoneInfo ? dateString : `${dateString}Z`;
      const dateObject = parseISO(stringToParse);
      return format(dateObject, 'dd.MM.yyyy, HH:mm', { locale: uk });
    } catch (e) {
      console.error(
        'Error formatting date:',
        e,
        'Original string:',
        dateString
      );
      return dateString;
    }
  };

  const sortedSessions = useMemo(
    () => [...enrichedSessions],
    [enrichedSessions]
  );
  const commonSelectSx = {
    color: theme.palette.primary.light,
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.primary.light, 0.3),
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '& .MuiSelect-icon': { color: theme.palette.primary.light },
  };
  const commonLabelSx = {
    color: theme.palette.primary.light,
    '&.Mui-focused': { color: theme.palette.primary.main },
  };

  return (
    <AdminLayout>
      <Box sx={{ p: { xs: 1.5, md: 2 }, color: theme.palette.text.primary }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
            flexWrap: 'wrap',
          }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.light,
              fontSize: { xs: '1.8rem', md: '2.125rem' },
            }}>
            Управління Сеансами
          </Typography>
          <PrimaryButton
            onClick={handleOpenModalToAdd}
            startIcon={<AddIcon />}
            sx={{ mt: { xs: 1.5, sm: 0 } }}>
            Додати Сеанс
          </PrimaryButton>
        </Box>

        <Paper
          sx={{
            p: { xs: 1.5, md: 2 },
            mb: 2.5,
            bgcolor: 'var(--admin-list-item-color)',
          }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              {' '}
              <StandardInput
                fullWidth
                label="Пошук за назвою фільму"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputLabelProps={{ shrink: !!searchTerm }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              {' '}
              <FormControl fullWidth size="small">
                <InputLabel
                  id="status-filter-label"
                  sx={commonLabelSx}
                  shrink={!!statusFilter}>
                  Статус
                </InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Статус"
                  onChange={(e: SelectChangeEvent<SessionStatus | 'all'>) =>
                    setStatusFilter(e.target.value as SessionStatus | 'all')
                  }
                  sx={commonSelectSx}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'background.paper',
                        color: theme.palette.text.primary,
                        borderRadius: '8px',
                      },
                    },
                  }}>
                  <MenuItem value="all">Всі статуси</MenuItem>
                  {(
                    Object.keys(
                      sessionStatusTranslations
                    ) as (keyof typeof sessionStatusTranslations)[]
                  ).map((statusKey) => (
                    <MenuItem key={statusKey} value={statusKey}>
                      {sessionStatusTranslations[statusKey]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              {' '}
              <FormControl fullWidth size="small">
                <InputLabel
                  id="hall-filter-label"
                  sx={commonLabelSx}
                  shrink={!!cinemaHallFilter || isLoadingInitialLookups}>
                  Кінозал
                </InputLabel>
                <Select
                  labelId="hall-filter-label"
                  value={cinemaHallFilter}
                  label="Кінозал"
                  onChange={(e: SelectChangeEvent<string>) =>
                    setCinemaHallFilter(e.target.value)
                  }
                  sx={commonSelectSx}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'background.paper',
                        color: theme.palette.text.primary,
                        borderRadius: '8px',
                      },
                    },
                  }}
                  disabled={isLoadingInitialLookups}>
                  <MenuItem value="all">Всі кінозали</MenuItem>
                  {isLoadingInitialLookups && (
                    <MenuItem value="" disabled>
                      <em>Завантаження...</em>
                    </MenuItem>
                  )}
                  {cinemaHalls.map((hall) => (
                    <MenuItem key={hall.id} value={String(hall.id)}>
                      {hall.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              size={{ xs: 12, md: 2 }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}>
              <Button
                variant="contained"
                onClick={handleFilterChange}
                startIcon={<FilterListIcon />}
                size="medium"
                sx={{
                  height: '40px',
                  width: { xs: '100%', sm: 'auto' },
                  bgcolor: theme.palette.primary.main,
                  '&:hover': { bgcolor: theme.palette.primary.dark },
                }}>
                {' '}
                Фільтр{' '}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              bgcolor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
            }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : sortedSessions.length === 0 ? (
          <Typography
            sx={{
              textAlign: 'center',
              mt: 3,
              color: theme.palette.text.secondary,
            }}>
            Сеансів не знайдено.
          </Typography>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                bgcolor: 'var(--admin-dark)',
                overflowX: { xs: 'auto', md: 'initial' },
              }}>
              <Table
                aria-label="sessions table"
                size="small"
                sx={{ minWidth: { xs: '800px', md: '100%' } }}>
                <TableHead
                  sx={{ backgroundColor: 'var(--admin-list-item-color)' }}>
                  <TableRow>
                    <TableCell
                      sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                      ID
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'text.primary',
                        fontWeight: 'bold',
                        minWidth: '150px',
                      }}>
                      Фільм
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'text.primary',
                        fontWeight: 'bold',
                        minWidth: '120px',
                      }}>
                      Кінозал
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'text.primary',
                        fontWeight: 'bold',
                        minWidth: '130px',
                      }}>
                      Час початку
                    </TableCell>
                    <TableCell
                      sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                      Ціна (грн)
                    </TableCell>
                    <TableCell
                      sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                      Статус
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 'bold',
                        minWidth: '100px',
                      }}>
                      Дії
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedSessions.map(({ sessionContent, cinemaHallName }) => (
                    <TableRow
                      key={sessionContent.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'var(--admin-list-item-hover-color)',
                        },
                      }}>
                      <TableCell sx={{ color: 'text.primary' }}>
                        {sessionContent.id}
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>
                        {sessionContent.title ||
                          `ID: ${sessionContent.contentId}`}
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>
                        {cinemaHallName}
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>
                        {formatDate(sessionContent.startTime)}
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>
                        {sessionContent.ticketPrice.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ color: 'text.primary' }}>
                        {sessionStatusTranslations[sessionContent.status] ||
                          sessionContent.status}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Редагувати">
                          <IconButton
                            onClick={() =>
                              handleOpenModalToEdit(sessionContent.id)
                            }
                            size="small">
                            <EditIcon
                              fontSize="small"
                              sx={{ color: 'primary.contrastText' }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Видалити">
                          <IconButton
                            onClick={() => handleDeleteAction(sessionContent)}
                            size="small">
                            <DeleteIcon
                              fontSize="small"
                              sx={{ color: 'primary.contrastText' }}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 3,
                  mb: 1,
                }}>
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

      <SessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccessfulSave={handleSuccessfulSave}
        sessionToEdit={sessionToEdit}
        cinemaHalls={cinemaHalls}
      />

      {isConfirmDeleteModalOpen && sessionToDelete && (
        <ConfirmModal
          message={`Ви впевнені, що хочете видалити сеанс ID: ${sessionToDelete.id} (${sessionToDelete.title || 'Без назви'})?`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsConfirmDeleteModalOpen(false);
            setSessionToDelete(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default SessionManagerPage;
