'use client';

import { useEffect, useState } from 'react';
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
  Chip
} from '@mui/material';
import { 
  CheckCircleOutline, 
  CalendarToday, 
  AccessTime,
  School,
  Group,
  TrendingUp,
  Psychology,
  ShowChart,
  Email,
  WhatsApp,
  Home
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

export default function MasterCourseSuccessPage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#22c55e', '#4ade80', '#86efac'],
      });
      setShowConfetti(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const courseModules = [
    { 
      title: 'Fundamentos del Trading', 
      duration: '2 semanas',
      icon: <TrendingUp />
    },
    { 
      title: 'Análisis Técnico Avanzado', 
      duration: '3 semanas',
      icon: <ShowChart />
    },
    { 
      title: 'Psicología del Trading', 
      duration: '2 semanas',
      icon: <Psychology />
    },
    { 
      title: 'Estrategias Profesionales', 
      duration: '3 semanas',
      icon: <School />
    },
    { 
      title: 'Trading en Vivo', 
      duration: '6 semanas',
      icon: <Group />
    }
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
            ¡Registro Exitoso!
          </Typography>
          <Typography variant="h5" color="text.secondary" mb={2}>
            Bienvenido al Master Trading Course 2025
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tu inversión en educación es el primer paso hacia el éxito en el trading
          </Typography>
        </Box>

        {/* Important Information Alert */}
        <Alert 
          severity="info" 
          sx={{ mb: 4 }}
          icon={<Email />}
        >
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Revisa tu correo electrónico
          </Typography>
          <Typography variant="body2">
            Te hemos enviado toda la información del curso, incluyendo el acceso a la plataforma 
            y los detalles para la primera sesión.
          </Typography>
        </Alert>

        <Grid container spacing={4}>
          {/* Course Timeline */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Calendario del Curso
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={3}>
                {/* Start Date */}
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <CalendarToday color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Fecha de Inicio
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          15 de Enero, 2025
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Duration */}
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <AccessTime color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Duración Total
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          4 Meses Intensivos
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Modules */}
                <Typography variant="h6" gutterBottom>
                  Módulos del Curso
                </Typography>
                <List>
                  {courseModules.map((module, index) => (
                    <ListItem key={index} sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 1 }}>
                      <ListItemIcon>
                        {module.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={module.title}
                        secondary={module.duration}
                      />
                      <Chip 
                        label={`Módulo ${index + 1}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </Paper>
          </Grid>

          {/* Next Steps */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Próximos Pasos
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Revisa tu email"
                    secondary="Información de acceso enviada"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Únete al grupo de WhatsApp"
                    secondary="Link en el email"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Descarga el material"
                    secondary="PDF de bienvenida"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutline color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Primera sesión"
                    secondary="15 de Enero, 7:00 PM EST"
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Contact Support */}
            <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                ¿Necesitas ayuda?
              </Typography>
              <Typography variant="body2" gutterBottom>
                Nuestro equipo está aquí para apoyarte
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
                  href="mailto:support@daytradedak.com"
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
            >
              Ir al Inicio
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/login')}
            >
              Acceder a la Plataforma
            </Button>
          </Stack>
        </Box>

        {/* Success Message */}
        <Box mt={6} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Has dado el primer paso hacia tu libertad financiera. 
            ¡Nos vemos en clase! 🚀
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}