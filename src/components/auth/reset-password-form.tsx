'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Stack,
  Typography,
  Box,
  InputAdornment,
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

const schema = zod.object({ email: zod.string().min(1, { message: 'Email is required' }).email() });

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '' } satisfies Values;

export function ResetPasswordForm(): React.JSX.Element {
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
      toast.success('Password reset instructions sent to your email');
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
          Forgot Password?
        </Typography>
        <Typography color="text.secondary" variant="body1" textAlign="center" sx={{ maxWidth: 400 }}>
          No worries! Enter your email and we&apos;ll send you reset instructions.
        </Typography>
      </Stack>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl fullWidth error={Boolean(errors.email)}>
                <OutlinedInput
                  {...field}
                  placeholder="Enter your email address"
                  type="email"
                  startAdornment={
                    <InputAdornment position="start">
                      <Email sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  }
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'text.primary',
                    },
                  }}
                />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
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
            {isPending ? 'Sending...' : 'Send Reset Instructions'}
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
            Back to Sign In
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
