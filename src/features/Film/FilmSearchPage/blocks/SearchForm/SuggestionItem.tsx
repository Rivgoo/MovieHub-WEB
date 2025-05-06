import React, { memo } from 'react';
import { ContentDto } from '../../../../../core/api/types/types.content';
import { Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

type StyleKeys = keyof ReturnType<typeof import('./SearchForm.styles').default>;
type StylesType = Partial<Record<StyleKeys, SxProps<Theme>>>;

interface SuggestionItemProps {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: ContentDto;
  styles: StylesType;
}

const SuggestionItem: React.FC<SuggestionItemProps> = memo(
  ({ props, option, styles }) => (
    <li {...props}>
      <Typography variant="body1" sx={styles.searchFormOptionText}>
        {option?.title ?? 'Invalid Title'}
      </Typography>
    </li>
  )
);

SuggestionItem.displayName = 'SuggestionItem';

export default SuggestionItem;
