import apiClient from '../client.ts';
import {
  CinemaHallFilterResponse,
  GetAllCinemaHallsResponse,
  GetCinemaHallByIdResponse,
  CinemaHallExistenceResponse,
  CreateCinemaHallRequest,
  CreateCinemaHallResponse,
  UpdateCinemaHallRequest,
} from '../types/types.cinemahall.ts';

// GET /api/v1/cinema-halls
export const getAllCinemaHalls =
  async (): Promise<GetAllCinemaHallsResponse> => {
    const { data } =
      await apiClient.get<GetAllCinemaHallsResponse>('/cinema-halls');
    return data;
  };

// GET /api/v1/cinema-halls/{id}
export const getCinemaHallById = async (
  id: number
): Promise<GetCinemaHallByIdResponse> => {
  const { data } = await apiClient.get<GetCinemaHallByIdResponse>(
    `/cinema-halls/${id}`
  );
  return data;
};

// GET /api/v1/cinema-halls/{id}/exists
export const checkCinemaHallExists = async (id: number): Promise<boolean> => {
  const { data } = await apiClient.get<CinemaHallExistenceResponse>(
    `/cinema-halls/${id}/exists`
  );
  return data.exists;
};

// GET /api/v1/cinema-halls/filter?query
export const searchCinemaHalls = async (
  query: string
): Promise<CinemaHallFilterResponse> => {
  const { data } = await apiClient.get<CinemaHallFilterResponse>(
    `/cinema-halls/filter${query.startsWith('?') ? query : `?${query}`}`
  );
  return data;
};

// POST /api/v1/cinema-halls
export const createCinemaHall = async (
  payload: CreateCinemaHallRequest
): Promise<CreateCinemaHallResponse> => {
  const { data } = await apiClient.post<CreateCinemaHallResponse>(
    '/cinema-halls',
    payload
  );
  return data;
};

// PUT /api/v1/cinema-halls/{id}
export const updateCinemaHall = async (
  id: number,
  payload: UpdateCinemaHallRequest
): Promise<void> => {
  await apiClient.put(`/cinema-halls/${id}`, payload);
};

// DELETE /api/v1/cinema-halls/{id}
export const deleteCinemaHall = async (id: number): Promise<void> => {
  await apiClient.delete(`/cinema-halls/${id}`);
};
