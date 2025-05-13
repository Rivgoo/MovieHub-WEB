import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from './ContentSection.module.css';
import { ProcessedFilmDetails } from '../../../../core/api/types/types.film';

interface ContentSectionProps {
   filmData: ProcessedFilmDetails | null; 
}

interface DetailItemProps { label: string; value: string | React.ReactNode; }
const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
    <Typography variant="body1" className={styles.contentSection_detailItem}>
        <Box component="span" className={styles.contentSection_detailItemLabel}>{label}:</Box> {value || 'N/A'}
    </Typography>
);

const ContentSection: React.FC<ContentSectionProps> = ({ filmData }) => {
  if (!filmData) {
  
    return null;
  }

  return (
    <Container maxWidth="lg" className={styles.contentSection_wrapper}>
      <Box className={styles.contentSection_box}>
        <Box
          className={styles.contentSection_detailsDescriptionContainer}
          sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 3, md: 5 } }}
        >
          <Box sx={{ flex: { sm: '1 1 50%' }, width: '100%' }}>
            <Typography variant="h4" className={styles.contentSection_sectionTitle}>Деталі</Typography>
            <Box>
              <DetailItem label="Прем'єра" value={filmData.releaseDate} />
              <DetailItem label="Вік" value={filmData.ageRating} />
              <DetailItem label="Режисер" value={filmData.directorName} />
              <DetailItem label="Тривалість" value={filmData.formattedRuntime} />
              <DetailItem label="Жанр" value={filmData.genres.join(' / ')} />
              {filmData.vote_average !== null && filmData.vote_average > 0 && (
            <DetailItem label="Рейтинг" value={`${filmData.vote_average.toFixed(1)}/10`} />
            )}
            </Box>
          </Box>
          <Box sx={{ flex: { sm: '1 1 50%' }, width: '100%' }}>
            <Typography variant="h4" className={styles.contentSection_sectionTitle}>Опис фільму</Typography>
            <Typography variant="body1" className={styles.contentSection_descriptionText}>
              {filmData.overview}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ContentSection;