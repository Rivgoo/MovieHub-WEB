import apiClient from '../client.ts';
import {
  SessionFilterResponse,
  GetAllSessionsResponse,
  GetSessionByIdResponse,
  SessionExistenceResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  UpdateSessionRequest,
  SessionWithContentDto,
} from '../types/types.session.ts';

// GET /api/v1/sessions
export const getAllSessions = async (): Promise<GetAllSessionsResponse> => {
  const { data } = await apiClient.get<GetAllSessionsResponse>('/sessions');
  return data;
};

// GET /api/v1/sessions/{id}
export const getSessionById = async (
  id: number
): Promise<GetSessionByIdResponse> => {
  const { data } = await apiClient.get<GetSessionByIdResponse>(
    `/sessions/${id}`
  );
  return data;
};

// GET /api/v1/sessions/{id}/exists
export const checkSessionExists = async (id: number): Promise<boolean> => {
  const { data } = await apiClient.get<SessionExistenceResponse>(
    `/sessions/${id}/exists`
  );
  return data.exists;
};

// GET /api/v1/sessions/filter?query
export const searchSessions = async (
  query: string
): Promise<SessionFilterResponse> => {
  const { data } = await apiClient.get<SessionFilterResponse>(
    `/sessions/filter${query.startsWith('?') ? query : `?${query}`}`
  );
  return data;
};

// GET /api/v1/sessions/filter-with-content?query
export const searchSessionsWithContent = async (
  query: string
): Promise<SessionFilterResponse> => {
  const { data } = await apiClient.get<SessionFilterResponse>(
    `/sessions/filter-with-content${query.startsWith('?') ? query : `?${query}`}`
  );
  return data;
};

// POST /api/v1/sessions
export const createSession = async (
  payload: CreateSessionRequest
): Promise<CreateSessionResponse> => {
  const { data } = await apiClient.post<CreateSessionResponse>(
    '/sessions',
    payload
  );
  return data;
};

// PUT /api/v1/sessions/{id}
export const updateSession = async (
  id: number,
  payload: UpdateSessionRequest
): Promise<void> => {
  await apiClient.put(`/sessions/${id}`, payload);
};

// DELETE /api/v1/sessions/{id}
export const deleteSession = async (id: number): Promise<void> => {
  await apiClient.delete(`/sessions/${id}`);
};
