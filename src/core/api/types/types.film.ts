export interface ProcessedFilmDetails {
  id: string;
  title: string;
  overview: string;
  tagline?: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  runtime: number | null;
  formattedRuntime?: string;
  genres: string[]; 
  mainGenres?: string[];
  vote_average: number;
  ageRating: string; 
  directorName: string;
  actors: ProcessedActor[];
  trailerUrl: string | null;
}

export interface ProcessedActor {
  id: string;
  name: string;
  imageUrl: string | null;
}