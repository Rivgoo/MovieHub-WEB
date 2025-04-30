export interface ApiErrorResponse {
  code: string;
  description: string;
  errorType: string;
}
export interface ApiFilmResponse {
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
