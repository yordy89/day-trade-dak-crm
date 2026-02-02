'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Avatar,
  Alert,
  useTheme,
  alpha,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircle,
  LocationOn,
  CalendarToday,
  Schedule,
  TrendingUp,
  Psychology,
  EmojiEvents,
  Celebration,
  LocalOffer,
  ExpandMore,
  AccessTime,
  School,
  Visibility,
  BarChart,
  AttachMoney,
  SelfImprovement,
  Groups,
  CameraAlt,
  Warning,
} from '@mui/icons-material';
import { useClientAuth } from '@/hooks/use-client-auth';
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal';
import { eventService } from '@/services/api/event.service';
import axios from 'axios';
import { SubscriptionPlan } from '@/types/user';
import GoogleMap from '@/components/common/GoogleMap';
import { useRouter } from 'next/navigation';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';

export default function CommunityEventPage() {
  const theme = useTheme();
  const { user } = useClientAuth();
  const { t: _t } = useTranslation('communityEvent');
  const router = useRouter();
  const [isProcessing, _setIsProcessing] = useState(false);
  const [pricing, setPricing] = useState<{ basePrice: number; currency: string } | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [_hasActiveSubscription, _setHasActiveSubscription] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [_isLoadingEvent, _setIsLoadingEvent] = useState(true);
  const [eventCapacity, setEventCapacity] = useState<{ available: boolean; remaining: number } | null>(null);
  const [isLoadingCapacity, setIsLoadingCapacity] = useState(true);
  
  // Check if registration is enabled from environment variable
  const isManuallyEnabled = process.env.NEXT_PUBLIC_COMMUNITY_EVENT_REGISTRATION_ENABLED === 'true';
  
  // Check both manual enable and capacity availability
  const isCapacityAvailable = eventCapacity?.available ?? true;
  const isRegistrationEnabled = isManuallyEnabled && isCapacityAvailable;

  useEffect(() => {
    // Check if user has Live Semanal subscription
    if (user) {
      const allSubscriptions = user.subscriptions || [];
      const hasActive = allSubscriptions.some((sub: any) => {
        // Handle both string and object subscription formats
        if (typeof sub === 'string') {
          return [SubscriptionPlan.LiveWeeklyManual, SubscriptionPlan.LiveWeeklyRecurring].includes(sub as SubscriptionPlan);
        } else if (sub && typeof sub === 'object' && 'plan' in sub) {
          // Check if it's a Live subscription and not expired
          const isLivePlan = [SubscriptionPlan.LiveWeeklyManual, SubscriptionPlan.LiveWeeklyRecurring].includes(sub.plan as SubscriptionPlan);
          const isNotExpired = !sub.expiresAt || new Date(sub.expiresAt) > new Date();
          return isLivePlan && isNotExpired;
        }
        return false;
      });
      _setHasActiveSubscription(hasActive);
    }

    // Fetch event data and pricing
    const fetchData = async () => {
      setIsLoadingCapacity(true);
      try {
        // Get the active community event
        const communityEventResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events/community/active`
        );
        const communityEvent = communityEventResponse.data;
        
        if (communityEvent) {
          setEvent(communityEvent);
          setPricing({ 
            basePrice: communityEvent.price || 599.99, 
            currency: 'usd' 
          });
          
          // Check event capacity
          try {
            const capacityInfo = await eventService.checkEventCapacity(communityEvent._id);
            setEventCapacity(capacityInfo);
          } catch (capacityError) {
            console.error('Error checking event capacity:', capacityError);
            // Default to available if capacity check fails
            setEventCapacity({ available: true, remaining: -1 });
          }
        } else {
          // Fallback pricing if no event found
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/public-pricing/CommunityEvent`
          );
          setPricing(response.data);
          // Create a mock event object for the registration modal
          setEvent({
            _id: 'community-event-default',
            name: 'Community Event',
            title: 'Mentoría Presencial con Mijail Medina',
            type: 'community_event',
            price: response.data.basePrice || 599.99,
            requiresActiveSubscription: false,
          });
          // For default event, assume capacity is available
          setEventCapacity({ available: true, remaining: -1 });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to default values
        setPricing({ basePrice: 599.99, currency: 'usd' });
        setEvent({
          _id: 'community-event-default',
          name: 'Community Event',
          title: 'Mentoría Presencial con Mijail Medina',
          type: 'community_event',
          price: 599.99,
          requiresActiveSubscription: false,
        });
        // Default capacity to available on error
        setEventCapacity({ available: true, remaining: -1 });
      } finally {
        setIsLoadingPrice(false);
        _setIsLoadingEvent(false);
        setIsLoadingCapacity(false);
      }
    };

    void fetchData();
  }, [user]);

  const handlePurchase = async () => {
    // Anyone can pay - open registration modal directly
    setIsRegistrationModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: pricing?.currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Format date for display
  const _formatEventDate = (date: Date | string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get Spanish day name
  const getDayName = (date: Date | string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('es-ES', { weekday: 'long' })
      .charAt(0).toUpperCase() + eventDate.toLocaleDateString('es-ES', { weekday: 'long' }).slice(1);
  };

  // Get day and month
  const getDayMonth = (date: Date | string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  // Get formatted date range for display - Hardcoded for March 2026 event
  const getDateRangeDisplay = () => {
    return 'Martes – Miércoles – Jueves. 17, 18, 19 de Marzo 2026';
  };

  // Hardcoded schedule for March 2026 event
  const generateDynamicSchedule = () => {
    return [
      {
        day: 'DÍA 1 - Martes 17 de Marzo',
        title: 'Operación en Vivo & Metodología de 3 Cuentas',
        icon: <TrendingUp />,
        color: '#16a34a',
        morning: {
          title: 'MAÑANA - Operación en Vivo con el Mentor',
          time: '8:30 AM - 12:00 PM',
          activities: [
            'Revisión del calendario económico y noticias clave',
            'Selección de activos con potencial (watchlist real)',
            'Análisis técnico y definición de zonas estratégicas',
            'Entrada justificada, clara y explicada paso a paso',
            'Gestión profesional del trade en vivo',
            'Comentarios mentales del mentor durante la operación',
            'Reflexión post-trade: ¿Qué se respetó? ¿Qué se aprendió?',
          ],
        },
        afternoon: {
          title: 'TARDE - Módulos de Inversión',
          time: '2:00 PM - 5:30 PM',
          modules: [
            {
              name: 'Módulo 1: Metodología de 3 Cuentas – Mapa de Ciclos',
              content: [
                'Estructurar tu capital en tres cuentas: semilla, crecimiento y largo plazo',
                'Transformar las ganancias del trading en patrimonio real',
                'Ciclos de inversión y flujo de capital disciplinado',
              ],
            },
            {
              name: 'Módulo 2: Inversión en Activos desde Cero',
              content: [
                'Diferencia entre ahorro e inversión',
                'Mentalidad del inversionista exitoso',
                'Errores comunes al empezar a invertir',
              ],
            },
            {
              name: 'Módulo 3: Inversión Flexible 70% del Capital (S&P-500)',
              content: [
                'Estrategia tipo Cuenta de Ahorro Flexible',
                'Cómo funciona esta inversión y sus ventajas',
                'Configuración y gestión del S&P-500',
              ],
            },
          ],
        },
      },
      {
        day: 'DÍA 2 - Miércoles 18 de Marzo',
        title: 'Operación en Vivo & Estrategias de Inversión',
        icon: <BarChart />,
        color: '#3b82f6',
        morning: {
          title: 'MAÑANA - Operación en Vivo con el Mentor',
          time: '8:30 AM - 12:00 PM',
          activities: [
            'Revisión del calendario económico y oportunidades del día',
            'Aplicación práctica de lo aprendido el día anterior',
            'Identificación de nuevas oportunidades en tiempo real',
            'Análisis de correlaciones entre activos',
            'Control emocional bajo presión del mercado',
            'Evaluación y ajuste de estrategias en vivo',
          ],
        },
        afternoon: {
          title: 'TARDE - Módulos de Inversión',
          time: '2:00 PM - 5:30 PM',
          modules: [
            {
              name: 'Módulo 4: Inversión con Depósito Automático (S&P-500)',
              content: [
                'Introducción al depósito automático',
                'Dollar Cost Averaging (DCA) explicado',
                'Configuración y automatización de inversiones',
              ],
            },
            {
              name: 'Módulo 5: Inversión a Corto Plazo (20% del Capital)',
              content: [
                'Estrategias para crecimiento a corto plazo',
                'Activos, ETFs e Inversiones Inversas',
                'Gestión activa de posiciones',
              ],
            },
            {
              name: 'Módulo 6: Inversión a Largo Plazo (20% del Capital)',
              content: [
                'Construcción de riqueza a largo plazo',
                'El poder del interés compuesto',
                'ETFs e inversiones para el futuro',
              ],
            },
          ],
        },
      },
      {
        day: 'DÍA 3 - Jueves 19 de Marzo',
        title: 'Operación en Vivo & Psicotrading',
        icon: <Psychology />,
        color: '#f59e0b',
        morning: {
          title: 'MAÑANA - Operación en Vivo con el Mentor',
          time: '8:30 AM - 12:00 PM',
          activities: [
            'Última sesión de trading en vivo del evento',
            'Revisión del calendario económico',
            'Selección de activos y ejecución de trades',
            'Integración de todos los conceptos aprendidos',
            'Sesión de preguntas y respuestas en vivo',
            'Reflexión final sobre la semana de operaciones',
          ],
        },
        afternoon: {
          title: 'TARDE - Módulos Finales & Cierre',
          time: '2:00 PM - 5:30 PM',
          modules: [
            {
              name: 'Módulo 7: Cómo Combinar Todo en una Estrategia Personal',
              content: [
                'Flexibilidad vs. automatización',
                'Corto plazo vs. largo plazo: cuándo y cómo',
                'Recomendaciones personalizadas según tus ingresos',
              ],
            },
            {
              name: 'Módulo Especial: Psicotrading – Domina tu Mente',
              content: [
                'Técnicas para controlar impulsos emocionales',
                'Operar desde el enfoque, no desde el miedo',
                'Crear tu libertad financiera con disciplina mental',
              ],
            },
            {
              name: '🎁 BONO ESPECIAL',
              content: [
                'Acceso a programa de ejercicios grabados durante 3 meses',
                'Transformación de mentalidad para inversores',
                'Foto oficial, certificado y cierre inspirador',
              ],
            },
          ],
        },
      },
    ];
  };

  const daySchedule = generateDynamicSchedule();

  return (
    <div className="min-h-screen">
      <MainNavbar />
      <main>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            color: 'white',
            pt: { xs: 14, sm: 16, md: 18 },
            pb: { xs: 6, sm: 8, md: 12 },
            overflow: 'hidden',
            backgroundColor: '#0d1117',
            minHeight: { xs: '80vh', sm: 'auto' },
            mt: { xs: 0, sm: 0, md: 0 },
            // Background image with very reduced opacity
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/assets/images/comunity-event-backgorund.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.08,
              zIndex: 0,
            },
            // Dark gradient overlay with subtle color accents
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(180deg,
                rgba(13, 17, 23, 0.3) 0%,
                rgba(22, 163, 74, 0.08) 30%,
                rgba(153, 27, 27, 0.08) 50%,
                rgba(22, 163, 74, 0.05) 70%,
                rgba(13, 17, 23, 0.5) 90%,
                rgba(13, 17, 23, 1) 100%)`,
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <Typography 
                    variant="h3" 
                    fontWeight={700} 
                    sx={{ 
                      mb: 2, 
                      color: '#22c55e',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    ¡ATENCIÓN TRADERS QUE QUIEREN RESULTADOS REALES!
                  </Typography>
                  <Typography 
                    variant="h2" 
                    fontWeight={800}
                    sx={{
                      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                      textAlign: { xs: 'center', md: 'left' },
                      lineHeight: { xs: 1.2, md: 1.1 }
                    }}
                  >
                    {event?.title || 'Mentoría Presencial con Mijail Medina'}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      opacity: 0.95,
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
                      fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    EN VIVO desde {event?.location || 'Tampa, Florida'}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      opacity: 0.9, 
                      mt: 2,
                      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
                      fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    3 días intensivos de inmersión total en el trading profesional
                  </Typography>
                  
                  {/* Event Details */}
                  <Stack spacing={2} sx={{ mt: 3, alignItems: { xs: 'center', md: 'flex-start' } }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LocationOn sx={{ color: 'primary.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                      <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>{event?.location || 'Tampa, Florida'}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CalendarToday sx={{ color: 'primary.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                      <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, textAlign: { xs: 'left', sm: 'center' } }}>
                        {getDateRangeDisplay()}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Schedule sx={{ color: 'primary.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                      <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' }, textAlign: { xs: 'left', sm: 'center' } }}>
                        8:30 AM a 12:00 PM (mañanas) | 2:00 PM a 5:30 PM (tardes)
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <School sx={{ color: 'primary.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                      <Typography variant="body1" fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        Modalidad: Presencial | Nivel: Avanzado
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Capacity Indicator - More marketing friendly */}
                  {eventCapacity && eventCapacity.remaining > 0 && eventCapacity.remaining <= 50 ? <Alert 
                      severity={eventCapacity.remaining <= 10 ? "error" : eventCapacity.remaining <= 25 ? "warning" : "info"}
                      sx={{ 
                        mt: 2, 
                        backgroundColor: alpha(
                          eventCapacity.remaining <= 10 
                            ? theme.palette.error.main 
                            : eventCapacity.remaining <= 25 
                              ? theme.palette.warning.main 
                              : theme.palette.info.main, 
                          0.1
                        ),
                        color: 'white',
                        '& .MuiAlert-icon': {
                          color: 'white'
                        }
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {eventCapacity.remaining <= 10 
                          ? `¡ÚLTIMOS LUGARES DISPONIBLES! 🔥`
                          : eventCapacity.remaining <= 25
                            ? `⚡ Quedan pocos lugares disponibles`
                            : `✨ Lugares limitados disponibles`
                        }
                      </Typography>
                    </Alert> : null}

                  {/* Non-refundable Policy Warning */}
                  <Alert 
                    severity="warning"
                    icon={<Warning />}
                    sx={{ 
                      mt: 3,
                      backgroundColor: alpha(theme.palette.warning.main, 0.15),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                      '& .MuiAlert-icon': {
                        color: theme.palette.warning.main,
                      },
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight={700}>
                        ⚠️ Política de No Reembolso
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.5 }}>
                        Los pagos por las MENTORÍAS PRESENCIALES no son reembolsables. 
                        Esta política se implementa para asegurar la planificación y el compromiso 
                        tanto de los participantes, del equipo y de nuestro Mentor, garantizando así 
                        la calidad y el valor de la experiencia educativa.
                      </Typography>
                    </Stack>
                  </Alert>

                  <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: { xs: 'center', md: 'flex-start' }, width: '100%' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handlePurchase}
                      disabled={!isRegistrationEnabled}
                      sx={{
                        backgroundColor: isRegistrationEnabled ? 'white' : 'grey.400',
                        color: isRegistrationEnabled ? 'primary.main' : 'grey.600',
                        '&:hover': {
                          backgroundColor: isRegistrationEnabled ? 'grey.100' : 'grey.400',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: 'grey.400',
                          color: 'grey.600',
                        },
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 700,
                        width: { xs: '90%', sm: 'auto' },
                        maxWidth: { xs: '350px', sm: 'none' }
                      }}
                    >
                      {isProcessing ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <>
                          {isLoadingPrice || isLoadingCapacity ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            isRegistrationEnabled 
                              ? `RESERVAR MI LUGAR - ${formatPrice(pricing?.basePrice || 599.99)}`
                              : !isManuallyEnabled 
                                ? 'LA MENTORÍA YA ALCANZÓ EL TOTAL DE REGISTROS'
                                : !isCapacityAvailable
                                  ? 'LA MENTORÍA YA ALCANZÓ EL TOTAL DE REGISTROS'
                                  : 'REGISTRO NO DISPONIBLE'
                          )}
                        </>
                      )}
                    </Button>
                    
                    {/* Manage Registration Button */}
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => router.push('/community-event/manage-registration')}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'grey.300',
                          backgroundColor: alpha(theme.palette.common.white, 0.1),
                        },
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 700,
                      }}
                    >
                      Gestionar Mi Registro
                    </Button>
                  </Stack>

                  {/* BNPL Payment Options Message */}
                  {pricing ? (
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 3,
                        p: 2,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <LocalOffer sx={{ color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            ¡Opciones de Financiamiento Disponibles!
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Financia tu inversión en educación con Klarna - planes flexibles disponibles
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ) : null}
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(13, 17, 23, 0.95) 50%, rgba(153, 27, 27, 0.15) 100%)',
                    border: '1px solid rgba(22, 163, 74, 0.3)',
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 4px 20px rgba(22, 163, 74, 0.4)',
                    }}
                  >
                    <EmojiEvents sx={{ fontSize: 50, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
                    CUPO LIMITADO
                  </Typography>
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 40px rgba(22, 163, 74, 0.3)',
                    }}
                  >
                    {isLoadingPrice ? '...' : formatPrice(pricing?.basePrice || 599.99)}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Solo para traders comprometidos
                  </Typography>
                  <Divider sx={{ my: 3, borderColor: 'rgba(22, 163, 74, 0.3)' }} />
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)',
                      border: '1px solid rgba(22, 163, 74, 0.3)',
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#22c55e' }}>
                      &quot;Aquí no ven teoría... aquí ven cómo se hace dinero en vivo y con disciplina.&quot;
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Registration Closed Notice */}
        {!isRegistrationEnabled && (
          <Box sx={{ py: 2, backgroundColor: alpha(theme.palette.warning.main, 0.1) }}>
            <Container maxWidth="lg">
              <Alert 
                severity="warning" 
                sx={{ 
                  fontSize: '1.1rem',
                  '& .MuiAlert-icon': {
                    fontSize: '2rem'
                  }
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  ¡Registro Cerrado!
                </Typography>
                <Typography variant="body1">
                  La mentoría presencial ya alcanzó el total de registros. Mantente atento a nuestras redes sociales para futuros eventos.
                </Typography>
              </Alert>
            </Container>
          </Box>
        )}

        {/* Daily Schedule */}
        <Box sx={{ backgroundColor: '#0d1117', py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              textAlign="center"
              fontWeight={700}
              mb={2}
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                background: 'linear-gradient(135deg, #ffffff 0%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Programa Completo de 3 Días
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              sx={{
                mb: 6,
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Una inmersión intensiva en trading profesional y construcción de patrimonio
            </Typography>
            <Grid container spacing={4}>
              {daySchedule.map((day) => (
                <Grid item xs={12} key={day.day}>
                  <Accordion
                    defaultExpanded={day.day.includes('DÍA 1')}
                    sx={{
                      backgroundColor: '#161b22',
                      borderRadius: '16px !important',
                      border: `1px solid ${alpha(day.color, 0.3)}`,
                      boxShadow: `0 4px 20px ${alpha(day.color, 0.15)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: `0 8px 30px ${alpha(day.color, 0.25)}`,
                        border: `1px solid ${alpha(day.color, 0.5)}`,
                      },
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': {
                        margin: '0 !important',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: day.color }} />}
                      sx={{
                        borderBottom: `1px solid ${alpha(day.color, 0.2)}`,
                        '&.Mui-expanded': {
                          minHeight: 'auto',
                        },
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center" width="100%">
                        <Avatar
                          sx={{
                            background: `linear-gradient(135deg, ${day.color} 0%, ${alpha(day.color, 0.7)} 100%)`,
                            width: { xs: 45, sm: 56 },
                            height: { xs: 45, sm: 56 },
                            boxShadow: `0 4px 14px ${alpha(day.color, 0.4)}`,
                          }}
                        >
                          {day.icon}
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' }, color: day.color }}>
                            {day.day}
                          </Typography>
                          <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, color: 'rgba(255, 255, 255, 0.7)' }}>
                            {day.title}
                          </Typography>
                        </Box>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>
                      <Grid container spacing={3}>
                        {/* Morning Session */}
                        <Grid item xs={12} md={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              height: '100%',
                              backgroundColor: '#0d1117',
                              border: `1px solid ${alpha(day.color, 0.2)}`,
                              borderRadius: 3,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                border: `1px solid ${alpha(day.color, 0.4)}`,
                                boxShadow: `0 4px 20px ${alpha(day.color, 0.15)}`,
                              },
                            }}
                          >
                            <Stack spacing={2}>
                              <Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
                                  {day.morning.title}
                                </Typography>
                                <Chip
                                  icon={<AccessTime sx={{ color: 'white !important' }} />}
                                  label={day.morning.time}
                                  size="small"
                                  sx={{
                                    background: `linear-gradient(135deg, ${day.color} 0%, ${alpha(day.color, 0.7)} 100%)`,
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>
                              <List dense>
                                {day.morning.activities.map((activity, idx) => (
                                  <ListItem key={idx} sx={{ py: 0.5 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <CheckCircle sx={{ color: day.color, fontSize: 20 }} />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={activity}
                                      primaryTypographyProps={{ variant: 'body2', sx: { color: 'rgba(255, 255, 255, 0.85)' } }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Stack>
                          </Paper>
                        </Grid>

                        {/* Afternoon Session */}
                        <Grid item xs={12} md={6}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              height: '100%',
                              backgroundColor: '#0d1117',
                              border: `1px solid ${alpha(day.color, 0.2)}`,
                              borderRadius: 3,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                border: `1px solid ${alpha(day.color, 0.4)}`,
                                boxShadow: `0 4px 20px ${alpha(day.color, 0.15)}`,
                              },
                            }}
                          >
                            <Stack spacing={2}>
                              <Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
                                  {day.afternoon.title}
                                </Typography>
                                <Chip
                                  icon={<AccessTime sx={{ color: 'white !important' }} />}
                                  label={day.afternoon.time}
                                  size="small"
                                  sx={{
                                    background: `linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)`,
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>
                              <Stack spacing={2}>
                                {day.afternoon.modules.map((module, idx) => (
                                  <Box
                                    key={idx}
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      backgroundColor: alpha(day.color, 0.05),
                                      border: `1px solid ${alpha(day.color, 0.15)}`,
                                    }}
                                  >
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ color: day.color, mb: 1 }}>
                                      {module.name}
                                    </Typography>
                                    <List dense sx={{ py: 0 }}>
                                      {module.content.map((item, itemIdx) => (
                                        <ListItem key={itemIdx} sx={{ py: 0.25 }}>
                                          <ListItemIcon sx={{ minWidth: 30 }}>
                                            <CheckCircle sx={{ color: day.color, fontSize: 16 }} />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={item}
                                            primaryTypographyProps={{ variant: 'body2', sx: { color: 'rgba(255, 255, 255, 0.8)' } }}
                                          />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Box>
                                ))}
                              </Stack>
                            </Stack>
                          </Paper>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Key Highlights */}
        <Box sx={{ backgroundColor: '#161b22', py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              textAlign="center"
              fontWeight={700}
              mb={2}
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Lo Que Aprenderás
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              sx={{ mb: 6, color: 'rgba(255, 255, 255, 0.7)', maxWidth: 600, mx: 'auto' }}
            >
              Habilidades y conocimientos que transformarán tu trading
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    backgroundColor: '#0d1117',
                    border: '1px solid rgba(22, 163, 74, 0.2)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(22, 163, 74, 0.2)',
                      border: '1px solid rgba(22, 163, 74, 0.4)',
                    },
                  }}
                >
                  <Stack spacing={3} alignItems="center">
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                        boxShadow: '0 4px 20px rgba(22, 163, 74, 0.4)',
                      }}
                    >
                      <Visibility sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight={600} textAlign="center" sx={{ color: 'white' }}>
                      Operación en Vivo
                    </Typography>
                    <Typography variant="body1" textAlign="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Observa cómo el mentor opera en tiempo real con pantalla proyectada,
                      explicando su análisis, decisión de entrada, ejecución y manejo emocional.
                    </Typography>
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    backgroundColor: '#0d1117',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(139, 92, 246, 0.2)',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                    },
                  }}
                >
                  <Stack spacing={3} alignItems="center">
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                      }}
                    >
                      <AttachMoney sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight={600} textAlign="center" sx={{ color: 'white' }}>
                      Metodología de 3 Cuentas
                    </Typography>
                    <Typography variant="body1" textAlign="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Aprende a estructurar tu capital en tres cuentas (semilla, crecimiento y largo plazo)
                      para transformar las ganancias del trading en patrimonio real y duradero.
                    </Typography>
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    backgroundColor: '#0d1117',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                    },
                  }}
                >
                  <Stack spacing={3} alignItems="center">
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight={600} textAlign="center" sx={{ color: 'white' }}>
                      Inversión Inteligente
                    </Typography>
                    <Typography variant="body1" textAlign="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Desde inversión en S&P-500 hasta estrategias con ETFs y Dollar Cost Averaging (DCA).
                      Aprende a combinar inversión a corto y largo plazo según tus ingresos.
                    </Typography>
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    backgroundColor: '#0d1117',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(245, 158, 11, 0.2)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                    },
                  }}
                >
                  <Stack spacing={3} alignItems="center">
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
                      }}
                    >
                      <SelfImprovement sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight={600} textAlign="center" sx={{ color: 'white' }}>
                      Psicotrading
                    </Typography>
                    <Typography variant="body1" textAlign="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Domina tu mente y crea tu libertad financiera. Técnicas para controlar impulsos
                      y operar desde el enfoque, no desde el miedo o la ansiedad.
                    </Typography>
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    backgroundColor: '#0d1117',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(6, 182, 212, 0.2)',
                      border: '1px solid rgba(6, 182, 212, 0.4)',
                    },
                  }}
                >
                  <Stack spacing={3} alignItems="center">
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                        boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
                      }}
                    >
                      <BarChart sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight={600} textAlign="center" sx={{ color: 'white' }}>
                      Estrategia Personalizada
                    </Typography>
                    <Typography variant="body1" textAlign="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Aprende a combinar flexibilidad vs. automatización, corto vs. largo plazo,
                      con recomendaciones específicas según tu nivel de ingresos y objetivos.
                    </Typography>
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, #0d1117 50%, rgba(22, 163, 74, 0.15) 100%)',
                    border: '2px solid rgba(22, 163, 74, 0.5)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(22, 163, 74, 0.3)',
                      border: '2px solid rgba(22, 163, 74, 0.7)',
                    },
                  }}
                >
                  <Stack spacing={3} alignItems="center">
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                        boxShadow: '0 4px 20px rgba(22, 163, 74, 0.5)',
                      }}
                    >
                      <EmojiEvents sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      textAlign="center"
                      sx={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Bono Especial
                    </Typography>
                    <Typography variant="body1" textAlign="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Acceso a un programa de ejercicios grabados durante 3 meses
                      para transformar tu mentalidad como inversionista.
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Why This Event */}
        <Box sx={{ backgroundColor: '#0d1117', py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              textAlign="center"
              fontWeight={700}
              mb={2}
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Esta Mentoría es Para Ti Si:
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              sx={{ mb: 6, color: 'rgba(255, 255, 255, 0.7)', maxWidth: 600, mx: 'auto' }}
            >
              Identifícate con los traders que buscan resultados reales
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  {[
                    'Eres estudiante de la academia y quieres profundizar tu formación',
                    'Quieres presenciar operaciones reales y aprender en vivo',
                    'Buscas estructurar tu capital de forma disciplinada',
                    'Deseas desarrollar una mentalidad de inversión a largo plazo',
                    'Quieres aprender a transformar ganancias de trading en patrimonio real',
                  ].map((text, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 3,
                        backgroundColor: '#161b22',
                        border: '1px solid rgba(22, 163, 74, 0.2)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(8px)',
                          border: '1px solid rgba(22, 163, 74, 0.5)',
                          boxShadow: '0 4px 20px rgba(22, 163, 74, 0.15)',
                        },
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                          }}
                        >
                          <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          {text}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Grid>
            </Grid>

            <Box textAlign="center" sx={{ mt: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  maxWidth: 800,
                  mx: 'auto',
                  mb: 4,
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(13, 17, 23, 0.95) 50%, rgba(59, 130, 246, 0.15) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 3,
                }}
              >
                <Typography variant="body1" fontWeight={600} sx={{ color: 'white' }}>
                  ¿Dónde colocas tu dinero? $10,000 en el banco pueden crecer a $10,500 en 5 años.
                  Los mismos $10,000 invertidos en activos como el ETF Vanguard Growth (VOOG) podrían convertirse en más de $30,000.
                </Typography>
              </Paper>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                &quot;La verdadera diferencia está entre dejar tu dinero en el banco y ponerlo a trabajar en activos.&quot;
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Location */}
        <Box sx={{ backgroundColor: '#161b22', py: 8 }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              textAlign="center"
              fontWeight={700}
              mb={2}
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Ubicación del Evento
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              sx={{ mb: 6, color: 'rgba(255, 255, 255, 0.7)', maxWidth: 600, mx: 'auto' }}
            >
              Un lugar premium para una experiencia de aprendizaje única
            </Typography>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, #0d1117 50%, rgba(22, 163, 74, 0.15) 100%)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      borderRadius: 3,
                    }}
                  >
                    <Stack spacing={2} textAlign="center">
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)',
                          }}
                        >
                          <LocationOn sx={{ fontSize: 28, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                          Tampa, Florida
                        </Typography>
                      </Stack>
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        sx={{
                          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Hilton Garden Inn Tampa Ybor Historic District
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        1700 E 9th Ave, Tampa, FL 33605
                      </Typography>
                      <Divider sx={{ my: 2, borderColor: 'rgba(236, 72, 153, 0.3)' }} />
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        sx={{
                          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {getDateRangeDisplay()}
                      </Typography>
                    </Stack>
                  </Paper>
                  <Box
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    <GoogleMap
                      location={{ lat: 27.9594, lng: -82.4423 }}
                      zoom={15}
                      height={300}
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #16a34a 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    ¿Qué Incluye tu Inversión?
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: '#0d1117',
                      border: '1px solid rgba(22, 163, 74, 0.2)',
                      borderRadius: 3,
                      p: 2,
                    }}
                  >
                    <List>
                      {[
                        { icon: <Visibility />, primary: 'Operación en vivo cada mañana', secondary: '3 sesiones de trading real con el mentor explicando cada decisión', color: '#16a34a' },
                        { icon: <School />, primary: '7 módulos de inversión completos', secondary: 'Metodología de 3 Cuentas, S&P-500, ETFs, DCA y estrategias a corto/largo plazo', color: '#3b82f6' },
                        { icon: <Psychology />, primary: 'Módulo Especial de Psicotrading', secondary: 'Domina tu mente y opera desde el enfoque, no desde el miedo', color: '#f59e0b' },
                        { icon: <EmojiEvents />, primary: 'Bono: Programa de 3 meses', secondary: 'Acceso a ejercicios grabados para transformar tu mentalidad', color: '#8b5cf6' },
                        { icon: <Groups />, primary: 'Networking exclusivo', secondary: 'Conexión con traders e inversionistas serios y el mentor', color: '#06b6d4' },
                        { icon: <CameraAlt />, primary: 'Certificado y foto oficial', secondary: 'Reconocimiento de tu participación en el evento', color: '#ec4899' },
                      ].map((item, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            py: 1.5,
                            borderBottom: index < 5 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                          }}
                        >
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '10px',
                                background: `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color, 0.7)} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 4px 14px ${alpha(item.color, 0.3)}`,
                              }}
                            >
                              {React.cloneElement(item.icon, { sx: { color: 'white', fontSize: 22 } })}
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            primary={item.primary}
                            secondary={item.secondary}
                            primaryTypographyProps={{ fontWeight: 600, sx: { color: 'white' } }}
                            secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.6)' } }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            position: 'relative',
            background: 'linear-gradient(180deg, #0d1117 0%, #161b22 50%, #0d1117 100%)',
            color: 'white',
            py: 10,
            textAlign: 'center',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(ellipse at center, rgba(22, 163, 74, 0.15) 0%, transparent 70%)',
              zIndex: 0,
            },
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
                boxShadow: '0 8px 40px rgba(22, 163, 74, 0.4)',
              }}
            >
              <Celebration sx={{ fontSize: 60, color: 'white' }} />
            </Box>
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #22c55e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Reserva tu lugar hoy mismo
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
              y prepárate para vivir la experiencia que cambiará tu forma de operar para siempre
            </Typography>

            <Box>
              <Paper
                elevation={0}
                sx={{
                  mb: 4,
                  p: 3,
                  maxWidth: 600,
                  mx: 'auto',
                  background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.2) 0%, rgba(13, 17, 23, 0.95) 50%, rgba(22, 163, 74, 0.2) 100%)',
                  border: '2px solid rgba(22, 163, 74, 0.4)',
                  borderRadius: 3,
                }}
              >
                <Typography variant="body1" fontWeight={700} sx={{ color: '#22c55e' }}>
                  CUPO LIMITADO – SOLO PARA TRADERS COMPROMETIDOS
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                  Esta mentoría es una inversión en tu futuro como trader profesional
                </Typography>
              </Paper>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePurchase}
                  disabled={!isRegistrationEnabled}
                  sx={{
                    background: isRegistrationEnabled
                      ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                      : 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                    color: 'white',
                    fontSize: '1.2rem',
                    py: 2,
                    px: 6,
                    fontWeight: 700,
                    borderRadius: 2,
                    boxShadow: isRegistrationEnabled
                      ? '0 4px 20px rgba(22, 163, 74, 0.4)'
                      : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: isRegistrationEnabled
                        ? 'linear-gradient(135deg, #15803d 0%, #14532d 100%)'
                        : 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                      transform: isRegistrationEnabled ? 'translateY(-2px)' : 'none',
                      boxShadow: isRegistrationEnabled
                        ? '0 6px 30px rgba(22, 163, 74, 0.5)'
                        : 'none',
                    },
                    '&.Mui-disabled': {
                      background: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  {isRegistrationEnabled
                    ? 'ASEGURAR MI LUGAR AHORA'
                    : !isManuallyEnabled
                      ? 'LA MENTORÍA YA ALCANZÓ EL TOTAL DE REGISTROS'
                      : !isCapacityAvailable
                        ? 'LA MENTORÍA YA ALCANZÓ EL TOTAL DE REGISTROS'
                        : 'REGISTRO NO DISPONIBLE'}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => router.push('/community-event/manage-registration')}
                  sx={{
                    borderColor: 'rgba(22, 163, 74, 0.5)',
                    color: '#22c55e',
                    fontSize: '1.2rem',
                    py: 2,
                    px: 4,
                    fontWeight: 700,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'rgba(22, 163, 74, 0.8)',
                      backgroundColor: 'rgba(22, 163, 74, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Gestionar Mi Registro
                </Button>
              </Stack>
            </Box>

            <Typography
              variant="body1"
              sx={{
                mt: 5,
                color: 'rgba(255, 255, 255, 0.6)',
                fontStyle: 'italic',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              &quot;Muchos pierden por entrar mal, pero otros pierden por reforzar sin sentido.&quot;<br />
              &quot;Este módulo te entrena para entrar solo donde hay probabilidad real, no emoción.&quot;
            </Typography>
          </Container>
        </Box>

      </main>

      {/* Footer Spacer */}
      <Box sx={{ height: { xs: 40, md: 60 }, backgroundColor: '#0d1117' }} />

      {/* Professional Footer */}
      <ProfessionalFooter />
      
      {/* Event Registration Modal */}
      {event ? (
        <EventRegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          event={event}
          userId={user?._id}
          userEmail={user?.email}
          user={user}
        />
      ) : null}
    </div>
  );
}