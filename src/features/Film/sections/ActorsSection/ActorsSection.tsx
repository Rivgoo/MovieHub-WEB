import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import HorizontalScroller from '../../../../shared/components/Scroller/HorizontalScroller';
import styles from './ActorsSection.module.css';
import { ProcessedActor } from '../../../../core/api/types/types.film';
import { useTheme } from '@mui/material/styles';

interface ActorsSectionProps {
  actors: ProcessedActor[] | null;
}

const ActorsSection: React.FC<ActorsSectionProps> = ({ actors }) => {
  const theme = useTheme();
  
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
            <HorizontalScroller
              sx={{
                '& .horizontal-scroller-content': {
                  justifyContent: actors.length < 4 ? 'center' : 'flex-start',
                  gap: {
                    xs: theme.spacing(1.5),
                    sm: theme.spacing(2),
                    md: theme.spacing(3),
                  }
                }
              }}
              scrollAmount={250}
            >
                {actors.map((actor) => (
                    <Box key={actor.id} className={styles.actorsSection_card}>
                        <Avatar
                            className={styles.actorsSection_avatar}
                            src={actor.imageUrl || undefined}
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
                        {actor.role && (
                            <Typography
                                variant="caption"
                                className={styles.actorsSection_role}
                                title={actor.role}
                            >
                                {actor.role}
                            </Typography>
                        )}
                    </Box>
                ))}
            </HorizontalScroller>
        </Box>
    </Container>
  );
};

export default ActorsSection;