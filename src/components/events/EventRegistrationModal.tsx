'use client';

import React, { useState, useEffect } from 'react';
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
  Add,
  Remove,
  ChildCare,
  LocalOffer,
} from '@mui/icons-material';
import { useTheme as useAppTheme } from '@/components/theme/theme-provider';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';

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
  endAdornment,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          display: 'flex',
          alignItems: multiline ? 'flex-start' : 'center',
          backgroundColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(0, 0, 0, 0.04)',
          borderRadius: 2,
          transition: 'all 0.3s',
          overflow: 'hidden',
          position: 'relative',
          border: error 
            ? `1px solid ${muiTheme.palette.error.main}` 
            : isFocused 
              ? '1px solid #16a34a'
              : isHovered
                ? `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`
                : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          '&:hover': {
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.05)' 
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
          endAdornment={endAdornment}
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
            color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
            '&.MuiInputBase-root': {
              '&:before': {
                display: 'none',
              },
              '&:after': {
                display: 'none',
              },
              '&.Mui-focused': {
                outline: 'none !important',
                boxShadow: 'none !important',
              },
            },
            '& input': {
              padding: '0 0 0 8px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
              backgroundColor: 'transparent',
              outline: 'none !important',
              border: 'none !important',
              boxShadow: 'none !important',
              '&:focus': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
              '&:focus-visible': {
                outline: 'none !important',
              },
              '&::placeholder': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                opacity: 1,
              },
            },
            '& textarea': {
              padding: '0 0 0 8px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)',
              backgroundColor: 'transparent',
              outline: 'none !important',
              border: 'none !important',
              boxShadow: 'none !important',
              '&:focus': {
                outline: 'none !important',
                border: 'none !important',
                boxShadow: 'none !important',
              },
              '&:focus-visible': {
                outline: 'none !important',
              },
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
  const { t: tCommunity } = useTranslation('communityEvent');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: userEmail || '',
    phoneNumber: '',
    tradingExperience: '',
    expectations: '',
  });
  const [additionalAdults, setAdditionalAdults] = useState(0);
  const [additionalChildren, setAdditionalChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(event.price || 0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'klarna' | null>(null);
  
  // Referral code states
  const [referralCode, setReferralCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeValidated, setCodeValidated] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountFixedAmount, setDiscountFixedAmount] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [affiliateDetails, setAffiliateDetails] = useState<any>(null);
  const [validationError, setValidationError] = useState('');

  // Price constants
  const ADULT_PRICE = 75;
  const CHILD_PRICE = 48;
  const KLARNA_FEE_PERCENTAGE = 0.0644; // 6.44%

  // Calculate total price whenever attendees or discount change
  useEffect(() => {
    const basePrice = event.price || 0;
    const attendeesPrice = (additionalAdults * ADULT_PRICE) + (additionalChildren * CHILD_PRICE);
    const subtotal = basePrice + attendeesPrice;
    
    // Apply discount if validated
    let finalPrice = subtotal;
    if (codeValidated) {
      let calculatedDiscount = 0;
      if (discountType === 'percentage' && discountPercentage > 0) {
        calculatedDiscount = (subtotal * discountPercentage) / 100;
      } else if (discountType === 'fixed' && discountFixedAmount > 0) {
        calculatedDiscount = Math.min(discountFixedAmount, subtotal);
      }
      setDiscountAmount(calculatedDiscount);
      finalPrice = subtotal - calculatedDiscount;
    }
    
    setTotalPrice(finalPrice);
  }, [additionalAdults, additionalChildren, event.price, codeValidated, discountPercentage, discountFixedAmount, discountType]);

  // Debug event data
  console.log('Event data in modal:', event);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateReferralCode = async () => {
    if (!referralCode.trim()) {
      setValidationError('Please enter a referral code');
      return;
    }

    setIsValidatingCode(true);
    setValidationError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/affiliates/validate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: referralCode.toUpperCase(),
          eventType: event.type || 'master_course',
        }),
      });

      const data = await response.json();
      
      if (data.valid) {
        setCodeValidated(true);
        setDiscountType(data.discountType || 'percentage');
        if (data.discountType === 'fixed') {
          setDiscountFixedAmount(data.discountFixedAmount || data.discount || 0);
        } else {
          setDiscountPercentage(data.discountPercentage || data.discount || 0);
        }
        setAffiliateDetails(data);
        toast.success(data.message || `Referral code applied!`);
      } else {
        setValidationError(data.message || 'Invalid referral code');
        setCodeValidated(false);
        setDiscountPercentage(0);
        setAffiliateDetails(null);
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      setValidationError('Failed to validate code. Please try again.');
    } finally {
      setIsValidatingCode(false);
    }
  };

  const clearReferralCode = () => {
    setReferralCode('');
    setCodeValidated(false);
    setDiscountPercentage(0);
    setDiscountFixedAmount(0);
    setDiscountType('percentage');
    setDiscountAmount(0);
    setAffiliateDetails(null);
    setValidationError('');
  };

  const handleAdultChange = (increment: boolean) => {
    if (increment && additionalAdults + additionalChildren < 10) {
      setAdditionalAdults(prev => prev + 1);
    } else if (!increment && additionalAdults > 0) {
      setAdditionalAdults(prev => prev - 1);
    }
  };

  const handleChildrenChange = (increment: boolean) => {
    if (increment && additionalAdults + additionalChildren < 10) {
      setAdditionalChildren(prev => prev + 1);
    } else if (!increment && additionalChildren > 0) {
      setAdditionalChildren(prev => prev - 1);
    }
  };

  const handleSubmit = async (paymentMethod: 'card' | 'klarna') => {
    setIsLoading(true);
    setSelectedPaymentMethod(paymentMethod);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
        toast.error('Por favor complete todos los campos requeridos');
        setIsLoading(false);
        setSelectedPaymentMethod(null);
        return;
      }

      // Prepare additional info based on event type
      const additionalInfo: any = {};
      if (event.type === 'master_course') {
        additionalInfo.tradingExperience = formData.tradingExperience;
        additionalInfo.expectations = formData.expectations;
      }
      
      // Add attendees information if it's a community event
      if (event.type === 'community_event' && (additionalAdults > 0 || additionalChildren > 0)) {
        additionalInfo.additionalAttendees = {
          adults: additionalAdults,
          children: additionalChildren,
          details: []  // No individual details needed
        };
      }

      // Create checkout session with payment method and affiliate data
      const checkoutData: any = {
        eventId: event._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        additionalInfo,
        userId,
        paymentMethod, // Add payment method to checkout data
      };
      
      // Add affiliate data if code is validated
      if (codeValidated && affiliateDetails) {
        checkoutData.affiliateCode = affiliateDetails.affiliateCode;
        checkoutData.affiliateId = affiliateDetails.affiliateId;
        checkoutData.discountAmount = discountAmount;
        checkoutData.commissionType = affiliateDetails.commissionType;
        checkoutData.commissionRate = affiliateDetails.commissionRate;
        checkoutData.commissionFixedAmount = affiliateDetails.commissionFixedAmount;
      }

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
        router.push('/academy/subscription/plans');
      } else if (errorMessage.includes('Event is full')) {
        toast.error(t('events.registration.errors.eventFull'));
      } else {
        // Display the actual error message from the API or fallback
        toast.error(errorMessage || t('events.registration.errors.checkoutFailed'));
      }
      setIsLoading(false);
      setSelectedPaymentMethod(null);
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
          maxWidth: '900px',
          width: '95vw',
          height: 'fit-content',
          maxHeight: '90vh',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          '@media (max-width: 600px)': {
            maxHeight: '85vh',
            margin: '10px',
            width: 'calc(100vw - 20px)',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: headerBackground,
          color: 'white',
          p: 2,
          position: 'relative',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          flexShrink: 0,
          '@media (max-width: 600px)': {
            p: 1.5,
          },
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
          <Typography variant="h5" fontWeight={700} sx={{ 
            lineHeight: 1.2,
            '@media (max-width: 600px)': {
              fontSize: '1.25rem',
            },
          }}>
            {t('events.registration.modal.registerFor')} {event.title || event.name}
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center">
            {event.price !== null && event.price !== undefined && event.price > 0 ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {codeValidated && discountAmount > 0 && (
                  <Chip
                    label={`$${event.price} USD`}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      textDecoration: 'line-through',
                      opacity: 0.8,
                    }}
                  />
                )}
                <Chip
                  label={`$${totalPrice.toFixed(2)} USD`}
                  sx={{
                    backgroundColor: 'white',
                    color: '#16a34a',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                  icon={<TrendingUp />}
                />
                {codeValidated && discountAmount > 0 && (
                  <Chip
                    label={discountType === 'percentage' ? `-${discountPercentage}%` : `-$${discountFixedAmount}`}
                    size="small"
                    sx={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            ) : null}
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {t('events.registration.modal.completeRegistration')}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Form Content */}
      <DialogContent sx={{ 
        p: 1.25,
        pt: 0.75,
        pb: 0.5,
        backgroundColor: modalBackground,
        flex: '1 1 auto',
        overflow: 'auto',
        minHeight: 0,
        maxHeight: 'calc(100vh - 250px)',
        '@media (max-width: 600px)': {
          maxHeight: 'calc(100vh - 280px)',
        },
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
          '&:hover': {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          },
        },
      }}>
        <Box component="form" id="event-registration-form">
          <Grid container spacing={0.75}>
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
                required
                disabled={isLoading}
                isDarkMode={isDarkMode}
                muiTheme={theme}
              />
            </Grid>

            {/* Referral Code Field - Only for Master Course */}
            {event.type === 'master_course' && (
              <Grid item xs={12}>
                <CustomInput
                  icon={<LocalOffer />}
                  label="Referral Code (Optional)"
                  name="referralCode"
                  value={referralCode}
                  onChange={(e) => {
                    setReferralCode(e.target.value.toUpperCase());
                    setValidationError('');
                    if (codeValidated) {
                      clearReferralCode();
                    }
                  }}
                  placeholder="Enter referral code"
                  disabled={isLoading || codeValidated}
                  isDarkMode={isDarkMode}
                  muiTheme={theme}
                  error={!!validationError}
                  helperText={validationError}
                  endAdornment={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {codeValidated ? (
                        <Button
                          size="small"
                          onClick={clearReferralCode}
                          disabled={isLoading}
                          sx={{ minWidth: 'auto' }}
                        >
                          Clear
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          onClick={validateReferralCode}
                          disabled={!referralCode || isLoading || isValidatingCode}
                          sx={{ minWidth: 'auto' }}
                        >
                          {isValidatingCode ? (
                            <CircularProgress size={16} />
                          ) : (
                            'Apply'
                          )}
                        </Button>
                      )}
                    </Box>
                  }
                />
                {codeValidated && affiliateDetails && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Referral code applied! {discountType === 'percentage' ? `${discountPercentage}%` : `$${discountFixedAmount}`} discount
                      {affiliateDetails.affiliateName && (
                        <> from {affiliateDetails.affiliateName}</>
                      )}
                    </Typography>
                  </Alert>
                )}
              </Grid>
            )}

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

            {/* Additional Attendees for Community Event */}
            {event.type === 'community_event' ? (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={600}
                    sx={{ 
                      mb: 1,
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)'
                    }}
                  >
                    {tCommunity('registration.additionalAttendees.title', 'Invitados para la Cena del Sábado')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    {tCommunity('registration.additionalAttendees.subtitle', 'Agrega familiares que asistirán ÚNICAMENTE a la cena especial del sábado 26 de octubre')}
                  </Typography>
                </Grid>

                {/* Quantity Selectors */}
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.03)' 
                        : 'rgba(0, 0, 0, 0.02)',
                      border: `1px solid ${isDarkMode 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(0, 0, 0, 0.08)'}`,
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          >
                            <Person fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {tCommunity('registration.additionalAttendees.adults', 'Adultos')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {tCommunity('registration.additionalAttendees.adultPrice', '$75 por adulto')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                          size="small"
                          onClick={() => handleAdultChange(false)}
                          disabled={isLoading || additionalAdults === 0}
                          sx={{
                            backgroundColor: isDarkMode 
                              ? 'rgba(255, 255, 255, 0.08)' 
                              : 'rgba(0, 0, 0, 0.04)',
                            '&:hover': {
                              backgroundColor: isDarkMode 
                                ? 'rgba(255, 255, 255, 0.12)' 
                                : 'rgba(0, 0, 0, 0.06)',
                            },
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            minWidth: 32, 
                            textAlign: 'center',
                            fontWeight: 700
                          }}
                        >
                          {additionalAdults}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleAdultChange(true)}
                          disabled={isLoading || additionalAdults + additionalChildren >= 10}
                          sx={{
                            backgroundColor: isDarkMode 
                              ? 'rgba(255, 255, 255, 0.08)' 
                              : 'rgba(0, 0, 0, 0.04)',
                            '&:hover': {
                              backgroundColor: isDarkMode 
                                ? 'rgba(255, 255, 255, 0.12)' 
                                : 'rgba(0, 0, 0, 0.06)',
                            },
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.03)' 
                        : 'rgba(0, 0, 0, 0.02)',
                      border: `1px solid ${isDarkMode 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(0, 0, 0, 0.08)'}`,
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main,
                            }}
                          >
                            <ChildCare fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {tCommunity('registration.additionalAttendees.children', 'Niños (menores de 12 años)')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {tCommunity('registration.additionalAttendees.childPrice', '$48 por niño')}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                          size="small"
                          onClick={() => handleChildrenChange(false)}
                          disabled={isLoading || additionalChildren === 0}
                          sx={{
                            backgroundColor: isDarkMode 
                              ? 'rgba(255, 255, 255, 0.08)' 
                              : 'rgba(0, 0, 0, 0.04)',
                            '&:hover': {
                              backgroundColor: isDarkMode 
                                ? 'rgba(255, 255, 255, 0.12)' 
                                : 'rgba(0, 0, 0, 0.06)',
                            },
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            minWidth: 32, 
                            textAlign: 'center',
                            fontWeight: 700
                          }}
                        >
                          {additionalChildren}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleChildrenChange(true)}
                          disabled={isLoading || additionalAdults + additionalChildren >= 10}
                          sx={{
                            backgroundColor: isDarkMode 
                              ? 'rgba(255, 255, 255, 0.08)' 
                              : 'rgba(0, 0, 0, 0.04)',
                            '&:hover': {
                              backgroundColor: isDarkMode 
                                ? 'rgba(255, 255, 255, 0.12)' 
                                : 'rgba(0, 0, 0, 0.06)',
                            },
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Price Summary and Note */}
                {(additionalAdults > 0 || additionalChildren > 0) ? (
                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor: alpha('#16a34a', 0.08),
                        border: `1px solid ${alpha('#16a34a', 0.2)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {tCommunity('registration.additionalAttendees.priceBreakdown.total', 'Total')}:
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {additionalAdults > 0 && `${additionalAdults} ${tCommunity('registration.additionalAttendees.adults', 'adultos')} `}
                            {additionalAdults > 0 && additionalChildren > 0 && '+ '}
                            {additionalChildren > 0 && `${additionalChildren} ${tCommunity('registration.additionalAttendees.children', 'niños')}`}
                          </Typography>
                        </Box>
                        <Box>
                          {codeValidated && discountAmount > 0 && (
                            <>
                              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                ${(totalPrice + discountAmount).toFixed(2)}
                              </Typography>
                              <Typography variant="caption" color="error" display="block">
                                Save ${discountAmount.toFixed(2)}!
                              </Typography>
                            </>
                          )}
                          <Typography variant="h5" fontWeight={700} color="primary">
                            ${totalPrice.toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ) : null}

                {/* Note about Saturday dinner only */}
                <Grid item xs={12}>
                  <Alert 
                    severity="info" 
                    sx={{ 
                      py: 0.5,
                      '& .MuiAlert-message': {
                        fontSize: '0.75rem',
                      }
                    }}
                  >
                    {tCommunity('registration.additionalAttendees.note', 'Nota: Los invitados adicionales SOLO podrán asistir a la cena del sábado. No tendrán acceso a las sesiones de entrenamiento ni a otras actividades del evento.')}
                  </Alert>
                </Grid>
              </>
            ) : null}


            {/* Info Box */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  mt: 0.5,
                  mb: 0.5,
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
                      variant="subtitle2" 
                      fontWeight={600} 
                      sx={{ 
                        color: '#16a34a',
                        mb: 0.5,
                        fontSize: '0.875rem'
                      }}
                    >
                      {t('events.registration.modal.whatHappensNext')}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                        lineHeight: 1.4,
                        wordBreak: 'break-word',
                        fontSize: '0.75rem'
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
        p: 1.5,
        pt: 1, 
        backgroundColor: modalBackground,
        borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outlined"
            size="medium"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1,
              minWidth: '120px',
              borderWidth: 2,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
              order: { xs: 2, sm: 1 },
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                borderWidth: 2,
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              },
            }}
          >
            {t('events.registration.modal.cancel')}
          </Button>
          {event.price !== null && event.price !== undefined && event.price > 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2.5, sm: 2 }, 
              width: '100%',
              order: { xs: 1, sm: 2 },
            }}>
              <Button
                onClick={() => handleSubmit('card')}
                disabled={isLoading && selectedPaymentMethod === 'card'}
                variant="contained"
                size="medium"
                fullWidth
                startIcon={isLoading && selectedPaymentMethod === 'card' ? <CircularProgress size={18} color="inherit" /> : <CreditCard />}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  py: { xs: 1.5, sm: 1.25 },
                  px: { xs: 2, sm: 2.5 },
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  fontWeight: 600,
                  background: selectedPaymentMethod === 'card' && isLoading ? buttonBackground : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  minHeight: { xs: '56px', sm: 'auto' },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                }}
              >
                {isLoading && selectedPaymentMethod === 'card' ? (
                  t('status.processing')
                ) : (
                  <>
                    <span>{t('events.registration.modal.payWithCard', 'Pagar al contado')}</span>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {codeValidated && discountAmount > 0 && (
                        <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', opacity: 0.7 }}>
                          ${(totalPrice + discountAmount).toFixed(2)} USD
                        </span>
                      )}
                      <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                        ${totalPrice.toFixed(2)} USD
                      </span>
                    </Box>
                  </>
                )}
              </Button>
              
              <Box sx={{ 
                display: { xs: 'none', sm: 'flex' }, 
                alignItems: 'center', 
                mx: 0.75,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}>
                O
              </Box>
              
              {/* Mobile divider */}
              <Box sx={{ 
                display: { xs: 'flex', sm: 'none' },
                alignItems: 'center',
                justifyContent: 'center',
                my: 0.5,
              }}>
                <Box sx={{
                  width: '100%',
                  height: '1px',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  '&::before': {
                    content: '"o"',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: modalBackground,
                    px: 1.5,
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'lowercase',
                  }
                }} />
              </Box>
              
              <Button
                onClick={() => handleSubmit('klarna')}
                disabled={isLoading && selectedPaymentMethod === 'klarna'}
                variant="contained"
                size="medium"
                fullWidth
                startIcon={isLoading && selectedPaymentMethod === 'klarna' ? <CircularProgress size={18} color="inherit" /> : <TrendingUp />}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  py: { xs: 1.5, sm: 1.25 },
                  px: { xs: 2, sm: 2.5 },
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  fontWeight: 600,
                  background: selectedPaymentMethod === 'klarna' && isLoading ? buttonBackground : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  minHeight: { xs: '72px', sm: 'auto' },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                  '@media (max-width: 600px)': {
                    '& .MuiButton-startIcon': {
                      display: 'none',
                    },
                  },
                }}
              >
                {isLoading && selectedPaymentMethod === 'klarna' ? (
                  t('status.processing')
                ) : (
                  <>
                    <span>{t('events.registration.modal.payWithKlarna', 'Financiar con Klarna')}</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1px' }}>
                      ${(totalPrice * (1 + KLARNA_FEE_PERCENTAGE)).toFixed(2)} USD
                    </span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '-1px' }}>
                      (incluye {(KLARNA_FEE_PERCENTAGE * 100).toFixed(2)}% por financiamiento)
                    </span>
                  </>
                )}
              </Button>
            </Box>
          ) : (
            <Button
              onClick={() => handleSubmit('card')}
              disabled={isLoading}
              variant="contained"
              size="medium"
              fullWidth
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                py: 1.25,
                px: 2.5,
                fontSize: '0.95rem',
                fontWeight: 600,
                background: buttonBackground,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: buttonHoverBackground,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {isLoading ? (
                t('status.processing')
              ) : (
                t('events.registration.free.submitButton')
              )}
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}