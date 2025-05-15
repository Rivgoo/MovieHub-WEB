import apiClient from './client';
import {
  ContentDto,
  ContentFilterResponse,
  CreateContentRequest,
  CreateContentResponse,
  UpdateContentRequest,
  ExistsResponse,
} from './types/types.content';

export interface ContentFilterParams {
  minRating?: number;
  maxRating?: number;
  minReleaseYear?: number;
  maxReleaseYear?: number;
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
}

export const contentApi = {
  getAll: async (): Promise<ContentFilterResponse> => {
    const response = await apiClient.get<ContentFilterResponse>('/contents/filter');
    return response.data;
  },

  getById: async (id: number): Promise<ContentDto> => {
    const response = await apiClient.get<ContentDto>(`/contents/${id}`);
    return response.data;
  },

  exists: async (id: number): Promise<ExistsResponse> => {
    const response = await apiClient.get<ExistsResponse>(`/contents/${id}/exists`);
    return response.data;
  },

  filter: async (params: Record<string, any>): Promise<ContentFilterResponse> => {
    const response = await apiClient.get<ContentFilterResponse>('/contents/filter', { params });
    return response.data;
  },

  create: async (data: CreateContentRequest): Promise<CreateContentResponse> => {
    const response = await apiClient.post<CreateContentResponse>('/contents', data);
    return response.data;
  },

  update: async (id: number, data: UpdateContentRequest): Promise<void> => {
    await apiClient.put(`/contents/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/contents/${id}`);
  },

  uploadPoster: async (id: number, data: { base64Image: string }): Promise<{ posterUrl: string }> => {
    const response = await apiClient.post<{ posterUrl: string }>(`/contents/${id}/poster`, data);
    return response.data;
  },

  uploadBanner: async (id: number, data: { base64Image: string }): Promise<{ bannerUrl: string }> => {
    const response = await apiClient.post<{ bannerUrl: string }>(`/contents/${id}/banner`, data);
    return response.data;
  },

  deletePoster: async (id: number): Promise<void> => {
    await apiClient.delete(`/contents/${id}/poster`);
  },

  deleteBanner: async (id: number): Promise<void> => {
    await apiClient.delete(`/contents/${id}/banner`);
  },

  addGenre: async (id: number, genreId: number): Promise<void> => {
    await apiClient.post(`/contents/${id}/genres/${genreId}`);
  },

  removeGenre: async (id: number, genreId: number): Promise<void> => {
    await apiClient.delete(`/contents/${id}/genres/${genreId}`);
  },

  addActor: async (id: number, actorId: number, roleName: string): Promise<void> => {
    await apiClient.post(`/contents/${id}/actors`, { actorId, roleName });
  },

  removeActor: async (id: number, actorId: number): Promise<void> => {
    await apiClient.delete(`/contents/${id}/actors/${actorId}`);
  },

   getAllGenres: async (contentId: number,genreId: number ) => {
    const response = await apiClient.get(`/contents/${contentId}/genres/${genreId}`);
    return response.data; 
},

   getGenres: async (contentId: number) => {
    const response = await apiClient.get(`/contents/${contentId}`);
    return response.data;
}

};
