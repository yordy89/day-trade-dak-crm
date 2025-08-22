'use client';

import React, { useEffect, useState } from 'react';
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
  Avatar,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import { 
  CheckCircleOutline, 
  CalendarToday, 
  LocationOn,
  Email,
  WhatsApp,
  Home,
  School,
  Groups,
  EmojiEvents,
  LiveTv,
  TrendingUp,
  Psychology,
  ShowChart,
  MenuBook,
  CardMembership,
  EventAvailable,
  AccessTime,
  Download,
  VideoLibrary
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';

export default function MasterCourseSuccessPage() {
  const router = useRouter();
  const theme = useTheme();
  const { i18n } = useTranslation();
  const isSpanish = i18n.language === 'es';
  const [isLoading, setIsLoading] = useState(false);

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

  const courseDetails = {
    name: isSpanish ? 'Curso Intensivo de Trading 2025' : 'Master Trading Course 2025',
    duration: isSpanish ? '3 Días Intensivos + 2.5 Meses de Práctica' : '3 Intensive Days + 2.5 Months of Practice',
    startDate: isSpanish ? '26 de Septiembre, 2025' : 'September 26, 2025',
    endDate: isSpanish ? '13 de Diciembre, 2025' : 'December 13, 2025',
    liveTrainingDates: isSpanish ? '11-13 de Octubre, 2025' : 'October 11-13, 2025',
    location: 'Tampa, Florida',
    venue: 'Tampa, Florida',
    format: isSpanish ? 'Online (15 días) + Presencial (3 días) + Práctica Supervisada (2 meses)' : 'Online (15 days) + In-Person (3 days) + Supervised Practice (2 months)',
  };

  const coursePhases = [
    {
      phase: isSpanish ? 'Fase 1: Aprendizaje Online' : 'Phase 1: Online Learning',
      duration: isSpanish ? '15 días antes del presencial' : '15 days before in-person',
      dates: isSpanish ? '26 Sep - 10 Oct' : 'Sep 26 - Oct 10',
      icon: <VideoLibrary />,
      description: isSpanish 
        ? '8 lecciones en video + 4 mentorías vía Zoom'
        : '8 video lessons + 4 Zoom mentorships',
      color: '#16a34a'
    },
    {
      phase: isSpanish ? 'Fase 2: Entrenamiento Presencial' : 'Phase 2: In-Person Training',
      duration: isSpanish ? '3 Días Intensivos' : '3 Intensive Days',
      dates: isSpanish ? '11-13 Oct 2025' : 'Oct 11-13, 2025',
      icon: <Groups />,
      description: isSpanish 
        ? 'Sábado, Domingo y Lunes en Tampa - Trading en vivo con capital real'
        : 'Saturday, Sunday and Monday in Tampa - Live trading with real capital',
      color: '#3b82f6'
    },
    {
      phase: isSpanish ? 'Fase 3: Práctica Supervisada' : 'Phase 3: Supervised Practice',
      duration: isSpanish ? '2 Meses (100% Online)' : '2 Months (100% Online)',
      dates: isSpanish ? '14 Oct - 13 Dic' : 'Oct 14 - Dec 13',
      icon: <TrendingUp />,
      description: isSpanish 
        ? 'Lunes a Viernes: Trading en vivo + 16 mentorías (8 técnicas + 8 psicotrading)'
        : 'Monday to Friday: Live trading + 16 mentorships (8 technical + 8 psycho-trading)',
      color: '#f59e0b'
    }
  ];

  const courseHighlights = [
    { 
      title: isSpanish ? '8 Módulos Especializados' : '8 Specialized Modules',
      description: isSpanish ? 'Contenido estructurado y práctico' : 'Structured and practical content',
      icon: <VideoLibrary />
    },
    { 
      title: isSpanish ? 'Trading en vivo' : 'Live Trading',
      description: isSpanish ? 'Opera con capital real junto a profesionales' : 'Trade with real capital alongside professionals',
      icon: <LiveTv />
    },
    { 
      title: isSpanish ? '12+ Sesiones de Mentoría' : '12+ Mentorship Sessions',
      description: isSpanish ? '4 preparatorias + 8 técnicas + 8 psicotrading' : '4 preparatory + 8 technical + 8 psycho-trading',
      icon: <Psychology />
    },
    { 
      title: isSpanish ? 'Certificación Profesional' : 'Professional Certification',
      description: isSpanish ? 'Certificado de Trading Profesional al completar' : 'Professional Trading Certificate upon completion',
      icon: <CardMembership />
    },
  ];

  const nextSteps = [
    {
      title: isSpanish ? 'Revisa tu email' : 'Check your email',
      description: isSpanish 
        ? 'Te enviamos los detalles de acceso y el material de bienvenida'
        : 'We sent you access details and welcome materials',
      icon: <Email />
    },
    {
      title: isSpanish ? 'Únete al grupo de WhatsApp' : 'Join WhatsApp Group',
      description: isSpanish 
        ? 'El link está en tu email de confirmación'
        : 'The link is in your confirmation email',
      icon: <WhatsApp />
    },
    {
      title: isSpanish ? 'Descarga el syllabus' : 'Download the syllabus',
      description: isSpanish 
        ? 'PDF completo con el programa detallado'
        : 'Complete PDF with detailed program',
      icon: <Download />
    },
    {
      title: isSpanish ? 'Marca tu calendario' : 'Mark your calendar',
      description: isSpanish 
        ? 'Primera sesión: 26 de Septiembre, 2025 a las 7:00 PM EST'
        : 'First session: September 26, 2025 at 7:00 PM EST',
      icon: <CalendarToday />
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <div className="min-h-screen">
      <MainNavbar />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 4, sm: 6, md: 8 }, pt: { xs: 12, sm: 14, md: 16 } }}>
        <Container maxWidth="lg">
          {/* Success Header */}
          <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
            <CheckCircleOutline 
              sx={{ 
                fontSize: { xs: 60, sm: 70, md: 80 }, 
                color: 'success.main',
                mb: 2
              }} 
            />
            <Typography 
              variant="h3" 
              gutterBottom 
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
            >
              {isSpanish ? '¡Registro Exitoso!' : 'Registration Successful!'}
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              mb={2}
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}
            >
              {isSpanish ? 'Bienvenido al Curso Intensivo de Trading 2025' : 'Welcome to Master Trading Course 2025'}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.95rem', sm: '1rem' }, px: { xs: 2, sm: 0 } }}
            >
              {isSpanish 
                ? 'Tu transformación hacia el trading profesional comienza ahora' 
                : 'Your transformation to professional trading starts now'}
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
              {isSpanish ? '📧 Revisa tu correo electrónico' : '📧 Check your email'}
            </Typography>
            <Typography variant="body2">
              {isSpanish 
                ? 'Te hemos enviado toda la información del curso, incluyendo las credenciales de acceso a la plataforma, el syllabus completo y el link al grupo exclusivo de WhatsApp.'
                : 'We\'ve sent you all course information, including platform access credentials, complete syllabus, and the exclusive WhatsApp group link.'}
            </Typography>
          </Alert>

          <Grid container spacing={4}>
            {/* Course Details */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: { xs: 3, sm: 4 }, mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'primary.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {isSpanish ? 'Tu Programa de Trading' : 'Your Trading Program'}
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  {/* Start Date */}
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ borderColor: alpha('#16a34a', 0.3) }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                          <CalendarToday sx={{ color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              {isSpanish ? 'Inicio del Curso' : 'Course Start'}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {courseDetails.startDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {isSpanish ? '3 Días + 2.5 Meses' : '3 Days + 2.5 Months'}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Format */}
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ borderColor: alpha('#16a34a', 0.3) }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                          <School sx={{ color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              {isSpanish ? 'Formato' : 'Format'}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {isSpanish ? 'Híbrido' : 'Hybrid'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {isSpanish ? 'Online + Presencial + Práctica' : 'Online + In-Person + Practice'}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Course Phases */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  {isSpanish ? 'Las 3 Fases de Tu Transformación' : 'The 3 Phases of Your Transformation'}
                </Typography>
                {coursePhases.map((phase, index) => (
                  <Paper 
                    key={phase.phase}
                    sx={{ 
                      p: 3, 
                      mb: 2,
                      backgroundColor: alpha(phase.color, 0.05),
                      border: `1px solid ${alpha(phase.color, 0.2)}`
                    }}
                  >
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: phase.color, width: 48, height: 48 }}>
                        {phase.icon}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {phase.phase}
                        </Typography>
                        <Stack direction="row" spacing={2} mb={1}>
                          <Chip 
                            label={phase.duration} 
                            size="small" 
                            sx={{ bgcolor: alpha(phase.color, 0.1), color: phase.color }}
                          />
                          <Chip 
                            label={phase.dates} 
                            size="small" 
                            variant="outlined"
                            sx={{ borderColor: phase.color, color: phase.color }}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {phase.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}

                {/* In-Person Training Location */}
                <Alert 
                  severity="success" 
                  sx={{ 
                    mt: 3,
                    backgroundColor: alpha('#3b82f6', 0.1),
                    '& .MuiAlert-icon': {
                      color: '#3b82f6'
                    }
                  }}
                  icon={<LocationOn />}
                >
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    {isSpanish ? '📍 Entrenamiento Presencial en Tampa' : '📍 In-Person Training in Tampa'}
                  </Typography>
                  <Typography variant="body2">
                    {courseDetails.liveTrainingDates} • {isSpanish ? 'Sábado, Domingo y Lunes' : 'Saturday, Sunday and Monday'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isSpanish 
                      ? '* El alojamiento NO está incluido. Te enviaremos una lista de hoteles recomendados con tarifas especiales.'
                      : '* Accommodation is NOT included. We\'ll send you a list of recommended hotels with special rates.'}
                  </Typography>
                </Alert>
              </Paper>

              {/* What's Included */}
              <Paper sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'primary.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {isSpanish ? 'Lo Que Incluye Tu Inscripción' : 'What Your Enrollment Includes'}
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={2}>
                  {courseHighlights.map((highlight) => (
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
                  <Grid item xs={12} sm={6}>
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
                          <Groups />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {isSpanish ? 'Comunidad Exclusiva' : 'Exclusive Community'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {isSpanish ? 'Grupo privado de WhatsApp y soporte continuo' : 'Private WhatsApp group and continuous support'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                          <MenuBook />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {isSpanish ? 'Libro del Mentor' : "Mentor's Book"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {isSpanish ? 'Libro firmado incluido en el programa' : 'Signed book included in the program'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Next Steps */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {isSpanish ? '✅ Próximos Pasos' : '✅ Next Steps'}
                </Typography>
                <List dense>
                  {nextSteps.map((step, index) => (
                    <ListItem key={step.title}>
                      <ListItemIcon>
                        <CheckCircleOutline color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={step.title}
                        secondary={step.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {/* Important Dates */}
              <Paper sx={{ 
                p: 3, 
                mb: 3,
                backgroundColor: alpha('#f59e0b', 0.05),
                border: `1px solid ${alpha('#f59e0b', 0.2)}`
              }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {isSpanish ? '📅 Fechas Importantes' : '📅 Important Dates'}
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {isSpanish ? 'Primera Sesión Online' : 'First Online Session'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isSpanish ? '26 de Septiembre, 2025 a las 7:00 PM EST' : 'September 26, 2025 at 7:00 PM EST'}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {isSpanish ? 'Entrenamiento Presencial' : 'In-Person Training'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {courseDetails.liveTrainingDates}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tampa, Florida
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {isSpanish ? 'Graduación' : 'Graduation'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isSpanish ? '13 de Diciembre, 2025' : 'December 13, 2025'}
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
                    ? 'Tu mentor está aquí para apoyarte'
                    : 'Your mentor is here to support you'}
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

          {/* Action Buttons */}
          <Box mt={{ xs: 4, md: 6 }} textAlign="center">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                startIcon={<Home />}
                onClick={() => router.push('/')}
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  },
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.95rem', sm: '1rem' }
                }}
              >
                {isSpanish ? 'Ir al Inicio' : 'Go to Home'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<School />}
                onClick={() => router.push('/academy/overview')}
                sx={{
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.95rem', sm: '1rem' }
                }}
              >
                {isSpanish ? 'Ir a la Academia' : 'Go to Academy'}
              </Button>
            </Stack>
          </Box>

          {/* Success Message */}
          <Box mt={{ xs: 4, md: 6 }} textAlign="center" px={{ xs: 2, sm: 0 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              {isSpanish 
                ? '¡Felicitaciones por dar este importante paso! 🎉'
                : 'Congratulations on taking this important step! 🎉'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '0.9rem' } }}>
              {isSpanish 
                ? 'Has tomado la mejor decisión para tu futuro financiero. Nos vemos en clase y prepárate para transformar tu vida a través del trading profesional. 🚀'
                : 'You\'ve made the best decision for your financial future. See you in class and get ready to transform your life through professional trading. 🚀'}
            </Typography>
          </Box>
        </Container>
      </Box>
      <ProfessionalFooter />
    </div>
  );
}