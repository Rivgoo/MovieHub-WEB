import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Layout from '../../shared/components/Layout';

const ErrorPage = () => {
  return (
    <Layout>
      <Container
        maxWidth="sm"
        sx={{
          mt: 4,
          mb: 4,
          display: 'flex',
          justifyContent: 'center',
          background: 'background.default',
        }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="text.secondary"
            sx={{ fontWeight: 600 }}>
            404 - Page Not Found
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Sorry, the page you are looking for does not exist.
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ErrorPage;
