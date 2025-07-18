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
  IconButton,
} from '@mui/material';
import {
  CheckCircle,
  Star,
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
  RestaurantMenu,
  Instagram,
  Twitter,
  YouTube,
  LinkedIn,
  Email,
  Phone,
} from '@mui/icons-material';
import { useClientAuth } from '@/hooks/use-client-auth';
import { useTheme as useAppTheme } from '@/components/theme/theme-provider';
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal';
import { eventService } from '@/services/api/event.service';
import axios from 'axios';
import { SubscriptionPlan } from '@/types/user';

export default function CommunityEventPage() {
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  const { user } = useClientAuth();
  const { t: _t } = useTranslation('communityEvent');
  const [isProcessing, _setIsProcessing] = useState(false);
  const [pricing, setPricing] = useState<{ basePrice: number; currency: string } | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [_hasActiveSubscription, _setHasActiveSubscription] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [_isLoadingEvent, _setIsLoadingEvent] = useState(true);

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
      try {
        // First, get all events and find the community event
        const eventsResponse = await eventService.getEvents({ isActive: true });
        const communityEvent = eventsResponse.data.find(
          (e: any) => e.type === 'community_event'
        );
        
        if (communityEvent) {
          setEvent(communityEvent);
          setPricing({ 
            basePrice: communityEvent.price || 599.99, 
            currency: 'usd' 
          });
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
      } finally {
        setIsLoadingPrice(false);
        _setIsLoadingEvent(false);
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const daySchedule = [
    {
      day: 'DÍA 1 - Jueves 25 de Septiembre',
      title: 'Operación en Vivo & Análisis Técnico',
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
        title: 'TARDE - Módulo 1: Análisis Técnico Pre-Market',
        time: '2:00 PM - 5:30 PM',
        activities: [
          'Cómo interpretar el comportamiento del mercado',
          'Identificación de soportes, resistencias, liquidez y volumen',
          'Lectura de gráficos en varias temporalidades',
          'Construcción de un plan de acción diario',
          'Cómo evitar la improvisación con una estructura clara',
          'Ejercicio práctico: Análisis pre-market con feedback en vivo',
        ],
      },
    },
    {
      day: 'DÍA 2 - Viernes 26 de Septiembre',
      title: 'Entradas Profesionales & Gestión de Riesgo',
      icon: <BarChart />,
      color: '#3b82f6',
      morning: {
        title: 'MAÑANA - Segunda Sesión de Trading en Vivo',
        time: '8:30 AM - 12:00 PM',
        activities: [
          'Aplicación práctica de lo aprendido el día anterior',
          'Identificación de nuevas oportunidades en tiempo real',
          'Análisis de correlaciones entre activos',
          'Manejo de posiciones múltiples',
          'Control emocional bajo presión del mercado',
          'Evaluación y ajuste de estrategias en vivo',
        ],
      },
      afternoon: {
        title: 'TARDE - Módulos 2, 3 y 4',
        time: '2:00 PM - 5:30 PM',
        modules: [
          {
            name: 'Módulo 2: Entradas Profesionales',
            content: [
              'Tipos de entrada: ruptura, pullback y rebote',
              'Confirmaciones visuales y contextuales',
              'Lectura del precio y comportamiento del volumen',
              'Cómo filtrar entradas de bajo nivel',
              'Checklist de entrada profesional',
            ],
          },
          {
            name: 'Módulo 3: Gestión de Riesgo',
            content: [
              'Cálculo de riesgo por operación basado en tu capital',
              'Cómo definir el tamaño de posición ideal',
              'Uso correcto del stop loss y take profits',
              'Planificación mensual de crecimiento de cuenta',
            ],
          },
          {
            name: 'Módulo 4: Precisión Bajo Presión',
            content: [
              'Cuándo reforzar una entrada ya abierta',
              'Cómo distinguir entre pullback y nueva oportunidad',
              'Simulación de entradas con feedback en tiempo real',
            ],
          },
        ],
      },
    },
    {
      day: 'DÍA 3 - Sábado 27 de Septiembre',
      title: 'Psicotrading & Celebración',
      icon: <Psychology />,
      color: '#f59e0b',
      morning: {
        title: 'MAÑANA - Módulo Especial: Psicotrading',
        time: '8:30 AM - 12:00 PM',
        activities: [
          'Cómo eliminar el miedo a perder y la ansiedad por ganar',
          'Técnicas mentales para mantener la calma bajo presión',
          'Identificar patrones mentales que sabotean tus trades',
          'Construcción de un ritual mental pre-sesión',
          'Disciplina emocional en entornos de incertidumbre',
          'Ejercicio guiado: Visualización del "Yo Trader" profesional',
        ],
      },
      afternoon: {
        title: 'TARDE - Actividad Recreativa & Cierre',
        time: '2:00 PM - 5:30 PM',
        activities: [
          'Actividad relajante (comida y experiencia grupal)',
          'Conversaciones abiertas con el mentor y compañeros',
          'Círculo de visión: ¿A dónde voy como trader después de esto?',
          'Foto oficial y cierre inspirador',
          'Networking y creación de lazos con la comunidad',
        ],
      },
    },
  ];

  return (
    <>
      {/* Header removed for unique page appearance */}
      <Box sx={{ minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
            color: 'white',
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  <Typography variant="h3" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>
                    ¡ATENCIÓN TRADERS QUE QUIEREN RESULTADOS REALES!
                  </Typography>
                  <Typography variant="h2" fontWeight={800}>
                    Mentoría Presencial con Mijail Medina
                  </Typography>
                  <Typography variant="h4" sx={{ opacity: 0.9 }}>
                    EN VIVO desde Tampa, Florida
                  </Typography>
                  <Typography variant="h5" sx={{ opacity: 0.8, mt: 2 }}>
                    3 días intensivos de inmersión total en el trading profesional
                  </Typography>
                  
                  {/* Event Details */}
                  <Stack spacing={2} sx={{ mt: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LocationOn sx={{ color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight={600}>Tampa, Florida</Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CalendarToday sx={{ color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight={600}>
                        Jueves – Viernes – Sábado. 25, 26, 27 de Septiembre
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Schedule sx={{ color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight={600}>
                        8:30 AM a 12:00 PM (mañanas) | 2:00 PM a 5:30 PM (tardes)
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <School sx={{ color: 'primary.main' }} />
                      <Typography variant="body1" fontWeight={600}>
                        Modalidad: Presencial | Nivel: Avanzado
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handlePurchase}
                      sx={{
                        backgroundColor: 'white',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'grey.100',
                        },
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                      }}
                    >
                      {isProcessing ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <>
                          {isLoadingPrice ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            `RESERVAR MI LUGAR - ${formatPrice(pricing?.basePrice || 599.99)}`
                          )}
                        </>
                      )}
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
                            ¡Opciones de Pago Flexibles Disponibles!
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Paga en 4 cuotas sin intereses con Klarna o en cuotas mensuales con Affirm
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

        {/* Daily Schedule */}
        <Box sx={{ backgroundColor: alpha(theme.palette.background.paper, 0.5), py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" textAlign="center" fontWeight={700} mb={6}>
              Programa Completo de 3 Días
            </Typography>
            <Grid container spacing={4}>
              {daySchedule.map((day) => (
                <Grid item xs={12} key={day.day}>
                  <Accordion 
                    defaultExpanded={day.day === 'DÍA 1 - Jueves 25 de Septiembre'}
                    sx={{
                      backgroundColor: alpha(day.color, 0.05),
                      borderLeft: `4px solid ${day.color}`,
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Stack direction="row" spacing={2} alignItems="center" width="100%">
                        <Avatar sx={{ backgroundColor: day.color, width: 50, height: 50 }}>
                          {day.icon}
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="h5" fontWeight={700} color={day.color}>
                            {day.day}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
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
                              {day.afternoon.modules ? (
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
                              ) : (
                                <List dense>
                                  {day.afternoon.activities.map((activity, idx) => (
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
                              )}
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
                <Stack spacing={3}>
                  <Avatar sx={{ width: 80, height: 80, backgroundColor: 'primary.main', mx: 'auto' }}>
                    <Visibility sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600} textAlign="center">
                    Operación en Vivo
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Verás cómo opera en tiempo real un trader rentable, con pantalla proyectada, 
                    explicando en voz alta su análisis, decisión de entrada, ejecución y manejo emocional.
                  </Typography>
                </Stack>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Stack spacing={3}>
                  <Avatar sx={{ width: 80, height: 80, backgroundColor: 'secondary.main', mx: 'auto' }}>
                    <AttachMoney sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600} textAlign="center">
                    Gestión Profesional
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Construye un sistema que te proteja y te permita escalar tu cuenta de forma estable. 
                    Aprenderás cómo cuidar tu capital, crecerlo y evitar el autosabotaje financiero.
                  </Typography>
                </Stack>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 3 }}>
                <Stack spacing={3}>
                  <Avatar sx={{ width: 80, height: 80, backgroundColor: 'success.main', mx: 'auto' }}>
                    <SelfImprovement sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600} textAlign="center">
                    Psicotrading
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Muchos saben analizar, pero pocos saben controlar sus impulsos. 
                    Este módulo transformador te ayudará a operar desde el enfoque, no desde el miedo.
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
                        Ya estás operando o aprendiendo en serio
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle sx={{ color: 'success.main', fontSize: 30 }} />
                      <Typography variant="h6">
                        Quieres resultados reales, no más teoría sin ejecución
                      </Typography>
                    </Stack>
                  </Paper>
                  <Paper sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle sx={{ color: 'success.main', fontSize: 30 }} />
                      <Typography variant="h6">
                        Estás listo para llevar tu operativa a un nivel profesional
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
            
            <Box textAlign="center" sx={{ mt: 6 }}>
              <Alert severity="info" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
                <Typography variant="body1" fontWeight={600}>
                  Herramienta incluida: Plantilla para plan de crecimiento y control de riesgo
                </Typography>
              </Alert>
              <Typography variant="h5" fontWeight={600} color="primary">
                &quot;Decidir bien bajo presión no es talento, es entrenamiento.&quot;
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
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <Stack spacing={2} textAlign="center">
                  <LocationOn sx={{ fontSize: 80, color: 'primary.main', mx: 'auto' }} />
                  <Typography variant="h4" fontWeight={700}>
                    Tampa, Florida
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Jueves – Viernes – Sábado
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="primary">
                    25, 26, 27 de Septiembre
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hotel 5 estrellas con todas las comodidades incluidas
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Typography variant="h5" fontWeight={600}>
                  ¿Qué Incluye tu Inversión?
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Star sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Hotel 5 estrellas" 
                      secondary="3 noches de alojamiento en habitación de lujo"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><RestaurantMenu sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Todas las comidas incluidas" 
                      secondary="Desayuno, almuerzo y cena gourmet durante los 3 días"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Groups sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Networking exclusivo" 
                      secondary="Conexión con traders serios y el mentor"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CameraAlt sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <ListItemText 
                      primary="Experiencia completa" 
                      secondary="Actividades recreativas y foto oficial del evento"
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
              <Button
                variant="contained"
                size="large"
                onClick={handlePurchase}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  fontSize: '1.2rem',
                  py: 2,
                  px: 6,
                  fontWeight: 700,
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                ASEGURAR MI LUGAR AHORA
              </Button>
            </Box>
            
            <Typography variant="body1" sx={{ mt: 4, opacity: 0.8 }}>
              &quot;Muchos pierden por entrar mal, pero otros pierden por reforzar sin sentido.&quot;<br/>
              &quot;Este módulo te entrena para entrar solo donde hay probabilidad real, no emoción.&quot;
            </Typography>
          </Container>
        </Box>

        {/* Simple Footer */}
        <Box
          component="footer"
          sx={{
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
            py: 6,
            borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {/* Company Info */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={700} gutterBottom color="primary">
                  DayTradeDak
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Tu plataforma de confianza para el trading profesional. 
                  Formación, mentoría y comunidad para traders serios.
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    info@daytradedak.com
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    +1 (555) 123-4567
                  </Typography>
                </Stack>
              </Grid>


              {/* Social Media */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Síguenos
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Únete a nuestra comunidad de traders en las redes sociales
                </Typography>
                <Stack direction="row" spacing={2}>
                  <IconButton
                    component="a"
                    href="https://instagram.com/daytradedak"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  >
                    <Instagram />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://twitter.com/daytradedak"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  >
                    <Twitter />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://youtube.com/@daytradedak"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  >
                    <YouTube />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://linkedin.com/company/daytradedak"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  >
                    <LinkedIn />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>

            {/* Copyright */}
            <Divider sx={{ my: 4 }} />
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} DayTradeDak. Todos los derechos reservados.
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mt: 1 }}
              >
                <Typography
                  component="a"
                  href="/privacy"
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Política de Privacidad
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  •
                </Typography>
                <Typography
                  component="a"
                  href="/terms"
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Términos y Condiciones
                </Typography>
              </Stack>
            </Box>
          </Container>
        </Box>
      </Box>
      
      {/* Event Registration Modal */}
      {event ? (
        <EventRegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          event={event}
          userId={user?._id}
          userEmail={user?.email}
        />
      ) : null}
    </>
  );
}