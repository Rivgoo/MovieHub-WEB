//тип Request описує body (наприклад, CreateContentRequest).
//тип Response — успішну відповідь (наприклад, ContentDto або UploadPosterResponse).
//тип ApiError, ProblemDetails — помилки (400+, 401, 404).

// GET api/v1/contents/filter
export interface ContentDto {
  id: number;
  title: string;
  description: string;
  rating: number;
  releaseYear: number;
  trailerUrl: string;
  posterUrl: string;
  durationMinutes: number;
  genreIds: number[];
  actorIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentDtoPaginatedList {
  items: ContentDto[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

// GET api/v1/contents/{id}/exists
export interface ExistsResponse {
  exists: boolean;
}

// GET /api/v1/contents
export type GetAllContentsResponse = ContentDto[];

// GET /api/v1/contents/{id}
export interface GetContentByIdResponse extends ContentDto {}

// POST /api/v1/contents
export interface CreateContentRequest {
  title: string;
  description: string;
  rating: number;
  releaseYear: number;
  trailerUrl: string;
  durationMinutes: number;
  genreIds: number[];
  actorIds: number[];
}

// POST /api/v1/contents/{id}/poster
export interface UploadPosterResponse {
  posterUrl: string;
}

// POST /api/v1/contents/{id}/genres/{genreId}
export interface AddGenreToContentResponse {
  id: number;
  genreId: number;
}

// POST /api/v1/contents/{id}/actors
export interface AddActorToContentRequest {
  actorId: number;
  roleName: string;
}

// PUT /api/v1/contents/{id}
export interface UpdateContentRequest {
  title: string;
  description: string;
  rating: number;
  releaseYear: number;
  trailerUrl: string;
  durationMinutes: number;
  genreIds: number[];
  actorIds: number[];
}

// DELETE /contents/{id}
export interface DeleteContentResponse {
  id: number;
}

// DELETE /contents/{id}/poster
export interface DeletePosterResponse {
  id: number;
}

// DELETE /contents/{id}/genres/{genreId}
export interface RemoveGenreFromContentResponse {
  id: number;
  genreId: number;
}

// DELETE /contents/{id}/actors/{actorId}
export interface RemoveActorFromContentResponse {
  id: number;
  actorId: number;
}
