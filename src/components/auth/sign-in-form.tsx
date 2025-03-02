'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { useLogin } from '@/hooks/use-login';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email es requerido' }).email(),
  password: zod.string().min(1, { message: 'Contraseña es requerida' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: 'yordyat9@gmail.com', password: 'Yordanys123' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const setAuthToken = useAuthStore((state) => state.setAuthToken);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { mutate: login, isError, error, isPending } = useLogin();

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      login(values, {
        onSuccess: (data: any) => {
          setAuthToken(data.access_token);
          router.replace(paths.dashboard.overview);
        },
        onError: (err: any) => {
          console.log(err);
          setError('root', { type: 'server', message: err?.response?.data?.message || 'Error de inicio de sesión' });
        },
      });
    },
    [login, setAuthToken, router, setError]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Iniciar Sesión</Typography>
        <Typography color="text.secondary" variant="body2">
          ¿No tienes una cuenta?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            Regístrate
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.email)} variant="outlined">
                <InputLabel shrink>Email</InputLabel>
                <OutlinedInput {...field} label="Email" type="email" notched />
                {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.password)} variant="outlined">
                <InputLabel shrink>Contraseña</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={() => setShowPassword(true)}
                      />
                    )
                  }
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  notched
                />
                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
              </FormControl>
            )}
          />
          {/* <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              ¿Olvidaste tu contraseña?
            </Link>
          </div> */}
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
