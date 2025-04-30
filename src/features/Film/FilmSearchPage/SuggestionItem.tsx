import React, { memo } from 'react';
import { ApiFilmResponse } from '../../../core/api/types';
import { Typography } from '@mui/material';
import getStyles from './FilmSearchPage.styles';

interface SuggestionItemProps {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: ApiFilmResponse;
  styles: ReturnType<typeof getStyles>;
}

const SuggestionItem: React.FC<SuggestionItemProps> = memo(
  ({ props, option, styles }) => (
    <li
      {...props}
      style={{
        backgroundColor: 'transparent',
        borderBottom: `1px solid`,
      }}>
      <Typography variant="body1" sx={styles.optionText}>
        {option.title}
      </Typography>
    </li>
  )
);

SuggestionItem.displayName = 'SuggestionItem';

export default SuggestionItem;
