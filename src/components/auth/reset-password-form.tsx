'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
  Box,
  InputBase,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Email,
  ArrowBack,
  LockReset,
} from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { paths } from '@/paths';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/api/auth.service';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';

const schema = zod.object({ email: zod.string().min(1, { message: 'Email is required' }).email() });

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '' } satisfies Values;

// Custom Input Component matching sign-in form style
const CustomInput = React.forwardRef<HTMLInputElement, any>(({ 
  icon, 
  label,
  isDarkMode, 
  muiTheme,
  error,
  helperText,
  ...props 
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  
  return (
    <FormControl fullWidth error={error}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'transparent',
          borderRadius: 2,
          border: '1px solid',
          borderColor: error 
            ? muiTheme.palette.error.main 
            : isFocused 
              ? muiTheme.palette.primary.main 
              : isDarkMode 
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: error 
              ? muiTheme.palette.error.main 
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
              ? muiTheme.palette.primary.main 
              : isDarkMode
                ? 'rgba(255, 255, 255, 0.7)'
                : 'rgba(0, 0, 0, 0.6)',
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
            color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
            '& input': {
              padding: '0 0 0 8px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
              backgroundColor: 'transparent',
              '&::placeholder': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                opacity: 1,
              },
            },
          }}
        />
      </Box>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
});

CustomInput.displayName = 'CustomInput';

export function ResetPasswordForm(): React.JSX.Element {
  const { t } = useTranslation('auth');
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: async (values: Values) => {
      return authService.resetPassword({ email: values.email });
    },
    onSuccess: () => {
      toast.success(t('resetPassword.emailSentMessage'));
      // Could redirect to a confirmation page
    },
    onError: (error: Error) => {
      setError('root', { type: 'server', message: error.message });
    },
  });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      resetPassword(values);
    },
    [resetPassword]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={2} alignItems="center">
        <Box 
          sx={{ 
            p: 2,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'white',
            mb: 2,
          }}
        >
          <LockReset sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h3" fontWeight={800} textAlign="center">
          {t('resetPassword.forgotPasswordTitle')}
        </Typography>
        <Typography color="text.secondary" variant="body1" textAlign="center" sx={{ maxWidth: 400 }}>
          {t('resetPassword.forgotPasswordSubtitle')}
        </Typography>
      </Stack>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <CustomInput
                {...field}
                icon={<Email sx={{ fontSize: 20 }} />}
                placeholder={t('resetPassword.emailPlaceholder')}
                type="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                isDarkMode={isDarkMode}
                muiTheme={muiTheme}
              />
            )}
          />
          
          {errors.root ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {errors.root.message}
            </Alert>
          ) : null}
          
          <Button 
            disabled={isPending} 
            type="submit" 
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
              },
            }}
          >
            {isPending ? t('resetPassword.sendingButton') : t('resetPassword.sendButton')}
          </Button>
          
          <Button
            component={RouterLink}
            href={paths.auth.signIn}
            variant="text"
            startIcon={<ArrowBack />}
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
                bgcolor: 'transparent',
              },
            }}
          >
            {t('resetPassword.backToSignIn')}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
