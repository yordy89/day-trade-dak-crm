'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { eventService } from '@/services/api/event.service';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField'; // Removed - using CustomInput instead
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
// import InputAdornment from '@mui/material/InputAdornment'; // Removed - no longer needed with CustomInput
import { useTheme, alpha } from '@mui/material/styles';
import {
  Close,
  Person,
  Email,
  Phone,
  Psychology,
  CheckCircle,
  TrendingUp,
  CreditCard,
} from '@mui/icons-material';
import { useTheme as useAppTheme } from '@/components/theme/theme-provider';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';

interface CustomInputProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  isDarkMode: boolean;
  muiTheme: any;
  name: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  endAdornment?: React.ReactNode;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  icon, 
  label, 
  isDarkMode, 
  muiTheme,
  error,
  helperText,
  required,
  disabled,
  multiline,
  rows,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <FormControl fullWidth>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 1, 
          fontWeight: 500,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {label} {required ? <span style={{ color: muiTheme.palette.error.main }}>*</span> : null}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: multiline ? 'flex-start' : 'center',
          backgroundColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.04)',
          borderRadius: 2,
          transition: 'all 0.3s',
          overflow: 'hidden',
          position: 'relative',
          border: error ? `1px solid ${muiTheme.palette.error.main}` : 'none',
          '&:hover': {
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.12)' 
              : 'rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 1.5,
            pt: multiline ? 2 : 0,
            color: isFocused 
              ? '#16a34a' 
              : isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            transition: 'color 0.3s',
          }}
        >
          {icon}
        </Box>
        <InputBase
          {...props}
          multiline={multiline}
          rows={rows}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          sx={{
            flex: 1,
            py: 1.25,
            pr: 2,
            fontSize: '15px',
            fontWeight: 400,
            color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
            '& input': {
              padding: '0 0 0 8px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
              backgroundColor: 'transparent',
              '&::placeholder': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                opacity: 1,
              },
            },
            '& textarea': {
              padding: '0 0 0 8px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
              backgroundColor: 'transparent',
              '&::placeholder': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                opacity: 1,
              },
            },
            '&.Mui-disabled': {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.38)' : 'rgba(0, 0, 0, 0.38)',
            },
          }}
        />
        {props.endAdornment}
      </Box>
      {helperText ? (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {helperText}
        </Typography>
      ) : null}
    </FormControl>
  );
};

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    _id: string;
    name: string;
    title?: string;
    type?: 'master_course' | 'community_event' | 'general';
    price?: number;
    requiresActiveSubscription?: boolean;
  };
  userId?: string;
  userEmail?: string;
}

