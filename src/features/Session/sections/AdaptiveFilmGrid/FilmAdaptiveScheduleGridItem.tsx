import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import getFilmAdaptiveScheduleGridItemStyles from './FilmAdaptiveScheduleGridItem.styles';
import { useEffect, useState } from 'react';
import { searchSessionsWithContent } from '../../../../core/api/requests/request.session';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SessionWithContentDto } from '../../../../core/api/types/types.session';

type Props = {};

export default function FilmAdaptiveScheduleGridItem({}: Props) {
  const theme = useTheme();
  const styles = getFilmAdaptiveScheduleGridItemStyles(theme);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    moviesData: false,
  });

  const [filmData, setFilmData] = useState<SessionWithContentDto[]>([]);

  useEffect(() => {
    const fetchFilmData = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, moviesData: true }));

        const params = new URLSearchParams(searchParams.toString());

        let minStartTime = params.get('MinStartTime');
        let maxStartTime = params.get('MaxStartTime');

        if (!minStartTime || !maxStartTime) {
          const today = new Date().toISOString().split('T')[0];
          minStartTime = `${today}T08:00`;
          maxStartTime = `${today}T23:00`;
        }

        const queryParams = new URLSearchParams();
        queryParams.set('PageSize', '300');
        queryParams.set('orderField', 'StartTime');
        queryParams.set('orderType', 'OrderBy');
        queryParams.set('MinStartTime', minStartTime);
        queryParams.set('MaxStartTime', maxStartTime);

        const response = await searchSessionsWithContent(
          `?${queryParams.toString()}`
        );
        setFilmData(response.items);
      } catch (error) {
        console.error('Fetch failed', error);
      } finally {
        setIsLoading((prev) => ({ ...prev, moviesData: false }));
      }
    };

    fetchFilmData();
  }, [searchParams.toString()]);

  const groupByContentId = (sessions: SessionWithContentDto[]) => {
    const grouped: Record<string, SessionWithContentDto[]> = {};
    sessions.forEach((session) => {
      const key = session.contentId.toString();
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(session);
    });
    return grouped;
  };

  const groupedFilms = groupByContentId(filmData);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {isLoading.moviesData ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <CircularProgress />
        </Box>
      ) : filmData.length === 0 ? (
        <Typography variant="h6" sx={{ opacity: 0.7, textAlign: 'center' }}>
          Нічого не знайдено
        </Typography>
      ) : (
        Object.entries(groupedFilms).map(([contentId, sessions]) => {
          const film = sessions[0];
          return (
            <Card key={contentId} sx={styles.filmCardItem}>
              <CardActionArea
                sx={styles.filmPoster}
                onClick={() => navigate(`/film/${contentId}`)}>
                <CardMedia
                  component="img"
                  sx={styles.filmPoster}
                  image={film.posterUrl || '/placeholder-poster.jpg'}
                  alt={film.title}
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-poster.jpg';
                  }}
                />
              </CardActionArea>
              <CardContent sx={styles.filmCardContent}>
                <Typography variant="h6" component="div" sx={styles.filmTitle}>
                  {film.title}
                </Typography>

                <Box sx={styles.sessionPriceInfo}>
                  <Typography sx={styles.sessionPriceText}>
                    Від {Math.min(...sessions.map((s) => s.ticketPrice))} грн
                  </Typography>
                </Box>

                <Box sx={styles.filmInfoContainer}>
                  {sessions.map((s) => (
                    <Tooltip
                      key={s.id}
                      title={`Від ${s.ticketPrice} грн`}
                      placement="bottom"
                      arrow
                      enterDelay={50}
                      leaveDelay={100}
                      PopperProps={{
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, -10],
                            },
                          },
                        ],
                      }}>
                      <Typography
                        onClick={() => navigate(`/booking/session/${film.id}`)}
                        variant="body2"
                        sx={styles.filmTimeText}>
                        {new Date(s.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Tooltip>
                  ))}
                </Box>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
}
