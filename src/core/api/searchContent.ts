import apiClient from './client.ts';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from './types.ts';
import { ContentDto } from './types/types.content.ts';
// import { ApiGenreResponse } from '../../features/Film/FilmSearchPage/blocks/FilterBar/types.ts';

export const searchContent = async (query: string): Promise<ContentDto[]> => {
  try {
    const { data } = await apiClient.get<{ items: ContentDto[] }>(
      '/contents/filter',
      { params: { SearchTerms: query } }
    );
    return data.items;
  } catch (error) {
    throw error as AxiosError<ApiErrorResponse>;
  }
};
// export const searchGenres = async () => {
//   try {
//     const { data } = await apiClient.get<{ items: ApiGenreResponse[] }>(
//       '/genres'
//     );
//   } catch (error) {}
// };
