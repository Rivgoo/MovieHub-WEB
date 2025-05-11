// src/features/Film/sections/ActorsSection/ActorsSection.tsx
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import HorizontalScroller from '../../../../shared/components/Scroller/HorizontalScroller'; // Перевірте шлях!
import styles from './ActorsSection.module.css';
import { ProcessedActor } from '../../../../core/api/types/types.film'; // Правильний шлях до типів

interface ActorsSectionProps {
  actors: ProcessedActor[] | null; // Приймаємо масив акторів
}

const ActorsSection: React.FC<ActorsSectionProps> = ({ actors }) => {
  if (!actors || actors.length === 0) {
    return (
      <Container maxWidth="lg" className={styles.actorsSection_wrapper}>
        <Box className={styles.actorsSection_container}>
          <Typography variant="h4" className={styles.actorsSection_title}>
            Актори та знімальна група
          </Typography>
          <Typography sx={{ color: 'primary.light', textAlign: 'center' }}>
            Інформація про акторів відсутня.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={styles.actorsSection_wrapper}>
        <Box className={styles.actorsSection_container}>
            <Typography variant="h4" className={styles.actorsSection_title}>
                Актори та знімальна група
            </Typography>
            <HorizontalScroller scrollAmount={300} >
                {actors.map((actor) => (
                    <Box key={actor.id} className={styles.actorsSection_card}>
                        <Avatar
                            className={styles.actorsSection_avatar}
                            src={actor.imageUrl || undefined} // Використовуємо imageUrl
                            alt={actor.name}
                        >
                            {!actor.imageUrl && actor.name ? actor.name.charAt(0).toUpperCase() : null}
                        </Avatar>
                        <Typography
                            variant="subtitle1"
                            className={styles.actorsSection_name}
                            title={actor.name}
                        >
                            {actor.name}
                        </Typography>
                    </Box>
                ))}
            </HorizontalScroller>
        </Box>
    </Container>
  );
};

export default ActorsSection;