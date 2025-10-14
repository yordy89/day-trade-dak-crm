import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  useTheme,
  InputBase,
  Popover,
} from '@mui/material';
import { DatePicker, DateTimePicker, StaticDatePicker, StaticDateTimePicker } from '@mui/x-date-pickers';
import { Calendar } from '@phosphor-icons/react';
import dayjs from 'dayjs';

interface CustomDatePickerProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  dateTime?: boolean;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  required,
  fullWidth = true,
  dateTime = false,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isFocused, setIsFocused] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setAnchorEl(inputRef.current);
    setIsFocused(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsFocused(false);
  };

  const handleDateChange = (newValue: any) => {
    onChange(newValue);
    if (!dateTime) {
      handleClose();
    }
  };

  const formatDisplay = () => {
    if (!value) return '';
    if (dateTime) {
      return dayjs(value).format('MM/DD/YYYY hh:mm A');
    }
    return dayjs(value).format('MM/DD/YYYY');
  };

  const StaticPicker = dateTime ? StaticDateTimePicker : StaticDatePicker;

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
        ref={inputRef}
        onClick={handleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
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
          cursor: 'pointer',
          '&:hover': {
            borderColor: error
              ? theme.palette.error.main
              : isDarkMode
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(0, 0, 0, 0.3)',
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
              ? theme.palette.primary.main
              : isDarkMode
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(0, 0, 0, 0.6)',
            transition: 'color 0.3s',
          }}
        >
          <Calendar size={20} />
        </Box>
        <InputBase
          value={formatDisplay()}
          readOnly
          placeholder={dateTime ? "MM/DD/YYYY hh:mm A" : "MM/DD/YYYY"}
          sx={{
            flex: 1,
            py: 1.75,
            pr: 2,
            fontSize: '16px',
            fontWeight: 400,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
            cursor: 'pointer',
            '& input': {
              cursor: 'pointer',
              padding: '0',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
              backgroundColor: 'transparent',
              '&::placeholder': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                opacity: 1,
              },
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pr: 1.5,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Calendar size={20} />
        </Box>
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            bgcolor: isDarkMode ? 'background.paper' : 'background.paper',
            borderRadius: 2,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <Box sx={{ p: 1 }}>
          <StaticPicker
            displayStaticWrapperAs="desktop"
            value={value}
            onChange={handleDateChange}
            slotProps={{
              actionBar: {
                actions: dateTime ? ['clear', 'accept'] : ['clear', 'today'],
                onAccept: dateTime ? handleClose : undefined,
                onClear: () => {
                  onChange(null);
                  handleClose();
                },
              } as any,
            }}
          />
        </Box>
      </Popover>
      {helperText && (
        <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};