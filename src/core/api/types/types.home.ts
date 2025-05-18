import { ContentDto } from './types.content'; 

export interface HeroMovieDto {
  id: string | number; 
  title: string;       
  backdropUrl: string | null; 
  description?: string | null;
  rating?: number;          
  durationMinutes?: number;  
  trailerUrl?: string | null; 
}

export interface MovieCardDto {
  id: string | number;
  title: string;
  posterUrl: string | null; 
  releaseYear?: number;  
  vote_average?: number;  
  durationMinutes?: number; 
  ageRating?: number; 
}


export interface ContentFilterResponseForHome {
  items: ContentDto[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}