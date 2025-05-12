import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Layout from '../../shared/components/Layout';
import { useTheme } from '@mui/material/styles';

const cinemaImageUrl = '/movie-cinema.jpg';

const AboutPage: React.FC = () => {
  const theme = useTheme();

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
            Ми створили MovieHub з однією простою метою: допомогти вам
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
          <Box component="ul" sx={{ pl: 2.5, listStylePosition: 'outside' }}>
            {[
              '** - Відкриття стає пригодою:** Шукайте фільми за жанрами, роками, акторами або просто настроєм. Наші зручні фільтри та рекомендації допоможуть знайти саме те, що вам потрібно.',
              '** - Кожен сеанс – подія:** Дізнавайтеся актуальний розклад сеансів у вашому місті, обирайте зручний час та місце.',
              '** - Ваша думка важлива:** Читайте відгуки інших глядачів та діліться власними рецензіями. Створюйте колекції улюблених стрічок та обговорюйте їх з друзями.',
              '** - Натхнення завжди поруч:** Ми постійно оновлюємо інформацію, додаємо трейлери, новини кіноіндустрії та цікаві факти, щоб ви завжди були в курсі найгарячіших прем\'єр та кінематографічних шедеврів.',
            ].map((item, index) => (
              <Typography
                component="li"
                key={index}
                variant="body1"
                sx={{ lineHeight: 1.7, mb: 1.5, '&::marker': { color: theme.palette.primary.main } }}
                dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            ))}
          </Box>

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

          <Typography
            variant="h6"
            component="p"
            align="center"
            sx={{
              fontWeight: 500,
              mt: 4,
              color: theme.palette.primary.light,
              fontStyle: 'italic',
            }}
          >
            Занурюйтесь у світ кіно з MovieHub!
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
};

export default AboutPage;