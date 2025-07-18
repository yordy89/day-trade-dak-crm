'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CheckCircle,
  Email,
  CalendarToday,
  LocationOn,
  School,
  TrendingUp,
  Download,
  WhatsApp,
  ContentCopy,
  LiveTv,
  Groups,
  Psychology,
  Timer,
  AutoAwesome,
  Celebration,
} from '@mui/icons-material';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useClientAuth } from '@/hooks/use-client-auth';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';
import { eventService } from '@/services/api/event.service';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const { user } = useClientAuth();
  
  const sessionId = searchParams.get('session_id');
  const eventParam = searchParams.get('event');
  
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Trigger confetti animation
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#22c55e', '#4ade80', '#86efac'],
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Verify session with Stripe
  useEffect(() => {
    // For now, we'll skip session verification and show success
    // In production, you should verify the session with Stripe
    setLoading(false);
    
    // Simulate session data for demo purposes
    if (sessionId) {
      setSessionData({
        success: true,
        sessionId: sessionId,
        event: eventParam,
      });
    }
  }, [sessionId, eventParam]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('info@daytradedash.com');
    setCopied(true);
    toast.success('Email copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hola, acabo de inscribirme al Master Course de Trading y me gustaría obtener más información.');
    // Replace with actual WhatsApp number
    const whatsappNumber = '1234567890'; // Add your WhatsApp business number here
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleDownloadReceipt = () => {
    // Implement receipt download functionality
    toast.success('El recibo se enviará a tu correo electrónico');
  };


  // Course timeline data
  const courseTimeline = [
    {
      phase: 'FASE 1',
      title: 'Aprendizaje Online',
      duration: '2 meses',
      icon: <School />,
      color: '#16a34a',
      items: [
        '8 módulos completos de trading',
        '4 mentorías grupales en vivo',
        'Acceso a comunidad exclusiva',
        'Material descargable',
      ],
    },
    {
      phase: 'FASE 2',
      title: 'Entrenamiento Presencial',
      duration: '3 días intensivos',
      icon: <LiveTv />,
      color: '#3b82f6',
      items: [
        'Trading en vivo con mentores',
        'Práctica con capital real',
        'Análisis de mercado en tiempo real',
        'Networking con traders profesionales',
      ],
    },
    {
      phase: 'FASE 3',
      title: 'Práctica Supervisada',
      duration: '2 meses',
      icon: <TrendingUp />,
      color: '#8b5cf6',
      items: [
        'Seguimiento personalizado',
        'Grupo privado de WhatsApp',
        'Sesiones semanales de Q&A',
        'Certificación al completar',
      ],
    },
  ];

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <MainNavbar />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 10, pb: 8 }}>
        <Container maxWidth="lg">
          {/* Success Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            <Box sx={{ display: 'inline-flex', mb: 3 }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)',
                }}
              >
                <CheckCircle sx={{ fontSize: 70, color: 'white' }} />
              </Box>
            </Box>
            
            <Typography variant="h2" fontWeight={800} gutterBottom>
              ¡Felicitaciones! 🎉
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Tu inscripción al Master Course ha sido confirmada
            </Typography>
            
            {user && (
              <Typography variant="body1" color="text.secondary">
                Hemos enviado todos los detalles a <strong>{user.email}</strong>
              </Typography>
            )}
          </MotionBox>

          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid item xs={12} md={8}>
              {/* Next Steps Card */}
              <MotionPaper
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                elevation={0}
                sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Próximos Pasos
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Revisa tu correo electrónico"
                      secondary="Te enviamos las credenciales de acceso y la guía de inicio rápido"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <School color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Accede a la plataforma de aprendizaje"
                      secondary="Comienza con el Módulo 1: Introducción al mercado de valores"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Groups color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Únete a la comunidad"
                      secondary="Conecta con otros estudiantes en nuestro grupo exclusivo"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Agenda tu primera mentoría"
                      secondary="Disponible a partir del 15 de enero de 2025"
                    />
                  </ListItem>
                </List>
              </MotionPaper>

              {/* Course Timeline */}
              <MotionPaper
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Tu Ruta de Aprendizaje
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  4 meses de formación intensiva para convertirte en un trader profesional
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  {courseTimeline.map((phase) => (
                    <Grid item xs={12} md={4} key={phase.phase}>
                      <Card
                        sx={{
                          height: '100%',
                          borderRadius: 2,
                          border: `2px solid ${alpha(phase.color, 0.2)}`,
                          background: alpha(phase.color, 0.05),
                          position: 'relative',
                          overflow: 'visible',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -20,
                            left: 20,
                            width: 50,
                            height: 50,
                            borderRadius: 2,
                            background: phase.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: `0 4px 20px ${alpha(phase.color, 0.4)}`,
                          }}
                        >
                          {phase.icon}
                        </Box>
                        
                        <CardContent sx={{ pt: 5 }}>
                          <Typography variant="overline" sx={{ color: phase.color, fontWeight: 700 }}>
                            {phase.phase}
                          </Typography>
                          <Typography variant="h6" fontWeight={700} gutterBottom>
                            {phase.title}
                          </Typography>
                          <Chip
                            label={phase.duration}
                            size="small"
                            sx={{
                              mb: 2,
                              backgroundColor: alpha(phase.color, 0.1),
                              color: phase.color,
                              fontWeight: 600,
                            }}
                          />
                          <List dense>
                            {phase.items.map((item, idx) => (
                              <ListItem key={idx} sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                  <CheckCircle sx={{ fontSize: 18, color: phase.color }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={item}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </MotionPaper>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Quick Actions */}
              <MotionPaper
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Acciones Rápidas
                </Typography>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<School />}
                    sx={{
                      background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                      },
                    }}
                    onClick={() => router.push('/academy/master-course')}
                  >
                    Ir a Mi Curso
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownloadReceipt}
                  >
                    Descargar Recibo
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<WhatsApp />}
                    color="success"
                    onClick={handleWhatsApp}
                  >
                    Contactar Soporte
                  </Button>
                </Stack>
              </MotionPaper>

              {/* Important Dates */}
              <MotionPaper
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Fechas Importantes
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Inicio del curso online
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      15 de enero de 2025
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Entrenamiento presencial
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      25-27 de octubre de 2025
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      📍 Miami, Florida
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Primera mentoría grupal
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      22 de enero de 2025
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      7:00 PM EST (Zoom)
                    </Typography>
                  </Box>
                </Stack>
              </MotionPaper>

              {/* Contact Support */}
              <MotionPaper
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  ¿Necesitas Ayuda?
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Nuestro equipo está aquí para apoyarte en cada paso de tu journey
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                    onClick={handleCopyEmail}
                  >
                    <Email fontSize="small" color="primary" />
                    <Typography variant="body2">info@daytradedash.com</Typography>
                    <IconButton size="small" sx={{ ml: 'auto' }}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                </Stack>
              </MotionPaper>
            </Grid>
          </Grid>

          {/* Bottom CTA */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            sx={{
              mt: 6,
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              }}
            />
            <AutoAwesome sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              ¡Tu viaje hacia el trading profesional comienza ahora!
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Prepárate para transformar tu futuro financiero
            </Typography>
            <Button
              size="large"
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
              onClick={() => router.push('/academy/master-course')}
            >
              Comenzar Ahora
            </Button>
          </MotionBox>
        </Container>
      </Box>
      <ProfessionalFooter />
    </>
  );
}