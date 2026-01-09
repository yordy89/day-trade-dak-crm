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
            backgroundImage: 'url(/assets/images/comunity-event-backgorund.png)',
            backgroundSize: { xs: 'contain', sm: 'cover' },
            backgroundPosition: { xs: 'center center', sm: 'center' },
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#0a0a0a',
            minHeight: { xs: '80vh', sm: 'auto' },
            mt: { xs: 0, sm: 0, md: 0 },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${alpha('#0a0a0a', 0.92)} 0%, ${alpha('#16a34a', 0.85)} 30%, ${alpha('#991b1b', 0.85)} 70%, ${alpha('#0a0a0a', 0.92)} 100%)`,
              zIndex: 0,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
                  elevation={10}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: alpha(theme.palette.background.paper, 0.95),
                    color: theme.palette.text.primary,
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    CUPO LIMITADO
                  </Typography>
                  <Typography variant="h2" fontWeight={800} color="primary">
                    {isLoadingPrice ? '...' : formatPrice(pricing?.basePrice || 599.99)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    Solo para traders comprometidos
                  </Typography>
                  <Divider sx={{ my: 3 }} />
                  <Alert severity="success">
                    <Typography variant="body2" fontWeight={600}>
                      &quot;Aquí no ven teoría... aquí ven cómo se hace dinero en vivo y con disciplina.&quot;
                    </Typography>
                  </Alert>
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
        <Box sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.5), py: 8 }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              textAlign="center" 
              fontWeight={700} 
              mb={6}
              sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
            >
              Programa Completo de 3 Días
            </Typography>
            <Grid container spacing={4}>
              {daySchedule.map((day) => (
                <Grid item xs={12} key={day.day}>
                  <Accordion 
                    defaultExpanded={day.day.includes('DÍA 1')}
                    sx={{
                      backgroundColor: alpha(day.color, 0.05),
                      borderLeft: `4px solid ${day.color}`,
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Stack direction="row" spacing={2} alignItems="center" width="100%">
                        <Avatar sx={{ backgroundColor: day.color, width: { xs: 40, sm: 50 }, height: { xs: 40, sm: 50 } }}>
                          {day.icon}
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="h5" fontWeight={700} color={day.color} sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                            {day.day}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                            {day.title}
                          </Typography>
                        </Box>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        {/* Morning Session */}
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 3, height: '100%' }}>
                            <Stack spacing={2}>
                              <Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                  {day.morning.title}
                                </Typography>
                                <Chip 
                                  icon={<AccessTime />} 
                                  label={day.morning.time} 
                                  size="small" 
                                  color="primary"
                                />
                              </Box>
                              <List dense>
                                {day.morning.activities.map((activity, idx) => (
                                  <ListItem key={idx}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <CheckCircle sx={{ color: day.color, fontSize: 20 }} />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={activity}
                                      primaryTypographyProps={{ variant: 'body2' }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Stack>
                          </Paper>
                        </Grid>
                        
                        {/* Afternoon Session */}
                        <Grid item xs={12} md={6}>
                          <Paper sx={{ p: 3, height: '100%' }}>
                            <Stack spacing={2}>
                              <Box>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                  {day.afternoon.title}
                                </Typography>
                                <Chip 
                                  icon={<AccessTime />} 
                                  label={day.afternoon.time} 
                                  size="small" 
                                  color="secondary"
                                />
                              </Box>
                              <Stack spacing={2}>
                                  {day.afternoon.modules.map((module, idx) => (
                                    <Box key={idx}>
                                      <Typography variant="subtitle2" fontWeight={600} color={day.color} gutterBottom>
                                        {module.name}
                                      </Typography>
                                      <List dense>
                                        {module.content.map((item, itemIdx) => (
                                          <ListItem key={itemIdx}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                              <CheckCircle sx={{ color: day.color, fontSize: 20 }} />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={item}
                                              primaryTypographyProps={{ variant: 'body2' }}
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
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" textAlign="center" fontWeight={700} mb={6}>
            Lo Que Aprenderás
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Stack spacing={3} alignItems="center">
                  <Avatar sx={{ width: 80, height: 80, backgroundColor: 'primary.main' }}>
                    <Visibility sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600} textAlign="center">
                    Operación en Vivo
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Observa cómo el mentor opera en tiempo real con pantalla proyectada,
                    explicando su análisis, decisión de entrada, ejecución y manejo emocional.
                    Incluye revisión del calendario económico y gestión del trade en vivo.
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Stack spacing={3} alignItems="center">
                  <Avatar sx={{ width: 80, height: 80, backgroundColor: 'secondary.main' }}>
                    <AttachMoney sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600} textAlign="center">
                    Metodología de 3 Cuentas
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Aprende a estructurar tu capital en tres cuentas (semilla, crecimiento y largo plazo)
                    para transformar las ganancias del trading en patrimonio real y duradero.
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Stack spacing={3} alignItems="center">
                  <Avatar sx={{ width: 80, height: 80, backgroundColor: 'success.main' }}>
                    <TrendingUp sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600} textAlign="center">
                    Inversión Inteligente
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Desde inversión en S&P-500 hasta estrategias con ETFs y Dollar Cost Averaging (DCA).
                    Aprende a combinar inversión a corto y largo plazo según tus ingresos.
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Stack spacing={3} alignItems="center">
                  <Avatar sx={{ width: 80, height: 80, backgroundColor: 'warning.main' }}>
                    <SelfImprovement sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600} textAlign="center">
                    Psicotrading
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Domina tu mente y crea tu libertad financiera. Técnicas para controlar impulsos
                    y operar desde el enfoque, no desde el miedo o la ansiedad.
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Stack spacing={3} alignItems="center">
                  <Avatar sx={{ width: 80, height: 80, backgroundColor: 'info.main' }}>
                    <BarChart sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600} textAlign="center">
                    Estrategia Personalizada
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Aprende a combinar flexibilidad vs. automatización, corto vs. largo plazo,
                    con recomendaciones específicas según tu nivel de ingresos y objetivos.
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.05), border: `2px solid ${theme.palette.primary.main}` }}>
                <Stack spacing={3} alignItems="center">
                  <Avatar sx={{ width: 80, height: 80, backgroundColor: 'primary.main' }}>
                    <EmojiEvents sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600} textAlign="center" color="primary">
                    🎁 Bono Especial
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Acceso a un programa de ejercicios grabados durante 3 meses
                    para transformar tu mentalidad como inversionista.
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Why This Event */}
        <Box sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05), py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" textAlign="center" fontWeight={700} mb={6}>
              Esta Mentoría es Para Ti Si:
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <Paper sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle sx={{ color: 'success.main', fontSize: 30 }} />
                      <Typography variant="h6">
                        Eres estudiante de la academia y quieres profundizar tu formación
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle sx={{ color: 'success.main', fontSize: 30 }} />
                      <Typography variant="h6">
                        Quieres presenciar operaciones reales y aprender en vivo
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle sx={{ color: 'success.main', fontSize: 30 }} />
                      <Typography variant="h6">
                        Buscas estructurar tu capital de forma disciplinada
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle sx={{ color: 'success.main', fontSize: 30 }} />
                      <Typography variant="h6">
                        Deseas desarrollar una mentalidad de inversión a largo plazo
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle sx={{ color: 'success.main', fontSize: 30 }} />
                      <Typography variant="h6">
                        Quieres aprender a transformar ganancias de trading en patrimonio real
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>

            <Box textAlign="center" sx={{ mt: 6 }}>
              <Alert severity="info" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
                <Typography variant="body1" fontWeight={600}>
                  ¿Dónde colocas tu dinero? $10,000 en el banco pueden crecer a $10,500 en 5 años.
                  Los mismos $10,000 invertidos en activos como el ETF Vanguard Growth (VOOG) podrían convertirse en más de $30,000.
                </Typography>
              </Alert>
              <Typography variant="h5" fontWeight={600} color="primary">
                &quot;La verdadera diferencia está entre dejar tu dinero en el banco y ponerlo a trabajar en activos.&quot;
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Location */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" textAlign="center" fontWeight={700} mb={6}>
            Ubicación del Evento
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <Stack spacing={2} textAlign="center">
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                      <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />
                      <Typography variant="h4" fontWeight={700}>
                        Tampa, Florida
                      </Typography>
                    </Stack>
                    <Typography variant="h5" fontWeight={600} color="primary">
                      Hilton Garden Inn Tampa Ybor Historic District
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      1700 E 9th Ave, Tampa, FL 33605
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h5" fontWeight={600} color="primary">
                      {getDateRangeDisplay()}
                    </Typography>
                  </Stack>
                </Paper>
                <GoogleMap 
                  location={{ lat: 27.9594, lng: -82.4423 }} // 1700 E 9th Ave, Tampa, FL 33605
                  zoom={15}
                  height={300}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Typography variant="h5" fontWeight={600}>
                  ¿Qué Incluye tu Inversión?
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Visibility sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <ListItemText
                      primary="Operación en vivo cada mañana"
                      secondary="3 sesiones de trading real con el mentor explicando cada decisión"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><School sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <ListItemText
                      primary="7 módulos de inversión completos"
                      secondary="Metodología de 3 Cuentas, S&P-500, ETFs, DCA y estrategias a corto/largo plazo"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Psychology sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <ListItemText
                      primary="Módulo Especial de Psicotrading"
                      secondary="Domina tu mente y opera desde el enfoque, no desde el miedo"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><EmojiEvents sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <ListItemText
                      primary="Bono: Programa de 3 meses"
                      secondary="Acceso a ejercicios grabados para transformar tu mentalidad"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Groups sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <ListItemText
                      primary="Networking exclusivo"
                      secondary="Conexión con traders e inversionistas serios y el mentor"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CameraAlt sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <ListItemText
                      primary="Certificado y foto oficial"
                      secondary="Reconocimiento de tu participación en el evento"
                    />
                  </ListItem>
                </List>
              </Stack>
            </Grid>
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
            color: 'white',
            py: 8,
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Celebration sx={{ fontSize: 80, mb: 3 }} />
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Reserva tu lugar hoy mismo
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              y prepárate para vivir la experiencia que cambiará tu forma de operar para siempre
            </Typography>
            
            <Box>
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  backgroundColor: alpha('#fff', 0.95),
                  color: 'success.dark',
                  maxWidth: 600,
                  mx: 'auto',
                  border: '2px solid',
                  borderColor: 'success.main',
                  '& .MuiAlert-icon': {
                    color: 'success.main',
                  },
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  CUPO LIMITADO – SOLO PARA TRADERS COMPROMETIDOS
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Esta mentoría es una inversión en tu futuro como trader profesional
                </Typography>
              </Alert>
              
              {/* Remove capacity indicator from this section per request */}
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePurchase}
                  disabled={!isRegistrationEnabled}
                  sx={{
                    backgroundColor: isRegistrationEnabled ? 'white' : 'grey.400',
                    color: isRegistrationEnabled ? 'primary.main' : 'grey.600',
                    fontSize: '1.2rem',
                    py: 2,
                    px: 6,
                    fontWeight: 700,
                    '&:hover': {
                      backgroundColor: isRegistrationEnabled ? 'grey.100' : 'grey.400',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'grey.400',
                      color: 'grey.600',
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
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontSize: '1.2rem',
                    py: 2,
                    px: 4,
                    fontWeight: 700,
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  Gestionar Mi Registro
                </Button>
              </Stack>
            </Box>
            
            <Typography variant="body1" sx={{ mt: 4, opacity: 0.8 }}>
              &quot;Muchos pierden por entrar mal, pero otros pierden por reforzar sin sentido.&quot;<br/>
              &quot;Este módulo te entrena para entrar solo donde hay probabilidad real, no emoción.&quot;
            </Typography>
          </Container>
        </Box>

      </main>
      
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