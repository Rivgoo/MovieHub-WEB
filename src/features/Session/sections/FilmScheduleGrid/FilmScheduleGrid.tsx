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
import getFilmScheduleGridStyles from './FilmScheduleGrid.styles';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchSessionsWithContent } from '../../../../core/api/requests/request.session';
import { SessionWithContentDto } from '../../../../core/api/types/types.session';

export default function FilmScheduleGrid() {
  const theme = useTheme();
  const styles = getFilmScheduleGridStyles(theme);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [filmData, setFilmData] = useState<SessionWithContentDto[]>([]);

  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    moviesData: false,
  });

  useEffect(() => {
    const fetchFilmData = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, moviesData: true }));

        const params = new URLSearchParams(searchParams.toString());

        let minStartTime = params.get('MinStartTime');
        let maxStartTime = params.get('MaxStartTime');
        let CinemaHallId = params.get('CinemaHallId') ?? '';
        let HasAvailableSeats = params.get('HasAvailableSeats') ?? '';
        let Status = params.get('Status') ?? '';
        let MinTicketPrice = params.get('MinTicketPrice') ?? '';
        let MaxTicketPrice = params.get('MaxTicketPrice') ?? '';

        debugger;
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

        queryParams.set('CinemaHallId', CinemaHallId);
        queryParams.set('HasAvailableSeats', HasAvailableSeats);
        queryParams.set('Status', Status);
        queryParams.set('MinTicketPrice', MinTicketPrice);
        queryParams.set('MaxTicketPrice', MaxTicketPrice);

        const response = await searchSessionsWithContent(
          `?${queryParams.toString()}`
        );
        console.log(queryParams.toString());
        debugger;
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
    <Box
      sx={{
        ...(filmData.length === 0 || isLoading.moviesData
          ? styles.nothingFound
          : styles.filmCardContainer),
      }}>
      {isLoading.moviesData ? (
        <CircularProgress />
      ) : filmData.length === 0 ? (
        <Typography variant="h6" sx={{ opacity: 0.7 }}>
          Нічого не знайдено
        </Typography>
      ) : (
        Object.entries(groupedFilms).map(([contentId, sessions]) => {
          const film = sessions[0];
          return (
            <Card key={contentId} sx={styles.filmCardItem}>
              <CardActionArea>
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

                <Box sx={styles.filmInfoContainer}>
                  <Box sx={styles.sessionTimeBox}>
                    <Tooltip
                      title={`Від ${film.ticketPrice} грн`}
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
                        variant="body2"
                        sx={{ ...styles.filmTimeText, cursor: 'pointer' }}>
                        {new Date(film.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <Box sx={styles.sessionPriceBox}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={styles.sessionPriceText}>
                      Від
                      <br /> {Math.min(...sessions.map((s) => s.ticketPrice))}
                      грн
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
}
