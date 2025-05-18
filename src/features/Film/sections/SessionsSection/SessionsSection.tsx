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
        const response = await searchSessions(`ContentId=${id}`);
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

  const formatTime = (iso: string): string => {
    const date = new Date(iso);
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
                      <Typography variant="body1">
                        {formatTime(el.startTime)}
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
