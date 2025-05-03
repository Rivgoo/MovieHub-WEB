import apiClient from './client.ts';
import {
  ContentDto,
  ContentFilterResponse,
  CreateContentRequest,
  CreateContentResponse,
  GetContentByIdResponse,
  ExistsResponse,
  UploadPosterResponse,
  AddActorToContentRequest,
  AddGenreToContentResponse,
  UpdateContentRequest,
} from './types/types.content.ts';

// GET api/v1/contents/filter
export const searchContent = async (query: string): Promise<ContentDto[]> => {
  const { data } = await apiClient.get<ContentFilterResponse>(
    `/contents/filter?query=${encodeURIComponent(query)}`
  );
  return data.items;
};

// GET api/v1/contents/{id}/exists
export const checkContentExists = async (id: number): Promise<boolean> => {
  const { data } = await apiClient.get<ExistsResponse>(
    `/contents/${id}/exists`
  );
  return data.exists;
};

// GET /api/v1/contents
export const getAllContents = async (): Promise<ContentDto[]> => {
  const { data } = await apiClient.get<ContentDto[]>('/contents');
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

// POST /api/v1/contents/{id}/genres/{genreId}
export const addGenreToContent = async (
  contentId: number,
  genreId: number
): Promise<AddGenreToContentResponse> => {
  const { data } = await apiClient.post<AddGenreToContentResponse>(
    `/contents/${contentId}/genres/${genreId}`
  );
  return data;
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
