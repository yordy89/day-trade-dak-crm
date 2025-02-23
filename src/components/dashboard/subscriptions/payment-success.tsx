'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { CheckCircle, WarningCircle } from '@phosphor-icons/react';

import API from '@/lib/axios';

export function PaymentSuccess(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionName = searchParams.get('subscription') || 'your new plan';

  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 5;
  const retryDelay = 2000;

  const fetchUpdatedUser = React.useCallback(async () => {
    try {
      console.log(`🔄 Fetching updated user profile (Attempt ${retryCount + 1})...`);
      setIsLoading(true);
      const response = await API.get('/user/profile');
      console.log('✅ User profile fetched:', response.data);

      if (!response.data.subscriptions.includes(subscriptionName) && retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        console.log(`⏳ Subscription not updated yet. Retrying in ${retryDelay / 1000} seconds...`);
        setTimeout(fetchUpdatedUser, retryDelay);
        return;
      }

      setUser(response.data);
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        console.log(`🔄 Retrying in ${retryDelay / 1000} seconds...`);
        setTimeout(fetchUpdatedUser, retryDelay);
      } else {
        setIsError(true);
        setIsLoading(false);
      }
    }
  }, [retryCount, maxRetries, retryDelay, subscriptionName, setUser]);

  React.useEffect(() => {
    void fetchUpdatedUser();
  }, [fetchUpdatedUser]);

  return (
    <Box
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      {!isError ? (
        <>
          <CheckCircle size={80} weight="fill" color="green" />
          <Typography variant="h4">Payment Successful!</Typography>
          <Typography variant="h6">You are now subscribed to {subscriptionName}.</Typography>
          {isLoading ? (
            <CircularProgress sx={{ mt: 2 }} />
          ) : (
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => router.push('/dashboard/overview')}>
              Go to Dashboard
            </Button>
          )}
        </>
      ) : (
        <>
          <WarningCircle size={80} weight="fill" color="red" />
          <Typography variant="h4" color="error">
            Subscription Update Failed
          </Typography>
          <Typography variant="h6" color="error">
            We couldn’t confirm your subscription. Please try again.
          </Typography>
          <Button variant="contained" sx={{ mt: 3 }} onClick={fetchUpdatedUser}>
            Retry Now
          </Button>
        </>
      )}
    </Box>
  );
}
