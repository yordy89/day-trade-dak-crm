'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  IconButton,
  CircularProgress,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Lock,
  LockReset,
  Visibility,
  VisibilityOff,
  CheckCircle,
} from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { paths } from '@/paths';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/api/auth.service';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/components/theme/theme-provider';
import { useTranslation } from 'react-i18next';

const schema = zod.object({
  password: zod.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: zod.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type Values = zod.infer<typeof schema>;

const defaultValues = { password: '', confirmPassword: '' } satisfies Values;

// Custom Input Component matching sign-in form style
const CustomInput = React.forwardRef<HTMLInputElement, any>(({ 
  icon, 
  label,
  isDarkMode, 
  muiTheme,
  error,
  helperText,
  showPassword,
  onTogglePassword,
  type = 'text',
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
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
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
        {type === 'password' && (
          <IconButton
            onClick={onTogglePassword}
            edge="end"
            sx={{ mr: 1 }}
          >
            {showPassword ? (
              <VisibilityOff sx={{ fontSize: 20, color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }} />
            ) : (
              <Visibility sx={{ fontSize: 20, color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }} />
            )}
          </IconButton>
        )}
      </Box>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
});

CustomInput.displayName = 'CustomInput';

export function ResetPasswordConfirmForm(): React.JSX.Element {
  const { t } = useTranslation('auth');
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [tokenValid, setTokenValid] = React.useState<boolean | null>(null);
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  // Verify token on mount
  React.useEffect(() => {
    if (token) {
      verifyToken.mutate(token);
    } else {
      setTokenValid(false);
    }
  }, [token]);

  const verifyToken = useMutation({
    mutationFn: async (token: string) => {
      return authService.verifyResetToken(token);
    },
    onSuccess: (data) => {
      setTokenValid(data.valid);
    },
    onError: () => {
      setTokenValid(false);
    },
  });

  const { mutate: resetPassword, isPending } = useMutation({
    mutationFn: async (values: Values) => {
      if (!token) throw new Error('No reset token provided');
      return authService.resetPasswordWithToken({
        token,
        newPassword: values.password,
      });
    },
    onSuccess: () => {
      setResetSuccess(true);
      toast.success(t('resetPassword.successMessage'));
      setTimeout(() => {
        router.push(paths.auth.signIn);
      }, 3000);
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

  // Loading state while verifying token
  if (tokenValid === null) {
    return (
      <Stack spacing={4} alignItems="center">
        <CircularProgress />
        <Typography>{t('resetPassword.verifyingLink')}</Typography>
      </Stack>
    );
  }

  // Invalid or expired token
  if (tokenValid === false) {
    return (
      <Stack spacing={4}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t('resetPassword.invalidLinkTitle')}
          </Typography>
          <Typography variant="body2">
            {t('resetPassword.invalidLinkMessage')}
          </Typography>
        </Alert>
        <Button
          variant="contained"
          fullWidth
          onClick={() => router.push(paths.auth.resetPassword)}
          sx={{
            py: 1.5,
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
            },
          }}
        >
          {t('resetPassword.requestNewLink')}
        </Button>
      </Stack>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <Stack spacing={4} alignItems="center">
        <Box 
          sx={{ 
            p: 2,
            borderRadius: '50%',
            bgcolor: 'success.main',
            color: 'white',
          }}
        >
          <CheckCircle sx={{ fontSize: 40 }} />
        </Box>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          {t('resetPassword.successTitle')}
        </Typography>
        <Typography color="text.secondary" textAlign="center">
          {t('resetPassword.redirectMessage')}
        </Typography>
      </Stack>
    );
  }

  // Reset form
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
          {t('resetPassword.setNewPasswordTitle')}
        </Typography>
        <Typography color="text.secondary" variant="body1" textAlign="center" sx={{ maxWidth: 400 }}>
          {t('resetPassword.setNewPasswordSubtitle')}
        </Typography>
      </Stack>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  {t('resetPassword.newPasswordLabel')}
                </Typography>
                <CustomInput
                  {...field}
                  icon={<Lock sx={{ fontSize: 20 }} />}
                  placeholder={t('resetPassword.newPasswordPlaceholder')}
                  type="password"
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  isDarkMode={isDarkMode}
                  muiTheme={muiTheme}
                />
              </Box>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  {t('resetPassword.confirmPasswordLabel')}
                </Typography>
                <CustomInput
                  {...field}
                  icon={<Lock sx={{ fontSize: 20 }} />}
                  placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                  type="password"
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword?.message}
                  isDarkMode={isDarkMode}
                  muiTheme={muiTheme}
                />
              </Box>
            )}
          />
          
          {errors.root ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {errors.root.message}
            </Alert>
          ) : null}

          {/* Password Requirements */}
          <Box sx={{ bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper', p: 2, borderRadius: 2, border: '1px solid', borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'divider' }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              {t('resetPassword.requirementsTitle')}
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                • {t('resetPassword.requirement1')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • {t('resetPassword.requirement2')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • {t('resetPassword.requirement3')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • {t('resetPassword.requirement4')}
              </Typography>
            </Stack>
          </Box>
          
          <Button 
            disabled={isPending} 
            type="submit" 
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
              },
            }}
          >
            {isPending ? t('resetPassword.resettingButton') : t('resetPassword.resetButton')}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}