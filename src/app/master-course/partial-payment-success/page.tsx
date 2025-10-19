'use client';

import React, { useEffect, useState, Suspense } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircleOutline,
  Payment,
  Schedule,
  ArrowForward,
  Home,
  Receipt,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';
import { useTheme as useAppTheme } from '@/components/theme/theme-provider';
import { eventService } from '@/services/api/event.service';

function PartialPaymentSuccessContent() {
  const router = useRouter();
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  const searchParams = useSearchParams();
  const [registration, setRegistration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const sessionId = searchParams.get('session_id');
  const registrationId = searchParams.get('registration_id');

  useEffect(() => {
    // Trigger confetti animation
    const timer = setTimeout(() => {
      void confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#22c55e', '#4ade80', '#86efac'],
      });
    }, 500);

    // Fetch registration details
    if (registrationId) {
      fetchRegistration();
    } else {
      setIsLoading(false);
    }

    return () => clearTimeout(timer);
  }, [registrationId]);

  const fetchRegistration = async () => {
    try {
      const balanceData = await eventService.getRegistrationBalance(registrationId!);
      setRegistration(balanceData.registration);

      // If payment is fully complete, redirect to full success page
      if (balanceData.registration.isFullyPaid) {
        console.log('Payment is fully paid, redirecting to full success page');
        setIsRedirecting(true);
        setTimeout(() => {
          router.push(`/master-course/success?session_id=${sessionId}`);
        }, 3000); // Wait 3 seconds to show the confetti and success message
      }
    } catch (error) {
      console.error('Error fetching registration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateProgress = () => {
    if (!registration) return 0;
    return (registration.totalPaid / registration.totalAmount) * 100;
  };

  if (isLoading) {
    return (
      <>
        <MainNavbar />
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={60} />
        </Box>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      <Box sx={{ minHeight: '100vh', bgcolor: isDarkMode ? '#0a0a0a' : '#f9fafb', py: { xs: 4, sm: 6, md: 8 }, pt: { xs: 12, sm: 14 } }}>
        <Container maxWidth="md">
          {/* Success Header */}
          <Box textAlign="center" mb={4}>
            <CheckCircleOutline
              sx={{
                fontSize: { xs: 70, sm: 90 },
                color: 'success.main',
                mb: 2
              }}
            />
            <Typography
              variant="h3"
              gutterBottom
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem' } }}
            >
              {isRedirecting ? '¡Pago Completo!' : '¡Pago Recibido!'}
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              mb={2}
              sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
            >
              {isRedirecting
                ? 'Redirigiendo a los detalles del curso...'
                : 'Tu pago ha sido procesado exitosamente'}
            </Typography>
            {isRedirecting && (
              <CircularProgress size={30} sx={{ mt: 2 }} />
            )}
          </Box>

          {/* Payment Summary Card */}
          {registration && (
            <Card
              sx={{
                mb: 4,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.success.main, 0.15)}`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Payment sx={{ fontSize: 40, color: 'success.main' }} />
                  <Typography variant="h5" fontWeight={700}>
                    Resumen del Pago
                  </Typography>
                </Stack>

                {/* Progress Bar */}
                <Box sx={{ mb: 4 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progreso del pago
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {calculateProgress().toFixed(0)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress()}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        background: registration.isFullyPaid
                          ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                          : 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                      },
                    }}
                  />
                </Box>

                <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.08), borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body1">Precio total del curso:</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formatCurrency(registration.totalAmount)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body1">Total pagado:</Typography>
                      <Typography variant="body1" fontWeight={700} color="success.main">
                        {formatCurrency(registration.totalPaid)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" fontWeight={700}>
                        Saldo pendiente:
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color={registration.isFullyPaid ? 'success.main' : 'warning.main'}>
                        {registration.isFullyPaid ? '¡Completado!' : formatCurrency(registration.remainingBalance)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>

                {!registration.isFullyPaid && (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Aún tienes un saldo pendiente
                    </Typography>
                    <Typography variant="body2">
                      Puedes realizar pagos adicionales en cualquier momento antes del evento desde la página "Mi Registro".
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                ✅ Próximos Pasos
              </Typography>

              <Stack spacing={3} sx={{ mt: 3 }}>
                <Stack direction="row" spacing={2}>
                  <CheckCircleOutline sx={{ color: 'success.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      1. Confirmación de pago recibida
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hemos enviado la confirmación de tu pago a tu correo electrónico con el resumen de tu registro
                    </Typography>
                  </Box>
                </Stack>

                {!registration?.isFullyPaid && (
                  <Stack direction="row" spacing={2}>
                    <Schedule sx={{ color: 'warning.main', mt: 0.5 }} />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        2. Completa tu pago antes del evento
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Puedes realizar pagos adicionales en cualquier momento visitando la página "Mi Registro"
                      </Typography>
                    </Box>
                  </Stack>
                )}

                <Stack direction="row" spacing={2}>
                  <Receipt sx={{ color: 'info.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {registration?.isFullyPaid ? '2' : '3'}. Acceso a la plataforma
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {registration?.isFullyPaid
                        ? 'Recibirás las credenciales de acceso 2 semanas antes del evento presencial (finales de septiembre 2025)'
                        : 'Una vez completado el pago total, recibirás las credenciales de acceso 2 semanas antes del evento presencial'}
                    </Typography>
                  </Box>
                </Stack>

                {registration?.isFullyPaid && (
                  <Stack direction="row" spacing={2}>
                    <AccountBalanceWallet sx={{ color: 'success.main', mt: 0.5 }} />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        3. ¡Tu lugar está asegurado!
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Has completado tu inscripción. Recibirás más información sobre el curso próximamente
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {!registration?.isFullyPaid && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<AccountBalanceWallet />}
                onClick={() => router.push('/master-course/my-registration')}
                sx={{
                  py: 2,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
                    boxShadow: '0 12px 32px rgba(245, 158, 11, 0.35)',
                  },
                }}
              >
                Realizar Otro Pago
              </Button>
            )}

            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<Home />}
              onClick={() => router.push('/')}
              sx={{ py: 2 }}
            >
              Volver al Inicio
            </Button>
          </Stack>

          {/* Success Message */}
          <Box mt={6} textAlign="center">
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ color: 'success.main' }}>
              ¡Gracias por tu pago! 🎉
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {registration?.isFullyPaid
                ? 'Tu inscripción está completa. ¡Nos vemos en el curso!'
                : 'Has asegurado tu lugar. Completa tu pago cuando estés listo.'}
            </Typography>
          </Box>
        </Container>
      </Box>
      <ProfessionalFooter />
    </>
  );
}

export default function PartialPaymentSuccessPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    }>
      <PartialPaymentSuccessContent />
    </Suspense>
  );
}
