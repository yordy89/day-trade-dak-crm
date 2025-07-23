'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  CircularProgress,
  Stack,
  Paper,
  alpha,
} from '@mui/material';
import { CheckCircle, PlayCircle } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';

export default function ClassesSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const _sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle navigation in a separate effect
  useEffect(() => {
    if (countdown === 0 && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/classes#videos');
    }
  }, [countdown, router, isRedirecting]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha('#0a0a0a', 0.92)} 0%, ${alpha('#16a34a', 0.85)} 30%, ${alpha('#991b1b', 0.85)} 70%, ${alpha('#0a0a0a', 0.92)} 100%)`,
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: alpha('#ffffff', 0.05),
            backdropFilter: 'blur(10px)',
            border: `2px solid ${alpha('#22c55e', 0.3)}`,
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: alpha('#22c55e', 0.2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
            }}
          >
            <CheckCircle sx={{ fontSize: 80, color: '#22c55e' }} />
          </Box>

          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ color: 'white' }}>
            ¡Pago Exitoso!
          </Typography>

          <Typography variant="h6" sx={{ color: alpha('#ffffff', 0.8), mb: 4 }}>
            Tu acceso a las clases ha sido activado
          </Typography>

          <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.7), mb: 4 }}>
            Recibirás un correo de confirmación en breve
          </Typography>

          <Stack spacing={3} alignItems="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayCircle />}
              onClick={() => router.push('/classes#videos')}
              sx={{
                py: 2,
                px: 6,
                fontSize: '1.1rem',
                fontWeight: 700,
                backgroundColor: '#22c55e',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#16a34a',
                },
              }}
            >
              Ir a las Clases
            </Button>

            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={20} sx={{ color: '#22c55e' }} />
              <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                Redirigiendo en {countdown} segundos...
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}