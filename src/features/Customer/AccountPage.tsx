import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useAuth } from '../../core/auth/useAuth';
import { useEffect, useState } from 'react';
import { getMyUserInfo, UserInfoResponse } from '../../core/api/userApi';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const CustomerAccountPage = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      if (user) {
        try {
          const info = await getMyUserInfo();
          setUserInfo(info);
        } catch (error) {
          console.error("Failed to fetch user info:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Should not happen if ProtectedRoute is working
      }
    };
    fetchInfo();
  }, [user]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: {xs: 2, sm:4},
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '400px', // Ensure paper has some height
        width: '100%',
      }}
    >
      {loading ? (
        <Box sx={{display: 'flex', justifyContent:'center', alignItems: 'center', flexGrow: 1}}>
            <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="text.primary"
            sx={{ fontWeight: 600, textAlign: 'center' }}
          >
            {userInfo ? `Вітаємо, ${userInfo.firstName}!` : 'Мій Кабінет'}
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ mb: 3, textAlign: 'center' }}>
            Це ваш особистий кабінет. Тут ви можете переглядати свої вподобання та бронювання.
            <br />
            Оберіть розділ з меню ліворуч.
          </Typography>
          {userInfo && (
            <Box sx={{textAlign: 'left', width: '100%', maxWidth: '400px', mt: 2, p:2, border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
                <Typography variant="h6" color="text.primary" gutterBottom sx={{borderBottom: '1px solid', borderColor: 'divider', pb: 1, mb:2}}>Деталі Акаунту:</Typography>
                <Typography color="text.primary" sx={{mb:1}}><strong>Ім'я:</strong> {userInfo.firstName}</Typography>
                <Typography color="text.primary" sx={{mb:1}}><strong>Прізвище:</strong> {userInfo.lastName}</Typography>
                <Typography color="text.primary"><strong>Email:</strong> {userInfo.email}</Typography>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default CustomerAccountPage;