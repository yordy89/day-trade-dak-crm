import React from 'react';
import { useRouter } from 'next/navigation';
import { Warning, SignIn, ArrowClockwise, Users } from '@phosphor-icons/react';
import { 
  Box, 
  Button, 
  Typography, 
  Alert, 
  Stack,
  Container
} from '@mui/material';

interface LiveMeetingsErrorProps {
  error: string;
  tokenExpired?: boolean;
  onRetry?: () => void;
  onGuestMode?: () => void;
}

export function LiveMeetingsError({ 
  error, 
  tokenExpired = false, 
  onRetry, 
  onGuestMode 
}: LiveMeetingsErrorProps) {
  const router = useRouter();

  if (tokenExpired) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            py: 4,
          }}
        >
          <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: 'warning.light',
              }}
            >
              <Warning size={24} color="#f59e0b" />
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                Session Expired
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your session has expired. Please sign in again to access live meetings.
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ width: '100%' }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SignIn size={20} />}
                onClick={() => router.push('/auth/sign-in')}
              >
                Sign In Again
              </Button>

              {onGuestMode && (
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Users size={20} />}
                  onClick={onGuestMode}
                >
                  Continue as Guest
                </Button>
              )}
            </Stack>

            <Alert severity="info" sx={{ width: '100%' }}>
              <Typography variant="body2">
                <strong>Tip:</strong> Sign in to join live meetings, access recordings, and participate in Q&A sessions.
              </Typography>
            </Alert>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          py: 4,
        }}
      >
        <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'error.light',
            }}
          >
            <Warning size={24} color="#dc2626" />
          </Box>
          
          <Box textAlign="center">
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error || 'We encountered an error while loading live meetings.'}
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ width: '100%' }}>
            {onRetry && (
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<ArrowClockwise size={20} />}
                onClick={onRetry}
              >
                Try Again
              </Button>
            )}

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => router.push('/')}
            >
              Go to Dashboard
            </Button>
          </Stack>

          <Alert severity="info" sx={{ width: '100%', backgroundColor: 'grey.50' }}>
            <Typography variant="body2">
              If this problem persists, please contact{' '}
              <Typography
                component="a"
                href="mailto:support@daytradedak.com"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                support@daytradedak.com
              </Typography>
            </Typography>
          </Alert>
        </Stack>
      </Box>
    </Container>
  );
}