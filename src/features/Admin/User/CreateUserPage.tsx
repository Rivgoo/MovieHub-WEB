import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Alert } from '@mui/material';
import AdminLayout from '../AdminLayout';
import UserForm from './UserForm';
import { registerAdmin, registerCustomer } from '../../../core/api/requests/request.user';
import { RegisterUserRequest } from '../../../core/api/types/types.user';
import '../User/UserManagerPage.css'; 
import { getApiErrorMessage } from '../../../core/api/getApiErrorMessage';

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: RegisterUserRequest, roleName?: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (roleName && roleName.toLowerCase() === "admin") {
        await registerAdmin(data);
      } else {
        await registerCustomer(data);
      }
      navigate('/admin/user-manager');
    } catch (err: any) {
      console.error("Error creating user:", err);
      setError(getApiErrorMessage(err, 'Не вдалося створити користувача.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout pageTitle="Створення користувача">
      <Paper className="user-form-container">
        <Typography variant="h5" component="h2">
          Створити користувача
        </Typography>
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        <UserForm
          onSubmit={handleSubmit as any} 
          isSubmitting={isSubmitting}
          isEditMode={false}
          onCancel={() => navigate('/admin/user-manager')}
        />
      </Paper>
    </AdminLayout>
  );
};

export default CreateUserPage;