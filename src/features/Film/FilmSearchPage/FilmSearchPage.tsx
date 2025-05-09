import React, { useEffect, useState, useCallback, useRef } from 'react';
import Layout from '../../../shared/components/Layout.tsx';
import SearchForm from './blocks/SearchForm/SearchForm.tsx';
import FilmGrid from './blocks/FilmGrid/FilmGrid.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  buildContentQuery,
  StateFilters as ApiStateFiltersType,
} from './blocks/SearchForm/buildContentQuery.utli.ts';

const normalizeFilterValueForStateAndUrl = (
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

type ApiFilterKeys = keyof ApiStateFiltersType;
type FilterBarInputKeys =
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

  const [apiFilters, setApiFilters] = useState<ApiStateFiltersType>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQueryForGrid, setSearchQueryForGrid] = useState<
    string | undefined
  >(undefined);

  const isInitialLoadDone = useRef(false);
  const currentGeneratedUrl = useRef<string>(location.search);

  const mapApiFiltersToFilterBar = useCallback(
    (currentApiFilters: ApiStateFiltersType): Record<string, string> => {
      const filterBarDisplayFilters: Record<string, string> = {};
      if (currentApiFilters.MinRating)
        filterBarDisplayFilters['rating'] = currentApiFilters.MinRating;
      if (currentApiFilters.MinReleaseYear)
        filterBarDisplayFilters['releaseYear'] =
          currentApiFilters.MinReleaseYear;
      if (currentApiFilters.GenreIds)
        filterBarDisplayFilters['genreId'] = currentApiFilters.GenreIds;
      if (currentApiFilters.HasSessions !== undefined)
        filterBarDisplayFilters['isNowShowing'] = currentApiFilters.HasSessions;
      if (currentApiFilters.MinAgeRating)
        filterBarDisplayFilters['ageRating'] = currentApiFilters.MinAgeRating;
      const minDuration = currentApiFilters.MinDurationMinutes;
      const maxDuration = currentApiFilters.MaxDurationMinutes;
      if (maxDuration === '119' && !minDuration)
        filterBarDisplayFilters['duration'] = 'lt120';
      else if (minDuration === '120' && !maxDuration)
        filterBarDisplayFilters['duration'] = 'gte120';
      else if (!minDuration && !maxDuration)
        filterBarDisplayFilters['duration'] = 'any';
      else filterBarDisplayFilters['duration'] = 'any';
      return filterBarDisplayFilters;
    },
    []
  );

  useEffect(() => {
    const params = new URLSearchParams(urlSearchString);
    const newApiFiltersFromURL: ApiStateFiltersType = {};
    let newSearchTermFromURL = '';
    let newCurrentPageFromURL = 1;

    params.forEach((value, key) => {
      const paramKey = key as
        | ApiFilterKeys
        | 'SearchTerms'
        | 'SearchTerm'
        | 'PageIndex'
        | 'page'
        | 'pageSize';
      if (paramKey === 'SearchTerms' || paramKey === 'SearchTerm')
        newSearchTermFromURL = value;
      else if (paramKey === 'PageIndex' || paramKey === 'page') {
        const pageVal = parseInt(value, 10);
        newCurrentPageFromURL = !isNaN(pageVal) && pageVal > 0 ? pageVal : 1;
      } else if (paramKey !== 'pageSize') {
        const normalizedVal = normalizeFilterValueForStateAndUrl(value);
        if (normalizedVal)
          newApiFiltersFromURL[paramKey as ApiFilterKeys] = normalizedVal;
      }
    });

    setApiFilters(newApiFiltersFromURL);
    setSearchTerm(newSearchTermFromURL);
    setCurrentPage(newCurrentPageFromURL);

    const initialGridQuery = buildContentQuery(
      newApiFiltersFromURL,
      newSearchTermFromURL,
      newCurrentPageFromURL
    );
    setSearchQueryForGrid(initialGridQuery);

    currentGeneratedUrl.current = urlSearchString;
    isInitialLoadDone.current = true;
  }, []);

  useEffect(() => {
    if (!isInitialLoadDone.current) {
      return;
    }

    const newGridQuery = buildContentQuery(apiFilters, searchTerm, currentPage);
    if (searchQueryForGrid !== newGridQuery) {
      setSearchQueryForGrid(newGridQuery);
    }

    const orderedParams: Array<{ key: string; value: string }> = [];
    orderedParams.push({ key: 'pageSize', value: '10' });

    const normalizedSearchVal = normalizeFilterValueForStateAndUrl(searchTerm);
    if (normalizedSearchVal)
      orderedParams.push({
        key: 'SearchTerms',
        value: encodeURIComponent(normalizedSearchVal.trim()),
      });

    const minRating = normalizeFilterValueForStateAndUrl(apiFilters.MinRating);
    if (minRating) orderedParams.push({ key: 'MinRating', value: minRating });

    const minReleaseYear = normalizeFilterValueForStateAndUrl(
      apiFilters.MinReleaseYear
    );
    if (minReleaseYear)
      orderedParams.push({ key: 'MinReleaseYear', value: minReleaseYear });

    const minDuration = normalizeFilterValueForStateAndUrl(
      apiFilters.MinDurationMinutes
    );
    if (minDuration)
      orderedParams.push({ key: 'MinDurationMinutes', value: minDuration });

    const maxDuration = normalizeFilterValueForStateAndUrl(
      apiFilters.MaxDurationMinutes
    );
    if (maxDuration)
      orderedParams.push({ key: 'MaxDurationMinutes', value: maxDuration });

    const genreIds = normalizeFilterValueForStateAndUrl(apiFilters.GenreIds);
    if (genreIds) orderedParams.push({ key: 'GenreIds', value: genreIds });

    const hasSessions = normalizeFilterValueForStateAndUrl(
      apiFilters.HasSessions
    );
    if (hasSessions !== undefined)
      orderedParams.push({ key: 'HasSessions', value: hasSessions });

    const minAgeRating = normalizeFilterValueForStateAndUrl(
      apiFilters.MinAgeRating
    );
    if (minAgeRating)
      orderedParams.push({ key: 'MinAgeRating', value: minAgeRating });

    const hasMeaningfulParams = orderedParams.some((p) => p.key !== 'pageSize');
    if (currentPage > 1 || hasMeaningfulParams) {
      orderedParams.push({ key: 'PageIndex', value: currentPage.toString() });
    }

    let newUrlString = orderedParams
      .map((p) => `${p.key}=${p.value}`)
      .join('&');
    const targetPath = location.pathname;
    if (newUrlString) newUrlString = `?${newUrlString}`;

    if (currentGeneratedUrl.current !== newUrlString) {
      currentGeneratedUrl.current = newUrlString;
      if (newUrlString === '' && location.search !== '') {
        navigate(targetPath, { replace: true });
      } else if (newUrlString !== '' && location.search !== newUrlString) {
        navigate(`${targetPath}${newUrlString}`, { replace: true });
      }
    }
  }, [
    apiFilters,
    searchTerm,
    currentPage,
    navigate,
    location,
    searchQueryForGrid,
    normalizeFilterValueForStateAndUrl,
  ]);

  const handleActualSearch = useCallback((newSearchQuery: string) => {
    setApiFilters((prev) => ({ ...prev }));
    setSearchTerm(newSearchQuery);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback(
    (filterBarKey: FilterBarInputKeys, filterValueFromBar: string) => {
      setApiFilters((prevApiFilters) => {
        const updatedApiFilters: ApiStateFiltersType = { ...prevApiFilters };
        const normalizedValue =
          normalizeFilterValueForStateAndUrl(filterValueFromBar);

        if (filterBarKey === 'duration') {
          delete updatedApiFilters.MinDurationMinutes;
          delete updatedApiFilters.MaxDurationMinutes;
        } else if (filterBarKey === 'rating') {
          delete updatedApiFilters.MinRating;
        } else if (filterBarKey === 'releaseYear') {
          delete updatedApiFilters.MinReleaseYear;
        } else if (filterBarKey === 'genreId') {
          delete updatedApiFilters.GenreIds;
        } else if (filterBarKey === 'isNowShowing') {
          delete updatedApiFilters.HasSessions;
        } else if (filterBarKey === 'ageRating') {
          delete updatedApiFilters.MinAgeRating;
        }

        if (normalizedValue !== undefined) {
          switch (filterBarKey) {
            case 'rating':
              updatedApiFilters.MinRating = normalizedValue;
              break;
            case 'releaseYear':
              updatedApiFilters.MinReleaseYear = normalizedValue;
              break;
            case 'duration':
              if (normalizedValue === 'lt120')
                updatedApiFilters.MaxDurationMinutes = '119';
              else if (normalizedValue === 'gte120')
                updatedApiFilters.MinDurationMinutes = '120';
              break;
            case 'genreId':
              updatedApiFilters.GenreIds = normalizedValue;
              break;
            case 'isNowShowing':
              updatedApiFilters.HasSessions = normalizedValue;
              break;
            case 'ageRating':
              updatedApiFilters.MinAgeRating = normalizedValue;
              break;
          }
        }
        return updatedApiFilters;
      });
      setCurrentPage(1);
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setApiFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setApiFilters((prev) => ({ ...prev }));
    setCurrentPage(newPage);
  }, []);

  if (!isInitialLoadDone.current && urlSearchString !== '') {
    return null;
  }

  return (
    <Layout>
      <SearchForm
        onSearchTermChange={handleActualSearch}
        filters={mapApiFiltersToFilterBar(apiFilters)}
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
