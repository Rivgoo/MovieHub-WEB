//тип Request описує body (наприклад, CreateContentRequest).
//тип Response — успішну відповідь (наприклад, ContentDto або UploadPosterResponse).

// Templates
export interface ContentDto {
  id: number;
  title: string;
  description: string;
  rating: number;
  directorFullName: string;
  releaseYear: number;
  trailerUrl: string;
  bannerUrl: string;
  posterUrl: string;
  durationMinutes: number;
  genreIds: number[];
  actorIds?: number[];
  actors?: { id: number; RoleName?: string| null; fullName?: string; firstName?: string; lastName?: string }[];
  ageRating: number; 
  createdAt: string;
  updatedAt: string;
}

export interface BaseContentPayload {
  title: string;
  description: string;
  rating: number;
  releaseYear: number;
  trailerUrl: string;
  durationMinutes: number;
  directorFullName: string;
  ageRating: number; 
  genreIds: number[];
  actorIds: number[];
}
//-----------------------------------------------------------

// GET api/v1/contents/filter
export interface ContentFilterResponse {
  items: ContentDto[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
//-----------------------------------------------------------

// GET api/v1/contents/{id}/exists
export interface ExistsResponse {
  exists: boolean;
}
//-----------------------------------------------------------

// GET /api/v1/contents
export type GetAllContentsResponse = ContentDto[];
//-----------------------------------------------------------

// GET /api/v1/contents/{id}
export type GetContentByIdResponse = ContentDto;
//-----------------------------------------------------------

// POST /api/v1/contents
export type CreateContentRequest = BaseContentPayload;

export interface CreateContentResponse {
  id: number;
   RoleName: string;
}
//-----------------------------------------------------------

// POST /api/v1/contents/{id}/poster
export type UploadPosterRequest = string;

export interface UploadPosterResponse {
  posterUrl: string;
}
//-----------------------------------------------------------

// POST /api/v1/contents/{id}/genres/{genreId}
export interface AddGenreToContentResponse {
  id: number;
  genreId: number;
}

export interface AddGenreToContentRequest {
  genreId: number;
}
//-----------------------------------------------------------

// POST /api/v1/contents/{id}/actors
export interface AddActorToContentRequest {
  actorId: number;
}
//-----------------------------------------------------------

// PUT /api/v1/contents/{id}
export type UpdateContentRequest = BaseContentPayload;
