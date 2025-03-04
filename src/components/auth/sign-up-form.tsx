'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { useMutation } from '@tanstack/react-query';
import API from '@/lib/axios';

const schema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required' }),
  lastName: zod.string().min(1, { message: 'Last name is required' }),
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
  terms: zod.boolean().refine((value) => value, 'You must accept the terms and conditions'),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { firstName: '', lastName: '', email: '', password: '', terms: false } satisfies Values;

interface SignUpResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface SignUpCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const { mutate: signUp } = useMutation<SignUpResponse, Error, SignUpCredentials>({
    mutationFn: async (values: SignUpCredentials) => {
      const response = await API.post<SignUpResponse>('/auth/signup', {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      return response.data; // Assume the API returns { token, user }
    },
    onSuccess: () => {
      router.replace(paths.auth.signIn);
    },
    onError: (error: any) => {
      setError('root', { type: 'server', message: error?.response?.data?.message || 'Sign-up failed' });
    },
  });

  const isLoading =false;

  const onSubmit = (values: Values): void => {
    signUp(values);
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Regístrate</Typography>
        <Typography color="text.secondary" variant="body2">
        ¿Ya tienes una cuenta?{' '}
          <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
          Iniciar sesión
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.firstName)}>
                <InputLabel>Nombre</InputLabel>
                <OutlinedInput {...field} label="First name" />
                {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormControl error={Boolean(errors.lastName)}>
                <InputLabel>Apellido</InputLabel>
                <OutlinedInput {...field} label="Last name" />
                {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Correo Electrónico</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Contraseña</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <React.Fragment>
                      He leído los <Link component={RouterLink} href={paths.terms.terms} underline='hover' variant='subtitle2'>términos y condiciones</Link>
                    </React.Fragment>
                  }
                />
                {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
              </div>
            )}
          />
          {errors.root ? <Alert severity="error">{errors.root.message}</Alert> : null}
          <Button disabled={isLoading} type="submit" variant="contained">
            {isLoading ? 'Registrándote...' : 'Regístrate'}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