export function EventRegistrationModal({
  isOpen,
  onClose,
  event,
  userId,
  userEmail,
}: EventRegistrationModalProps) {
  const router = useRouter();
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: userEmail || '',
    phoneNumber: '',
    tradingExperience: '',
    expectations: '',
  });

  // Debug event data
  console.log('Event data in modal:', event);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error(t('form.validation.requiredFields'));
        setIsLoading(false);
        return;
      }

      // Prepare additional info based on event type
      const additionalInfo: any = {};
      if (event.type === 'master_course') {
        additionalInfo.tradingExperience = formData.tradingExperience;
        additionalInfo.expectations = formData.expectations;
      }

      // Create checkout session
      const checkoutData = {
        eventId: event._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        additionalInfo,
        userId,
      };

      const response = await eventService.createEventCheckout(checkoutData);
      
      // Redirect to Stripe hosted checkout
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // The errorHandler returns an ApiError object with a message property
      const errorMessage = error.message || error.response?.data?.message || '';
      
      if (errorMessage.includes('Ya te has registrado con este correo electrónico')) {
        toast.error(t('events.registration.errors.alreadyRegistered'));
      } else if (errorMessage.includes('active subscription required')) {
        toast.error(t('events.registration.errors.activeSubscriptionRequired'));
        router.push('/pricing');
      } else if (errorMessage.includes('Event is full')) {
        toast.error(t('events.registration.errors.eventFull'));
      } else {
        // Display the actual error message from the API or fallback
        toast.error(errorMessage || t('events.registration.errors.checkoutFailed'));
      }
      setIsLoading(false);
    }
  };

  const modalBackground = isDarkMode
    ? '#1a1a1a'
    : '#ffffff';

  // Always use green theme colors for consistency
  const headerBackground = `linear-gradient(135deg, ${alpha('#16a34a', 0.9)} 0%, ${alpha('#15803d', 0.9)} 100%)`;

  // Always use green theme colors for buttons
  const buttonBackground = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
  const buttonHoverBackground = 'linear-gradient(135deg, #15803d 0%, #14532d 100%)';

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          background: modalBackground,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: isDarkMode 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)' 
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px',
          width: '90vw',
          height: 'fit-content',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: headerBackground,
          color: 'white',
          p: 2.5,
          position: 'relative',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          flexShrink: 0,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            backgroundColor: alpha('#000', 0.2),
            '&:hover': {
              backgroundColor: alpha('#000', 0.3),
            },
          }}
        >
          <Close />
        </IconButton>

        <Stack spacing={1.5} sx={{ pr: 6 }}>
          <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {t('events.registration.modal.registerFor')} {event.title || event.name}
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center">
            {event.price !== null && event.price !== undefined && event.price > 0 ? (
              <Chip
                label={`$${event.price} USD`}
                sx={{
                  backgroundColor: 'white',
                  color: '#16a34a',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
                icon={<TrendingUp />}
              />
            ) : null}
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {t('events.registration.modal.completeRegistration')}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Form Content */}
      <DialogContent sx={{ 
        p: 2,
        pt: 1.5,
        backgroundColor: modalBackground,
        flex: '1 1 auto',
        overflow: 'visible',
        minHeight: 0,
      }}>
        <Box component="form" onSubmit={handleSubmit} id="event-registration-form">
          <Grid container spacing={1.5}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                fontWeight={600} 
                gutterBottom
                sx={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                  mb: 0.5
                }}
              >
                {t('events.registration.modal.personalInformation')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomInput
                icon={<Person />}
                label={t('events.registration.modal.firstName')}
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
                disabled={isLoading}
                isDarkMode={isDarkMode}
                muiTheme={theme}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <CustomInput
                icon={<Person />}
                label={t('events.registration.modal.lastName')}
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
                disabled={isLoading}
                isDarkMode={isDarkMode}
                muiTheme={theme}
              />
            </Grid>
            
            <Grid item xs={12} sm={7}>
              <CustomInput
                icon={<Email />}
                label={t('events.registration.modal.email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                required
                disabled={isLoading}
                isDarkMode={isDarkMode}
                muiTheme={theme}
              />
            </Grid>
            
            <Grid item xs={12} sm={5}>
              <CustomInput
                icon={<Phone />}
                label={t('events.registration.modal.phone')}
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
                isDarkMode={isDarkMode}
                muiTheme={theme}
              />
            </Grid>

            {/* Master Course specific fields */}
            {event.type === 'master_course' ? (
              <>
                <Grid item xs={12}>
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    gutterBottom 
                    sx={{ 
                      mt: 0.5,
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                      mb: 0.5
                    }}
                  >
                    {t('events.registration.modal.tradingBackground')}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomInput
                    icon={<TrendingUp />}
                    label={t('events.registration.modal.tradingExperience')}
                    name="tradingExperience"
                    value={formData.tradingExperience}
                    onChange={handleInputChange}
                    placeholder={t('events.registration.modal.tradingExperiencePlaceholder')}
                    multiline
                    rows={2}
                    disabled={isLoading}
                    isDarkMode={isDarkMode}
                    muiTheme={theme}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <CustomInput
                    icon={<Psychology />}
                    label={t('events.registration.modal.expectationsLabel')}
                    name="expectations"
                    value={formData.expectations}
                    onChange={handleInputChange}
                    placeholder={t('events.registration.modal.expectationsShortPlaceholder')}
                    multiline
                    rows={2}
                    disabled={isLoading}
                    isDarkMode={isDarkMode}
                    muiTheme={theme}
                  />
                </Grid>
              </>
            ) : null}


            {/* Payment Options Info */}
            {event.price !== undefined && event.price !== null && event.price > 0 ? (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mt: 0.5,
                    backgroundColor: alpha('#f59e0b', 0.1),
                    border: `1px solid ${alpha('#f59e0b', 0.3)}`,
                    borderRadius: '8px',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <CreditCard sx={{ color: '#f59e0b', mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#f59e0b', mb: 1 }}>
                        {t('events.registration.modal.paymentOptionsTitle', 'Flexible Payment Options Available')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                        {event.price >= 50 ? 
                          t('events.registration.modal.bnplAvailable', 'Choose from multiple payment options including Klarna (pay in 4) and Affirm (monthly payments) at checkout.')
                          : t('events.registration.modal.cardPayment', 'Pay securely with credit or debit card.')
                        }
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ) : null}

            {/* Info Box */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  mt: 0.5,
                  backgroundColor: isDarkMode 
                    ? alpha(event.type === 'master_course' ? '#16a34a' : '#3b82f6', 0.1)
                    : alpha(event.type === 'master_course' ? '#16a34a' : '#3b82f6', 0.05),
                  border: `1px solid ${isDarkMode 
                    ? alpha(event.type === 'master_course' ? '#16a34a' : '#3b82f6', 0.3)
                    : alpha(event.type === 'master_course' ? '#16a34a' : '#3b82f6', 0.2)}`,
                  borderRadius: '8px',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <CheckCircle sx={{ 
                    color: '#16a34a', 
                    mt: 0.5 
                  }} />
                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight={600} 
                      sx={{ 
                        color: '#16a34a',
                        mb: 1
                      }}
                    >
                      {t('events.registration.modal.whatHappensNext')}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' 
                      }}
                    >
                      {t('events.registration.modal.afterSubmitting')}
                      {event.type === 'master_course' ? ` ${t('events.registration.modal.courseAccess')}` : ''}
                      {event.type === 'community_event' ? ` ${t('events.registration.modal.eventConfirmation')}` : ''}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

          </Grid>
        </Box>
      </DialogContent>
      
      {/* Action Buttons - Outside scrollable area */}
      <Box sx={{ 
        p: 2,
        pt: 1.5, 
        backgroundColor: modalBackground,
        borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        flexShrink: 0,
      }}>
        <Stack direction="row" spacing={2}>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderWidth: 2,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
              '&:hover': {
                borderWidth: 2,
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              },
            }}
          >
            {t('events.registration.modal.cancel')}
          </Button>
          <Button
            type="submit"
            form="event-registration-form"
            disabled={isLoading}
            variant="contained"
            size="large"
            fullWidth
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: buttonBackground,
              '&:hover': {
                background: buttonHoverBackground,
              },
            }}
          >
            {isLoading ? (
              t('status.processing')
            ) : event.price !== null && event.price !== undefined && event.price > 0 ? (
              `${t('events.registration.modal.proceedToPayment')} $${event.price}`
            ) : (
              t('events.registration.free.submitButton')
            )}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}