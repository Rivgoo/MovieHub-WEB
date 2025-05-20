import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import HeroSectionStyles from './HeroSection';
import SearchFieldSection from '../SearchFieldSection/SearchFieldSection';

const HeroSection = () => {
  const theme = useTheme();
  const styles = HeroSectionStyles(theme);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={styles.heroBox}>
      <Typography variant="h4" component="h1" sx={styles.heroTitle}>
        Шукаєте фільм?
      </Typography>
      {!isSmallScreen ? (
        <Typography variant="subtitle1" sx={styles.heroSubTitle}>
          Введіть назву і ми обов'язково знайдемо його для вас.
        </Typography>
      ) : (
        <Typography variant="subtitle1" sx={styles.heroSubTitle}>
          Введіть назву для пошуку.
        </Typography>
      )}
      <SearchFieldSection />
    </Box>
  );
};

export default HeroSection;
