'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Link,
  Stack,
  Typography,
  Box,
  IconButton,
  Divider,
  Checkbox,
  FormControlLabel,
  InputBase,
  useTheme as useMuiTheme,
  alpha,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  TrendingUp,
  ShowChart,
  CandlestickChart,
} from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useTheme } from '@/components/theme/theme-provider';

import { paths } from '@/paths';
import { useLogin } from '@/hooks/use-login';
import { useTranslation } from 'react-i18next';

const createSchema = (t: any) => zod.object({
  email: zod.string().min(1, { message: t('auth.signIn.errors.emailRequired') }).email(t('auth.signIn.errors.emailInvalid')),
  password: zod.string().min(1, { message: t('auth.signIn.errors.passwordRequired') }),
});

type Values = zod.infer<ReturnType<typeof createSchema>>;

const defaultValues = { email: '', password: '' } satisfies Values;

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
  isDarkMode: boolean;
  muiTheme: any;
  name: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  endAdornment?: React.ReactNode;
}

const CustomInput = React.memo<CustomInputProps>(({
  icon,
  label,
  isDarkMode,
  muiTheme,
  error,
  helperText,
  endAdornment,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <FormControl fullWidth error={error}>
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          fontWeight: 600,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {label} {props.required ? <span style={{ color: '#f87171' }}>*</span> : null}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          borderRadius: 2,
          border: '1px solid',
          borderColor: error
            ? '#f87171'
            : isFocused
              ? '#22c55e'
              : isDarkMode
                ? 'rgba(255, 255, 255, 0.15)'
                : 'rgba(0, 0, 0, 0.2)',
          boxShadow: isFocused && !error ? '0 0 0 3px rgba(34, 197, 94, 0.15)' : 'none',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: error
              ? '#f87171'
              : isFocused
                ? '#22c55e'
                : isDarkMode
                  ? 'rgba(255, 255, 255, 0.25)'
                  : 'rgba(0, 0, 0, 0.3)',
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
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
              : isDarkMode
                ? 'rgba(255, 255, 255, 0.5)'
                : 'rgba(0, 0, 0, 0.5)',
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
            color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
            '& input': {
              padding: '0 0 0 8px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
              backgroundColor: 'transparent',
              '&::placeholder': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                opacity: 1,
              },
              '&:-webkit-autofill': {
                WebkitBoxShadow: isDarkMode
                  ? '0 0 0 1000px rgba(255, 255, 255, 0.05) inset !important'
                  : '0 0 0 1000px rgba(0, 0, 0, 0.02) inset !important',
                WebkitTextFillColor: isDarkMode ? 'rgba(255, 255, 255, 0.95) !important' : 'rgba(0, 0, 0, 0.87) !important',
              },
            },
          }}
        />
        {endAdornment ? (
          <Box sx={{ pr: 1 }}>
            {endAdornment}
          </Box>
        ) : null}
      </Box>
      {helperText ? <FormHelperText sx={{ color: '#f87171' }}>{helperText}</FormHelperText> : null}
    </FormControl>
  );
});

CustomInput.displayName = 'CustomInput';

const REMEMBER_ME_KEY = 'daytradedk_remember_email';

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [rememberMe, setRememberMe] = React.useState<boolean>(false);
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const schema = React.useMemo(() => createSchema(t), [t]);

  // Get remembered email from localStorage
  const getRememberedEmail = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REMEMBER_ME_KEY) || '';
    }
    return '';
  }, []);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  // Load remembered email on mount
  React.useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      setValue('email', rememberedEmail);
      setRememberMe(true);
    }
  }, [getRememberedEmail, setValue]);

  const loginMutation = useLogin();
  const { mutate: login, isPending } = loginMutation;

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      // Handle Remember Me - save or remove email from localStorage
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, values.email);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }

      login(values, {
        onSuccess: () => {
          const redirectUrl = searchParams?.get('returnUrl') || searchParams?.get('redirect');
          if (redirectUrl) {
            router.replace(decodeURIComponent(redirectUrl));
          } else {
            router.replace(paths.academy.overview);
          }
        },
        onError: (error: Error) => {
          setError('root', { type: 'server', message: error.message });
        },
      });
    },
    [login, router, setError, searchParams, rememberMe]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            mb: 2,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}
        >
          <TrendingUp sx={{ fontSize: 28, color: '#22c55e' }} />
          <ShowChart sx={{ fontSize: 28, color: '#60a5fa' }} />
          <CandlestickChart sx={{ fontSize: 28, color: '#fbbf24' }} />
        </Box>
        <Typography
          variant="h3"
          fontWeight={800}
          textAlign="center"
          sx={{
            background: isDarkMode
              ? 'linear-gradient(135deg, #ffffff 0%, #22c55e 100%)'
              : 'linear-gradient(135deg, #1a1a1a 0%, #16a34a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('auth.signIn.title')}
        </Typography>
        <Typography sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }} variant="body1" textAlign="center">
          {t('auth.signIn.subtitle')}
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
                label={t('auth.signIn.email')}
                placeholder={t('auth.signIn.emailPlaceholder')}
                type="email"
                required
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                isDarkMode={isDarkMode}
                muiTheme={muiTheme}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <CustomInput
                {...field}
                icon={<Lock sx={{ fontSize: 20 }} />}
                label={t('auth.signIn.password')}
                placeholder={t('auth.signIn.passwordPlaceholder')}
                type={showPassword ? 'text' : 'password'}
                required
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                isDarkMode={isDarkMode}
                muiTheme={muiTheme}
                endAdornment={
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                }
              />
            )}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                    '&.Mui-checked': {
                      color: '#22c55e',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                  {t('auth.signIn.rememberMe')}
                </Typography>
              }
            />
            <Link
              component={RouterLink}
              href={paths.auth.resetPassword}
              variant="subtitle2"
              sx={{
                color: '#22c55e',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.2s',
                '&:hover': {
                  color: '#16a34a',
                  textDecoration: 'underline',
                },
              }}
            >
              {t('auth.signIn.forgotPassword')}
            </Link>
          </Box>

          {errors.root ? <Alert severity="error">{errors.root.message}</Alert> : null}

          <Button
            disabled={isPending}
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 1.75,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              background: isPending ? undefined : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              boxShadow: isPending ? 'none' : '0 4px 14px rgba(34, 197, 94, 0.4)',
              transition: 'all 0.3s',
              '&:hover': {
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                boxShadow: '0 6px 20px rgba(34, 197, 94, 0.5)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&:disabled': {
                background: 'rgba(34, 197, 94, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {isPending ? t('auth.signIn.submittingButton') : t('auth.signIn.submitButton')}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }}>
              {t('auth.signIn.or')}
            </Typography>
          </Divider>

          <Typography variant="body2" textAlign="center" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
            {t('auth.signIn.noAccount')}{' '}
            <Link
              component={RouterLink}
              href={paths.auth.signUp}
              underline="hover"
              variant="subtitle2"
              sx={{
                color: '#22c55e',
                fontWeight: 600,
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#16a34a',
                },
              }}
            >
              {t('auth.signIn.signUpLink')}
            </Link>
          </Typography>
        </Stack>
      </form>
    </Stack>
  );
}