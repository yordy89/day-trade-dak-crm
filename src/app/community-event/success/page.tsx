'use client';

import React, { useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Grid,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Stack,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  CheckCircleOutline, 
  CalendarToday, 
  LocationOn,
  Email,
  WhatsApp,
  Home,
  Hotel,
  Restaurant,
  Groups,
  EmojiEvents,
  Celebration,
  Flight,
  EventAvailable,
  AccessTime
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import GoogleMap from '@/components/common/GoogleMap';

export default function CommunityEventSuccessPage() {
  const router = useRouter();
  const theme = useTheme();
  const { i18n } = useTranslation();
  const isSpanish = i18n.language === 'es';

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

    return () => clearTimeout(timer);
  }, []);

  const eventDetails = {
    name: isSpanish ? 'Mentoría Presencial con Mijail Medina' : 'In-Person Mentorship with Mijail Medina',
    date: isSpanish ? '25-27 de Septiembre, 2025' : 'September 25-27, 2025',
    location: 'Tampa, Florida',
    venue: 'Hilton Garden Inn Tampa Ybor Historic District',
    address: '1700 E 9th Ave, Tampa, FL 33605',
    attendees: isSpanish ? 'Cupo Limitado' : 'Limited Spots',
  };

  const eventHighlights = [
    { 
      title: isSpanish ? '3 días de mentoría presencial' : '3 days of in-person mentorship',
      description: isSpanish ? 'Operación en vivo y entrenamiento con Mijail Medina' : 'Live trading and training with Mijail Medina',
      icon: <EmojiEvents />
    },
    { 
      title: isSpanish ? 'Cena especial del sábado' : 'Saturday special dinner',
      description: isSpanish ? 'Evento de networking y celebración con la comunidad' : 'Networking and celebration event with the community',
      icon: <Restaurant />
    },
    { 
      title: isSpanish ? 'Módulo de Psicotrading' : 'Psychotrading Module',
      description: isSpanish ? 'Técnicas mentales para operar con disciplina' : 'Mental techniques for disciplined trading',
      icon: <Groups />
    },
    { 
      title: isSpanish ? 'Material profesional incluido' : 'Professional materials included',
      description: isSpanish ? 'Plantillas para plan de crecimiento y control de riesgo' : 'Templates for growth plan and risk control',
      icon: <EventAvailable />
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        {/* Success Header */}
        <Box textAlign="center" mb={6}>
          <CheckCircleOutline 
            sx={{ 
              fontSize: 80, 
              color: 'success.main',
              mb: 2
            }} 
          />
          <Typography variant="h3" gutterBottom fontWeight="bold">
            {isSpanish ? '¡Registro Exitoso!' : 'Registration Successful!'}
          </Typography>
          <Typography variant="h5" color="text.secondary" mb={2}>
            {isSpanish ? 'Bienvenido al Evento Comunitario DayTradeDak 2025' : 'Welcome to DayTradeDak Community Event 2025'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isSpanish 
              ? 'Prepárate para una experiencia transformadora en el mundo del trading' 
              : 'Get ready for a transformative experience in the world of trading'}
          </Typography>
        </Box>

        {/* Important Information Alert */}
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4,
            backgroundColor: alpha('#16a34a', 0.1),
            color: theme.palette.mode === 'dark' ? 'text.primary' : undefined,
            '& .MuiAlert-icon': {
              color: '#16a34a'
            }
          }}
          icon={<Email />}
        >
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            {isSpanish ? 'Revisa tu correo electrónico' : 'Check your email'}
          </Typography>
          <Typography variant="body2">
            {isSpanish 
              ? 'Te hemos enviado la confirmación de tu registro con todos los detalles del evento y la información de acceso.'
              : 'We\'ve sent you a registration confirmation with all event details and access information.'}
          </Typography>
        </Alert>

        <Grid container spacing={4}>
          {/* Event Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'primary.main' }}>
                {isSpanish ? 'Detalles del Evento' : 'Event Details'}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                {/* Date & Time */}
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ borderColor: alpha('#16a34a', 0.3) }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <CalendarToday sx={{ color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            {isSpanish ? 'Fecha del Evento' : 'Event Date'}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {eventDetails.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {isSpanish ? '3 días inolvidables' : '3 unforgettable days'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Location */}
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ borderColor: alpha('#16a34a', 0.3) }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <LocationOn sx={{ color: 'primary.main' }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            {isSpanish ? 'Ubicación' : 'Location'}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold">
                            {eventDetails.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {eventDetails.venue}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {eventDetails.address}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Event Highlights */}
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                {isSpanish ? 'Lo que incluye tu registro' : 'What your registration includes'}
              </Typography>
              <Grid container spacing={2}>
                {eventHighlights.map((highlight) => (
                  <Grid item xs={12} sm={6} key={highlight.title}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        height: '100%',
                        backgroundColor: alpha('#16a34a', 0.05),
                        border: `1px solid ${alpha('#16a34a', 0.1)}`
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ color: 'primary.main' }}>
                          {highlight.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {highlight.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {highlight.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Map */}
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                {isSpanish ? 'Ubicación del Evento' : 'Event Location'}
              </Typography>
              <GoogleMap 
                location={{ lat: 27.9594, lng: -82.4423 }} // 1700 E 9th Ave, Tampa, FL 33605
                zoom={15}
                height={300}
              />
            </Paper>

            {/* Event Schedule Preview */}
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'primary.main' }}>
                {isSpanish ? 'Agenda del Evento' : 'Event Schedule'}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <List>
                <ListItem sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                  <ListItemIcon>
                    <EventAvailable sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={isSpanish ? 'Día 1: Operación en Vivo & Análisis Técnico' : 'Day 1: Live Trading & Technical Analysis'}
                    secondary={isSpanish ? 'Trading en vivo con el mentor, análisis pre-market' : 'Live trading with mentor, pre-market analysis'}
                  />
                  <Chip 
                    label={isSpanish ? 'Jueves 25' : 'Thursday 25'} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </ListItem>
                <ListItem sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                  <ListItemIcon>
                    <EmojiEvents sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={isSpanish ? 'Día 2: Entradas Profesionales & Gestión de Riesgo' : 'Day 2: Professional Entries & Risk Management'}
                    secondary={isSpanish ? 'Segunda sesión de trading, módulos 2, 3 y 4' : 'Second trading session, modules 2, 3 and 4'}
                  />
                  <Chip 
                    label={isSpanish ? 'Viernes 26' : 'Friday 26'} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </ListItem>
                <ListItem sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                  <ListItemIcon>
                    <Celebration sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={isSpanish ? 'Día 3: Psicotrading & Celebración' : 'Day 3: Psychotrading & Celebration'}
                    secondary={isSpanish ? 'Módulo de psicotrading, actividad recreativa y cena especial' : 'Psychotrading module, recreational activity and special dinner'}
                  />
                  <Chip 
                    label={isSpanish ? 'Sábado 27' : 'Saturday 27'} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Next Steps */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {isSpanish ? 'Próximos Pasos' : 'Next Steps'}
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={isSpanish ? 'Guarda la fecha' : 'Save the date'}
                    secondary={isSpanish ? '25-27 de Septiembre en tu calendario' : 'September 25-27 in your calendar'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={isSpanish ? 'Planifica tu viaje' : 'Plan your trip'}
                    secondary={isSpanish ? 'Reserva vuelo y alojamiento con tiempo' : 'Book flight and accommodation in advance'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={isSpanish ? 'Prepárate para el evento' : 'Prepare for the event'}
                    secondary={isSpanish ? 'Trae laptop y libreta para tomar notas' : 'Bring laptop and notebook for notes'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={isSpanish ? 'Llega temprano el día 1' : 'Arrive early on day 1'}
                    secondary={isSpanish ? 'Check-in a las 8:00 AM el jueves' : 'Check-in at 8:00 AM on Thursday'}
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Travel Info */}
            <Paper sx={{ 
              p: 3, 
              mb: 3,
              backgroundColor: alpha('#16a34a', 0.05),
              border: `1px solid ${alpha('#16a34a', 0.2)}`
            }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {isSpanish ? 'Información de Viaje' : 'Travel Information'}
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Flight sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight={600}>
                      {isSpanish ? 'Aeropuerto Recomendado' : 'Recommended Airport'}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Tampa International Airport (TPA)
                  </Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Hotel sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight={600}>
                      {isSpanish ? 'Hotel del Evento' : 'Event Hotel'}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Hilton Garden Inn Tampa Ybor Historic District
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isSpanish ? '* Alojamiento NO incluido - Solo evento' : '* Accommodation NOT included - Event only'}
                  </Typography>
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTime sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight={600}>
                      {isSpanish ? 'Check-in del Evento' : 'Event Check-in'}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {isSpanish ? 'Jueves, 8:00 AM - 8:30 AM' : 'Thursday, 8:00 AM - 8:30 AM'}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Contact Support */}
            <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                {isSpanish ? '¿Necesitas ayuda?' : 'Need help?'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {isSpanish 
                  ? 'Nuestro equipo de eventos está aquí para ti'
                  : 'Our events team is here for you'}
              </Typography>
              <Stack spacing={2} mt={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WhatsApp />}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  href="https://wa.me/17863551346"
                  target="_blank"
                >
                  WhatsApp Support
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Email />}
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': { 
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)' 
                    }
                  }}
                  href="mailto:support@daytradedak.com"
                >
                  Email Support
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Action Button */}
        <Box mt={6} textAlign="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            onClick={() => router.push('/')}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            {isSpanish ? 'Ir al Inicio' : 'Go to Home'}
          </Button>
        </Box>

        {/* Success Message */}
        <Box mt={6} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {isSpanish 
              ? '¡Nos vemos en Tampa! Prepárate para una experiencia transformadora en el trading 🚀'
              : 'See you in Tampa! Get ready for a transformative trading experience 🚀'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}