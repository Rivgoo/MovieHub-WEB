import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Layout from '../../shared/components/Layout';

const RegistrationPage = () => {
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
            Registration Page
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This is the registration page. Please fill in your details to
            register.
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
};

export default RegistrationPage;
