import apiClient from '../client.ts';
import {
  ContentFilterResponse,
  CreateContentRequest,
  CreateContentResponse,
  GetContentByIdResponse,
  ExistsResponse,
  UploadPosterResponse,
  AddActorToContentRequest,
  AddGenreToContentRequest,
  UpdateContentRequest,
  GetAllContentsResponse,
} from '../types/types.content.ts';

// GET api/v1/contents/filter
export const searchContent = async (
  query: string
): Promise<ContentFilterResponse> => {
  const { data } = await apiClient.get<ContentFilterResponse>(
    `/contents/filter${query.startsWith('?') ? query : `?${query}`}`
  );
  return data;
};

// GET api/v1/contents/{id}/exists
export const checkContentExists = async (id: number): Promise<boolean> => {
  const { data } = await apiClient.get<ExistsResponse>(
    `/contents/${id}/exists`
  );
  return data.exists;
};

// GET /api/v1/contents
export const getAllContents = async (): Promise<GetAllContentsResponse> => {
  const { data } = await apiClient.get<GetAllContentsResponse>('/contents');
  return data;
};

// GET /api/v1/contents/{id}
export const getContentById = async (
  id: number
): Promise<GetContentByIdResponse> => {
  const { data } = await apiClient.get<GetContentByIdResponse>(
    `/contents/${id}`
  );
  return data;
};

// POST /api/v1/contents
export const createContent = async (
  payload: CreateContentRequest
): Promise<CreateContentResponse> => {
  const { data } = await apiClient.post<CreateContentResponse>(
    '/contents',
    payload
  );
  return data;
};

// POST /api/v1/contents/{id}/poster
export const uploadPoster = async (
  contentId: number,
  base64Poster: string
): Promise<UploadPosterResponse> => {
  const { data } = await apiClient.post<UploadPosterResponse>(
    `/contents/${contentId}/poster`,
    base64Poster,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
  return data;
};

// POST /api/v1/contents/{contentId}/genres
export const addGenreToContent = async (
  contentId: number,
  genreData: AddGenreToContentRequest
): Promise<void> => {
  await apiClient.post(`/contents/${contentId}/genres`, genreData);
};

// POST /api/v1/contents/{id}/actors
export const addActorToContent = async (
  contentId: number,
  actorData: AddActorToContentRequest
): Promise<void> => {
  await apiClient.post(`/contents/${contentId}/actors`, actorData);
};

// PUT /api/v1/contents/{id}
export const updateContent = async (
  id: number,
  payload: UpdateContentRequest
): Promise<void> => {
  await apiClient.put<void>(`/contents/${id}`, payload);
};

// DELETE /api/v1/contents/{id}
export const deleteContent = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`/contents/${id}`);
};

// DELETE /api/v1/contents/{id}/poster
export const deleteContentPoster = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`/contents/${id}/poster`);
};

// DELETE /api/v1/contents/{id}/genres/{genreId}
export const deleteContentGenre = async (
  id: number,
  genreIds: number
): Promise<void> => {
  await apiClient.delete<void>(`/contents/${id}/genres/${genreIds}`);
};

// DELETE /api/v1/contents/{id}/actors/{actorId}
export const deleteContentActor = async (
  id: number,
  actorIds: number
): Promise<void> => {
  await apiClient.delete<void>(`/contents/${id}/genres/${actorIds}`);
};

// DELETE /api/v1/users/favorites/{contentId}
export const removeFromFavorites = async (contentId: number): Promise<void> => {
  await apiClient.delete(`/users/favorites/${contentId}`);
};