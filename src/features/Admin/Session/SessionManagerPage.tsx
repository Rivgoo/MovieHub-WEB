import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {useNavigate, useLocation } from 'react-router-dom';
import {Box} from '@mui/material';
import AdminLayout from '../AdminLayout';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import AdminActions from '../AdminActions/AdminActions';
import StandardPagination from '../../../shared/components/Pagination/StandardPagination';
import SessionModal from './SessionModal';
import './SessionManagerPage.css';
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
} 
from '../../../core/api/types/types.session';
import { CinemaHallDto } from '../../../core/api/types/types.cinemahall';
import { getApiErrorMessage } from '../../../core/api/getApiErrorMessage';
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
  const [enrichedSessions, setEnrichedSessions] = useState<EnrichedSession[]>(
    []
  )
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
        OrderField: 'StartTime',
        OrderType: 'OrderByDescending',
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
            `Кінозал ID: ${sc.cinemaHallId}`, 
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
    fetchSessions(1, currentFilters);
    setCurrentPage(1);
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

  return (
    <AdminLayout pageTitle="Керування сеансами">
      <Box className="session-page">
        <div className="session-page-header">
          <h2>Сеанси</h2>
          <button className="session-add-button" onClick={handleOpenModalToAdd}>
            Додати новий сеанс
          </button>
        </div>
        <div className="session-filters">
         <input
    type="text"
    className="session-search-input"
    placeholder="Пошук за назвою фільму"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value as SessionStatus | 'all')}
  style={{
    paddingRight: '2.5rem', 
    backgroundImage: `url("data:image/svg+xml,%3Csvg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '1rem',
    appearance: 'none',
    color: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
  }}
>
  <option value="all">Всі статуси</option>
  {Object.keys(sessionStatusTranslations).map((statusKey) => (
    <option key={statusKey} value={statusKey}>
      {sessionStatusTranslations[statusKey as SessionStatus]}
    </option>
  ))}
</select>
        <select
  value={cinemaHallFilter}
  onChange={(e) => setCinemaHallFilter(e.target.value)}
  disabled={isLoadingInitialLookups}
  style={{
    paddingRight: '2.5rem',
    backgroundImage: `url("data:image/svg+xml,%3Csvg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '1rem',
    appearance: 'none',
    color: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
  }}
>
  <option value="all">Всі кінозали</option>
  {isLoadingInitialLookups && (
    <option disabled>Завантаження...</option>
  )}
  {cinemaHalls.map((hall) => (
    <option key={hall.id} value={String(hall.id)}>
      {hall.name}
    </option>
  ))}
</select>
          <button onClick={handleFilterChange}>Фільтрувати</button>
        </div>
        {error && <div className="error-alert">{error}</div>}
        {isLoading ? (
          <div className="loading-spinner">Завантаження...</div>
        ) : sortedSessions.length === 0 ? (
          <div className="no-sessions">Сеансів не знайдено.</div>
        ) : (
          <div className="session-table-container">
            <div className="session-table-header">
              <span>фільм</span>
              <span>кінозал</span>
              <span>час початку</span>
              <span>ціна</span>
              <span>статус</span>
              <span className='sessions-actions-wrapper'>дії</span>
            </div>
            {sortedSessions.map(({ sessionContent, cinemaHallName }) => (
              <div key={sessionContent.id} className="session-table-row"> 
                <span>{sessionContent.title || 'Назва не вказана'}</span> 
                <span>{cinemaHallName}</span>
                <span>{formatDate(sessionContent.startTime)}</span>
                <span>{sessionContent.ticketPrice.toFixed(2)} грн</span>
                <span>
                  {sessionStatusTranslations[sessionContent.status] ||
                    sessionContent.status}
                </span>

                <span className="session-actions">
                     <AdminActions
                    onEdit={() =>handleOpenModalToEdit(sessionContent.id)}
                    onDelete={() => handleDeleteAction(sessionContent)}
                    />
                </span>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <StandardPagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
            />
          </div>
        )}

        <SessionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccessfulSave={handleSuccessfulSave}
          sessionToEdit={sessionToEdit}
          cinemaHalls={cinemaHalls}
        />

        {isConfirmDeleteModalOpen && sessionToDelete && (
          <ConfirmModal
            message={`Ви впевнені, що хочете видалити сеанс для фільму "${sessionToDelete.title || 'Без назви'}" на ${formatDate(sessionToDelete.startTime)}?`}
            onConfirm={confirmDelete}
            onCancel={() => {
              setIsConfirmDeleteModalOpen(false);
              setSessionToDelete(null);
            }}
          />
        )}
      </Box>
    </AdminLayout>
  );
};
export default SessionManagerPage;