import React from 'react';
import { ContentDto } from '../../../../../core/api/types/types.content';
import { Typography, useTheme } from '@mui/material';
import getSearchFormStyles from './SearchForm.styles';

interface SuggestionItemProps {
  htmlLiProps: React.HTMLAttributes<HTMLLIElement>;
  option: ContentDto | string;
}

const SuggestionItem: React.FC<SuggestionItemProps> = React.memo(
  ({ htmlLiProps, option }) => {
    const theme = useTheme();
    const styles = getSearchFormStyles(theme);

    if (!option) {
      return null;
    }

    const title = typeof option === 'string' ? option : option.title;
    const optionTextStyle = styles.searchFormOptionText || {};

    const { key, ...restOfLiProps } = htmlLiProps as typeof htmlLiProps & {
      key?: React.Key;
    };
    return (
      <li key={key} {...restOfLiProps}>
        <Typography sx={optionTextStyle}>
          {title ?? 'Завантаження...'}
        </Typography>
      </li>
    );
  }
);

SuggestionItem.displayName = 'SuggestionItem';
export default SuggestionItem;
