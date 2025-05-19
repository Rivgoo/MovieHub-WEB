import React from 'react';
import { ContentDto } from '../../../../../../core/api/types/types.content';
import { Box, Typography, useTheme } from '@mui/material';
import SearchFieldSectionStyles from '../SearchFieldSection.styles';

interface Props {
  htmlLiProps: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
  option: ContentDto | string;
}

const RenderOptions: React.FC<Props> = ({ htmlLiProps, option }) => {
  const theme = useTheme();
  const styles = SearchFieldSectionStyles(theme);

  const { key, ...restProps } = htmlLiProps;

  if (!option) {
    return null;
  }

  return (
    <Box component={'li'} {...restProps} sx={styles.renderOption}>
      {typeof option !== 'string' && (
        <Typography variant="subtitle1" noWrap>
          {option.title}
        </Typography>
      )}
    </Box>
  );
};

export default RenderOptions;
