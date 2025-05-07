import apiClient from "./client";  
import {
  ActorDto,
  ActorFilterResponse,
  ActorExistenceResponse,
  CreateActorRequest,
  CreateActorResponse,
  UpdateActorRequest,
} from './types/types.actor';

export const actorApi = {
  filter: async (params: Record<string, any>): Promise<ActorFilterResponse> => {
    const response = await apiClient.get<ActorFilterResponse>(`/actors/filter`, { params });
    return response.data;
  },

  checkExists: async (id: number): Promise<ActorExistenceResponse> => {
    const response = await apiClient.get<ActorExistenceResponse>(`/actors/${id}/exists`);
    return response.data;
  },

  getById: async (id: number): Promise<ActorDto> => {
    const response = await apiClient.get<ActorDto>(`/actors/${id}`);
    return response.data;
  },

  create: async (data: CreateActorRequest): Promise<CreateActorResponse> => {
    const response = await apiClient.post<CreateActorResponse>(`/actors`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateActorRequest): Promise<void> => {
    await apiClient.put(`/actors/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/actors/${id}`);
  },

  deletePhoto: async (id: number): Promise<void> => {
    await apiClient.delete(`/actors/${id}/photo`);
  },
};