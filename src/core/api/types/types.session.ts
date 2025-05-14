//тип Request описує body (наприклад, CreateContentRequest).
//тип Response — успішну відповідь (наприклад, ContentDto або UploadPosterResponse).

// Templates
export type SessionStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Canceled';

export interface SessionDto {
  id: number;
  startTime: string;
  contentId: number;
  cinemaHallId: number;
  status: SessionStatus;
  ticketPrice: number;
}

// GET /api/v1/sessions/filter-with-content
export interface SessionWithContentDto extends SessionDto {
  title: string;
  description: string;
  rating: number;
  releaseYear: number;
  trailerUrl: string;
  bannerUrl: string;
  posterUrl: string;
  durationMinutes: number;
  genreIds: number[];
}
//-----------------------------------------------------------

// GET /api/v1/sessions/filter
export interface SessionFilterResponse {
  items: SessionWithContentDto[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
//-----------------------------------------------------------

// GET /api/v1/sessions
export type GetAllSessionsResponse = SessionDto[];
//-----------------------------------------------------------

// GET /api/v1/sessions/{id}
export type GetSessionByIdResponse = SessionDto;
//-----------------------------------------------------------

// GET /api/v1/sessions/{id}/exists
export interface SessionExistenceResponse {
  exists: boolean;
}
//-----------------------------------------------------------

// POST /api/v1/sessions
export interface CreateSessionRequest {
  startTime: string;
  contentId: number;
  cinemaHallId: number;
  ticketPrice: number;
}
export interface CreateSessionResponse {
  id: number;
}
//-----------------------------------------------------------

// PUT /api/v1/sessions/{id}
export interface UpdateSessionRequest {
  startTime: string;
  contentId: number;
  cinemaHallId: number;
  ticketPrice: number;
}
export type UpdateSessionResponse = void;
//-----------------------------------------------------------

// DELETE /api/v1/sessions/{id}
export type DeleteSessionResponse = void;
