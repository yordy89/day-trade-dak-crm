'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  Button,
  Typography,
  Alert,
  Stack,
  IconButton,
  CircularProgress,
  alpha,
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Person,
  Visibility, 
  VisibilityOff,
  PersonAdd,
  ArrowLeft,
} from '@mui/icons-material';
import { authService } from '@/services/api/auth.service';
import { CustomInput } from './CustomInput';

const schema = z.object({
  firstName: z.string().min(1, { message: 'Nombre es requerido' }),
  lastName: z.string().min(1, { message: 'Apellido es requerido' }),
  email: z.string().min(1, { message: 'Email es requerido' }).email({ message: 'Email inválido' }),
  password: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Debe contener al menos una mayúscula' })
    .regex(/[a-z]/, { message: 'Debe contener al menos una minúscula' })
    .regex(/[0-9]/, { message: 'Debe contener al menos un número' }),
  confirmPassword: z.string().min(1, { message: 'Confirma tu contraseña' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof schema>;

export default function ClassesSignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.signUp({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      
      // Don't store the token after registration - user needs to login
      // Redirect to sign-in page
      router.push('/classes/sign-in');
    } catch (err: any) {
      setError(err.message || 'Error al crear cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Button
        onClick={() => router.push('/classes')}
        sx={{
          mb: 3,
          color: alpha('#ffffff', 0.7),
          '&:hover': {
            color: '#22c55e',
            backgroundColor: alpha('#22c55e', 0.1),
          },
        }}
        startIcon={<ArrowLeft />}
      >
        Volver a las clases
      </Button>
      
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
        Crear Cuenta
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: alpha('#ffffff', 0.7) }}>
        Regístrate para acceder a las clases
      </Typography>

      {error ? <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            backgroundColor: alpha('#f44336', 0.1),
            color: 'white',
            '& .MuiAlert-icon': {
              color: '#f44336',
            },
          }}
        >
          {error}
        </Alert> : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  icon={<Person sx={{ fontSize: 20 }} />}
                  label="Nombre"
                  placeholder="John"
                  required
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  icon={<Person sx={{ fontSize: 20 }} />}
                  label="Apellido"
                  placeholder="Doe"
                  required
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
                />
              )}
            />
          </Stack>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                icon={<Email sx={{ fontSize: 20 }} />}
                label="Correo electrónico"
                placeholder="tu@email.com"
                type="email"
                required
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            )}
          />


          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                icon={<Lock sx={{ fontSize: 20 }} />}
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                type={showPassword ? 'text' : 'password'}
                required
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
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
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                icon={<Lock sx={{ fontSize: 20 }} />}
                label="Confirmar contraseña"
                placeholder="Repite tu contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword?.message}
                endAdornment={
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                }
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <PersonAdd />}
            sx={{
              py: 1.75,
              mt: 2,
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
                backgroundColor: alpha('#16a34a', 0.5),
              },
            }}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </Stack>
      </form>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/classes/sign-in" style={{ textDecoration: 'none' }}>
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: '#22c55e',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Inicia sesión aquí
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}