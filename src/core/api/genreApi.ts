import apiClient from "./client";
import {
  CreateGenreRequest,
  GenreDto,
  CreateGenreResponse,
  UpdateGenreRequest,
  GetAllGenresResponse,
  UpdateGenreResponse,
  DeleteGenreResponse
} from "./types/types.genre";

export const getAllGenres = async (): Promise<GetAllGenresResponse> => {
  const response = await apiClient.get<GetAllGenresResponse>("/genres");
  return response.data;
};

export const createGenre = async (data: CreateGenreRequest): Promise<CreateGenreResponse> => {
  const response = await apiClient.post<CreateGenreResponse>("/genres", data);
  return response.data;
};

export const updateGenre = async (id: number, data: UpdateGenreRequest): Promise<UpdateGenreResponse> => {
  const response = await apiClient.put<UpdateGenreResponse>(`/genres/${id}`, data);
  return response.data;
};

export const deleteGenre = async (id: number): Promise<DeleteGenreResponse> => {
  const response = await apiClient.delete<DeleteGenreResponse>(`/genres/${id}`);
  return response.data;
};

export const getGenreById = async (id: number): Promise<GenreDto | null> => {
  try {
    const response = await apiClient.get<GenreDto>(`/genres/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};