export type SessionStatus = 'Ongoing' | 'Scheduled' | 'Ended';

export interface SessionDto {
  id: number;
  startTime: string;
  contentId: number;
  cinemaHallId: number;
  status: SessionStatus;
  ticketPrice: number;
}

// 📘 GET /api/v1/sessions/filter
export interface SessionFilterResponse {
  items: SessionDto[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
//-----------------------------------------------------------

// 📘 GET /api/v1/sessions
export type GetAllSessionsResponse = SessionDto[];
//-----------------------------------------------------------

// 📘 GET /api/v1/sessions/{id}
export type GetSessionByIdResponse = SessionDto;
//-----------------------------------------------------------

// 📘 GET /api/v1/sessions/{id}/exists
export interface SessionExistenceResponse {
  exists: boolean;
}
//-----------------------------------------------------------

// 📘 POST /api/v1/sessions
export interface CreateSessionRequest {
  startTime: string; // ISO string
  contentId: number;
  cinemaHallId: number;
  ticketPrice: number;
}
export interface CreateSessionResponse {
  id: number;
}
//-----------------------------------------------------------

// 📘 PUT /api/v1/sessions/{id}
export interface UpdateSessionRequest {
  startTime: string; // ISO string
  contentId: number;
  cinemaHallId: number;
  ticketPrice: number;
}
export type UpdateSessionResponse = void;
//-----------------------------------------------------------

// 📘 DELETE /api/v1/sessions/{id}
export type DeleteSessionResponse = void;


// NEW TYPES for filter-with-content
export interface SessionContentDto {
  id: number;
  startTime: string;
  cinemaHallId: number;
  status: SessionStatus;
  ticketPrice: number;
  contentId: number;
  title?: string;
  description?: string;
  rating?: number;
  releaseYear?: number;
  trailerUrl?: string;
  bannerUrl?: string;
  posterUrl?: string;
  durationMinutes?: number;
  genreIds?: number[];
  ageRating?: number;
}

export interface SessionContentDtoPaginatedList {
  items: SessionContentDto[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}