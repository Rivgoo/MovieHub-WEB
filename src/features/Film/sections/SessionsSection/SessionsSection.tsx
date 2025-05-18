import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { searchSessions } from '../../../../core/api/requests/request.session';
import {
  SessionDto,
  SessionFilterResponse,
} from '../../../../core/api/types/types.session';

import getSessionSectionStyles from './SessionSection.styles';
import { FillBorderButton } from '../../../../shared/components/Buttons';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

const SessionsSection = () => {
  const theme = useTheme();
  const styles = getSessionSectionStyles(theme);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [sessions, setSessions] = useState<SessionFilterResponse>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const response = await searchSessions(
          `PageSize=100&MinStartTime=${getMinStartTime()}&MaxStartTime=${getMaxStartTime()}&ContentId=${id}`
        );
        setSessions(response);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (iso: string): string => {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'long',
    }).format(date);
  };

  const getMinStartTime = (): string => {
    const now = new Date();
    now.setUTCHours(8, 0, 0, 0);
    return now.toISOString();
  };

  const getMaxStartTime = (): string => {
    const max = new Date();
    max.setUTCDate(max.getUTCDate() + 10);
    max.setUTCHours(23, 0, 0, 0);
    return max.toISOString();
  };

  const toLocalHM = (dateStr: string): string => {
    const hasTimeZoneInfo = /Z|[+-]\d{2}:\d{2}$/.test(dateStr);
    const stringToParse = hasTimeZoneInfo ? dateStr : `${dateStr}Z`;
    const dateObject = parseISO(stringToParse);
    return format(dateObject, 'HH:mm', { locale: uk });
  };

  const groupByDate = (sessions: SessionDto[]) => {
    const grouped: Record<string, SessionDto[]> = {};

    sessions.forEach((session) => {
      const dateKey = session.startTime.split('T')[0]; // YYYY-MM-DD

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(session);
    });

    return grouped;
  };

  const groupedByDate = groupByDate(sessions?.items ?? []);

  return (
    <Container>
      <Typography variant="h4" sx={styles.sectionTitle}>
        Сеанси
      </Typography>
      {isLoading ? (
        <Box sx={styles.loadingBar}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {Object.entries(groupedByDate).length === 0 ? (
            <Box sx={styles.loadingBar}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ ...styles.sessionDate, opacity: '0.7' }}>
                {'Нажаль сеанси відсутні ;('}
              </Typography>
            </Box>
          ) : (
            Object.entries(groupedByDate).map(([date, sessions]) => (
              <Box key={date} mb={3} sx={styles.sessionDateItem}>
                <Typography variant="h5" gutterBottom sx={styles.sessionDate}>
                  {formatDate(date)}
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={2}>
                  {sessions.map((el) => (
                    <FillBorderButton
                      key={el.id}
                      sx={styles.sessionTimeBtn}
                      onClick={() => navigate(`/booking/session/${el.id}`)}>
                      <Typography variant="body1" sx={styles.timeText}>
                        {toLocalHM(el.startTime)}
                      </Typography>
                      <Typography variant="body1" sx={styles.priceText}>
                        {el.ticketPrice} грн
                      </Typography>
                    </FillBorderButton>
                  ))}
                </Box>

                <Divider sx={styles.divider} />
              </Box>
            ))
          )}
        </Box>
      )}
    </Container>
  );
};

export default SessionsSection;
