//тип Request описує body (наприклад, CreateContentRequest).
//тип Response — успішну відповідь (наприклад, ContentDto або UploadPosterResponse).

// Templates
export interface CinemaHallDto {
  id: number;
  name: string;
  seatsPerRow: number[]; // Кількість місць у кожному ряду
  numberOfRows: number;
  totalCapacity: number;
  createdAt: string;
  updatedAt: string;
}

// GET /api/v1/cinema-halls/filter
export interface CinemaHallFilterResponse {
  items: CinemaHallDto[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
//-----------------------------------------------------------

// GET /api/v1/cinema-halls
export type GetAllCinemaHallsResponse = CinemaHallDto[];
//-----------------------------------------------------------

// GET /api/v1/cinema-halls/{id}
export type GetCinemaHallByIdResponse = CinemaHallDto;
//-----------------------------------------------------------

// GET /api/v1/cinema-halls/{id}/exists
export interface CinemaHallExistenceResponse {
  exists: boolean;
}
//-----------------------------------------------------------

// POST /api/v1/cinema-halls
export interface CreateCinemaHallRequest {
  name: string;
  seatsPerRow: number[];
}
export interface CreateCinemaHallResponse {
  id: number;
}
//-----------------------------------------------------------

// PUT /api/v1/cinema-halls/{id}
export interface UpdateCinemaHallRequest {
  name: string;
  seatsPerRow: number[];
}
export type UpdateCinemaHallResponse = void;
//-----------------------------------------------------------

// DELETE /api/v1/cinema-halls/{id}
export type DeleteCinemaHallResponse = void;
