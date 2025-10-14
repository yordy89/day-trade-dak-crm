import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputBase,
  FormHelperText,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';

interface CustomInputProps {
  icon?: React.ReactNode;
  label: string;
  value: any;
  onChange: (e: any) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  name?: string;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  select?: boolean;
  children?: React.ReactNode;
  InputProps?: any;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  icon,
  label,
  error,
  helperText,
  endAdornment,
  disabled,
  required,
  fullWidth = true,
  multiline = false,
  rows = 1,
  select = false,
  children,
  InputProps,
  ...rest
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          fontWeight: 500,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {label} {required ? <span style={{ color: theme.palette.error.main }}>*</span> : null}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: multiline ? 'flex-start' : 'center',
          backgroundColor: 'transparent',
          borderRadius: 2,
          border: '1px solid',
          borderColor: error
            ? theme.palette.error.main
            : isFocused
              ? theme.palette.primary.main
              : isDarkMode
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s',
          opacity: disabled ? 0.6 : 1,
          '&:hover': {
            borderColor: disabled
              ? undefined
              : error
                ? theme.palette.error.main
                : isDarkMode
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 1.5,
              pt: multiline ? 2 : 0,
              color: isFocused
                ? theme.palette.primary.main
                : isDarkMode
                  ? 'rgba(255, 255, 255, 0.7)'
                  : 'rgba(0, 0, 0, 0.6)',
              transition: 'color 0.3s',
            }}
          >
            {icon}
          </Box>
        )}
        {select ? (
          <Select
            {...rest}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            variant="standard"
            disableUnderline
            sx={{
              flex: 1,
              py: 1.75,
              px: icon ? 1 : 2,
              fontSize: '16px',
              fontWeight: 400,
              color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
              '& .MuiSelect-select': {
                padding: '0',
                backgroundColor: 'transparent',
              },
              '& .MuiSelect-icon': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                right: 12,
              },
            }}
          >
            {children}
          </Select>
        ) : (
          <InputBase
            {...rest}
            {...InputProps}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            sx={{
              flex: 1,
              py: 1.75,
              px: 2,
              pl: icon ? 1 : 2,
              fontSize: '16px',
              fontWeight: 400,
              color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
              '& input, & textarea': {
                padding: '0',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
                backgroundColor: 'transparent',
                '&::placeholder': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  opacity: 1,
                },
                '&:disabled': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.38)' : 'rgba(0, 0, 0, 0.38)',
                },
              },
            }}
            endAdornment={endAdornment}
          />
        )}
      </Box>
      {helperText && (
        <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

interface CustomSelectProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: Array<{ value: any; label: string }>;
  icon?: React.ReactNode;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  icon,
  required,
  error,
  helperText,
  disabled,
  fullWidth = true,
}) => {
  return (
    <CustomInput
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      icon={icon}
      required={required}
      error={error}
      helperText={helperText}
      disabled={disabled}
      fullWidth={fullWidth}
      select
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </CustomInput>
  );
};