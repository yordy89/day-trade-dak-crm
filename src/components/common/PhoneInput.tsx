'use client';

import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { Phone } from '@mui/icons-material';

interface PhoneInputComponentProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function PhoneInputComponent({
  value,
  onChange,
  label,
  error,
  helperText,
  required,
  disabled,
  placeholder = '+1 (555) 000-0000',
}: PhoneInputComponentProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontWeight: 500,
            color: error
              ? 'error.main'
              : isDarkMode
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(0, 0, 0, 0.8)',
          }}
        >
          {label}
          {required && <span style={{ color: theme.palette.error.main }}> *</span>}
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isDarkMode
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.04)',
          borderRadius: 2,
          border: `1px solid ${
            error
              ? theme.palette.error.main
              : isDarkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)'
          }`,
          transition: 'all 0.3s',
          opacity: disabled ? 0.5 : 1,
          '&:hover': !disabled
            ? {
                borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.06)',
              }
            : {},
          '&:focus-within': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            borderWidth: 1,
          },
        }}
      >
        <Phone
          sx={{
            ml: 1.5,
            mr: 1,
            color: error
              ? 'error.main'
              : isDarkMode
              ? 'rgba(255, 255, 255, 0.5)'
              : 'rgba(0, 0, 0, 0.5)',
          }}
        />
        <PhoneInput
          international
          defaultCountry="US"
          value={value}
          onChange={(val) => onChange(val || '')}
          disabled={disabled}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '12px 16px 12px 8px',
            fontSize: '15px',
            fontWeight: 400,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
          }}
        />
      </Box>
      {helperText && (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'block',
            color: error ? 'error.main' : 'text.secondary',
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
