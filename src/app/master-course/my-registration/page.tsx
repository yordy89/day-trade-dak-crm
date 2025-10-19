'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  LinearProgress,
  Grid,
  useTheme,
  alpha,
  InputBase,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Search,
  Payment,
  CheckCircle,
  Schedule,
  Receipt,
  Email,
  Phone,
  Person,
  ExpandMore,
  ExpandLess,
  Download,
  CreditCard,
  AttachMoney,
  CalendarToday,
  Warning,
  Info,
  ArrowBack,
} from '@mui/icons-material';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';
import { useTheme as useAppTheme } from '@/components/theme/theme-provider';
import { eventService } from '@/services/api/event.service';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Registration {
  id: string;
  registrationNumber?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  eventName: string;
  eventDate?: string;
  totalAmount: number;
  totalPaid: number;
  remainingBalance: number;
  isFullyPaid: boolean;
  paymentMode: 'full' | 'partial';
  createdAt: string;
}

interface PaymentHistory {
  paymentId: string;
  amount: number;
  type: string;
  status: string;
  processedAt: string;
  description?: string;
  receiptUrl?: string;
}

export default function MyRegistrationPage() {
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  const router = useRouter();

  console.log('Dark mode:', isDarkMode);

  const [searchData, setSearchData] = useState({
    email: '',
    registrationId: '',
  });

  const [masterCourseEventId, setMasterCourseEventId] = useState<string | null>(null);

  // Load the current Master Course event on mount
  useEffect(() => {
    const loadMasterCourseEvent = async () => {
      try {
        const eventsResponse = await eventService.getEvents({ isActive: true });
        const masterCourseEvents = eventsResponse.data.filter(
          (e: any) => e.type === 'master_course' && e.isActive
        );
        const featuredEvent = masterCourseEvents.find((e: any) => e.featuredInCRM) || masterCourseEvents[0];

        if (featuredEvent) {
          setMasterCourseEventId(featuredEvent._id);
          console.log('Master Course Event ID:', featuredEvent._id);
        }
      } catch (error) {
        console.error('Error loading Master Course event:', error);
      }
    };

    loadMasterCourseEvent();
  }, []);

  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [eventSettings, setEventSettings] = useState<any>(null);

  const MINIMUM_PAYMENT = eventSettings?.minimumInstallmentAmount || 50;

  // Check if this is a final payment scenario (remaining < minimum)
  const isFinalPayment = useMemo(() => {
    if (!registration) return false;
    const remainingBalance = parseFloat(registration.remainingBalance.toFixed(2));
    return remainingBalance < MINIMUM_PAYMENT;
  }, [registration, MINIMUM_PAYMENT]);

  // Auto-set payment amount to remaining balance when it's a final payment
  useEffect(() => {
    if (registration && isFinalPayment) {
      const remainingBalance = parseFloat(registration.remainingBalance.toFixed(2));
      setPaymentAmount(remainingBalance);
    }
  }, [registration, isFinalPayment]);

  const handleSearch = async () => {
    // Validate that at least one field is filled
    if (!searchData.email && !searchData.registrationId) {
      toast.error('Por favor ingresa tu correo electrónico o número de registro');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      // Build search params - prioritize eventId over eventType for accuracy
      const searchParams: any = {
        email: searchData.email || undefined,
        registrationId: searchData.registrationId || undefined,
      };

      // If we have the Master Course event ID, search by specific event
      if (masterCourseEventId) {
        searchParams.eventId = masterCourseEventId;
        console.log('Searching for registrations with eventId:', masterCourseEventId);
      } else {
        // Fallback to eventType if event ID not loaded yet
        searchParams.eventType = 'master_course';
        console.log('Searching for registrations with eventType: master_course');
      }

      console.log('Sending search request with params:', searchParams);
      const response = await eventService.searchRegistrations(searchParams);
      console.log('Search response:', response);
      console.log('Response length:', response?.length);

      if (response && response.length > 0) {
        console.log('Found registrations:', response);
        // Get the first matching Master Course registration
        const reg = response[0];
        console.log('Selected registration:', reg);
        setRegistration(reg);

        // If we have a registration ID, fetch payment history
        if (reg.id) {
          const balanceData = await eventService.getRegistrationBalance(reg.id);
          console.log('Balance Data:', balanceData);
          console.log('Payment History:', balanceData.paymentHistory);
          setPaymentHistory(balanceData.paymentHistory || []);

          // Also fetch the event to get minimum payment settings
          if (reg.eventId || masterCourseEventId) {
            try {
              const eventData = await eventService.getEvent(reg.eventId || masterCourseEventId);
              setEventSettings(eventData);
              console.log('Event Settings:', {
                minimumInstallmentAmount: eventData.minimumInstallmentAmount,
              });
            } catch (error) {
              console.error('Error loading event settings:', error);
            }
          }
        }

        toast.success('Registro encontrado');
      } else {
        console.warn('No registrations found for params:', searchParams);
        toast.error('No se encontró ningún registro con esos datos');
        setRegistration(null);
        setPaymentHistory([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error al buscar el registro');
    } finally {
      setIsSearching(false);
    }
  };

  const handleMakePayment = async () => {
    if (!registration || !paymentAmount) {
      toast.error('Por favor ingresa un monto válido');
      return;
    }

    // Use rounded values to avoid floating point precision issues
    const roundedAmount = parseFloat(paymentAmount.toFixed(2));
    const roundedBalance = parseFloat(registration.remainingBalance.toFixed(2));

    // BUSINESS RULE:
    // If remaining balance < minimum: Must pay exact remaining amount
    // If remaining balance >= minimum: Can pay from minimum to remaining
    if (isFinalPayment) {
      // Final payment - must pay exact amount
      if (roundedAmount !== roundedBalance) {
        toast.error(`Debes pagar el saldo restante completo de $${roundedBalance.toFixed(2)}`);
        return;
      }
    } else {
      // Regular partial payment - validate minimum and maximum
      if (paymentAmount < MINIMUM_PAYMENT) {
        toast.error(`El monto mínimo de pago es $${MINIMUM_PAYMENT.toFixed(2)} USD`);
        return;
      }

      if (roundedAmount > roundedBalance) {
        toast.error(`El monto no puede exceder el balance restante de $${roundedBalance.toFixed(2)}`);
        return;
      }
    }

    setIsLoadingPayment(true);
    try {
      const response = await eventService.makePartialPayment(registration.id, {
        amount: paymentAmount,
        paymentMethod: 'card',
        description: 'Pago adicional',
      });

      if (response.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error('No se recibió URL de pago');
      }
    } catch (error: any) {
      console.error('Payment error:', error);

      // Show actual error message from API
      const errorMessage = error?.message || error?.response?.data?.message || error?.toString();

      if (errorMessage && errorMessage.includes('Minimum payment amount')) {
        // Extract the minimum amount from error message
        toast.error(errorMessage);
      } else if (errorMessage && errorMessage.includes('exceeds remaining balance')) {
        toast.error(errorMessage);
      } else if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error('Error al procesar el pago');
      }
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const calculateProgress = () => {
    if (!registration) return 0;
    return (registration.totalPaid / registration.totalAmount) * 100;
  };

  return (
    <>
      <MainNavbar />

      <Box sx={{ pt: { xs: 12, md: 14 }, minHeight: '100vh', bgcolor: isDarkMode ? '#0a0a0a' : '#f9fafb' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/master-course')}
            sx={{
              mb: 3,
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            Volver al Master Course
          </Button>

          <Typography variant="h3" fontWeight={700} gutterBottom align="center">
            Mi Registro - Master Course
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
            Consulta el estado de tu registro y realiza pagos adicionales
          </Typography>

          {/* Search Section */}
          <Card
            sx={{
              mb: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Search sx={{ fontSize: 32, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Buscar mi registro
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ingresa cualquiera de los siguientes datos para encontrar tu registro
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)' }}>
                      Correo electrónico
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)',
                        borderRadius: 2,
                        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: '#16a34a',
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)',
                        },
                        '&:focus-within': {
                          borderColor: '#16a34a',
                          borderWidth: 1,
                        },
                      }}
                    >
                      <Email sx={{ ml: 1.5, mr: 1, color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }} />
                      <InputBase
                        fullWidth
                        placeholder="tu@email.com"
                        value={searchData.email}
                        onChange={(e) => setSearchData({ ...searchData, email: e.target.value })}
                        sx={{
                          flex: 1,
                          py: 1.25,
                          pr: 2,
                          fontSize: '15px',
                          fontWeight: 400,
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
                          '& input': {
                            padding: '0 0 0 8px',
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
                            backgroundColor: 'transparent',
                            '&::placeholder': {
                              color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)' }}>
                      Número de registro
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)',
                        borderRadius: 2,
                        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: '#16a34a',
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)',
                        },
                        '&:focus-within': {
                          borderColor: '#16a34a',
                          borderWidth: 1,
                        },
                      }}
                    >
                      <Receipt sx={{ ml: 1.5, mr: 1, color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }} />
                      <InputBase
                        fullWidth
                        placeholder="REG-20251019-A1B2C"
                        value={searchData.registrationId}
                        onChange={(e) => setSearchData({ ...searchData, registrationId: e.target.value.toUpperCase() })}
                        sx={{
                          flex: 1,
                          py: 1.25,
                          pr: 2,
                          fontSize: '15px',
                          fontWeight: 400,
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
                          '& input': {
                            padding: '0 0 0 8px',
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
                            backgroundColor: 'transparent',
                            '&::placeholder': {
                              color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={isSearching ? <CircularProgress size={20} color="inherit" /> : <Search />}
                  onClick={handleSearch}
                  disabled={isSearching}
                  fullWidth
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    boxShadow: '0 8px 24px rgba(22, 163, 74, 0.25)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                      boxShadow: '0 12px 32px rgba(22, 163, 74, 0.35)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                  }}
                >
                  {isSearching ? 'Buscando...' : 'Buscar Registro'}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Registration Details */}
          {registration && (
            <>
              {/* Personal Information */}
              <Card
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Person sx={{ fontSize: 32, color: 'primary.main' }} />
                      <Typography variant="h5" fontWeight={700}>
                        Información del Registro
                      </Typography>
                    </Stack>
                    <Chip
                      label={registration.isFullyPaid ? 'Pagado Completo' : 'Pago Parcial'}
                      color={registration.isFullyPaid ? 'success' : 'warning'}
                      icon={registration.isFullyPaid ? <CheckCircle /> : <Schedule />}
                      sx={{ px: 1, fontWeight: 600 }}
                    />
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Person />
                          </ListItemIcon>
                          <ListItemText
                            primary="Nombre completo"
                            secondary={`${registration.firstName} ${registration.lastName}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Email />
                          </ListItemIcon>
                          <ListItemText primary="Correo electrónico" secondary={registration.email} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Phone />
                          </ListItemIcon>
                          <ListItemText primary="Teléfono" secondary={registration.phoneNumber} />
                        </ListItem>
                      </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Receipt />
                          </ListItemIcon>
                          <ListItemText
                            primary="Número de registro"
                            secondary={registration.registrationNumber || registration.id}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CalendarToday />
                          </ListItemIcon>
                          <ListItemText
                            primary="Fecha de registro"
                            secondary={formatDate(registration.createdAt)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Info />
                          </ListItemIcon>
                          <ListItemText primary="Evento" secondary={registration.eventName} />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  border: `1px solid ${alpha(registration.isFullyPaid ? theme.palette.success.main : theme.palette.warning.main, 0.2)}`,
                  boxShadow: `0 4px 20px ${alpha(registration.isFullyPaid ? theme.palette.success.main : theme.palette.warning.main, 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Payment sx={{ fontSize: 32, color: registration.isFullyPaid ? 'success.main' : 'warning.main' }} />
                    <Typography variant="h5" fontWeight={700}>
                      Resumen de Pagos
                    </Typography>
                  </Stack>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progreso del pago
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {calculateProgress().toFixed(0)}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={calculateProgress()}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: registration.isFullyPaid
                            ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                            : 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                        },
                      }}
                    />
                  </Box>

                  <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>Precio total:</Typography>
                        <Typography fontWeight={600}>{formatCurrency(registration.totalAmount)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>Total pagado:</Typography>
                        <Typography fontWeight={600} color="success.main">
                          {formatCurrency(registration.totalPaid)}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight={600}>Balance restante:</Typography>
                        <Typography fontWeight={700} color="primary" variant="h6">
                          {formatCurrency(registration.remainingBalance)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  {!registration.isFullyPaid && (
                    <Alert severity="info" sx={{ mt: 3 }}>
                      <Typography variant="body2">
                        Tienes un balance pendiente de {formatCurrency(registration.remainingBalance)}.
                        Puedes realizar el pago en cualquier momento antes del evento.
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Make Additional Payment */}
              {!registration.isFullyPaid && (
                <Card
                  sx={{
                    mb: 4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    borderRadius: 3,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.success.main, 0.1)}`,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                      <CreditCard sx={{ fontSize: 32, color: 'success.main' }} />
                      <Box>
                        <Typography variant="h5" fontWeight={700}>
                          Realizar Pago Adicional
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reduce tu saldo pendiente con un pago seguro
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)' }}>
                          Monto a pagar
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: isFinalPayment
                              ? (isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)')
                              : (isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)'),
                            borderRadius: 2,
                            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                            transition: 'all 0.3s',
                            opacity: isFinalPayment ? 0.7 : 1,
                            '&:hover': {
                              borderColor: isFinalPayment ? (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : '#16a34a',
                              backgroundColor: isFinalPayment
                                ? (isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)')
                                : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'),
                            },
                            '&:focus-within': {
                              borderColor: isFinalPayment ? (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : '#16a34a',
                              borderWidth: 1,
                            },
                          }}
                        >
                          <AttachMoney sx={{ ml: 1.5, mr: 0.5, color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }} />
                          <InputBase
                            fullWidth
                            type="number"
                            placeholder="0.00"
                            value={paymentAmount || ''}
                            onChange={(e) => {
                              if (!isFinalPayment) {
                                const value = parseFloat(e.target.value);
                                // Round to 2 decimal places
                                setPaymentAmount(isNaN(value) ? 0 : parseFloat(value.toFixed(2)));
                              }
                            }}
                            disabled={isFinalPayment}
                            inputProps={{
                              step: '0.01',
                              min: isFinalPayment ? registration.remainingBalance : MINIMUM_PAYMENT,
                              max: registration.remainingBalance,
                              readOnly: isFinalPayment,
                            }}
                            sx={{
                              flex: 1,
                              py: 1.25,
                              pr: 2,
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
                              cursor: isFinalPayment ? 'not-allowed' : 'text',
                              '& input': {
                                padding: '0 0 0 8px',
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
                                backgroundColor: 'transparent',
                                cursor: isFinalPayment ? 'not-allowed' : 'text',
                                '&::placeholder': {
                                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                                  opacity: 1,
                                },
                              },
                            }}
                          />
                        </Box>
                        {isFinalPayment ? (
                          <Alert severity="info" sx={{ mt: 1 }}>
                            <Typography variant="caption">
                              Este es tu pago final. Debes pagar el saldo restante completo: {formatCurrency(registration.remainingBalance)}
                            </Typography>
                          </Alert>
                        ) : (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            Mínimo: ${MINIMUM_PAYMENT.toFixed(2)} | Máximo: {formatCurrency(registration.remainingBalance)}
                          </Typography>
                        )}
                      </Box>

                      {!isFinalPayment && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Montos rápidos:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Button
                              size="medium"
                              variant={paymentAmount === parseFloat(Math.min(100, registration.remainingBalance).toFixed(2)) ? 'contained' : 'outlined'}
                              onClick={() => setPaymentAmount(parseFloat(Math.min(100, registration.remainingBalance).toFixed(2)))}
                              sx={{
                                borderRadius: 2,
                                px: 2,
                                background: paymentAmount === Math.min(100, registration.remainingBalance)
                                  ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                                  : 'transparent',
                                '&:hover': {
                                  background: paymentAmount === Math.min(100, registration.remainingBalance)
                                    ? 'linear-gradient(135deg, #15803d 0%, #14532d 100%)'
                                    : alpha(theme.palette.primary.main, 0.08),
                                },
                              }}
                            >
                              $100
                            </Button>
                            <Button
                              size="medium"
                              variant={paymentAmount === Math.min(200, registration.remainingBalance) ? 'contained' : 'outlined'}
                              onClick={() => setPaymentAmount(parseFloat(Math.min(200, registration.remainingBalance).toFixed(2)))}
                              sx={{
                                borderRadius: 2,
                                px: 2,
                                background: paymentAmount === Math.min(200, registration.remainingBalance)
                                  ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                                  : 'transparent',
                                '&:hover': {
                                  background: paymentAmount === Math.min(200, registration.remainingBalance)
                                    ? 'linear-gradient(135deg, #15803d 0%, #14532d 100%)'
                                    : alpha(theme.palette.primary.main, 0.08),
                                },
                              }}
                            >
                              $200
                            </Button>
                            <Button
                              size="medium"
                              variant={paymentAmount === Math.min(500, registration.remainingBalance) ? 'contained' : 'outlined'}
                              onClick={() => setPaymentAmount(parseFloat(Math.min(500, registration.remainingBalance).toFixed(2)))}
                              sx={{
                                borderRadius: 2,
                                px: 2,
                                background: paymentAmount === Math.min(500, registration.remainingBalance)
                                  ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                                  : 'transparent',
                                '&:hover': {
                                  background: paymentAmount === Math.min(500, registration.remainingBalance)
                                    ? 'linear-gradient(135deg, #15803d 0%, #14532d 100%)'
                                    : alpha(theme.palette.primary.main, 0.08),
                                },
                              }}
                            >
                              $500
                            </Button>
                            <Button
                              size="medium"
                              variant={paymentAmount === parseFloat(registration.remainingBalance.toFixed(2)) ? 'contained' : 'outlined'}
                              onClick={() => setPaymentAmount(parseFloat(registration.remainingBalance.toFixed(2)))}
                              sx={{
                                borderRadius: 2,
                                px: 2,
                                background: paymentAmount === parseFloat(registration.remainingBalance.toFixed(2))
                                  ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
                                  : 'transparent',
                                borderColor: paymentAmount === parseFloat(registration.remainingBalance.toFixed(2)) ? '#f59e0b' : 'divider',
                                color: paymentAmount === parseFloat(registration.remainingBalance.toFixed(2)) ? 'white' : 'text.primary',
                                '&:hover': {
                                  background: paymentAmount === parseFloat(registration.remainingBalance.toFixed(2))
                                    ? 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)'
                                    : alpha('#f59e0b', 0.08),
                                  borderColor: '#f59e0b',
                                },
                              }}
                            >
                              Pagar Todo (${registration.remainingBalance.toFixed(2)})
                            </Button>
                          </Stack>
                        </Box>
                      )}

                      <Button
                        variant="contained"
                        size="large"
                        startIcon={isLoadingPayment ? <CircularProgress size={20} color="inherit" /> : <CreditCard />}
                        onClick={handleMakePayment}
                        disabled={isLoadingPayment || paymentAmount === 0}
                        fullWidth
                        sx={{
                          py: 2.5,
                          borderRadius: 2,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          background: isFinalPayment
                            ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
                            : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                          boxShadow: isFinalPayment
                            ? '0 8px 24px rgba(245, 158, 11, 0.25)'
                            : '0 8px 24px rgba(22, 163, 74, 0.25)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: isFinalPayment
                              ? 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)'
                              : 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                            boxShadow: isFinalPayment
                              ? '0 12px 32px rgba(245, 158, 11, 0.35)'
                              : '0 12px 32px rgba(22, 163, 74, 0.35)',
                            transform: 'translateY(-2px)',
                          },
                          '&:disabled': {
                            opacity: 0.6,
                            background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                          },
                        }}
                      >
                        {isLoadingPayment
                          ? 'Procesando...'
                          : isFinalPayment
                          ? `Completar Pago Final (${formatCurrency(paymentAmount || 0)})`
                          : `Pagar ${formatCurrency(paymentAmount || 0)}`}
                      </Button>

                      {!isFinalPayment && paymentAmount > 0 && paymentAmount < MINIMUM_PAYMENT && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          El monto mínimo de pago es ${MINIMUM_PAYMENT.toFixed(2)} USD
                        </Alert>
                      )}
                      {!isFinalPayment && parseFloat(paymentAmount.toFixed(2)) > parseFloat(registration.remainingBalance.toFixed(2)) && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                          El monto no puede exceder el balance restante de {formatCurrency(registration.remainingBalance)}
                        </Alert>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Payment History */}
              <Card
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  boxShadow: `0 4px 20px ${alpha(theme.palette.info.main, 0.08)}`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: showPaymentHistory ? 3 : 0 }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Receipt sx={{ fontSize: 32, color: 'info.main' }} />
                      <Typography variant="h5" fontWeight={700}>
                        Historial de Pagos
                      </Typography>
                    </Stack>
                    <IconButton
                      onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                      sx={{
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.info.main, 0.2),
                        },
                      }}
                    >
                      {showPaymentHistory ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Stack>

                  <Collapse in={showPaymentHistory}>
                    {paymentHistory.length > 0 ? (
                      <Timeline position="alternate">
                        {paymentHistory.map((payment, index) => (
                          <TimelineItem key={payment.paymentId}>
                            <TimelineOppositeContent color="text.secondary">
                              {payment.processedAt ? formatDate(payment.processedAt) : 'Pendiente'}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                              <TimelineDot
                                color={payment.status === 'completed' ? 'success' : payment.status === 'pending' ? 'warning' : 'error'}
                              >
                                <Payment />
                              </TimelineDot>
                              {index < paymentHistory.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                              <Paper
                                sx={{
                                  p: 2,
                                  border: `1px solid ${
                                    payment.status === 'completed'
                                      ? alpha(theme.palette.success.main, 0.3)
                                      : payment.status === 'pending'
                                      ? alpha(theme.palette.warning.main, 0.3)
                                      : alpha(theme.palette.error.main, 0.3)
                                  }`,
                                  backgroundColor:
                                    payment.status === 'completed'
                                      ? alpha(theme.palette.success.main, 0.05)
                                      : payment.status === 'pending'
                                      ? alpha(theme.palette.warning.main, 0.05)
                                      : alpha(theme.palette.error.main, 0.05),
                                }}
                              >
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                  <Typography fontWeight={600}>{formatCurrency(payment.amount)}</Typography>
                                  <Chip
                                    label={payment.status === 'completed' ? 'Completado' : payment.status === 'pending' ? 'Pendiente' : 'Fallido'}
                                    color={payment.status === 'completed' ? 'success' : payment.status === 'pending' ? 'warning' : 'error'}
                                    size="small"
                                  />
                                </Stack>
                                <Typography variant="caption" color="text.secondary">
                                  {payment.description || payment.type}
                                </Typography>
                                {payment.status === 'pending' && (
                                  <Alert severity="info" sx={{ mt: 1.5 }}>
                                    <Typography variant="caption">
                                      Este pago está pendiente de confirmación. Completa el proceso de pago en Stripe.
                                    </Typography>
                                  </Alert>
                                )}
                                {payment.receiptUrl && payment.status === 'completed' && (
                                  <Box sx={{ mt: 1 }}>
                                    <Button
                                      size="small"
                                      startIcon={<Download />}
                                      href={payment.receiptUrl}
                                      target="_blank"
                                    >
                                      Descargar recibo
                                    </Button>
                                  </Box>
                                )}
                              </Paper>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    ) : (
                      <Alert severity="info">No hay historial de pagos disponible</Alert>
                    )}
                  </Collapse>
                </CardContent>
              </Card>
            </>
          )}

          {/* No Registration Found */}
          {hasSearched && !isSearching && !registration && (
            <Alert severity="warning" sx={{ mt: 4 }}>
              <Typography variant="body1" fontWeight={600} gutterBottom>
                No se encontró ningún registro
              </Typography>
              <Typography variant="body2">
                Verifica que los datos ingresados sean correctos. Si necesitas ayuda, contacta a nuestro equipo de soporte.
              </Typography>
            </Alert>
          )}
        </Container>
      </Box>

      <ProfessionalFooter />
    </>
  );
}