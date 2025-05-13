import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Layout from '../../shared/components/Layout';
import { useTheme } from '@mui/material/styles'; // alpha тут не потрібна, якщо не використовуємо прозорість для Divider
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const cinemaImageUrl = '/movie-cinema.jpg';

const AboutPage: React.FC = () => {
  const theme = useTheme();

  // Дані для переваг з іконками
  const features = [
    {
      icon: <MovieFilterIcon sx={{ color: theme.palette.primary.main, fontSize: '1.8rem' }} />, // Додано колір та розмір
      title: 'Відкриття стає пригодою',
      description: 'Шукайте фільми за жанрами, роками, акторами або просто настроєм. Наші зручні фільтри та рекомендації допоможуть знайти саме те, що вам потрібно.',
    },
    {
      icon: <EventSeatIcon sx={{ color: theme.palette.primary.main, fontSize: '1.8rem' }} />, // Додано колір та розмір
      title: 'Кожен сеанс – подія',
      description: 'Дізнавайтеся актуальний розклад сеансів у вашому місті, обирайте зручний час та місце.',
    },
    {
      icon: <LightbulbIcon sx={{ color: theme.palette.primary.main, fontSize: '1.8rem' }} />, // Додано колір та розмір
      title: 'Натхнення завжди поруч',
      description: 'Ми постійно оновлюємо інформацію, додаємо трейлери, щоб ви завжди були в курсі найгарячіших прем\'єр та кінематографічних шедеврів.',
    },
  ];

  return (
    <Layout>
      <Box
        sx={{
          width: '100%',
          height: { xs: '250px', sm: '350px', md: '450px' },
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${cinemaImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette.common.white,
          textAlign: 'center',
          px: 2,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              fontSize: { xs: '2.5rem', sm: '3.5rem' },
            }}
          >
            MovieHub
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontWeight: 300,
              textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
              fontSize: { xs: '1.1rem', sm: '1.4rem' },
            }}
          >
            Ваш персональний гід у безмежному світі кіно!
          </Typography>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 3, md: 5 },
          mb: { xs: 4, md: 6 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: '12px',
          }}
        >
          <Typography
            variant="body1"
            component="p"
            sx={{ lineHeight: 1.7, mb: 2, fontSize: '1.05rem' }}
          >
            <b>MovieHub створений з однією простою метою: </b> допомогти вам
            знаходити фільми, які ви полюбите, та ділитися враженнями з
            однодумцями. У сучасному потоці новинок та класики легко
            загубитися, але ми тут, щоб зробити ваш кінематографічний
            досвід незабутнім.
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              mt: 4,
              mb: 2,
              color: theme.palette.primary.main,
            }}
          >
            Що таке MovieHub?
          </Typography>

          <Typography
            variant="body1"
            component="p"
            sx={{ lineHeight: 1.7, mb: 1 }}
          >
            Це не просто база даних фільмів. Це місце, де:
          </Typography>
          
          {/* Список переваг з іконками */}
          {features.map((feature, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', my: 2.5 }}> {/* Змінено my для відступів */}
              <Box sx={{ mr: 1.5, mt: '4px' }}> {/* Зменшено mr, додано mt для вирівнювання іконки */}
                {feature.icon}
              </Box>
              <Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 500, mb: 0.25 }}> {/* Зменшено mb */}
                  {feature.title.replace(/\*\*(.*?)\*\*/g, '$1')} {/* Прибираємо ** з заголовка */}
                </Typography>
                <Typography variant="body1" color="text.secondary.ContrastText" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          ))}

          <Typography
            variant="body1"
            component="p"
            sx={{ lineHeight: 1.7, mt: 3, mb: 2 }}
          >
            Ми віримо, що кіно – це магія, яка об'єднує. І наша місія –
            зробити цю магію доступною та захопливою для кожного.
            Приєднуйтесь до спільноти MovieHub, досліджуйте, обирайте та
            насолоджуйтесь найкращими фільмами разом з нами!
          </Typography>

        </Paper>
      </Container>
    </Layout>
  );
};

export default AboutPage;