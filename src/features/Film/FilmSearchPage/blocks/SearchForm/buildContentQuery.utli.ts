export type ContentFilters = Partial<Record<StateFilterKeys, string>>; // Використовуємо StateFilterKeys

// Функція normalizeFilterValueUtil тут або імпортована
const normalizeFilterValueUtil = (
  value: string | undefined
): string | undefined => {
  if (
    value === 'any' ||
    value === '' ||
    value === undefined ||
    value === 'Всі'
  ) {
    // Додано "Всі"
    return undefined;
  }
  return value;
};

export function buildContentQuery(
  filtersFromState: ContentFilters,
  searchTermFromState: string,
  pageIndexFromState: number = 1,
  pageSizeToUse: number = 10
): string {
  const queryParams = new URLSearchParams();

  queryParams.append('pageSize', pageSizeToUse.toString());

  const normalizedSearch = normalizeFilterValueUtil(searchTermFromState);
  if (normalizedSearch) {
    queryParams.append('SearchTerms', normalizedSearch.trim());
  }

  // Обробляємо фільтри з API ключами зі стану filtersFromState
  const minRating = normalizeFilterValueUtil(filtersFromState.MinRating);
  if (minRating) queryParams.append('MinRating', minRating);

  const minReleaseYear = normalizeFilterValueUtil(
    filtersFromState.MinReleaseYear
  );
  if (minReleaseYear) queryParams.append('MinReleaseYear', minReleaseYear);

  // Нова логіка для тривалості - перевіряємо і Min і Max зі стану
  const minDuration = normalizeFilterValueUtil(
    filtersFromState.MinDurationMinutes
  );
  const maxDuration = normalizeFilterValueUtil(
    filtersFromState.MaxDurationMinutes
  );
  if (minDuration) queryParams.append('MinDurationMinutes', minDuration);
  if (maxDuration) queryParams.append('MaxDurationMinutes', maxDuration); // API має підтримувати це

  const genreIds = normalizeFilterValueUtil(filtersFromState.GenreIds);
  if (genreIds) queryParams.append('GenreIds', genreIds);

  // hasSessions може бути 'true' або 'false'
  const hasSessions = normalizeFilterValueUtil(filtersFromState.HasSessions);
  if (hasSessions !== undefined) {
    // Додаємо, якщо є true або false
    queryParams.append('HasSessions', hasSessions);
  }

  // Новий фільтр віку
  const minAgeRating = normalizeFilterValueUtil(filtersFromState.MinAgeRating);
  if (minAgeRating) queryParams.append('MinAgeRating', minAgeRating);

  queryParams.append('PageIndex', pageIndexFromState.toString());

  return queryParams.toString();
}

// Визначення StateFilterKeys тут або імпортоване звідкись
type StateFilterKeys =
  | 'SearchTerms'
  | 'MinRating'
  | 'MinReleaseYear'
  | 'MinDurationMinutes'
  | 'MaxDurationMinutes'
  | 'GenreIds'
  | 'HasSessions'
  | 'MinAgeRating';
