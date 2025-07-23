'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Close,
  Person,
  ChildCare,
  Add,
  Remove,
  AttachMoney,
  CheckCircle,
  CreditCard,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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

interface AddAttendeesModalProps {
  open: boolean;
  onClose: () => void;
  registration: EventRegistration;
  onSuccess?: () => void;
}

export function AddAttendeesModal({ open, onClose, registration, onSuccess: _onSuccess }: AddAttendeesModalProps) {
  const _router = useRouter();
  const [additionalAdults, setAdditionalAdults] = useState(0);
  const [additionalChildren, setAdditionalChildren] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'klarna'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Pricing
  const ADULT_PRICE = 75;
  const CHILD_PRICE = 48;
  const KLARNA_FEE_PERCENTAGE = 0.0644;

  // Current attendees
  const currentAdults = registration.additionalInfo?.additionalAttendees?.adults || 0;
  const currentChildren = registration.additionalInfo?.additionalAttendees?.children || 0;

  // Calculate prices
  const baseAmount = (additionalAdults * ADULT_PRICE) + (additionalChildren * CHILD_PRICE);
  const klarnaFee = paymentMethod === 'klarna' ? baseAmount * KLARNA_FEE_PERCENTAGE : 0;
  const totalAmount = baseAmount + klarnaFee;

  const handleAdultChange = (increment: boolean) => {
    if (increment && additionalAdults < 10) {
      setAdditionalAdults(additionalAdults + 1);
    } else if (!increment && additionalAdults > 0) {
      setAdditionalAdults(additionalAdults - 1);
    }
  };

  const handleChildrenChange = (increment: boolean) => {
    if (increment && additionalChildren < 10) {
      setAdditionalChildren(additionalChildren + 1);
    } else if (!increment && additionalChildren > 0) {
      setAdditionalChildren(additionalChildren - 1);
    }
  };

  const handleSubmit = async () => {
    if (additionalAdults === 0 && additionalChildren === 0) {
      toast.error('Por favor agrega al menos un invitado');
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/event-registrations/${registration._id}/add-attendees`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            additionalAdults,
            additionalChildren,
            paymentMethod,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al procesar la solicitud');
      }

      const { checkoutUrl } = await response.json();
      
      // Redirect to Stripe checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No se recibió URL de pago');
      }
    } catch (error: any) {
      console.error('Error adding attendees:', error);
      toast.error(error.message || 'Error al agregar invitados');
      setIsProcessing(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: '#000000',
          backgroundImage: 'none',
          color: 'white',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        },
      }}
    >
      <DialogTitle sx={{ p: 4, pb: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: 'white', mb: 1 }}>
              Agregar Invitados
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={registration.event.title || registration.event.name}
                size="medium"
                sx={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontWeight: 600,
                  px: 2,
                  height: 32,
                }}
              />
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Solo para la cena del sábado
              </Typography>
            </Stack>
          </Box>
          <IconButton 
            onClick={onClose} 
            disabled={isProcessing}
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              },
            }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={4}>
          {/* Current Registration Info */}
          <Box
            sx={{
              p: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
              Registro Actual
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mb: 0.5 }}>
                  Titular
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                  {registration.firstName} {registration.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', mb: 0.5 }}>
                  Invitados
                </Typography>
                {currentAdults > 0 || currentChildren > 0 ? (
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                    {currentAdults} adultos, {currentChildren} niños
                  </Typography>
                ) : (
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Sin invitados adicionales
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>


          {/* Add New Attendees */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
              Agregar Nuevos Invitados
            </Typography>

            <Grid container spacing={3}>
              {/* Adults */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 2,
                    height: '100%',
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack spacing={3} sx={{ height: '100%' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar 
                        sx={{ 
                          bgcolor: 'rgba(255, 255, 255, 0.08)',
                          width: 48, 
                          height: 48,
                        }}
                      >
                        <Person sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 28 }} />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: 'white', fontSize: '1.1rem' }}>
                          Adultos
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          ${ADULT_PRICE} por adulto
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                          onClick={() => handleAdultChange(false)}
                          disabled={additionalAdults === 0 || isProcessing}
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.6)',
                            width: 40,
                            height: 40,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-disabled': {
                              color: 'rgba(255, 255, 255, 0.2)',
                              borderColor: 'rgba(255, 255, 255, 0.05)',
                            },
                          }}
                        >
                          <Remove />
                        </IconButton>
                        
                        <Box
                          sx={{
                            minWidth: 80,
                            textAlign: 'center',
                            py: 1,
                            px: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>{additionalAdults}</Typography>
                        </Box>
                        
                        <IconButton
                          onClick={() => handleAdultChange(true)}
                          disabled={additionalAdults >= 10 || isProcessing}
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.6)',
                            width: 40,
                            height: 40,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-disabled': {
                              color: 'rgba(255, 255, 255, 0.2)',
                              borderColor: 'rgba(255, 255, 255, 0.05)',
                            },
                          }}
                        >
                          <Add />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              {/* Children */}
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 2,
                    height: '100%',
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Stack spacing={3} sx={{ height: '100%' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar 
                        sx={{ 
                          bgcolor: 'rgba(255, 255, 255, 0.08)',
                          width: 48, 
                          height: 48,
                        }}
                      >
                        <ChildCare sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 28 }} />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: 'white', fontSize: '1.1rem' }}>
                          Niños
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          ${CHILD_PRICE} por niño (menor de 12)
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                          onClick={() => handleChildrenChange(false)}
                          disabled={additionalChildren === 0 || isProcessing}
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.6)',
                            width: 40,
                            height: 40,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-disabled': {
                              color: 'rgba(255, 255, 255, 0.2)',
                              borderColor: 'rgba(255, 255, 255, 0.05)',
                            },
                          }}
                        >
                          <Remove />
                        </IconButton>
                        
                        <Box
                          sx={{
                            minWidth: 80,
                            textAlign: 'center',
                            py: 1,
                            px: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>{additionalChildren}</Typography>
                        </Box>
                        
                        <IconButton
                          onClick={() => handleChildrenChange(true)}
                          disabled={additionalChildren >= 10 || isProcessing}
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.6)',
                            width: 40,
                            height: 40,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                            },
                            '&.Mui-disabled': {
                              color: 'rgba(255, 255, 255, 0.2)',
                              borderColor: 'rgba(255, 255, 255, 0.05)',
                            },
                          }}
                        >
                          <Add />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Payment Method Selection */}
          {baseAmount > 0 && (
            <>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Selecciona tu método de pago
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      onClick={() => setPaymentMethod('card')}
                      sx={{
                        p: 3,
                        cursor: 'pointer',
                        position: 'relative',
                        backgroundColor: paymentMethod === 'card'
                          ? 'rgba(34, 197, 94, 0.15)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: `2px solid ${paymentMethod === 'card' 
                          ? '#22c55e' 
                          : 'rgba(255, 255, 255, 0.08)'}`,
                        borderRadius: 2,
                        minHeight: 120,
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: paymentMethod === 'card' ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
                          backgroundColor: paymentMethod === 'card'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              sx={{
                                bgcolor: paymentMethod === 'card' 
                                  ? '#22c55e'
                                  : 'rgba(255, 255, 255, 0.08)',
                                width: 48,
                                height: 48,
                              }}
                            >
                              <CreditCard sx={{ color: paymentMethod === 'card' ? 'white' : 'rgba(255, 255, 255, 0.6)' }} />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
                                Tarjeta
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                Pago seguro instantáneo
                              </Typography>
                            </Box>
                          </Stack>
                          {paymentMethod === 'card' && (
                            <CheckCircle sx={{ color: '#22c55e', fontSize: 28 }} />
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box
                      onClick={() => setPaymentMethod('klarna')}
                      sx={{
                        p: 3,
                        cursor: 'pointer',
                        position: 'relative',
                        backgroundColor: paymentMethod === 'klarna'
                          ? 'rgba(34, 197, 94, 0.15)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: `2px solid ${paymentMethod === 'klarna' 
                          ? '#22c55e' 
                          : 'rgba(255, 255, 255, 0.08)'}`,
                        borderRadius: 2,
                        minHeight: 120,
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: paymentMethod === 'klarna' ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
                          backgroundColor: paymentMethod === 'klarna'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              sx={{
                                bgcolor: paymentMethod === 'klarna' 
                                  ? '#22c55e'
                                  : 'rgba(255, 255, 255, 0.08)',
                                width: 48,
                                height: 48,
                              }}
                            >
                              <AttachMoney sx={{ color: paymentMethod === 'klarna' ? 'white' : 'rgba(255, 255, 255, 0.6)' }} />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight={700} sx={{ color: 'white' }}>
                                Klarna
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                Paga a plazos • +6.44% fee
                              </Typography>
                            </Box>
                          </Stack>
                          {paymentMethod === 'klarna' && (
                            <CheckCircle sx={{ color: '#22c55e', fontSize: 28 }} />
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Price Summary */}
              <Box
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 2,
                  mt: 1,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Resumen de Pago
                </Typography>
                
                <Stack spacing={1}>
                  {additionalAdults > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {additionalAdults} adulto{additionalAdults > 1 ? 's' : ''} × ${ADULT_PRICE}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {formatPrice(additionalAdults * ADULT_PRICE)}
                      </Typography>
                    </Stack>
                  )}
                  
                  {additionalChildren > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {additionalChildren} niño{additionalChildren > 1 ? 's' : ''} × ${CHILD_PRICE}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {formatPrice(additionalChildren * CHILD_PRICE)}
                      </Typography>
                    </Stack>
                  )}
                  
                  {paymentMethod === 'klarna' && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Comisión Klarna (6.44%)
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        {formatPrice(klarnaFee)}
                      </Typography>
                    </Stack>
                  )}
                  
                  <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                      Total a Pagar
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#22c55e' }}>
                      {formatPrice(totalAmount)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </>
          )}

          {/* Action Buttons */}
          <Box 
            sx={{ 
              pt: 4, 
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              mt: 3,
            }}
          >
            <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center">
              <Button
                variant="text"
                onClick={onClose}
                disabled={isProcessing}
                size="large"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'none',
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                }}
              >
                Cancelar
              </Button>
              
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isProcessing || (additionalAdults === 0 && additionalChildren === 0)}
                startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <CreditCard />}
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  minWidth: 200,
                  backgroundColor: '#22c55e',
                  color: 'white',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                  '&:hover': {
                    backgroundColor: '#16a34a',
                    boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(34, 197, 94, 0.3)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                {isProcessing ? 'Procesando...' : `Pagar ${formatPrice(totalAmount)}`}
              </Button>
            </Stack>
          </Box>

          {/* Note */}
          <Box
            sx={{
              p: 2.5,
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: 2,
              mt: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              <Box component="span" sx={{ color: 'white', fontWeight: 600 }}>Nota:</Box> Los invitados adicionales SOLO podrán asistir a la cena del sábado. 
              No tendrán acceso a las sesiones de entrenamiento ni a otras actividades del evento.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}