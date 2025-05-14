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
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  options: Option[];
  isLoading?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  isLoading = false,
}) => {
  const theme = useTheme();
  const styles = getSelectorFieldStyles(theme);

  const isIdNameOption = (opt: Option): opt is IdNameOption =>
    (opt as IdNameOption).id !== undefined;

  return (
    <Box sx={styles.selectorWrapper}>
      <Typography variant="caption" sx={styles.selectorLabelText}>
        {label}
      </Typography>

      <Select
        aria-label={label}
        name={name}
        value={value}
        onChange={onChange}
        disabled={isLoading}
        displayEmpty
        size="small"
        sx={styles.selectField}
        MenuProps={{ PaperProps: {} }}>
        <MenuItem value="" sx={styles.selectorSelectorItem}>
          Всі
        </MenuItem>

        {isLoading && (
          <MenuItem disabled sx={styles.selectorSelectorItem}>
            Завантаження...
          </MenuItem>
        )}

        {!isLoading &&
          options.map((opt) =>
            isIdNameOption(opt) ? (
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
          )}
      </Select>
    </Box>
  );
};

export default SelectField;
