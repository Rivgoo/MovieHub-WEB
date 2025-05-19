import apiClient from '../client.ts';
import {
  UserExistenceResponse,
  UserInfoResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  UserFilterResponse,
  UpdateUserRequest,
  UserDto,
  GetAllRolesResponse
} from '../types/types.user.ts';

// GET /api/v1/users/{id}/exists
export const checkUserExists = async (id: string): Promise<boolean> => {
  const { data } = await apiClient.get<UserExistenceResponse>(
    `/users/${id}/exists`
  );
  return data.exists;
};

// GET /api/v1/users/{id}/info
export const getUserInfo = async (id: string): Promise<UserInfoResponse> => {
  const { data } = await apiClient.get<UserInfoResponse>(`/users/${id}/info`);
  return data;
};

// POST /api/v1/users/customer/register
export const registerCustomer = async (
  payload: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  const { data } = await apiClient.post<RegisterUserResponse>(
    '/users/customer/register',
    payload
  );
  return data;
};

// POST /api/v1/users/admins/register
export const registerAdmin = async (
  payload: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  const { data } = await apiClient.post<RegisterUserResponse>(
    '/users/admins/register',
    payload
  );
  return data;
};

// GET /api/v1/users/filter
export const filterUsers = async (
  queryParams?: string
): Promise<UserFilterResponse> => {
  const endpoint = queryParams ? `/users/filter?${queryParams}` : '/users/filter';
  const { data } = await apiClient.get<UserFilterResponse>(endpoint);
  return data;
};

// GET /api/v1/users/{id}
export const getUserById = async (id: string): Promise<UserDto | null> => {
  const { data } = await apiClient.get<UserDto>(`/users/${id}`);
  return data;
};

// PUT /api/v1/users/{id}
export const updateUser = async (
  id: string,
  payload: UpdateUserRequest
): Promise<void> => {
  await apiClient.put(`/users/${id}`, payload);
};

// DELETE /api/v1/users/{id}
export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

// GET /api/v1/users/roles
export const getAllRoles = async (): Promise<GetAllRolesResponse> => {
  const { data } = await apiClient.get<GetAllRolesResponse>('/users/roles');
  return data;
};