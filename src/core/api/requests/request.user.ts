import apiClient from '../client.ts';
import {
  UserExistenceResponse,
  UserInfoResponse,
  RegisterUserRequest,
  RegisterUserResponse,
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
