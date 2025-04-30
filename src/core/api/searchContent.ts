import apiClient from './client.ts';
import { AxiosError } from 'axios';
import { ApiErrorResponse, ApiFilmResponse } from './types.ts';

export const searchContent = async (
  query: string
): Promise<ApiFilmResponse[]> => {
  try {
    const { data } = await apiClient.get<{ items: ApiFilmResponse[] }>(
      '/contents/filter',
      { params: { SearchTerms: query } }
    );
    return data.items;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse>;
  }
};
