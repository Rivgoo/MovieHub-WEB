
import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ReplayIcon from '@mui/icons-material/Replay';
import FilterListIcon from '@mui/icons-material/FilterList';


import FilterSelect from './FilterSelect';
import {
    GENRE_FILTER_OPTIONS,
    YEAR_FILTER_OPTIONS,
    RATING_FILTER_OPTIONS,
    SORT_FILTER_OPTIONS,

} from '../constants/FilterOptions';


export interface FiltersState {
    sort: string | number | null;
    genre: string | number | null;
    year: string | number | null;
    rating: string | number | null;

}


interface MovieFilterPanelProps {

    onFiltersChange: (filters: FiltersState) => void;

    initialFilters?: Partial<FiltersState>;

    sx?: object;
}


const DEFAULT_SORT = SORT_FILTER_OPTIONS[0]?.value ?? null;
const DEFAULT_GENRE = 'all';
const DEFAULT_YEAR = 0;
const DEFAULT_RATING = 0;


const MovieFilterPanel: React.FC<MovieFilterPanelProps> = ({
    onFiltersChange,
    initialFilters = {}, 
    sx = {}, 
}) => {

    const [selectedSort, setSelectedSort] = useState<string | number | null>(initialFilters.sort ?? DEFAULT_SORT);
    const [selectedGenre, setSelectedGenre] = useState<string | number | null>(initialFilters.genre ?? DEFAULT_GENRE);
    const [selectedYear, setSelectedYear] = useState<string | number | null>(initialFilters.year ?? DEFAULT_YEAR);
    const [selectedRating, setSelectedRating] = useState<string | number | null>(initialFilters.rating ?? DEFAULT_RATING);

    const handleSortChange = useCallback((value: string | number | null) => setSelectedSort(value), []);
    const handleGenreChange = useCallback((value: string | number | null) => setSelectedGenre(value), []);
    const handleYearChange = useCallback((value: string | number | null) => setSelectedYear(value), []);
    const handleRatingChange = useCallback((value: string | number | null) => setSelectedRating(value), []);

    const handleResetFilters = useCallback(() => {
        setSelectedSort(DEFAULT_SORT);
        setSelectedGenre(DEFAULT_GENRE);
        setSelectedYear(DEFAULT_YEAR);
        setSelectedRating(DEFAULT_RATING);

    }, []);


    useEffect(() => {

        const currentFilters: FiltersState = {
            sort: selectedSort,
            genre: selectedGenre,
            year: selectedYear,
            rating: selectedRating,

        };

        onFiltersChange(currentFilters);
    }, [selectedSort, selectedGenre, selectedYear, selectedRating, onFiltersChange]);


    return (
        <Paper
            elevation={1}
            sx={{
                p: '8px 16px',
                bgcolor: '#303030',
                color: '#e2e8f0',
                borderRadius: 2,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5 },
                border: '1px solid #505050',
                ...sx, 
            }}
        >
            <FilterListIcon sx={{ color: '#FFFFFF', mr: 1, display: { xs: 'none', sm: 'block' } }} />
            <Typography variant="body2" sx={{ mr: 1, color: '#FFFFFF', display: { xs: 'none', md: 'block' } }}>
                Фільтрувати за:
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mr: 1, display: { xs: 'none', md: 'block' } }} />

            {/* --- Фільтри --- */}
            <FilterSelect
                id="panel-sort-filter"
                label="Сортування"
                options={SORT_FILTER_OPTIONS}
                selectedValue={selectedSort}
                onChange={handleSortChange} 
            />
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mx: { xs: 0.5, sm: 1} }} />

            <FilterSelect
                id="panel-genre-filter"
                label="Жанр"
                options={GENRE_FILTER_OPTIONS}
                selectedValue={selectedGenre}
                onChange={handleGenreChange}
            />
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mx: { xs: 0.5, sm: 1} }} />

             <FilterSelect
                id="panel-rating-filter"
                label="Рейтинг"
                options={RATING_FILTER_OPTIONS}
                selectedValue={selectedRating}
                onChange={handleRatingChange}
            />
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mx: { xs: 0.5, sm: 1} }} />

             <FilterSelect
                id="panel-year-filter"
                label="Рік"
                options={YEAR_FILTER_OPTIONS}
                selectedValue={selectedYear}
                onChange={handleYearChange}
            />
            {/* Додайте FilterSelect для Тривалості, якщо потрібно */}

            {/* --- Кнопка Скидання --- */}
            <Box sx={{ flexGrow: 1 }} />
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', ml: 1 }} />
            <Button
                onClick={handleResetFilters}
                startIcon={<ReplayIcon sx={{ fontSize: '1.1rem' }}/>}
                sx={{
                    color: '#f6ad55', textTransform: 'none', fontSize: '0.9rem', p: '5px 10px', ml: { xs: 0.5, sm: 1},
                    '&:hover': { backgroundColor: 'rgba(246, 173, 85, 0.1)' }
                }}
            >
                Скинути
            </Button>
        </Paper>
    );
};

export default MovieFilterPanel;