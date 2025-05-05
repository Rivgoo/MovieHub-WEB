
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from './ContentSection.module.css'; 


interface ContentSectionProps {
    onSelectSession: () => void;
}


interface DetailItemProps { label: string; value: string | React.ReactNode; }
const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
    <Typography variant="body1" className={styles.detailItem}>
        <Box component="span" className={styles.detailItemLabel}>{label}:</Box> {value}
    </Typography>
);

const ContentSection: React.FC<ContentSectionProps> = () => {
  return (
    <Container maxWidth="lg" className={styles.contentWrapper}>
      <Box className={styles.contentBox}>
        <Box
          className={styles.detailsDescriptionContainer}
          sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 3, md: 5 } }}
        >
         
          <Box sx={{ flex: { sm: '1 1 50%' }, width: '100%' }}>
            <Typography variant="h4" className={styles.sectionTitle}>Деталі</Typography>
            <Box>
              <DetailItem label="Прем'єра" value="Дата прем'єри" />
              <DetailItem label="Вік" value="XX+" />
              <DetailItem label="Країна" value="Країна виробник" />
              <DetailItem label="Режисер" value="Ім'я Режисера" />
              <DetailItem label="Тривалість" value="XXX хв" />
              <DetailItem label="Жанр" value="Жанр 1 / Жанр 2" />
              <DetailItem label="Рейтинг" value="X.X / 10" />
            </Box>
          </Box>
        
          <Box sx={{ flex: { sm: '1 1 50%' }, width: '100%' }}>
            <Typography variant="h4" className={styles.sectionTitle}>Опис фільму</Typography>
            <Typography variant="body1" className={styles.descriptionText}>
              Повний опис сюжету фільму тут...
            </Typography>
          </Box>
        </Box>
        
      </Box>
    </Container>
  );
};

export default ContentSection;