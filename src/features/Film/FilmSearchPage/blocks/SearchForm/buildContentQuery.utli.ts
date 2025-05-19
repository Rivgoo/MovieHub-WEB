export type ApiFilterKeys =
  | 'MinRating'
  | 'MinReleaseYear'
  | 'MinDurationMinutes'
  | 'MaxDurationMinutes'
  | 'GenreIds'
  | 'HasSessions'
  | 'MaxAgeRating';
export type StateFilters = Partial<Record<ApiFilterKeys, string>>;

const normalizeFilterValueForApi = (
  value: string | undefined
): string | undefined => {
  if (
    value === 'any' ||
    value === '' ||
    value === undefined ||
    value === 'Всі'
  ) {
    return undefined;
  }
  return value;
};

export function buildContentQuery(
  filtersFromState: StateFilters,
  searchTermFromState: string,
  pageIndexFromState: number = 1,
  pageSizeToUse: number = 8
): string {
  const queryParams = new URLSearchParams();

  queryParams.append('pageSize', pageSizeToUse.toString());

  const normalizedSearch = normalizeFilterValueForApi(searchTermFromState);
  if (normalizedSearch) {
    queryParams.append('SearchTerms', normalizedSearch.trim());
  }

  const minRating = normalizeFilterValueForApi(filtersFromState.MinRating);
  if (minRating) {
    queryParams.append('MinRating', minRating);
  }

  const minReleaseYear = normalizeFilterValueForApi(
    filtersFromState.MinReleaseYear
  );
  if (minReleaseYear) {
    queryParams.append('MinReleaseYear', minReleaseYear);
  }

  const minDuration = normalizeFilterValueForApi(
    filtersFromState.MinDurationMinutes
  );
  if (minDuration) {
    queryParams.append('MinDurationMinutes', minDuration);
  }

  const maxDuration = normalizeFilterValueForApi(
    filtersFromState.MaxDurationMinutes
  );
  if (maxDuration) {
    queryParams.append('MaxDurationMinutes', maxDuration);
  }

  const genreIds = normalizeFilterValueForApi(filtersFromState.GenreIds);
  if (genreIds) {
    queryParams.append('GenreIds', genreIds);
  }

  const hasSessions = normalizeFilterValueForApi(filtersFromState.HasSessions);
  if (hasSessions !== undefined) {
    queryParams.append('HasSessions', hasSessions);
  }

  const maxAgeRating = normalizeFilterValueForApi(
    filtersFromState.MaxAgeRating
  );
  if (maxAgeRating) {
    queryParams.append('MaxAgeRating', maxAgeRating);
  }

  queryParams.append('PageIndex', pageIndexFromState.toString());

  return queryParams.toString();
}
