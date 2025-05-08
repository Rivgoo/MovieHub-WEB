import apiClient from '../client.ts';
import { LoginRequest, LoginResponse } from '../types/types.auth.ts';

// POST /api/v1/auth
export const loginUser = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth', payload);
  return data;
};
