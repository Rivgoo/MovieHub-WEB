import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import AdminLayout from '../AdminLayout';
import UserForm from './UserForm';
import { getUserById, updateUser } from '../../../core/api/requests/request.user';
import { UserDto, UpdateUserRequest } from '../../../core/api/types/types.user';
import '../User/UserManagerPage.css';
import { getApiErrorMessage } from '../../../core/api/getApiErrorMessage';

const EditUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        setIsLoading(true);
        setError(null);
        setUser(null); 
        try {
          const fetchedUser = await getUserById(userId);
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            setError('Користувача не знайдено');
          }
        } catch (err: any) {
          setError(getApiErrorMessage(err, 'Помилка завантаження даних користувача.'));
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    } else {
      setError('ID користувача не вказано');
      setIsLoading(false);
      setUser(null);
    }
  }, [userId]);

  const handleSubmit = async (data: UpdateUserRequest) => {
    if (!userId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await updateUser(userId, data);
      navigate('/admin/user-manager');
    } catch (err: any) {
      setError(err.response?.data?.description || err.message || 'Не вдалося оновити користувача');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Paper className="user-form-container">
        <Typography variant="h5" component="h2">
          Редагувати користувача
        </Typography>
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        {user && userId ? (
          <UserForm
            key={userId} 
            initialData={user} 
            onSubmit={handleSubmit as any}
            isSubmitting={isSubmitting}
            isEditMode={true}
            onCancel={() => navigate('/admin/user-manager')}
          />
        ) : (
          !error && <Typography sx={{mt: 2}}>Користувача не знайдено.</Typography>
        )}
      </Paper>
    </AdminLayout>
  );
};

export default EditUserPage;