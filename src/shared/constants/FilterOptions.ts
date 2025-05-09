export interface FilterOption {
    value: string | number; 
    label: string;          
  }

  export const GENRE_FILTER_OPTIONS: FilterOption[] = [
    { value: 'all', label: 'Всі Жанри' },
    { value: 'action', label: 'Бойовик' },
    { value: 'comedy', label: 'Комедія' },
    { value: 'drama', label: 'Драма' },

  ];
  
  export const RATING_FILTER_OPTIONS: FilterOption[] = [
    { value: 0, label: 'Будь-який' },
    { value: 9, label: '9+' },
    { value: 8, label: '8+' },
    { value: 7, label: '7+' },
  ];
  
  export const YEAR_FILTER_OPTIONS: FilterOption[] = [
    { value: 0, label: 'Будь-який рік' },
    { value: 2024, label: '2024' },
    { value: 2023, label: '2023' },
    { value: -1, label: 'Старші' },
  ];
  
  export const DURATION_FILTER_OPTIONS: FilterOption[] = [
    { value: 'any', label: 'Будь-яка' },
    { value: 'lt90', label: 'До 90 хв' },
    { value: '90-120', label: '90-120 хв' },
  ];
  
  export const SORT_FILTER_OPTIONS: FilterOption[] = [
    { value: 'popularity.desc', label: 'Популярні' }, 
    { value: 'release_date.desc', label: 'Новинки' },
    { value: 'vote_average.desc', label: 'Рейтинг ↓' },
    { value: 'title.asc', label: 'Назва А-Я' },
    { value: 'title.desc', label: 'Назва Я-А' },
  ];
  
