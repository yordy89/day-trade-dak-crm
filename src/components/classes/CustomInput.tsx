import React, { useState } from 'react';
import {
  FormControl,
  Typography,
  Box,
  InputBase,
  FormHelperText,
} from '@mui/material';

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
}

export const CustomInput: React.FC<CustomInputProps> = ({ 
  icon, 
  label, 
  error,
  helperText,
  endAdornment,
  required,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <FormControl fullWidth error={error}>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 1, 
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        {label} {required ? <span style={{ color: '#f44336' }}>*</span> : null}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'transparent',
          borderRadius: 2,
          border: '1px solid',
          borderColor: error 
            ? '#f44336' 
            : isFocused 
              ? '#22c55e' 
              : 'rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: error 
              ? '#f44336' 
              : 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 1.5,
            color: isFocused 
              ? '#22c55e' 
              : 'rgba(255, 255, 255, 0.7)',
            transition: 'color 0.3s',
          }}
        >
          {icon}
        </Box>
        <InputBase
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          sx={{
            flex: 1,
            py: 1.75,
            pr: 2,
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.87)',
            '& input': {
              padding: '0 0 0 8px',
              color: 'rgba(255, 255, 255, 0.87)',
              backgroundColor: 'transparent',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
                opacity: 1,
              },
            },
          }}
        />
        {endAdornment ? <Box sx={{ pr: 1 }}>
            {endAdornment}
          </Box> : null}
      </Box>
      {helperText ? (
        <FormHelperText sx={{ color: '#f44336', mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};