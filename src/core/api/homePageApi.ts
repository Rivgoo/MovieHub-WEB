import apiClient from './client';
import { ContentDto } from './types/types.content';
import {
  HeroMovieDto,
  MovieCardDto,
  ContentFilterResponseForHome,
} from './types/types.home';

const mapContentToHeroMovie = (content: ContentDto): HeroMovieDto => ({
  id: String(content.id),
  title: content.title,
  backdropUrl: content.bannerUrl,
  description: content.description,
  rating:
    content.rating !== null && content.rating !== undefined
      ? content.rating > 10 && content.rating <= 100
        ? parseFloat((content.rating / 10).toFixed(1))
        : parseFloat(content.rating.toFixed(1))
      : undefined,
  durationMinutes: content.durationMinutes,
  trailerUrl: content.trailerUrl,
});

const mapContentToMovieCard = (content: ContentDto): MovieCardDto => ({
  id: String(content.id),
  title: content.title,
  posterUrl: content.posterUrl,
  releaseYear: content.releaseYear,
  vote_average:
    content.rating !== null && content.rating !== undefined
      ? content.rating > 10 && content.rating <= 100
        ? parseFloat((content.rating / 10).toFixed(1))
        : parseFloat(content.rating.toFixed(1))
      : undefined,
  durationMinutes: content.durationMinutes,
  ageRating: content.ageRating,
});

const performContentFilterRequest = async (
  queryParams: URLSearchParams
): Promise<ContentDto[]> => {
  try {
    const response = await apiClient.get<ContentFilterResponseForHome>(
      `/contents/filter?${queryParams.toString()}`
    );
    return response.data.items || [];
  } catch (error) {
    console.error(
      'Error during content filter request:',
      error,
      'Query:',
      queryParams.toString()
    );
    throw error;
  }
};

export const getFeaturedMoviesForHero = async (params?: {
  limit?: number;
}): Promise<HeroMovieDto[] | null> => {
  const limit = params?.limit || 5;
  let heroMovies: HeroMovieDto[] = [];

  const queryParamsWithSessions = new URLSearchParams();
  queryParamsWithSessions.set('pageSize', String(limit));
  queryParamsWithSessions.set('pageIndex', '1');
  queryParamsWithSessions.set('hasSessions', 'true');

  const nowUtc = new Date();
  const tenDaysLaterUtc = new Date(nowUtc.getTime() + 10 * 24 * 60 * 60 * 1000);

  queryParamsWithSessions.set('minSessionStartTime', nowUtc.toISOString());
  queryParamsWithSessions.set(
    'maxSessionStartTime',
    tenDaysLaterUtc.toISOString()
  );

  queryParamsWithSessions.append('orderField', 'Rating');
  queryParamsWithSessions.append('orderType', 'OrderByDescending');
  queryParamsWithSessions.set('hasBanner', 'true');

  try {
    const moviesWithSessions = await performContentFilterRequest(
      queryParamsWithSessions
    );
    heroMovies = moviesWithSessions.map(mapContentToHeroMovie);
  } catch (error) {
    console.warn(
      'Could not fetch hero movies with session filters, proceeding to fallback:',
      error
    );
  }

  if (heroMovies.length < limit) {
    const queryParamsFallback = new URLSearchParams();
    queryParamsFallback.set('pageSize', String(limit - heroMovies.length));
    queryParamsFallback.set('pageIndex', '1');
    queryParamsFallback.append('orderField', 'ReleaseYear');
    queryParamsFallback.append('orderType', 'OrderByDescending');
    queryParamsFallback.append('orderField', 'Rating');
    queryParamsFallback.append('orderType', 'ThenByDescending');
    queryParamsFallback.set('hasBanner', 'true');

    try {
      const fallbackMoviesRaw =
        await performContentFilterRequest(queryParamsFallback);
      const fallbackMovies = fallbackMoviesRaw.map(mapContentToHeroMovie);

      const existingIds = new Set(heroMovies.map((m) => m.id));
      fallbackMovies.forEach((fm) => {
        if (!existingIds.has(fm.id) && heroMovies.length < limit) {
          heroMovies.push(fm);
          existingIds.add(fm.id);
        }
      });
    } catch (error) {
      console.error('Error fetching fallback hero movies:', error);
    }
  }

  return heroMovies.length > 0 ? heroMovies.slice(0, limit) : null;
};

export const getPopularMoviesList = async (params?: {
  pageIndex?: number;
  pageSize?: number;
}): Promise<MovieCardDto[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('pageIndex', String(params?.pageIndex || 1));
    queryParams.set('pageSize', String(params?.pageSize || 10));
    queryParams.append('orderField', 'Rating');
    queryParams.append('orderType', 'OrderByDescending');
    queryParams.set('hasPoster', 'true');

    const moviesRaw = await performContentFilterRequest(queryParams);
    return moviesRaw.map(mapContentToMovieCard);
  } catch (error) {
    console.error('Error fetching popular (top rated) movies:', error);
    return null;
  }
};

export const getNowPlayingMoviesList = async (params?: {
  pageIndex?: number;
  pageSize?: number;
}): Promise<MovieCardDto[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('pageIndex', String(params?.pageIndex || 1));
    queryParams.set('pageSize', String(params?.pageSize || 10));
    queryParams.set('hasSessions', 'true');
    queryParams.append('orderField', 'ReleaseYear');
    queryParams.append('orderType', 'OrderByDescending');
    queryParams.set('hasPoster', 'true');

    const moviesRaw = await performContentFilterRequest(queryParams);
    return moviesRaw.map(mapContentToMovieCard);
  } catch (error) {
    console.error("Error fetching 'now playing' movies:", error);
    return null;
  }
};
