import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Layout from '../../shared/components/Layout';

const TermsPage: React.FC = () => {
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
            Terms of Service
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please read these Terms of Service carefully. They govern your access to and use of our website/service. By using our website/service, you agree to be bound by these Terms.
          </Typography>
        </Paper>
      </Container>
    </Layout>
  );
};

export default TermsPage;
