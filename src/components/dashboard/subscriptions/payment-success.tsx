'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { CheckCircle, WarningCircle } from '@phosphor-icons/react';

import API from '@/lib/axios';
import { mapMembershipName } from '@/lib/memberships';
import type { SubscriptionPlan } from '@/types/user';

export function PaymentSuccess(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionName = searchParams.get('subscription') || 'your new plan';

  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const retryCountRef = React.useRef(0); // Keeps track of retries without triggering re-renders
  const maxRetries = 5;
  const retryDelay = 2000;

  const fetchUpdatedUser = React.useCallback(async () => {
    if (retryCountRef.current >= maxRetries) {
      console.error('❌ Max retries reached. Subscription update failed.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      console.log(`🔄 Fetching updated user profile (Attempt ${retryCountRef.current + 1})...`);
      const response = await API.get('/user/profile');
      console.log('✅ User profile fetched:', response.data);

      if (!response.data.subscriptions.includes(subscriptionName)) {
        retryCountRef.current += 1;
        console.log(`⏳ Subscription not updated yet. Retrying in ${retryDelay / 1000} seconds...`);

        setTimeout(() => fetchUpdatedUser(), retryDelay);
        return;
      }

      setUser(response.data);
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      retryCountRef.current += 1;
      if (retryCountRef.current < maxRetries) {
        console.log(`🔄 Retrying in ${retryDelay / 1000} seconds...`);
        setTimeout(() => fetchUpdatedUser(), retryDelay);
      } else {
        setIsError(true);
        setIsLoading(false);
      }
    }
  }, [subscriptionName, setUser]);

  React.useEffect(() => {
    void fetchUpdatedUser();
  }, [fetchUpdatedUser]); // Runs only once when the component mounts

  return (
    <Box
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      {!isError ? (
        <>
          <CheckCircle size={80} weight="fill" color="green" />
          <Typography variant="h4">¡Pago Exitoso!</Typography>
          <Typography variant="h6">Ahora estás suscrito a {mapMembershipName(subscriptionName as SubscriptionPlan)}.</Typography>
          {isLoading ? (
            <CircularProgress sx={{ mt: 2 }} />
          ) : (
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => router.push('/dashboard/mentorship')}>
              Ir a Mentorías
            </Button>
          )}
        </>
      ) : (
        <>
          <WarningCircle size={80} weight="fill" color="red" />
          <Typography variant="h4" color="error">
            ❌ Error al actualizar la suscripción
          </Typography>
          <Typography variant="h6" color="error">
            ❌ No pudimos confirmar tu suscripción. Por favor, inténtalo de nuevo.
          </Typography>
          <Button variant="contained" sx={{ mt: 3 }} onClick={fetchUpdatedUser}>
            🔄 Reintentar ahora
          </Button>
        </>
      )}
    </Box>
  );
}
