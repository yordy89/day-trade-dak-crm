'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  ButtonGroup,
  Chip,
  Alert,
  Divider,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Slider,
  CircularProgress,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CreditCard,
  Wallet,
  CalendarToday,
  Info,
  CheckCircle,
  Warning,
  AttachMoney,
  TrendingUp,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface PartialPaymentSectionProps {
  event: any;
  totalPrice: number;
  onPaymentTypeSelect: (type: 'full' | 'partial', depositAmount?: number) => void;
  onSubmit: (paymentMethod: string, paymentType: 'full' | 'partial', depositAmount?: number) => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

export const PartialPaymentSection: React.FC<PartialPaymentSectionProps> = ({
  event,
  totalPrice,
  onPaymentTypeSelect,
  onSubmit,
  isLoading,
  isDarkMode,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);

  // Calculate minimum deposit based on event settings
  const calculateMinimumDeposit = () => {
    if (event.minimumDepositAmount && event.minimumDepositAmount > 0) {
      return event.minimumDepositAmount;
    }
    if (event.depositPercentage && event.depositPercentage > 0) {
      return (totalPrice * event.depositPercentage) / 100;
    }
    // Default to 20% if no settings
    return totalPrice * 0.2;
  };

  const minimumDeposit = calculateMinimumDeposit();
  const remainingBalance = totalPrice - depositAmount;

  useEffect(() => {
    // Set initial deposit to minimum when partial is selected
    if (paymentType === 'partial' && depositAmount < minimumDeposit) {
      setDepositAmount(minimumDeposit);
    }
  }, [paymentType, minimumDeposit]);

  const handlePaymentTypeChange = (type: 'full' | 'partial') => {
    setPaymentType(type);
    if (type === 'partial') {
      setDepositAmount(minimumDeposit);
      onPaymentTypeSelect('partial', minimumDeposit);
    } else {
      onPaymentTypeSelect('full');
    }
  };

  const handleDepositSliderChange = (event: Event, value: number | number[]) => {
    const amount = value as number;
    setDepositAmount(amount);
    onPaymentTypeSelect('partial', amount);
  };

  const handleQuickDepositSelect = (percentage: number) => {
    const amount = Math.max((totalPrice * percentage) / 100, minimumDeposit);
    setDepositAmount(amount);
    onPaymentTypeSelect('partial', amount);
  };

  const handlePaymentSubmit = (method: string) => {
    setSelectedPaymentMethod(method);
    onSubmit(method, paymentType, paymentType === 'partial' ? depositAmount : undefined);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Check if partial payments are allowed for this event
  const partialPaymentsAllowed = event.paymentMode === 'partial_allowed';

  if (!partialPaymentsAllowed) {
    // Show only full payment options
    return (
      <Stack spacing={3}>
        <Alert icon={<Info />} severity="info">
          Este evento requiere el pago completo al momento del registro.
        </Alert>

        <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Total a Pagar
          </Typography>
          <Typography variant="h3" color="primary" fontWeight={700}>
            {formatCurrency(totalPrice)}
          </Typography>
        </Paper>

        <Divider />

        <Typography variant="h6" fontWeight={600} gutterBottom>
          Selecciona tu método de pago
        </Typography>

        <Stack spacing={2}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<CreditCard />}
            onClick={() => handlePaymentSubmit('card')}
            disabled={isLoading}
            sx={{
              py: 2,
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
              },
            }}
          >
            {isLoading && selectedPaymentMethod === 'card' ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Pagar con Tarjeta'
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Wallet />}
            onClick={() => handlePaymentSubmit('klarna')}
            disabled={isLoading}
            sx={{ py: 2 }}
          >
            {isLoading && selectedPaymentMethod === 'klarna' ? (
              <CircularProgress size={24} />
            ) : (
              'Pagar con Klarna'
            )}
          </Button>
        </Stack>
      </Stack>
    );
  }

  // Show partial payment options
  return (
    <Stack spacing={3}>
      <Alert icon={<Info />} severity="success">
        ¡Este evento permite pagos parciales! Puedes asegurar tu lugar con un depósito inicial.
      </Alert>

      {/* Payment Type Selection */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          ¿Cómo deseas pagar?
        </Typography>

        <FormControl component="fieldset">
          <RadioGroup
            value={paymentType}
            onChange={(e) => handlePaymentTypeChange(e.target.value as 'full' | 'partial')}
          >
            <FormControlLabel
              value="full"
              control={<Radio color="primary" />}
              label={
                <Box>
                  <Typography fontWeight={600}>
                    Pago Completo - {formatCurrency(totalPrice)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Paga el monto total ahora y asegura tu lugar
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              value="partial"
              control={<Radio color="primary" />}
              label={
                <Box>
                  <Typography fontWeight={600}>
                    Pago Parcial - Desde {formatCurrency(minimumDeposit)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Reserva tu lugar con un depósito y paga el resto después
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>
      </Paper>

      {/* Partial Payment Details */}
      <Collapse in={paymentType === 'partial'}>
        <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Configura tu depósito inicial
          </Typography>

          {/* Quick Select Buttons */}
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center' }}>
              Opciones rápidas:
            </Typography>
            <ButtonGroup size="small">
              <Button onClick={() => handleQuickDepositSelect(20)}>20%</Button>
              <Button onClick={() => handleQuickDepositSelect(30)}>30%</Button>
              <Button onClick={() => handleQuickDepositSelect(50)}>50%</Button>
              <Button onClick={() => handleQuickDepositSelect(75)}>75%</Button>
            </ButtonGroup>
          </Stack>

          {/* Deposit Slider */}
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Depósito inicial: <strong>{formatCurrency(depositAmount)}</strong>
            </Typography>
            <Slider
              value={depositAmount}
              onChange={handleDepositSliderChange}
              min={minimumDeposit}
              max={totalPrice}
              step={50}
              marks={[
                { value: minimumDeposit, label: `Mínimo` },
                { value: totalPrice, label: `Total` },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={formatCurrency}
              color="primary"
            />
          </Box>

          {/* Payment Summary */}
          <Stack spacing={1} sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Depósito inicial:</Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(depositAmount)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Balance restante:</Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(remainingBalance)}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography fontWeight={600}>Precio total:</Typography>
              <Typography fontWeight={600} color="primary">
                {formatCurrency(totalPrice)}
              </Typography>
            </Box>
          </Stack>

          {/* Payment Schedule Preview */}
          <Box sx={{ mt: 3 }}>
            <Button
              size="small"
              startIcon={<CalendarToday />}
              onClick={() => setShowPaymentSchedule(!showPaymentSchedule)}
            >
              {showPaymentSchedule ? 'Ocultar' : 'Ver'} calendario de pagos
            </Button>

            <Collapse in={showPaymentSchedule}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Calendario de pagos estimado:</strong>
                </Typography>
                <Typography variant="caption">
                  • Hoy: {formatCurrency(depositAmount)} (Depósito inicial)<br />
                  • Próximos 30 días: {formatCurrency(remainingBalance * 0.5)}<br />
                  • Antes del evento: {formatCurrency(remainingBalance * 0.5)}<br />
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  * Podrás pagar el balance restante en cualquier momento antes del evento
                </Typography>
              </Alert>
            </Collapse>
          </Box>
        </Paper>
      </Collapse>

      {/* Full Payment Details */}
      <Collapse in={paymentType === 'full'}>
        <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <CheckCircle color="success" />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Pago Completo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pagarás el monto total de {formatCurrency(totalPrice)} ahora
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Collapse>

      <Divider />

      {/* Payment Methods */}
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Método de pago
        </Typography>

        <Stack spacing={2}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<CreditCard />}
            onClick={() => handlePaymentSubmit('card')}
            disabled={isLoading}
            sx={{
              py: 2,
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
              },
            }}
          >
            {isLoading && selectedPaymentMethod === 'card' ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Pagar ${paymentType === 'partial' ? 'Depósito' : 'Total'} con Tarjeta`
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Wallet />}
            onClick={() => handlePaymentSubmit('klarna')}
            disabled={isLoading}
            sx={{ py: 2 }}
          >
            {isLoading && selectedPaymentMethod === 'klarna' ? (
              <CircularProgress size={24} />
            ) : (
              `Pagar ${paymentType === 'partial' ? 'Depósito' : 'Total'} con Klarna`
            )}
          </Button>
        </Stack>
      </Box>

      {/* Terms and Conditions for Partial Payments */}
      {paymentType === 'partial' && (
        <Alert severity="warning" icon={<Warning />}>
          <Typography variant="caption">
            Al realizar un pago parcial, te comprometes a pagar el balance restante antes de la fecha del evento.
            Recibirás recordatorios por correo electrónico con instrucciones para completar tu pago.
          </Typography>
        </Alert>
      )}
    </Stack>
  );
};