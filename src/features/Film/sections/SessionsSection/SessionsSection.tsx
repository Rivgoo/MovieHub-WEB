import { useEffect, useState } from 'react';
import './SessionsSection.module.css';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { searchSessions } from '../../../../core/api/requests/request.session';
import {
  SessionDto,
  SessionFilterResponse,
} from '../../../../core/api/types/types.session';
import { display } from '@mui/system';

type Props = {};

const SessionsSection = (props: Props) => {
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
      <Typography variant="h4" component={'h1'}>
        Сеанси
      </Typography>
      {isLoading ? (
        <>Завантаження</>
      ) : (
        <Box>
          {Object.entries(groupedByDate).map(([date, sessions]) => (
            <Box
              key={date}
              style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">{formatDate(date)}</Typography>

              {sessions.map((el) => (
                <Box
                  key={el.id}
                  display="flex"
                  justifyContent="space-between"
                  width={150}>
                  <Typography
                    onClick={() => {
                      navigate(`/booking/session/${el.id}`);
                    }}>
                    {formatTime(el.startTime)}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default SessionsSection;
