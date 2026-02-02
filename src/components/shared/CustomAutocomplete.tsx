import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  useTheme,
  Autocomplete,
  InputBase,
  Chip,
  alpha,
} from '@mui/material';

interface CustomAutocompleteProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: string[];
  error?: boolean;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  freeSolo?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  multiple?: boolean;
}

export const CustomAutocomplete: React.FC<CustomAutocompleteProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  helperText,
  required,
  fullWidth = true,
  freeSolo = true,
  placeholder,
  icon,
  multiple = false,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      <Autocomplete
        value={value}
        onChange={(e, newValue) => onChange(newValue)}
        options={options}
        freeSolo={freeSolo}
        multiple={multiple}
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        renderTags={multiple ? (value, getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
              size="small"
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                m: 0.5,
              }}
            />
          )) : undefined
        }
        renderInput={(params) => (
          <Box
            ref={params.InputProps.ref}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'transparent',
              borderRadius: 2,
              border: '1px solid',
              borderColor: error
                ? theme.palette.error.main
                : (isFocused || isOpen)
                  ? theme.palette.primary.main
                  : isDarkMode
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: error
                  ? theme.palette.error.main
                  : isDarkMode
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(0, 0, 0, 0.3)',
              },
              flexWrap: multiple ? 'wrap' : 'nowrap',
              minHeight: multiple && value?.length > 0 ? 'auto' : undefined,
              py: multiple && value?.length > 0 ? 1 : 0,
            }}
          >
            {icon && !multiple && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 1.5,
                  color: (isFocused || isOpen)
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
            {multiple && value?.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', flex: 1, px: 1 }}>
                {params.InputProps.startAdornment}
                <InputBase
                  {...(() => {
                    const { color, ...rest } = params.inputProps as any;
                    return rest;
                  })()}
                  placeholder={value?.length === 0 ? placeholder : ''}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  sx={{
                    flex: 1,
                    minWidth: 120,
                    py: 1,
                    px: 1,
                    fontSize: '16px',
                    fontWeight: 400,
                    '& input': {
                      padding: '0',
                      color: `${isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'} !important`,
                      backgroundColor: 'transparent',
                      '&::placeholder': {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>
            ) : (
              <InputBase
                {...(() => {
                  const { color, ...rest } = params.inputProps as any;
                  return rest;
                })()}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                sx={{
                  flex: 1,
                  py: 1.75,
                  px: 2,
                  pl: icon ? 1 : 2,
                  fontSize: '16px',
                  fontWeight: 400,
                  '& input': {
                    padding: '0',
                    color: `${isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'} !important`,
                    backgroundColor: 'transparent',
                    '&::placeholder': {
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                      opacity: 1,
                    },
                  },
                }}
                endAdornment={params.InputProps.endAdornment}
              />
            )}
          </Box>
        )}
        sx={{
          '& .MuiAutocomplete-popupIndicator': {
            display: 'none',
          },
          '& .MuiAutocomplete-clearIndicator': {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          },
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              },
              '& .MuiAutocomplete-listbox': {
                py: 1,
                '& .MuiAutocomplete-option': {
                  py: 1.5,
                  px: 2,
                  mx: 1,
                  my: 0.5,
                  borderRadius: 1.5,
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                  },
                  '&[aria-selected="true"]': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.18),
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.25),
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  },
                },
              },
              '& .MuiAutocomplete-noOptions': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                py: 2,
                textAlign: 'center',
              },
              // Custom scrollbar
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: alpha(theme.palette.primary.main, 0.3),
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: alpha(theme.palette.primary.main, 0.5),
              },
            },
          },
        }}
      />
      {helperText && (
        <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};