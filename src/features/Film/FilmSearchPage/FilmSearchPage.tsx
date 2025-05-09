import React, { useEffect, useState, useCallback, useRef } from 'react';
import Layout from '../../../shared/components/Layout.tsx';
import SearchForm from './blocks/SearchForm/SearchForm.tsx';
import FilmGrid from './blocks/FilmGrid/FilmGrid.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildContentQuery } from './blocks/SearchForm/buildContentQuery.utli.ts';

const normalizeFilterValue = (
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

type StateFilterKeys =
  | 'SearchTerms'
  | 'MinRating'
  | 'MinReleaseYear'
  | 'MinDurationMinutes'
  | 'MaxDurationMinutes'
  | 'GenreIds'
  | 'HasSessions'
  | 'MinAgeRating';

type FilterBarKeys =
  | 'searchTerm'
  | 'rating'
  | 'releaseYear'
  | 'duration'
  | 'genreId'
  | 'isNowShowing'
  | 'ageRating';

const FilmSearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { search: urlSearchString } = location;

  const [filters, setFilters] = useState<
    Partial<Record<StateFilterKeys, string>>
  >({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQueryForGrid, setSearchQueryForGrid] = useState<
    string | undefined
  >(undefined);

  const hasInitializedFromUrl = useRef(false);
  const prevUrlRef = useRef<string>(location.search);

  const mapApiFiltersToFilterBar = useCallback(
    (
      apiFilters: Partial<Record<StateFilterKeys, string>>
    ): Record<string, string> => {
      const filterBarFilters: Record<string, string> = {};

      if (apiFilters.MinRating)
        filterBarFilters['rating'] = apiFilters.MinRating;
      if (apiFilters.MinReleaseYear)
        filterBarFilters['releaseYear'] = apiFilters.MinReleaseYear;
      if (apiFilters.GenreIds)
        filterBarFilters['genreId'] = apiFilters.GenreIds;
      if (apiFilters.HasSessions !== undefined)
        filterBarFilters['isNowShowing'] = apiFilters.HasSessions;
      if (apiFilters.MinAgeRating)
        filterBarFilters['ageRating'] = apiFilters.MinAgeRating;

      const minDuration = apiFilters.MinDurationMinutes;
      const maxDuration = apiFilters.MaxDurationMinutes;
      if (maxDuration === '119') {
        filterBarFilters['duration'] = 'lt120';
      } else if (minDuration === '120') {
        filterBarFilters['duration'] = 'gte120';
      } else {
        filterBarFilters['duration'] = 'any';
      }

      return filterBarFilters;
    },
    []
  );

  useEffect(() => {
    const params = new URLSearchParams(urlSearchString);
    const newApiFiltersFromURL: Partial<Record<StateFilterKeys, string>> = {};
    let newSearchTermFromURL = '';
    let newCurrentPageFromURL = 1;

    params.forEach((value, key) => {
      const paramKey = key as
        | StateFilterKeys
        | 'PageIndex'
        | 'page'
        | 'SearchTerm'
        | 'pageSize';

      if (paramKey === 'SearchTerms' || paramKey === 'SearchTerm') {
        newSearchTermFromURL = value;
      } else if (paramKey === 'PageIndex' || paramKey === 'page') {
        const pageVal = parseInt(value, 10);
        newCurrentPageFromURL = !isNaN(pageVal) && pageVal > 0 ? pageVal : 1;
      } else if (paramKey !== 'pageSize') {
        const normalizedValue = normalizeFilterValue(value);
        if (normalizedValue !== undefined) {
          newApiFiltersFromURL[paramKey as StateFilterKeys] = normalizedValue;
        }
      }
    });

    let stateNeedsUpdate = false;
    if (JSON.stringify(filters) !== JSON.stringify(newApiFiltersFromURL)) {
      setFilters(newApiFiltersFromURL);
      stateNeedsUpdate = true;
    }
    if (searchTerm !== newSearchTermFromURL) {
      setSearchTerm(newSearchTermFromURL);
      stateNeedsUpdate = true;
    }
    if (currentPage !== newCurrentPageFromURL) {
      setCurrentPage(newCurrentPageFromURL);
      stateNeedsUpdate = true;
    }

    if (!hasInitializedFromUrl.current) {
      hasInitializedFromUrl.current = true;

      if (!stateNeedsUpdate && urlSearchString === '') {
        const initialGridQuery = buildContentQuery(
          newApiFiltersFromURL,
          newSearchTermFromURL,
          newCurrentPageFromURL
        );
        setSearchQueryForGrid(initialGridQuery);
      }
    }
    prevUrlRef.current = urlSearchString;
  }, [urlSearchString]);

  useEffect(() => {
    if (!hasInitializedFromUrl.current) {
      return;
    }

    const currentGridQuery = buildContentQuery(
      filters,
      searchTerm,
      currentPage
    );

    if (searchQueryForGrid !== currentGridQuery) {
      setSearchQueryForGrid(currentGridQuery);
    }

    const orderedParams: Array<{ key: string; value: string }> = [];
    orderedParams.push({ key: 'pageSize', value: '10' });

    const normalizedSearchVal = normalizeFilterValue(searchTerm);
    if (normalizedSearchVal)
      orderedParams.push({
        key: 'SearchTerms',
        value: encodeURIComponent(normalizedSearchVal.trim()),
      });

    if (filters.MinRating)
      orderedParams.push({ key: 'MinRating', value: filters.MinRating });
    if (filters.MinReleaseYear)
      orderedParams.push({
        key: 'MinReleaseYear',
        value: filters.MinReleaseYear,
      });
    if (filters.MinDurationMinutes)
      orderedParams.push({
        key: 'MinDurationMinutes',
        value: filters.MinDurationMinutes,
      });
    if (filters.MaxDurationMinutes)
      orderedParams.push({
        key: 'MaxDurationMinutes',
        value: filters.MaxDurationMinutes,
      });
    if (filters.GenreIds)
      orderedParams.push({ key: 'GenreIds', value: filters.GenreIds });
    if (filters.HasSessions)
      orderedParams.push({ key: 'HasSessions', value: filters.HasSessions });
    if (filters.MinAgeRating)
      orderedParams.push({ key: 'MinAgeRating', value: filters.MinAgeRating });

    const hasMeaningfulParams = orderedParams.length > 1;
    if (currentPage > 1 || hasMeaningfulParams) {
      orderedParams.push({ key: 'PageIndex', value: currentPage.toString() });
    }

    let newGeneratedUrlSearchString = orderedParams
      .map((p) => `${p.key}=${p.value}`)
      .join('&');
    const targetPath = location.pathname;
    if (newGeneratedUrlSearchString)
      newGeneratedUrlSearchString = `?${newGeneratedUrlSearchString}`;

    if (prevUrlRef.current !== newGeneratedUrlSearchString) {
      prevUrlRef.current = newGeneratedUrlSearchString;

      if (newGeneratedUrlSearchString === '' && location.search !== '') {
        navigate(targetPath, { replace: true });
      } else if (newGeneratedUrlSearchString !== '') {
        navigate(`${targetPath}${newGeneratedUrlSearchString}`, {
          replace: true,
        });
      }
    }
  }, [
    filters,
    searchTerm,
    currentPage,
    navigate,
    location.pathname,
    searchQueryForGrid,
  ]);

  const handleActualSearch = useCallback((newSearchQuery: string) => {
    setSearchTerm(newSearchQuery);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback(
    (filterBarKey: FilterBarKeys, filterValue: string) => {
      setFilters((prevApiFilters) => {
        const updatedApiFilters = { ...prevApiFilters };
        const normalizedValue = normalizeFilterValue(filterValue);

        if (filterBarKey === 'rating') delete updatedApiFilters['MinRating'];
        if (filterBarKey === 'releaseYear')
          delete updatedApiFilters['MinReleaseYear'];
        if (filterBarKey === 'duration') {
          delete updatedApiFilters['MinDurationMinutes'];
          delete updatedApiFilters['MaxDurationMinutes'];
        }
        if (filterBarKey === 'genreId') delete updatedApiFilters['GenreIds'];
        if (filterBarKey === 'isNowShowing')
          delete updatedApiFilters['HasSessions'];
        if (filterBarKey === 'ageRating')
          delete updatedApiFilters['MinAgeRating'];

        if (normalizedValue !== undefined) {
          if (filterBarKey === 'rating')
            updatedApiFilters['MinRating'] = normalizedValue;
          if (filterBarKey === 'releaseYear')
            updatedApiFilters['MinReleaseYear'] = normalizedValue;
          updatedApiFilters['GenreIds'] = normalizedValue;
          if (filterBarKey === 'isNowShowing')
            updatedApiFilters['HasSessions'] = normalizedValue;
          if (filterBarKey === 'ageRating')
            updatedApiFilters['MinAgeRating'] = normalizedValue;
          if (filterBarKey === 'duration') {
            if (normalizedValue === 'lt120') {
              updatedApiFilters['MaxDurationMinutes'] = '119';
            } else if (normalizedValue === 'gte120') {
              updatedApiFilters['MinDurationMinutes'] = '120';
            }
          }
        }

        return updatedApiFilters;
      });
      setCurrentPage(1);
    },
    [normalizeFilterValue]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  if (!hasInitializedFromUrl.current && urlSearchString !== '') {
    return null;
  }

  return (
    <Layout>
      <SearchForm
        onSearchTermChange={handleActualSearch}
        filters={mapApiFiltersToFilterBar(filters)}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        initialSearchTerm={searchTerm}
      />
      <FilmGrid
        searchQuery={searchQueryForGrid}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Layout>
  );
};
export default FilmSearchPage;
