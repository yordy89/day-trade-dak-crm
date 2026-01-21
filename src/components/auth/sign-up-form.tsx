'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Link,
  Stack,
  Typography,
  Box,
  IconButton,
  Divider,
  InputBase,
  useTheme as useMuiTheme,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  TrendingUp,
  ShowChart,
  CandlestickChart,
} from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useTheme } from '@/components/theme/theme-provider';

import { paths } from '@/paths';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useRecaptcha } from '@/hooks/use-recaptcha';

const createSchema = (t: any) => zod.object({
  firstName: zod.string().min(1, { message: t('auth.signUp.errors.firstNameRequired') }),
  lastName: zod.string().min(1, { message: t('auth.signUp.errors.lastNameRequired') }),
  email: zod.string().min(1, { message: t('auth.signUp.errors.emailRequired') }).email(t('auth.signUp.errors.emailInvalid')),
  password: zod
    .string()
    .min(12, { message: 'La contraseña debe tener al menos 12 caracteres' })
    .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
    .regex(/[a-z]/, { message: 'La contraseña debe contener al menos una letra minúscula' })
    .regex(/[0-9]/, { message: 'La contraseña debe contener al menos un número' })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { message: 'La contraseña debe contener al menos un carácter especial' }),
  terms: zod.boolean().refine((value) => value, t('auth.signUp.errors.termsRequired')),
  mediaTerms: zod.boolean().refine((value) => value, t('auth.signUp.errors.mediaTermsRequired')),
  communityGuidelines: zod.boolean().refine((value) => value, t('auth.signUp.errors.communityGuidelinesRequired')),
});

type Values = zod.infer<ReturnType<typeof createSchema>>;

const defaultValues = { firstName: '', lastName: '', email: '', password: '', terms: false, mediaTerms: false, communityGuidelines: false } satisfies Values;


interface SignUpCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptedMediaUsageTerms?: boolean;
  acceptedCommunityGuidelines?: boolean;
  recaptchaToken?: string;
}

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

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const { executeRecaptcha, isLoaded: recaptchaLoaded } = useRecaptcha();

  const schema = React.useMemo(() => createSchema(t), [t]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async (values: SignUpCredentials) => {
      const { authService } = await import('@/services/api/auth.service');
      return authService.signUp(values);
    },
    onSuccess: () => {
      toast.success(t('auth.signUp.success'));
      router.replace(paths.auth.signIn);
    },
    onError: (error: any) => {
      setError('root', { 
        type: 'server', 
        message: error.message || t('auth.signUp.errors.signupFailed') 
      });
    },
  });

  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const onSubmit = async (values: Values): Promise<void> => {
    // Execute reCAPTCHA before submitting
    const recaptchaToken = await executeRecaptcha('signup');

    if (!recaptchaToken) {
      setError('root', {
        type: 'recaptcha',
        message: 'Error de verificación de seguridad. Por favor, recarga la página e intenta de nuevo.',
      });
      return;
    }

    // Extract terms from values and prepare signup data
    const { terms: _terms, mediaTerms, communityGuidelines, ...signUpData } = values;
    signUp({
      ...signUpData,
      acceptedMediaUsageTerms: mediaTerms,
      acceptedCommunityGuidelines: communityGuidelines,
      recaptchaToken,
    });
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={2} alignItems="center">
        <Box sx={{ display: 'flex', gap: 1, color: 'primary.main', mb: 2 }}>
          <TrendingUp sx={{ fontSize: 32 }} />
          <ShowChart sx={{ fontSize: 32 }} />
          <CandlestickChart sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h3" fontWeight={800} textAlign="center">
          {t('auth.signUp.title')}
        </Typography>
        <Typography color="text.secondary" variant="body1" textAlign="center">
          {t('auth.signUp.subtitle')}
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  icon={<Person sx={{ fontSize: 20 }} />}
                  label={t('auth.signUp.firstName')}
                  placeholder={t('auth.signUp.firstNamePlaceholder')}
                  required
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                  isDarkMode={isDarkMode}
                  muiTheme={muiTheme}
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <CustomInput
                  {...field}
                  icon={<Person sx={{ fontSize: 20 }} />}
                  label={t('auth.signUp.lastName')}
                  placeholder={t('auth.signUp.lastNamePlaceholder')}
                  required
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
                  isDarkMode={isDarkMode}
                  muiTheme={muiTheme}
                />
              )}
            />
          </Stack>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <CustomInput
                {...field}
                icon={<Email sx={{ fontSize: 20 }} />}
                label={t('auth.signUp.email')}
                placeholder={t('auth.signUp.emailPlaceholder')}
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
                label={t('auth.signUp.password')}
                placeholder={t('auth.signUp.passwordPlaceholder')}
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
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
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
                      {t('auth.signUp.termsPrefix')}{' '}
                      <Link
                        component={RouterLink}
                        href={`${paths.terms.terms}#terms`}
                        underline="hover"
                        variant="body2"
                        sx={{ color: 'primary.main' }}
                      >
                        {t('auth.signUp.termsOfService')}
                      </Link>
                      {' '}{t('auth.signUp.and')}{' '}
                      <Link
                        component={RouterLink}
                        href={`${paths.terms.terms}#privacy`}
                        underline="hover"
                        variant="body2"
                        sx={{ color: 'primary.main' }}
                      >
                        {t('auth.signUp.privacyPolicy')}
                      </Link>
                    </Typography>
                  }
                />
                {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
              </Box>
            )}
          />

          <Controller
            control={control}
            name="mediaTerms"
            render={({ field }) => (
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
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
                      {t('auth.signUp.mediaTermsPrefix')}{' '}
                      <Link
                        component={RouterLink}
                        href="/media-usage-terms"
                        target="_blank"
                        underline="hover"
                        variant="body2"
                        sx={{ color: 'primary.main' }}
                      >
                        {t('auth.signUp.mediaTerms')}
                      </Link>
                      {' '}{t('auth.signUp.mediaTermsSuffix')}
                    </Typography>
                  }
                />
                {errors.mediaTerms ? <FormHelperText error>{errors.mediaTerms.message}</FormHelperText> : null}
              </Box>
            )}
          />

          <Controller
            control={control}
            name="communityGuidelines"
            render={({ field }) => (
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
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
                      {t('auth.signUp.communityGuidelinesPrefix')}{' '}
                      <Link
                        component={RouterLink}
                        href="/community-guidelines"
                        target="_blank"
                        underline="hover"
                        variant="body2"
                        sx={{ color: 'primary.main' }}
                      >
                        {t('auth.signUp.communityGuidelines')}
                      </Link>
                      {' '}{t('auth.signUp.communityGuidelinesSuffix')}
                    </Typography>
                  }
                />
                {errors.communityGuidelines ? <FormHelperText error>{errors.communityGuidelines.message}</FormHelperText> : null}
              </Box>
            )}
          />

          {errors.root ? <Alert severity="error">{errors.root.message}</Alert> : null}
          
          <Button
            disabled={isPending || !recaptchaLoaded}
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
            {isPending ? t('auth.signUp.submittingButton') : t('auth.signUp.submitButton')}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('auth.signUp.or')}
            </Typography>
          </Divider>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            {t('auth.signUp.hasAccount')}{' '}
            <Link 
              component={RouterLink} 
              href={paths.auth.signIn} 
              underline="hover" 
              variant="subtitle2"
              sx={{ color: 'primary.main', fontWeight: 600 }}
            >
              {t('auth.signUp.signInLink')}
            </Link>
          </Typography>
        </Stack>
      </form>
    </Stack>
  );
}