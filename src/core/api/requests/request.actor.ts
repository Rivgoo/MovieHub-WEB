import apiClient from '../client.ts';
import {
  ActorFilterResponse,
  GetAllActorsResponse,
  GetActorByIdResponse,
  ActorExistenceResponse,
  CreateActorRequest,
  CreateActorResponse,
  UploadActorPhotoRequest,
  UploadActorPhotoResponse,
  UpdateActorRequest,
} from '../types/types.actor.ts';

// GET /api/v1/actors
export const getAllActors = async (): Promise<GetAllActorsResponse> => {
  const { data } = await apiClient.get<GetAllActorsResponse>('/actors');
  return data;
};

// GET /api/v1/actors/{id}
export const getActorById = async (
  id: number
): Promise<GetActorByIdResponse> => {
  const { data } = await apiClient.get<GetActorByIdResponse>(`/actors/${id}`);
  return data;
};

// GET /api/v1/actors/{id}/exists
export const checkActorExists = async (id: number): Promise<boolean> => {
  const { data } = await apiClient.get<ActorExistenceResponse>(
    `/actors/${id}/exists`
  );
  return data.exists;
};

// GET /api/v1/actors/filter?query
export const searchActors = async (
  query: string
): Promise<ActorFilterResponse> => {
  const { data } = await apiClient.get<ActorFilterResponse>(
    `/actors/filter${query.startsWith('?') ? query : `?${query}`}`
  );
  return data;
};

// POST /api/v1/actors
export const createActor = async (
  payload: CreateActorRequest
): Promise<CreateActorResponse> => {
  const { data } = await apiClient.post<CreateActorResponse>(
    '/actors',
    payload
  );
  return data;
};

// POST /api/v1/actors/{id}/photo
export const uploadActorPhoto = async (
  id: number,
  payload: UploadActorPhotoRequest
): Promise<UploadActorPhotoResponse> => {
  const { data } = await apiClient.post<UploadActorPhotoResponse>(
    `/actors/${id}/photo`,
    payload
  );
  return data;
};

// PUT /api/v1/actors/{id}
export const updateActor = async (
  id: number,
  payload: UpdateActorRequest
): Promise<void> => {
  await apiClient.put(`/actors/${id}`, payload);
};

// DELETE /api/v1/actors/{id}
export const deleteActor = async (id: Number): Promise<void> => {
  await apiClient.put(`/actors/${id}`);
};

// DELETE /api/v1/actors/{id}/photo
export const deleteActorPhoto = async (id: Number): Promise<void> => {
  await apiClient.put(`/actors/${id}/photo`);
};
