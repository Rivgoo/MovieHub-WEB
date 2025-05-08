export type ContentFilters = Record<string, string>;

export function buildContentQuery(
  filters: ContentFilters,
  searchTerm: string,
  pageIndex: number = 1
): string {
  const params = new URLSearchParams();

  if (searchTerm.trim()) {
    params.set('SearchTerms', searchTerm.trim());
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (!value) return;

    switch (key) {
      case 'availableRate':
        params.set('MinRating', value);
        break;
      case 'genreId':
        params.set('GenreIds', value);
        break;
      case 'availableInCinema':
        params.set('HasSessions', value);
        break;
      case 'duration':
        if (value === 'short') params.set('MaxDuration', '90');
        else if (value === 'medium') params.set('Duration', '120');
        else if (value === 'long') params.set('MinDuration', '150');
        break;
      case 'releaseYear':
        params.set('MinReleaseYear', (Number(value) - 1).toString());
        break;
      default:
        params.set(key, value);
    }
  });

  params.set('pageIndex', pageIndex.toString());

  return `?${params.toString()}`;
}
