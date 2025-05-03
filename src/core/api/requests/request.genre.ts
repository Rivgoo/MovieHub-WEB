import apiClient from '../client.ts';
import {
  GenreExistenceResponse,
  GetAllGenresResponse,
  GetGenreByIdResponse,
  CreateGenreRequest,
  CreateGenreResponse,
  UpdateGenreRequest,
  UpdateGenreResponse,
  DeleteGenreResponse,
} from '../types/types.genre.ts';

// GET /api/v1/genres
export const getAllGenres = async (): Promise<GetAllGenresResponse> => {
  const { data } = await apiClient.get<GetAllGenresResponse>('/genres');
  return data;
};

// GET /api/v1/genres/{id}
export const getGenreById = async (
  id: number
): Promise<GetGenreByIdResponse> => {
  const { data } = await apiClient.get<GetGenreByIdResponse>(`/genres/${id}`);
  return data;
};

// GET /api/v1/genres/{id}/exists
export const checkGenreExists = async (id: number): Promise<boolean> => {
  const { data } = await apiClient.get<GenreExistenceResponse>(
    `/genres/${id}/exists`
  );
  return data.exists;
};

// POST /api/v1/genres
export const createGenre = async (
  payload: CreateGenreRequest
): Promise<CreateGenreResponse> => {
  const { data } = await apiClient.post<CreateGenreResponse>(
    '/genres',
    payload
  );
  return data;
};

// PUT /api/v1/genres/{id}
export const updateGenre = async (
  id: number,
  payload: UpdateGenreRequest
): Promise<UpdateGenreResponse> => {
  const { data } = await apiClient.put<UpdateGenreResponse>(
    `/genres/${id}`,
    payload
  );
  return data;
};

// DELETE /api/v1/genres/{id}
export const deleteGenre = async (id: number): Promise<DeleteGenreResponse> => {
  await apiClient.delete<DeleteGenreResponse>(`/genres/${id}`);
};
