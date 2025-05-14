import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  CircularProgress,
  Alert,
  Chip, 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from '../AdminLayout';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import StandardPagination from '../../../shared/components/Pagination/StandardPagination';
import { filterUsers, deleteUser, updateUser, getAllRoles } from '../../../core/api/requests/request.user';
import { UserDto, UpdateUserRequest, RoleDto } from '../../../core/api/types/types.user';
import { PrimaryButton } from '../../../shared/components/Buttons';
import './UserManagerPage.css';

const PAGE_SIZE = 10;

const UserManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [allSystemRoles, setAllSystemRoles] = useState<RoleDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [userToToggleBlock, setUserToToggleBlock] = useState<UserDto | null>(null);
  const [isTogglingBlock, setIsTogglingBlock] = useState(false);

  const [userToDelete, setUserToDelete] = useState<UserDto | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const fetchInitialData = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const usersQueryParams = `PageIndex=${page}&PageSize=${PAGE_SIZE}&OrderField=CreatedAt&OrderType=OrderByDescending`;
      const [usersResponse, rolesResponse] = await Promise.all([
        filterUsers(usersQueryParams),
        getAllRoles()
      ]);

      setUsers(usersResponse.items || []);
      setTotalPages(usersResponse.totalPages || 0);
      setAllSystemRoles(rolesResponse || []);

      if (page > (usersResponse.totalPages || 0) && (usersResponse.totalPages || 0) > 0) {
        setCurrentPage(usersResponse.totalPages || 1);
      }
    } catch (err: any) {
      setError(err.response?.data?.description || err.message || 'Помилка завантаження даних');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData(currentPage);
  }, [currentPage, fetchInitialData]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleEditUser = (userId: string) => {
    navigate(`/admin/user-manager/edit/${userId}`);
  };

  const handleDeleteUser = (user: UserDto) => {
    setUserToDelete(user);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setIsLoading(true); 
      try {
        await deleteUser(userToDelete.id);
        fetchInitialData(currentPage); 
      } catch (err: any) {
        setError(err.response?.data?.description || 'Помилка видалення користувача');
      } finally {
        setIsLoading(false);
        setIsConfirmModalOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleToggleBlock = async (user: UserDto) => {
    setUserToToggleBlock(user);
    setIsTogglingBlock(true);
    setError(null);
    try {
      const updateData: UpdateUserRequest = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        isBlocked: !user.isBlocked,
      };
      await updateUser(user.id, updateData);
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id ? { ...u, isBlocked: !user.isBlocked, updatedAt: new Date().toISOString() } : u
        )
      );
    } catch (err: any) {
        setError(err.response?.data?.description || 'Помилка зміни статусу блокування');
    } finally {
      setIsTogglingBlock(false);
      setUserToToggleBlock(null);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getDisplayRoleNodes = (userRoleIdentifiers: string[] | null): React.ReactNode => {
    if (!userRoleIdentifiers || userRoleIdentifiers.length === 0) return 'N/A';
    if (allSystemRoles.length === 0 && isLoading) return <CircularProgress size={15} sx={{ml: 1}}/>;
    if (allSystemRoles.length === 0 && !isLoading) return userRoleIdentifiers.join(', ') + " (ID не знайдено)";

    return userRoleIdentifiers.map(idOrName => {
      const role = allSystemRoles.find(r => r.id.toLowerCase() === idOrName.toLowerCase() || r.name.toLowerCase() === idOrName.toLowerCase());
      const roleName = role ? role.name : idOrName;
      return (
        <Chip 
          key={idOrName}
          label={roleName} 
          size="small" 
          sx={{ 
            mr: 0.5, mb: 0.5, 
            bgcolor: roleName.toLowerCase() === 'admin' ? 'secondary.main' : 'primary.dark',
            color: 'primary.contrastText',
            textTransform: 'capitalize'
          }} 
        />
      );
    });
  };

  return (
    <AdminLayout>
      <Box className="user-manager-page">
        <Box className="user-manager-header">
          <Typography variant="h4" component="h2">Користувачі</Typography>
          <PrimaryButton
            className="create-user-button"
            onClick={() => navigate('/admin/user-manager/create')}
          >
            Створити користувача
          </PrimaryButton>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {isLoading && !userToToggleBlock && !userToDelete ? (
          <Box display="flex" justifyContent="center" py={5}><CircularProgress /></Box>
        ) : users.length === 0 && !isLoading ? (
            <Typography sx={{ textAlign: 'center', mt: 3 }}>Користувачів не знайдено.</Typography>
        ) : (
          <>
            <TableContainer component={Paper} className="user-table">
              <Table aria-label="users table">
                <TableHead>
                  <TableRow>
                    <TableCell>Ім'я</TableCell>
                    <TableCell>Прізвище</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Ролі</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Створено</TableCell>
                    <TableCell align="right">Дії</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.firstName || '-'}</TableCell>
                      <TableCell>{user.lastName || '-'}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell sx={{whiteSpace: 'nowrap'}}>
                        {getDisplayRoleNodes(user.roles)}
                      </TableCell>
                      <TableCell>
                        <Typography 
                            component="span" 
                            className={user.isBlocked ? "user-status-blocked" : "user-status-active"}
                        >
                          {user.isBlocked ? 'Заблокований' : 'Активний'}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell align="right" className="user-actions">
                        <Switch
                          checked={user.isBlocked}
                          onChange={() => handleToggleBlock(user)}
                          disabled={isTogglingBlock && userToToggleBlock?.id === user.id}
                          size="small"
                        />
                        <IconButton onClick={() => handleEditUser(user.id)} size="small" aria-label="edit">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteUser(user)} size="small" aria-label="delete">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {totalPages > 0 && (
              <Box className="pagination-container">
                <StandardPagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                />
              </Box>
            )}
          </>
        )}
      </Box>
      {isConfirmModalOpen && userToDelete && (
        <ConfirmModal
          message={`Ви впевнені, що хочете видалити користувача ${userToDelete.firstName} ${userToDelete.lastName}?`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsConfirmModalOpen(false);
            setUserToDelete(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default UserManagerPage;