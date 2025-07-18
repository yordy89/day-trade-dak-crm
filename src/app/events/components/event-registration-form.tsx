'use client';

import React, { useState } from 'react';
import { 
  Alert, 
  Box, 
  Button, 
  Stack, 
  Typography,
  useTheme as useMuiTheme,
  alpha,
  CircularProgress,
  FormControl,
  InputBase,
  FormHelperText,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CheckCircle,
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';

import API from '@/lib/axios';

interface RegistrationFormProps {
  eventId: string;
  onRegistered: () => void;
}

interface CustomInputProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  isDarkMode: boolean;
  muiTheme: any;
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  icon, 
  label, 
  isDarkMode, 
  muiTheme,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <FormControl fullWidth sx={{ '& .MuiFormControl-root': { border: 'none', outline: 'none' } }}>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 1, 
          fontWeight: 500,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {label} <span style={{ color: muiTheme.palette.error.main }}>*</span>
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(10px)',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          borderRadius: 2,
          border: 'none !important',
          boxShadow: 'none !important',
          transition: 'all 0.3s',
          overflow: 'hidden',
          position: 'relative',
          outline: 'none !important',
          '&:hover': {
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.12)' 
              : 'rgba(0, 0, 0, 0.06)',
            border: 'none !important',
            outline: 'none !important',
            boxShadow: 'none !important',
          },
          '&:focus, &:focus-visible, &:active': {
            border: 'none !important',
            outline: 'none !important',
            boxShadow: 'none !important',
          },
          '&:focus-within': {
            outline: 'none !important',
            border: 'none !important',
            boxShadow: 'none !important',
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
              ? muiTheme.palette.primary.main 
              : 'rgba(0, 0, 0, 0.6)',
            transition: 'color 0.3s',
          }}
        >
          {icon}
        </Box>
        <InputBase
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
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
            backgroundColor: 'transparent',
            '&.MuiInputBase-root': {
              backgroundColor: 'transparent',
              '&:before': {
                display: 'none !important',
                border: 'none !important',
              },
              '&:after': {
                display: 'none !important',
                border: 'none !important',
              },
              '&:hover:before': {
                display: 'none !important',
                border: 'none !important',
              },
              '&.Mui-focused': {
                backgroundColor: 'transparent',
                outline: 'none !important',
                '&:before': {
                  display: 'none !important',
                  border: 'none !important',
                },
                '&:after': {
                  display: 'none !important',
                  border: 'none !important',
                },
              },
            },
            '& input': {
              padding: '0 0 0 8px',
              backgroundColor: 'transparent',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.87) !important' : 'rgba(0, 0, 0, 0.87) !important',
              WebkitTextFillColor: isDarkMode ? 'rgba(255, 255, 255, 0.87) !important' : 'rgba(0, 0, 0, 0.87) !important',
              outline: 'none !important',
              border: 'none !important',
              '&:focus': {
                outline: 'none !important',
                border: 'none !important',
                backgroundColor: 'transparent',
              },
              '&:-webkit-autofill': {
                WebkitBoxShadow: isDarkMode 
                  ? '0 0 0 1000px rgba(255, 255, 255, 0.08) inset !important'
                  : '0 0 0 1000px rgba(0, 0, 0, 0.04) inset !important',
                WebkitTextFillColor: isDarkMode ? 'rgba(255, 255, 255, 0.87) !important' : 'rgba(0, 0, 0, 0.87) !important',
                caretColor: isDarkMode ? 'rgba(255, 255, 255, 0.87) !important' : 'rgba(0, 0, 0, 0.87) !important',
              },
            },
            '& input::placeholder': {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              opacity: 1,
            },
          }}
        />
      </Box>
    </FormControl>
  );
};

const EventRegistrationForm: React.FC<RegistrationFormProps> = ({ eventId, onRegistered }) => {
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const register = useMutation({
    mutationFn: async () => {
      await API.post('/event-registrations', {
        ...formData,
        eventId,
        isVip: false,
        paymentStatus: 'free',
      });
    },
    onSuccess: () => {
      setErrorMessage(null);
      onRegistered();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || t('events.registration.errors.registrationFailed');
      setErrorMessage(msg);
    },
  });

  const handleSubmit = async () => {
    await register.mutateAsync();
  };

  return (
    <Box
      component="form"
      sx={{ mt: 2 }}
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <Stack spacing={3}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('events.registration.free.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('events.registration.free.subtitle')}
          </Typography>
        </Box>

        {errorMessage && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2,
              backgroundColor: isDarkMode ? alpha('#d32f2f', 0.1) : alpha('#d32f2f', 0.05),
            }}
          >
            {errorMessage}
          </Alert>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <CustomInput
            icon={<Person sx={{ fontSize: 20 }} />}
            label={t('events.registration.fields.firstName')}
            value={formData.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder={t('events.registration.fields.firstNamePlaceholder')}
            required
            isDarkMode={isDarkMode}
            muiTheme={muiTheme}
          />
          <CustomInput
            icon={<Person sx={{ fontSize: 20 }} />}
            label={t('events.registration.fields.lastName')}
            value={formData.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder={t('events.registration.fields.lastNamePlaceholder')}
            required
            isDarkMode={isDarkMode}
            muiTheme={muiTheme}
          />
        </Stack>

        <CustomInput
          icon={<Email sx={{ fontSize: 20 }} />}
          label={t('events.registration.fields.email')}
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
          placeholder={t('events.registration.fields.emailPlaceholder')}
          required
          isDarkMode={isDarkMode}
          muiTheme={muiTheme}
        />

        <CustomInput
          icon={<Phone sx={{ fontSize: 20 }} />}
          label={t('events.registration.fields.phone')}
          value={formData.phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phoneNumber: e.target.value })}
          placeholder={t('events.registration.fields.phonePlaceholder')}
          required
          isDarkMode={isDarkMode}
          muiTheme={muiTheme}
        />

        <Box sx={{ mt: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
            disabled={register.isPending}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              background: register.isPending 
                ? undefined
                : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              boxShadow: register.isPending ? 0 : 4,
              transition: 'all 0.3s',
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                boxShadow: 6,
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                backgroundColor: alpha(muiTheme.palette.primary.main, 0.5),
              },
            }}
          >
            {register.isPending ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                {t('events.registration.free.submittingButton')}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle />
                {t('events.registration.free.submitButton')}
              </Box>
            )}
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
          {t('events.registration.free.termsText')}
        </Typography>
      </Stack>
    </Box>
  );
};

export default EventRegistrationForm;