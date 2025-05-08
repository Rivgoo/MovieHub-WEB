import apiClient from './client';
import {
  RegisterUserRequest,
  RegisterUserResponse,
} from './types/types.user';
import { ApiErrorResponse } from './types';
import { AxiosError } from 'axios';

export const registerUser = async (
  userData: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  try {
    const response = await apiClient.post<RegisterUserResponse>(
      '/users/customer/register',
      userData
    );
    return response.data;
  } catch (error) {
    console.error('Registration API error:', error);
    throw error;
  }
};

export const getRegistrationErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response?.status === 409) {
      return 'Користувач з таким email або телефоном вже існує.';
    } else if (axiosError.response?.data?.description) {
      return axiosError.response.data.description;
    } else {
      return 'Помилка реєстрації. Спробуйте пізніше.';
    }
  }
  return 'Невідома помилка під час реєстрації.';
};