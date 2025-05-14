import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
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

  useEffect(() => {
    const fetchFilmsData = async () => {
      try {
        const response = await searchSessionsWithContent(
          searchParams.toString()
        );
        setFilmData(response.items);
      } catch (error) {
        console.error('Failed to load film sessions:', error);
      }
    };

    fetchFilmsData();
  }, [searchParams]);

  return (
    <Box sx={styles.filmCardContainer}>
      {filmData.map((film) => (
        <Card key={film.id} sx={styles.filmCardItem}>
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
                  <br /> {film.ticketPrice} грн
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
