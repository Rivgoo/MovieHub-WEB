import React from 'react';
import MuiPagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import { getPaginationStyles } from './StandardPagination.styles';

interface StandardPaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  size?: 'small' | 'medium' | 'large';
}

const StandardPagination: React.FC<StandardPaginationProps> = ({
  count,
  page,
  onChange,
  disabled = false,
  sx,
  size = 'medium',
}) => {
  const theme = useTheme();

  if (count <= 1) {
    return null;
  }

  const paginationSpecificStyles = getPaginationStyles(theme);

  return (
    <Stack
      spacing={3}
      alignItems="center"
      sx={{
        ...sx
      }}
    >
      <MuiPagination
        count={count}
        page={page}
        onChange={onChange}
        disabled={disabled}
        shape="rounded"
        size={size}
        sx={paginationSpecificStyles}
      />
    </Stack>
  );
};

export default StandardPagination;