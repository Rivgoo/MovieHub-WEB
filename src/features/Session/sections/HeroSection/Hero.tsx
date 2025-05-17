import { Box, Typography, useTheme } from '@mui/material';
import getSessionSearchHeroStyles from './Hero.styles';
type Props = {};

export default function Hero({}: Props) {
  const theme = useTheme();
  const styles = getSessionSearchHeroStyles(theme);

  return (
    <Box sx={styles.heroBox}>
      <Typography variant="h4" component="h1" sx={styles.heroText}>
        Зараз у прокаті
      </Typography>
    </Box>
  );
}
