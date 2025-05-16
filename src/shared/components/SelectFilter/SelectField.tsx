import React from 'react';
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import getSelectorFieldStyles from './SelectField.styles';

type IdNameOption = { id: number; name: string };
type ValueLabelOption = { value: string; label: string };
type Option = IdNameOption | ValueLabelOption;

interface SelectFieldProps {
  label: string;
  name: string;
  value: string | string[];
  onChange: (
    e: SelectChangeEvent<string> | SelectChangeEvent<string[]>
  ) => void;
  options: Option[];
  isLoading?: boolean;
  multiple?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  isLoading = false,
  multiple = false,
}) => {
  const theme = useTheme();
  const styles = getSelectorFieldStyles(theme);

  const commonProps = {
    'aria-label': label,
    name,
    disabled: isLoading,
    displayEmpty: true,
    size: 'small' as const,
    sx: styles.selectField,
    MenuProps: { PaperProps: {} },
  };

  const renderMenuItems = () => [
    <MenuItem
      key="_all_"
      value={multiple ? [] : ''}
      sx={styles.selectorSelectorItem}>
      Всі
    </MenuItem>,
    isLoading ? (
      <MenuItem key="_loading_" disabled sx={styles.selectorSelectorItem}>
        Завантаження...
      </MenuItem>
    ) : (
      options.map((opt) =>
        'id' in opt ? (
          <MenuItem
            key={opt.id}
            value={opt.id.toString()}
            sx={styles.selectorSelectorItem}>
            {opt.name}
          </MenuItem>
        ) : (
          <MenuItem
            key={opt.value}
            value={opt.value}
            sx={styles.selectorSelectorItem}>
            {opt.label}
          </MenuItem>
        )
      )
    ),
  ];

  return (
    <Box sx={styles.selectorWrapper}>
      <Typography variant="caption" sx={styles.selectorLabelText}>
        {label}
      </Typography>

      {multiple ? (
        <Select<string[]>
          {...commonProps}
          multiple
          value={value as string[]}
          onChange={onChange as (e: SelectChangeEvent<string[]>) => void}>
          {renderMenuItems()}
        </Select>
      ) : (
        <Select<string>
          {...commonProps}
          value={value as string}
          onChange={onChange as (e: SelectChangeEvent<string>) => void}>
          {renderMenuItems()}
        </Select>
      )}
    </Box>
  );
};

export default SelectField;
