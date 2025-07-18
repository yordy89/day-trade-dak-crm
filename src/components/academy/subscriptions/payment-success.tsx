'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Typography, 
  Alert,
  Card,
  CardContent,
  Container,
  Stack,
  Chip,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import { 
  CheckCircle, 
  WarningCircle,
  ArrowRight,
  CreditCard,
  Sparkle,
  Star,
  Trophy,
  RocketLaunch
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

import { SubscriptionPlan } from '@/types/user';
import API from '@/lib/axios';
import { mapMembershipName } from '@/lib/memberships';

// Confetti component for celebration effect
const ConfettiAnimation = () => {
  // Use theme-appropriate colors - various shades of green and complementary colors
  const colors = ['#16a34a', '#15803d', '#22c55e', '#059669', '#10b981'];
  const confettiCount = 50;
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}
    >
      {[...Array(confettiCount)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0,
            opacity: 1
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            rotate: Math.random() * 360,
            opacity: 0
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
    </Box>
  );
};

export function PaymentSuccess(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const sessionId = searchParams.get('session_id');
  const subscriptionName = searchParams.get('plan') || searchParams.get('subscription') || 'your new plan';

  // Don&apos;t need setUser here, it&apos;s handled by the auth store
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState('Procesando pago...');
  const retryCountRef = React.useRef(0);
  const maxRetries = 5;
  const retryDelay = 2000;

  // Simulate progress for better UX
  React.useEffect(() => {
    if (isLoading && !isError) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [isLoading, isError]);

  const fetchUpdatedUser = React.useCallback(async () => {
    if (retryCountRef.current >= maxRetries) {
      console.error('❌ Max retries reached. Subscription update failed.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      setCurrentStep('Actualizando tu perfil...');
      console.log(`🔄 Fetching updated user profile (Attempt ${retryCountRef.current + 1})...`);
      const response = await API.get('/user/profile');
      console.log('✅ User profile fetched:', response.data);

      const hasSubscription = response.data.subscriptions.some(
        (sub: any) => sub === subscriptionName || sub.plan === subscriptionName
      );
      
      if (!hasSubscription && paymentConfirmed) {
        retryCountRef.current += 1;
        console.log(`⏳ Subscription not updated yet. Retrying in ${retryDelay / 1000} seconds...`);
        setCurrentStep('Sincronizando suscripción...');
        setTimeout(() => fetchUpdatedUser(), retryDelay);
        return;
      }

      useAuthStore.getState().setUser(response.data);
      setProgress(100);
      setCurrentStep('¡Listo!');
      setTimeout(() => {
        setIsLoading(false);
        setIsError(false);
      }, 1000);
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
  }, [subscriptionName, paymentConfirmed]);

  // Confirm the payment with session ID
  const confirmPayment = React.useCallback(async () => {
    if (!sessionId) {
      console.log('⚠️ No session ID found, fetching user profile directly');
      setCurrentStep('Verificando suscripción...');
      return fetchUpdatedUser();
    }

    try {
      setCurrentStep('Confirmando pago...');
      setProgress(20);
      console.log('🔄 Confirming payment with session ID:', sessionId);
      const response = await API.post('/payments/confirm-payment', { sessionId });
      console.log('✅ Payment confirmation response:', response.data);

      if (response.data.success) {
        setPaymentConfirmed(true);
        setProgress(60);
        // Update subscription name from response if available
        if (response.data.subscription?.plan) {
          const plan = response.data.subscription.plan;
          // Update URL to reflect the correct plan
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('plan', plan);
          window.history.replaceState({}, '', newUrl.toString());
        }
        // Now fetch the updated user profile
        return fetchUpdatedUser();
      }
      setErrorMessage(response.data.message || 'Payment confirmation failed');
      setIsError(true);
      setIsLoading(false);
    } catch (error: any) {
      console.error('❌ Error confirming payment:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to confirm payment. Please try again.');
      setIsError(true);
      setIsLoading(false);
    }
  }, [sessionId, fetchUpdatedUser]);

  const navigateTo = () => {
    // Map subscription plans to their correct routes
    const routeMap: Record<string, string> = {
      [SubscriptionPlan.CLASSES]: '/academy/classes',
      [SubscriptionPlan.MasterClases]: '/academy/masterclass',
      [SubscriptionPlan.LiveRecorded]: '/academy/live-sessions',
      [SubscriptionPlan.PSICOTRADING]: '/academy/psicotrading',
      [SubscriptionPlan.PeaceWithMoney]: '/academy/personal-growth/peace-with-money',
      [SubscriptionPlan.LiveWeeklyManual]: '/live',
      [SubscriptionPlan.LiveWeeklyRecurring]: '/live',
      [SubscriptionPlan.MasterCourse]: '/master-course',
      [SubscriptionPlan.CommunityEvent]: '/community-event',
      [SubscriptionPlan.VipEvent]: '/vip-event',
    };

    const route = routeMap[subscriptionName as SubscriptionPlan];
    if (route) {
      router.push(route);
    } else {
      // Fallback to dashboard if route not found
      router.push('/academy');
    }
  };

  // Get plan details for display
  const getPlanDetails = () => {
    // Use theme green color for all plans to maintain consistency
    const themeGreen = '#16a34a';
    const plans: Record<string, { icon: React.ReactNode; color: string; description: string }> = {
      basic: {
        icon: <Star size={32} weight="fill" />,
        color: themeGreen,
        description: 'Acceso completo al Master Course con actualizaciones de por vida'
      },
      class: {
        icon: <Trophy size={32} weight="fill" />,
        color: themeGreen,
        description: 'Clases en vivo diarias y análisis de mercado en tiempo real'
      },
      mentorship: {
        icon: <RocketLaunch size={32} weight="fill" />,
        color: themeGreen,
        description: 'Mentoría 1-a-1 con traders expertos y plan personalizado'
      },
      psicotrading: {
        icon: <Sparkle size={32} weight="fill" />,
        color: themeGreen,
        description: 'Domina tu psicología de trading y transforma tu mentalidad'
      },
      moneypeace: {
        icon: <CreditCard size={32} weight="fill" />,
        color: themeGreen,
        description: 'Programa de transformación financiera de 60 días'
      },
      liveweeklymanual: {
        icon: <RocketLaunch size={32} weight="fill" />,
        color: themeGreen,
        description: 'Acceso semanal al Live Trading Room con análisis en tiempo real'
      },
      liveweeklyrecurring: {
        icon: <RocketLaunch size={32} weight="fill" />,
        color: themeGreen,
        description: 'Suscripción automática al Live Trading Room con beneficios exclusivos'
      }
    };

    return plans[subscriptionName.toLowerCase()] || {
      icon: <CheckCircle size={32} weight="fill" />,
      color: themeGreen,
      description: 'Tu suscripción ha sido activada exitosamente'
    };
  };

  React.useEffect(() => {
    void confirmPayment();
  }, []);

  const planDetails = getPlanDetails();

  return (
    <Box
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {!isError && !isLoading ? <ConfettiAnimation /> : null}
      
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {!isError ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${planDetails.color} 0%, ${alpha(planDetails.color, 0.5)} 100%)`,
                  }
                }}
              >
                <CardContent>
                  {isLoading ? (
                    <Stack spacing={3} alignItems="center">
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: alpha(planDetails.color, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}
                      >
                        <CircularProgress
                          size={80}
                          thickness={2}
                          sx={{
                            position: 'absolute',
                            color: planDetails.color
                          }}
                        />
                        <Box sx={{ color: planDetails.color }}>
                          {planDetails.icon}
                        </Box>
                      </Box>
                      
                      <Stack spacing={1} alignItems="center" sx={{ width: '100%' }}>
                        <Typography variant="h5" fontWeight={600}>
                          {currentStep}
                        </Typography>
                        <Box sx={{ width: '100%', mt: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: alpha(planDetails.color, 0.1),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: `linear-gradient(90deg, ${planDetails.color} 0%, ${alpha(planDetails.color, 0.7)} 100%)`,
                              }
                            }}
                          />
                        </Box>
                      </Stack>
                    </Stack>
                  ) : (
                    <Stack spacing={3} alignItems="center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 200,
                          damping: 10
                        }}
                      >
                        <Box
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: alpha(planDetails.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}
                        >
                          <Box 
                            sx={{ 
                              color: planDetails.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <CheckCircle size={60} weight="fill" />
                          </Box>
                          <Box
                            sx={{
                              position: 'absolute',
                              inset: -10,
                              borderRadius: '50%',
                              border: `2px solid ${alpha(planDetails.color, 0.3)}`,
                              animation: 'pulse 2s ease-in-out infinite'
                            }}
                          />
                        </Box>
                      </motion.div>
                      
                      <Stack spacing={2} alignItems="center">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Typography variant="h4" fontWeight={700} textAlign="center">
                            ¡Pago Exitoso!
                          </Typography>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Chip
                            label={mapMembershipName(subscriptionName as SubscriptionPlan)}
                            sx={{
                              backgroundColor: alpha(planDetails.color, 0.1),
                              color: planDetails.color,
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              py: 2.5,
                              px: 1
                            }}
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Typography 
                            variant="body1" 
                            color="text.secondary" 
                            textAlign="center"
                            sx={{ maxWidth: 400 }}
                          >
                            {planDetails.description}
                          </Typography>
                        </motion.div>
                      </Stack>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{ width: '100%' }}
                      >
                        <Stack spacing={2} sx={{ width: '100%' }}>
                          <Button 
                            variant="contained" 
                            size="large"
                            fullWidth
                            endIcon={<ArrowRight weight="bold" />}
                            onClick={() => navigateTo()}
                            sx={{
                              py: 1.5,
                              backgroundColor: planDetails.color,
                              '&:hover': {
                                backgroundColor: alpha(planDetails.color, 0.9),
                              }
                            }}
                          >
                            Comenzar ahora
                          </Button>
                          
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              Recibirás un correo de confirmación en breve
                            </Typography>
                          </Box>
                        </Stack>
                      </motion.div>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.error.main}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <CardContent>
                  <Stack spacing={3} alignItems="center">
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: alpha(theme.palette.error.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <WarningCircle size={48} weight="fill" color={theme.palette.error.main} />
                    </Box>
                    
                    <Stack spacing={2} alignItems="center">
                      <Typography variant="h4" fontWeight={700} color="error">
                        Error al procesar el pago
                      </Typography>
                      <Typography variant="body1" color="text.secondary" textAlign="center">
                        {errorMessage || 'No pudimos confirmar tu suscripción. Por favor, inténtalo de nuevo.'}
                      </Typography>
                      
                      {sessionId ? <Alert severity="info" sx={{ width: '100%' }}>
                          <Typography variant="caption">
                            ID de sesión: {sessionId.substring(0, 20)}...
                          </Typography>
                        </Alert> : null}
                    </Stack>
                    
                    <Stack spacing={2} sx={{ width: '100%' }}>
                      <Button 
                        variant="contained" 
                        size="large"
                        fullWidth
                        onClick={() => {
                          setIsError(false);
                          setIsLoading(true);
                          setProgress(0);
                          retryCountRef.current = 0;
                          void confirmPayment();
                        }}
                      >
                        Reintentar ahora
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="large"
                        fullWidth
                        onClick={() => router.push('/academy/subscriptions/plans')}
                      >
                        Volver a planes
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
