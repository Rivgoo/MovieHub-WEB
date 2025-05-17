import apiClient from './client';
import { ContentDto } from './types/types.content';
import { HeroMovieDto, MovieCardDto, ContentFilterResponseForHome } from './types/types.home';

const mapContentToHeroMovie = (content: ContentDto): HeroMovieDto => ({
  id: String(content.id),
  title: content.title,
  backdropUrl: content.bannerUrl,
  description: content.description,
  rating: content.rating !== null && content.rating !== undefined ? (content.rating > 10 && content.rating <= 100 ? parseFloat((content.rating / 10).toFixed(1)) : parseFloat(content.rating.toFixed(1))) : undefined,
  durationMinutes: content.durationMinutes,
  trailerUrl: content.trailerUrl,
});

const mapContentToMovieCard = (content: ContentDto): MovieCardDto => ({
  id: String(content.id),
  title: content.title,
  posterUrl: content.posterUrl,
  releaseYear: content.releaseYear,
  vote_average: content.rating !== null && content.rating !== undefined ? (content.rating > 10 && content.rating <= 100 ? parseFloat((content.rating / 10).toFixed(1)) : parseFloat(content.rating.toFixed(1))) : undefined,
  durationMinutes: content.durationMinutes,
  ageRating: content.ageRating,
});


export const getFeaturedMoviesForHero = async (params?: { limit?: number }): Promise<HeroMovieDto[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('pageSize', String(params?.limit || 5)); 
    queryParams.set('pageIndex', '1');                  

    queryParams.append('orderField', 'ReleaseYear');
    queryParams.append('orderType', 'OrderByDescending');
    queryParams.append('orderField', 'Rating');
    queryParams.append('orderType', 'ThenByDescending');

    queryParams.set('hasBanner', 'true');
    queryParams.set('minRating', '7'); 

    const response = await apiClient.get<ContentFilterResponseForHome>(`/contents/filter?${queryParams.toString()}`);
    return response.data.items.map(mapContentToHeroMovie) || [];
  } catch (error) {
    console.error("Error fetching featured movies for hero:", error);
    return null;
  }
};

export const getPopularMoviesList = async (params?: { pageIndex?: number, pageSize?: number }): Promise<MovieCardDto[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('pageIndex', String(params?.pageIndex || 1)); 
    queryParams.set('pageSize', String(params?.pageSize || 10));  
    queryParams.append('orderField', 'Rating');
    queryParams.append('orderType', 'OrderByDescending'); 
    queryParams.set('hasPoster', 'true');

    const response = await apiClient.get<ContentFilterResponseForHome>(`/contents/filter?${queryParams.toString()}`);
    return response.data.items.map(mapContentToMovieCard) || [];
  } catch (error) {
    console.error("Error fetching popular (top rated) movies:", error);
    return null;
  }
};


export const getNowPlayingMoviesList = async (params?: { pageIndex?: number, pageSize?: number }): Promise<MovieCardDto[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('pageIndex', String(params?.pageIndex || 1)); 
    queryParams.set('pageSize', String(params?.pageSize || 10)); 

    queryParams.set('hasSessions', 'true');
    queryParams.append('orderField', 'ReleaseYear'); 
    queryParams.append('orderType', 'OrderByDescending');
    queryParams.set('hasPoster', 'true');

    queryParams.set('minReleaseYear', (new Date().getFullYear() - 1).toString()); 

    const response = await apiClient.get<ContentFilterResponseForHome>(`/contents/filter?${queryParams.toString()}`);
    return response.data.items.map(mapContentToMovieCard) || [];
  } catch (error) {
    console.error("Error fetching 'now playing' movies:", error);
    return null;
  }
};