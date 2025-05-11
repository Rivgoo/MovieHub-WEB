//тип Request описує body (наприклад, CreateContentRequest).
//тип Response — успішну відповідь (наприклад, ContentDto або UploadPosterResponse).

// Templates
export interface GenreDto {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
//-----------------------------------------------------------

// GET /api/v1/genres/{id}/exists
export interface GenreExistenceResponse {
  exists: boolean;
}
//-----------------------------------------------------------

// GET /api/v1/genres
export type GetAllGenresResponse = GenreDto[];
//-----------------------------------------------------------

// GET /api/v1/genres/{id}
export type GetGenreByIdResponse = GenreDto;
//-----------------------------------------------------------

// POST /api/v1/genres
export interface CreateGenreRequest {
  name: string;
}

export interface CreateGenreResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
}
//-----------------------------------------------------------

// PUT /api/v1/genres/{id}
export interface UpdateGenreRequest {
  name: string;
}

export type UpdateGenreResponse = void;
//-----------------------------------------------------------

// DELETE /api/v1/genres/{id}
export type DeleteGenreResponse = void;