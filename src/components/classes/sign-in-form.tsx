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
  Visibility, 
  VisibilityOff,
  Login,
  ArrowLeft,
} from '@mui/icons-material';
import { authService } from '@/services/api/auth.service';
import { CustomInput } from './CustomInput';

const schema = z.object({
  email: z.string().min(1, { message: 'Email es requerido' }).email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Contraseña es requerida' }),
});

type FormValues = z.infer<typeof schema>;

export default function ClassesSignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.signIn(data.email, data.password);
      
      // The auth service already handles storing the token and user
      // Redirect to classes page
      router.push('/classes');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
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
        Iniciar Sesión
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: alpha('#ffffff', 0.7) }}>
        Accede a tu cuenta para ver las clases
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
        <Stack spacing={3}>
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
                placeholder="Tu contraseña"
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


          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <Login />}
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
                backgroundColor: alpha('#16a34a', 0.5),
              },
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </Stack>
      </form>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
          ¿No tienes cuenta?{' '}
          <Link href="/classes/sign-up" style={{ textDecoration: 'none' }}>
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
              Regístrate aquí
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}