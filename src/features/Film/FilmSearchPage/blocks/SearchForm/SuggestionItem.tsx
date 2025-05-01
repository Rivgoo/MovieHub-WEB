import React, { memo } from 'react';
import { ApiFilmResponse } from '../../../../../core/api/types';
import { Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

type StyleKeys = keyof ReturnType<
  typeof import('./SearchForm.styles.ts').default
>;
type StylesType = Partial<Record<StyleKeys, SxProps<Theme>>>;

interface SuggestionItemProps {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: ApiFilmResponse;
  styles: StylesType;
}

const SuggestionItem: React.FC<SuggestionItemProps> = memo(
  ({ props, option, styles }) => (
    <li {...props} key={option.id}>
      <Typography variant="body1" sx={styles.optionText}>
        {option?.title ?? 'Invalid Title'}
      </Typography>
    </li>
  )
);

SuggestionItem.displayName = 'SuggestionItem';

export default SuggestionItem;
