import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormHelperText,
  useTheme,
  InputBase,
  Popover,
  alpha,
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
            borderRadius: 3,
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
              height: '3px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            },
          },
        }}
      >
        <Box
          sx={{
            p: 1,
            // Calendar styling
            '& .MuiPickersLayout-root': {
              backgroundColor: 'transparent',
            },
            '& .MuiPickersCalendarHeader-root': {
              pl: 2,
              pr: 1,
              '& .MuiPickersCalendarHeader-label': {
                fontWeight: 600,
                color: theme.palette.primary.main,
              },
              '& .MuiIconButton-root': {
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                },
              },
            },
            '& .MuiDayCalendar-weekDayLabel': {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              fontWeight: 600,
              fontSize: '12px',
            },
            '& .MuiPickersDay-root': {
              fontWeight: 500,
              fontSize: '14px',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
              '&.MuiPickersDay-today': {
                border: `2px solid ${theme.palette.primary.main}`,
                backgroundColor: 'transparent',
                '&:not(.Mui-selected)': {
                  color: theme.palette.primary.main,
                },
              },
            },
            // Time picker styling
            '& .MuiMultiSectionDigitalClock-root': {
              '& .MuiMultiSectionDigitalClockSection-root': {
                '&::after': {
                  display: 'none',
                },
              },
              '& .MuiMenuItem-root': {
                borderRadius: 1.5,
                mx: 0.5,
                my: 0.25,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
              },
            },
            // Clock styling
            '& .MuiClock-root': {
              '& .MuiClockPointer-root': {
                backgroundColor: theme.palette.primary.main,
              },
              '& .MuiClockPointer-thumb': {
                backgroundColor: theme.palette.primary.main,
                border: `4px solid ${theme.palette.primary.main}`,
              },
              '& .MuiClock-pin': {
                backgroundColor: theme.palette.primary.main,
              },
              '& .MuiClockNumber-root': {
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                },
              },
            },
            // Action bar styling
            '& .MuiDialogActions-root': {
              px: 2,
              pb: 2,
              '& .MuiButton-root': {
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                '&.MuiButton-text': {
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  },
                },
              },
            },
            // Year/Month picker styling
            '& .MuiYearCalendar-root, & .MuiMonthCalendar-root': {
              '& .MuiPickersYear-yearButton, & .MuiPickersMonth-monthButton': {
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
              },
            },
          }}
        >
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