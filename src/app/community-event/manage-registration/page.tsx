'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import {
  Email,
  Search,
  CalendarToday,
  Person,
  ChildCare,
  Add,
  ArrowBack,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { AddAttendeesModal } from '@/components/events/AddAttendeesModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme as useAppTheme } from '@/components/theme/theme-provider';
import { CustomInput } from '@/components/common/CustomInput';

interface EventRegistration {
  _id: string;
  event: {
    _id: string;
    name: string;
    title: string;
    date: string;
    type: string;
  };
  firstName: string;
  lastName: string;
  email: string;
  additionalInfo?: {
    additionalAttendees?: {
      adults: number;
      children: number;
    };
  };
  amountPaid: number;
  canAddAttendees: boolean;
}

export default function ManageRegistrationPage() {
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);
  const [isAddAttendeesModalOpen, setIsAddAttendeesModalOpen] = useState(false);

  const handleSearch = async () => {
    if (!email?.includes('@')) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(false);

    try {
      // TODO: Replace with actual API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/event-registrations/by-email?email=${encodeURIComponent(email)}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          setRegistrations([]);
          setSearched(true);
          return;
        }
        throw new Error('Error al buscar registros');
      }

      const data = await response.json();
      setRegistrations(data.registrations || []);
      setSearched(true);
    } catch (err) {
      console.error('Error searching registrations:', err);
      setError('Error al buscar tus registros. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttendees = (registration: EventRegistration) => {
    setSelectedRegistration(registration);
    setIsAddAttendeesModalOpen(true);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section with gradient background like community-event */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
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
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, sm: 6, md: 8 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Stack spacing={2} alignItems="center">
              {/* Back button */}
              <Button
                variant="text"
                onClick={() => router.push('/community-event')}
                startIcon={<ArrowBack />}
                sx={{
                  color: 'white',
                  mb: 2,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                Volver al evento
              </Button>
              
              <Typography 
                variant="h3" 
                fontWeight={700} 
                gutterBottom
                sx={{
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                Gestionar Mi Registro
              </Typography>
              <Typography 
                variant="h6" 
                sx={{
                  opacity: 0.9,
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Agrega familiares a tu registro existente
              </Typography>
            </Stack>
          </Box>

          {/* Email Lookup Form */}
          {!searched && (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paper
              elevation={0}
              sx={{
                p: 4,
                maxWidth: 500,
                mx: 'auto',
                backgroundColor: isDarkMode 
                  ? alpha(theme.palette.background.paper, 0.9)
                  : alpha(theme.palette.common.white, 0.95),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                borderRadius: 3,
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
            <Stack spacing={3}>
              <Box textAlign="center">
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    border: `2px solid ${theme.palette.primary.main}`,
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <Email sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                </Avatar>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  fontWeight={700}
                  sx={{ color: isDarkMode ? 'white' : theme.palette.text.primary }}
                >
                  Ingresa tu email
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Buscaremos todos los eventos donde estás registrado
                </Typography>
              </Box>

              <CustomInput
                icon={<Email />}
                label="Email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                required
                error={Boolean(error)}
                helperText={error || undefined}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSearch}
                disabled={loading || !email}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Search />}
                sx={{
                  py: 1.5,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  '&.Mui-disabled': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                  },
                }}
              >
                {loading ? 'Buscando...' : 'Buscar Mis Registros'}
              </Button>
            </Stack>
              </Paper>
            </Box>
          )}

          {/* Registration Results */}
          {searched && (
            <Box sx={{ mt: 4, flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              {/* Search Again Button */}
              <Box mb={4} textAlign="center">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearched(false);
                    setRegistrations([]);
                    setEmail('');
                  }}
                  startIcon={<Search />}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  Buscar con otro email
                </Button>
              </Box>

              {/* No Registrations Found */}
              {registrations.length === 0 && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    maxWidth: 600, 
                    mx: 'auto',
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: 'white',
                    '& .MuiAlert-icon': {
                      color: theme.palette.info.light,
                    },
                  }}
                >
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    No encontramos registros con este email
                  </Typography>
                  <Typography variant="body2">
                    Si te registraste con otro email, por favor búscalo nuevamente.
                  </Typography>
                </Alert>
              )}

              {/* Registration Cards */}
              <Grid container spacing={3}>
                {registrations.map((registration) => (
                  <Grid item xs={12} key={registration._id}>
                    <Card
                      elevation={0}
                      sx={{
                        backgroundColor: isDarkMode 
                          ? alpha(theme.palette.background.paper, 0.9)
                          : alpha(theme.palette.common.white, 0.95),
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 30px 0 rgba(0, 0, 0, 0.4)',
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={3}>
                        {/* Event Info */}
                        <Box>
                          <Typography variant="h5" fontWeight={700} gutterBottom>
                            {registration.event.title || registration.event.name}
                          </Typography>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Chip
                              icon={<CalendarToday sx={{ fontSize: 16 }} />}
                              label={format(new Date(registration.event.date), 'dd \'de\' MMMM, yyyy', { locale: es })}
                              size="small"
                            />
                            {!registration.canAddAttendees && (
                              <Chip
                                label="Evento pasado"
                                size="small"
                                color="default"
                              />
                            )}
                          </Stack>
                        </Box>

                        <Divider />

                        {/* Registration Details */}
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                              REGISTRADO A NOMBRE DE
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {registration.firstName} {registration.lastName}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" color="text.secondary" gutterBottom>
                              INVITADOS ACTUALES
                            </Typography>
                            <Stack direction="row" spacing={2}>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <Person sx={{ fontSize: 20 }} />
                                <Typography variant="body1">
                                  {registration.additionalInfo?.additionalAttendees?.adults || 0} adultos
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <ChildCare sx={{ fontSize: 20 }} />
                                <Typography variant="body1">
                                  {registration.additionalInfo?.additionalAttendees?.children || 0} niños
                                </Typography>
                              </Stack>
                            </Stack>
                          </Grid>
                        </Grid>

                        {/* Action Section */}
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={2}
                          alignItems={{ xs: 'stretch', sm: 'center' }}
                          justifyContent="space-between"
                        >
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              TOTAL PAGADO
                            </Typography>
                            <Typography variant="h6" fontWeight={700} color="primary">
                              {formatPrice(registration.amountPaid)}
                            </Typography>
                          </Box>
                          
                          {registration.canAddAttendees && (
                            <Button
                              variant="contained"
                              startIcon={<Add />}
                              onClick={() => handleAddAttendees(registration)}
                              sx={{ minWidth: 200 }}
                            >
                              Agregar Invitados
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            </Box>
          )}
        </Container>
      </Box>

      {/* Add Attendees Modal */}
      {selectedRegistration && (
        <AddAttendeesModal
          open={isAddAttendeesModalOpen}
          onClose={() => {
            setIsAddAttendeesModalOpen(false);
            setSelectedRegistration(null);
          }}
          registration={selectedRegistration}
          onSuccess={() => {
            setIsAddAttendeesModalOpen(false);
            setSelectedRegistration(null);
            // Refresh registrations
            handleSearch();
          }}
        />
      )}
    </Box>
  );
}