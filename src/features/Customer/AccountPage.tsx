import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/useAuth';
import { PrimaryButton } from '../../shared/components/Buttons';
import Layout from '../../shared/components/Layout';

const CustomerAccountPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

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
            Customer Account
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This page is under construction. Please check back later.
          </Typography>
          <PrimaryButton onClick={handleLogout} sx={{ width: '50%' }}>
            Вийти
          </PrimaryButton>
        </Paper>
      </Container>
    </Layout>
  );
};

export default CustomerAccountPage;
