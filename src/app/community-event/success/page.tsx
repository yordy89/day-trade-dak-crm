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
    name: isSpanish ? 'El Evento de Trading Más Exclusivo del Año' : 'The Most Exclusive Trading Event of the Year',
    date: isSpanish ? '25-27 de Octubre, 2025' : 'October 25-27, 2025',
    location: 'Miami, Florida',
    venue: 'Miami Beach Convention Center',
    attendees: '200+ Traders',
  };

  const eventHighlights = [
    { 
      title: isSpanish ? 'Trading en Vivo' : 'Live Trading',
      description: isSpanish ? 'Sesiones de trading en tiempo real con expertos' : 'Real-time trading sessions with experts',
      icon: <EmojiEvents />
    },
    { 
      title: isSpanish ? 'Networking Premium' : 'Premium Networking',
      description: isSpanish ? 'Conecta con traders exitosos de todo el mundo' : 'Connect with successful traders worldwide',
      icon: <Groups />
    },
    { 
      title: isSpanish ? 'Cenas Exclusivas' : 'Exclusive Dinners',
      description: isSpanish ? 'Experiencias gastronómicas de alto nivel' : 'High-end dining experiences',
      icon: <Restaurant />
    },
    { 
      title: isSpanish ? 'Alojamiento Incluido' : 'Accommodation Included',
      description: isSpanish ? 'Hotel 5 estrellas durante todo el evento' : '5-star hotel throughout the event',
      icon: <Hotel />
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
              ? 'Te hemos enviado la confirmación de tu registro con todos los detalles del evento, información sobre viajes y alojamiento.'
              : 'We\'ve sent you a registration confirmation with all event details, travel and accommodation information.'}
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
                    primary={isSpanish ? 'Día 1: Bienvenida y Fundamentos' : 'Day 1: Welcome & Fundamentals'}
                    secondary={isSpanish ? 'Check-in, sesión de apertura, cena de bienvenida' : 'Check-in, opening session, welcome dinner'}
                  />
                  <Chip 
                    label={isSpanish ? 'Viernes' : 'Friday'} 
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
                    primary={isSpanish ? 'Día 2: Trading Intensivo' : 'Day 2: Intensive Trading'}
                    secondary={isSpanish ? 'Sesiones en vivo, workshops, networking premium' : 'Live sessions, workshops, premium networking'}
                  />
                  <Chip 
                    label={isSpanish ? 'Sábado' : 'Saturday'} 
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
                    primary={isSpanish ? 'Día 3: Estrategias Avanzadas y Clausura' : 'Day 3: Advanced Strategies & Closing'}
                    secondary={isSpanish ? 'Masterclass especial, panel de expertos, cena de gala' : 'Special masterclass, expert panel, gala dinner'}
                  />
                  <Chip 
                    label={isSpanish ? 'Domingo' : 'Sunday'} 
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
                    primary={isSpanish ? 'Confirma tu asistencia' : 'Confirm your attendance'}
                    secondary={isSpanish ? 'Responde al email de confirmación' : 'Reply to the confirmation email'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={isSpanish ? 'Reserva tu vuelo' : 'Book your flight'}
                    secondary={isSpanish ? 'Te enviamos recomendaciones' : 'We sent you recommendations'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={isSpanish ? 'Únete al grupo VIP' : 'Join the VIP group'}
                    secondary={isSpanish ? 'Link exclusivo en tu email' : 'Exclusive link in your email'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={isSpanish ? 'Prepara tu estrategia' : 'Prepare your strategy'}
                    secondary={isSpanish ? 'Material pre-evento disponible' : 'Pre-event material available'}
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
                    Miami International Airport (MIA)
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
                    The Ritz-Carlton, South Beach
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isSpanish ? '* Habitación incluida en tu registro' : '* Room included in your registration'}
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
                    {isSpanish ? 'Viernes, 3:00 PM - 6:00 PM' : 'Friday, 3:00 PM - 6:00 PM'}
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
                  href="https://wa.me/1234567890"
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
                  href="mailto:events@daytradedak.com"
                >
                  Email Support
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box mt={6} textAlign="center">
          <Stack direction="row" spacing={2} justifyContent="center">
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
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/academy/overview')}
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: alpha('#16a34a', 0.04)
                }
              }}
            >
              {isSpanish ? 'Ver Mi Academia' : 'View My Academy'}
            </Button>
          </Stack>
        </Box>

        {/* Success Message */}
        <Box mt={6} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {isSpanish 
              ? '¡Nos vemos en Miami! Prepárate para una experiencia única 🌴'
              : 'See you in Miami! Get ready for a unique experience 🌴'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}