'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, CircularProgress } from '@mui/material';
import { CheckCircle } from '@phosphor-icons/react';
import API from '@/lib/axios';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useAuthStore } from '@/store/auth-store';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const plan = searchParams.get('plan');

  React.useEffect(() => {
    const confirmAndRedirect = async () => {
      if (sessionId) {
        try {
          // Confirm payment
          const response = await API.post('/payments/confirm-payment', { sessionId });
          
          if (response.data.success) {
            // Fetch updated user profile
            const userResponse = await API.get('/user/profile');
            useAuthStore.getState().setUser(userResponse.data);
            
            // Redirect to subscription success page with plan info
            setTimeout(() => {
              router.push(`/academy/subscription/success?plan=${plan || response.data.subscription?.plan}&session_id=${sessionId}`);
            }, 1500);
          } else {
            // If payment not confirmed, still redirect but let the success page handle it
            router.push(`/academy/subscription/success?plan=${plan}&session_id=${sessionId}`);
          }
        } catch (error) {
          console.error('Error confirming payment:', error);
          // Still redirect on error
          router.push(`/academy/subscription/success?plan=${plan}&session_id=${sessionId}`);
        }
      } else {
        // No session ID, redirect to plans
        router.push('/academy/subscription/plans');
      }
    };

    confirmAndRedirect();
  }, [sessionId, plan, router]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CheckCircle size={80} weight="fill" color="green" />
      <Typography variant="h4" sx={{ mt: 2 }}>
        Procesando tu pago...
      </Typography>
      <CircularProgress sx={{ mt: 3 }} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Serás redirigido en unos segundos
      </Typography>
    </Box>
  );
}