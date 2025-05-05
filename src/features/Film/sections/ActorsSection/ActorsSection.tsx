
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import styles from './ActorsSection.module.css'; 

interface ActorInfo { id: string; name: string; }
interface ActorsSectionProps {
  // actors?: ActorInfo[];
}

const ActorsSection: React.FC<ActorsSectionProps> = () => {
  const exampleActors: ActorInfo[] = [
    { id: '1', name: 'Ім\'я Актора 1' }, { id: '2', name: 'Ім\'я Актора 2' },
    { id: '3', name: 'Ім\'я Актора 3' }, { id: '4', name: 'Ім\'я Актора 4' },
    { id: '5', name: 'Ім\'я Актора 5' }, { id: '6', name: 'Ім\'я Актора 6' },
  ];

  return (
    <Container maxWidth="lg" className={styles.actorsWrapper}>
        <Box className={styles.actorsContainer}>
            <Typography variant="h4" className={styles.actorsTitle}>
                Актори та знімальна група
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 2, sm: 3, md: 4 } }}>
                {exampleActors.map((actor) => (
                    <Box key={actor.id} className={styles.actorCard}>
                        <Avatar className={styles.actorAvatar} />
                        <Typography variant="subtitle1" className={styles.actorName}>
                            {actor.name}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    </Container>
  );
};

export default ActorsSection;