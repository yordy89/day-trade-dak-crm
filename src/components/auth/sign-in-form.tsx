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
          fontWeight: 500,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {label} {props.required ? <span style={{ color: muiTheme.palette.error.main }}>*</span> : null}
      </Typography>
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
        {endAdornment ? <Box sx={{ pr: 1 }}>
            {endAdornment}
          </Box> : null}
      </Box>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
});

CustomInput.displayName = 'CustomInput';

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [rememberMe, setRememberMe] = React.useState<boolean>(false);
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  const schema = React.useMemo(() => createSchema(t), [t]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const loginMutation = useLogin();
  const { mutate: login, isPending } = loginMutation;

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
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
    [login, router, setError, searchParams]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={2} alignItems="center">
        <Box sx={{ display: 'flex', gap: 1, color: 'primary.main', mb: 2 }}>
          <TrendingUp sx={{ fontSize: 32 }} />
          <ShowChart sx={{ fontSize: 32 }} />
          <CandlestickChart sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h3" fontWeight={800} textAlign="center">
          {t('auth.signIn.title')}
        </Typography>
        <Typography color="text.secondary" variant="body1" textAlign="center">
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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  {t('auth.signIn.rememberMe')}
                </Typography>
              }
            />
            <Link 
              component={RouterLink} 
              href={paths.auth.resetPassword} 
              variant="subtitle2"
              sx={{ 
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
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
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                backgroundColor: alpha(muiTheme.palette.primary.main, 0.5),
              },
            }}
          >
            {isPending ? t('auth.signIn.submittingButton') : t('auth.signIn.submitButton')}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('auth.signIn.or')}
            </Typography>
          </Divider>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            {t('auth.signIn.noAccount')}{' '}
            <Link 
              component={RouterLink} 
              href={paths.auth.signUp} 
              underline="hover" 
              variant="subtitle2"
              sx={{ color: 'primary.main', fontWeight: 600 }}
            >
              {t('auth.signIn.signUpLink')}
            </Link>
          </Typography>
        </Stack>
      </form>
    </Stack>
  );
}