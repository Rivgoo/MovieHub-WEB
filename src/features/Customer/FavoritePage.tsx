import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const FavoritePage = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: {xs: 2, sm:4},
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '400px',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        color="text.primary"
        sx={{ fontWeight: 600 }}
      >
        Вподобані фільми
      </Typography>
      <Typography variant="body1" color="text.primary" sx={{ mb: 3, textAlign: 'center' }}>
        Ця сторінка в розробці. Будь ласка, зайдіть пізніше.
      </Typography>
    </Paper>
  );
};

export default FavoritePage;