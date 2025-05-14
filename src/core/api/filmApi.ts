import { getContentById} from './requests/request.content';
import { ProcessedFilmDetails, ProcessedActor } from './types/types.film';
import { getAllGenres } from './genreApi';
import { GenreDto } from './types/types.genre';
import { actorApi } from './actorApi';
import { ActorInContentResponse } from './types/types.actor'



const getAgeRatingText = (ageRating: number | undefined): string => {
  if (ageRating === undefined) return "N/A";
  if (ageRating === 0) return "0+";
  return `${ageRating}+`;
};

const formatRuntime = (minutes: number | null | undefined): string => {
    if (minutes === null || minutes === undefined || minutes <= 0) return 'N/A';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    let result = '';
    if (h > 0) result += `${h} год `;
    if (m > 0) result += `${m} хв`;
    return result.trim() || 'N/A';
};

let genresCache: GenreDto[] | null = null;
const fetchAndCacheGenres = async (): Promise<GenreDto[]> => {
  if (genresCache && genresCache.length > 0) {
    return genresCache;
  }
  try {
    const genres = await getAllGenres();
    genresCache = genres;
    return genres;
  } catch (error) {
      console.error("Не вдалося завантажити список жанрів:", error);
      return [];
  }
};

export const getProcessedFilmDetailsById = async (filmId: string): Promise<ProcessedFilmDetails> => {
  try {
    const numericFilmId = parseInt(filmId, 10); 
    if (isNaN(numericFilmId)) {
      throw new Error("Некоректний ID фільму.");
    }

    const [apiData, allGenres] = await Promise.all([
        getContentById(numericFilmId),
        fetchAndCacheGenres()
    ]);

    const genresMap = new Map<number, string>();
    allGenres.forEach(genre => {
      genresMap.set(genre.id, genre.name);
    });

    let processedActors: ProcessedActor[] = [];
    if (apiData.actorIds && apiData.actorIds.length > 0) {
      try {
        
        const actorPromises = apiData.actorIds.slice(0, 6).map(actorId =>
          actorApi.getInContent(actorId, numericFilmId)
        );
        const actorsData: ActorInContentResponse[] = await Promise.all(actorPromises);

        processedActors = actorsData.map(actorInContentData => ({ 
          id: String(actorInContentData.id),
          name: `${actorInContentData.firstName} ${actorInContentData.lastName}`,
          imageUrl: actorInContentData.photoUrl,
          role: actorInContentData.roleName,
        }));
      } catch (actorError) {
        console.error(`Помилка під час завантаження даних акторів для фільму ID ${numericFilmId}:`, actorError);
       
        processedActors = apiData.actorIds.slice(0, 6).map((id: number) => ({
            id: String(id),
            name: `Актор ID: ${id}`,
            imageUrl: null,
            role: 'Роль невідома' 
        } as ProcessedActor)); 
      }
    }
    
    const filmGenreNames = apiData.genreIds
      ? apiData.genreIds.map((id: number) => genresMap.get(id) || `ID:${id}`)
      : [];
    const mainFilmGenreNames = filmGenreNames.slice(0, 3);

    let calculatedVoteAverage = 0;
    if (apiData.rating !== null && apiData.rating !== undefined) {
        const ratingValue = apiData.rating > 10 && apiData.rating <= 100 ? apiData.rating / 10 : apiData.rating;
        calculatedVoteAverage = parseFloat(ratingValue.toFixed(1));
        if (isNaN(calculatedVoteAverage)) calculatedVoteAverage = 0;
    }

    
    const isInitiallyFavorite = (apiData as any).isFavorited === true || false;

    const processedData: ProcessedFilmDetails = {
      id: String(apiData.id),
      title: apiData.title,
      overview: apiData.description,
      posterUrl: apiData.posterUrl,
      backdropUrl: apiData.bannerUrl,
      releaseDate: String(apiData.releaseYear),
      runtime: apiData.durationMinutes,
      formattedRuntime: formatRuntime(apiData.durationMinutes),
      genres: filmGenreNames,
      mainGenres: mainFilmGenreNames,
      vote_average: calculatedVoteAverage,
      ageRating: getAgeRatingText(apiData.ageRating),
      directorName: apiData.directorFullName,
      actors: processedActors, 
      trailerUrl: apiData.trailerUrl,
      isFavorited: isInitiallyFavorite,
    
    };
    return processedData;
  } catch (error: any) {
    console.error(`Помилка під час отримання та обробки деталей фільму (ID: ${filmId}):`, error);
    if (error.response) {
      if (error.response.status === 401) { throw new Error("Помилка автентифікації. Будь ласка, увійдіть в систему."); }
      if (error.response.status === 404) { throw new Error(`Фільм з ID '${filmId}' не знайдено.`); }
    }
    if (error.message === "Некоректний ID фільму.") { throw error; }
    throw new Error("Не вдалося завантажити дані про фільм. Спробуйте пізніше.");
  }
};