import React, { useEffect, useState, useCallback, useRef } from 'react';
import Layout from '../../../shared/components/Layout.tsx';
import SearchForm from './blocks/SearchForm/SearchForm.tsx';
import FilmGrid from './blocks/FilmGrid/FilmGrid.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  buildContentQuery,
  StateFilters as ApiStateFiltersType,
} from './blocks/SearchForm/buildContentQuery.utli.ts';
import MetaTags from '../../../shared/components/MetaTag/MetaTags';

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
  const lastProcessedUrl = useRef<string>('');

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
      if (currentApiFilters.MaxAgeRating)
        filterBarDisplayFilters['ageRating'] = currentApiFilters.MaxAgeRating;
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

    const gridQuery = buildContentQuery(
      newApiFiltersFromURL,
      newSearchTermFromURL,
      newCurrentPageFromURL
    );
    setSearchQueryForGrid(gridQuery);

    lastProcessedUrl.current = urlSearchString;
    if (!isInitialLoadDone.current) {
        isInitialLoadDone.current = true;
    }
  }, [urlSearchString]); 

  useEffect(() => {
    if (!isInitialLoadDone.current) {
      return;
    }

    const orderedParams: Array<{ key: string; value: string }> = [];

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

    const maxAgeRating = normalizeFilterValueForStateAndUrl(
      apiFilters.MaxAgeRating
    );
    if (maxAgeRating)
      orderedParams.push({ key: 'MaxAgeRating', value: maxAgeRating });

    const hasMeaningfulParams = orderedParams.length > 0;
    if (currentPage > 1 || (hasMeaningfulParams && currentPage === 1) ) {
      orderedParams.push({ key: 'PageIndex', value: currentPage.toString() });
    }

    let newUrlString = orderedParams
      .map((p) => `${p.key}=${p.value}`)
      .join('&');
    const targetPath = location.pathname;
    if (newUrlString) newUrlString = `?${newUrlString}`;

    if (lastProcessedUrl.current !== newUrlString) {
      lastProcessedUrl.current = newUrlString;
      navigate(`${targetPath}${newUrlString}`, { replace: true });
    }
  }, [
    apiFilters,
    searchTerm,
    currentPage,
    navigate,
    location.pathname
  ]);

  const handleActualSearch = useCallback((newSearchQuery: string) => {
    if (searchTerm !== newSearchQuery || currentPage !== 1) {
        setSearchTerm(newSearchQuery);
        setCurrentPage(1);
    }
  }, [searchTerm, currentPage]);

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
          delete updatedApiFilters.MaxAgeRating;
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
              updatedApiFilters.MaxAgeRating = normalizedValue;
              break;
          }
        }
        return updatedApiFilters;
      });
      if (currentPage !== 1) {
         setCurrentPage(1);
      }
    },
    [currentPage]
  );

  const handleResetFilters = useCallback(() => {
    if (Object.keys(apiFilters).length > 0 || searchTerm !== '' || currentPage !== 1) {
        setApiFilters({});
        setSearchTerm('');
        setCurrentPage(1);
    }
  }, [apiFilters, searchTerm, currentPage]);

  const handlePageChange = useCallback((newPage: number) => {
    if (currentPage !== newPage) {
       setCurrentPage(newPage);
    }
  }, [currentPage]);

  if (!isInitialLoadDone.current && urlSearchString !== '') {
    return null;
  }

  return (
    <Layout>
      <MetaTags 
        title="Пошук фільмів - Знайдіть ідеальний фільм | MovieHub" 
        description="Шукайте фільми за назвою, жанром, роком випуску та іншими критеріями..." 
      />
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
