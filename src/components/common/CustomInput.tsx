'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  InputBase,
  FormControl,
  useTheme,
} from '@mui/material';
import { useTheme as useAppTheme } from '@/components/theme/theme-provider';

interface CustomInputProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  name: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  endAdornment?: React.ReactNode;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({ 
  icon, 
  label, 
  error,
  helperText,
  required,
  disabled,
  multiline,
  rows,
  fullWidth = true,
  ...props 
}) => {
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <FormControl fullWidth={fullWidth}>
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          display: 'flex',
          alignItems: multiline ? 'flex-start' : 'center',
          backgroundColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(0, 0, 0, 0.04)',
          borderRadius: 2,
          transition: 'all 0.3s',
          overflow: 'hidden',
          position: 'relative',
          border: error 
            ? `1px solid ${theme.palette.error.main}` 
            : isFocused 
              ? '1px solid #16a34a'
              : isHovered
                ? `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`
                : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          '&:hover': {
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 1.5,
            pt: multiline ? 2 : 0,
            color: isFocused 
              ? '#16a34a' 
              : isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            transition: 'color 0.3s',
          }}
        >
          {icon}
        </Box>
        <InputBase
          {...props}
          multiline={multiline}
          rows={rows}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          sx={{
            flex: 1,
            py: 1.25,
            pr: 2,
            fontSize: '15px',
            fontWeight: 400,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
            '&.MuiInputBase-root': {
              '&:before': {
                display: 'none',
              },
              '&:after': {
                display: 'none',
              },
              '&.Mui-focused': {
                outline: 'none !important',
                boxShadow: 'none !important',
              },
            },
            '& input': {
              padding: '0 0 0 8px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
              backgroundColor: 'transparent',
              outline: 'none !important',
              border: 'none !important',
              boxShadow: 'none !important',
              '&:focus': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
              '&:focus-visible': {
                outline: 'none !important',
              },
              '&::placeholder': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                opacity: 1,
              },
              '&:-webkit-autofill': {
                WebkitBoxShadow: isDarkMode 
                  ? '0 0 0 1000px rgba(0, 0, 0, 0.9) inset' 
                  : '0 0 0 1000px rgba(255, 255, 255, 0.9) inset',
                WebkitTextFillColor: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
                transition: 'background-color 5000s ease-in-out 0s',
              },
            },
            '& textarea': {
              padding: '0 0 0 8px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
              backgroundColor: 'transparent',
              outline: 'none !important',
              border: 'none !important',
              boxShadow: 'none !important',
              '&:focus': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
              '&:focus-visible': {
                outline: 'none !important',
              },
              '&::placeholder': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                opacity: 1,
              },
            },
          }}
          endAdornment={props.endAdornment}
        />
      </Box>
      {helperText && (
        <Typography 
          variant="caption" 
          color={error ? 'error' : 'text.secondary'} 
          sx={{ mt: 1, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};