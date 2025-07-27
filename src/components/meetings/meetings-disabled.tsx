'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import { Construction, ArrowLeft } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export function MeetingsDisabled() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: alpha(theme.palette.warning.main, 0.05),
            border: `2px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Construction sx={{ fontSize: 40, color: theme.palette.warning.main }} />
          </Box>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            Meetings Under Maintenance
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            We&apos;re upgrading our meeting system to provide you with a better experience. 
            This feature will be available again soon.
          </Typography>

          <Stack spacing={2} alignItems="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowLeft />}
              onClick={() => router.push('/')}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Return to Home
            </Button>

            <Typography variant="caption" color="text.secondary">
              For urgent matters, please contact support
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}