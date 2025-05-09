
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import HorizontalScroller from '../../../../shared/components/Scroller/HorizontalScroller';
import styles from './ActorsSection.module.css';


interface ActorInfo {
  id: string;
  name: string;
  // imageUrl?: string;
}

interface ActorsSectionProps {
  // actors?: ActorInfo[];
}

const exampleActors: ActorInfo[] = [
    { id: '1', name: 'Софія Карсон' }, { id: '2', name: 'Конні Бріттон' },
    { id: '3', name: 'Кайл Аллен' }, { id: '4', name: 'Адам Брукс' },
    { id: '5', name: 'Ніколас Ґоліцин' }, { id: '6', name: 'Ентоні Старр' },
    { id: '7', name: 'Актор Сьомий' }, { id: '8', name: 'Восьмий Актор Із Дуже Довгим Іменем' },
   
];

const ActorsSection: React.FC<ActorsSectionProps> = () => {
  const actorsToDisplay = exampleActors;

  return (
    <Container maxWidth="lg" className={styles.actorsSection_wrapper}>
        <Box className={styles.actorsSection_container}>
            <Typography variant="h4" className={styles.actorsSection_title}>
                Актори та знімальна група
            </Typography>

           
            <HorizontalScroller scrollAmount={300} >
               -
                {actorsToDisplay.map((actor) => (
                    <Box key={actor.id} className={styles.actorsSection_card}>
                        <Avatar
                            className={styles.actorsSection_avatar}
                            // src={actor.imageUrl}
                            alt={actor.name}
                        />
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