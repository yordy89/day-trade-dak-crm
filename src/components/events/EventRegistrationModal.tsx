'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { eventService } from '@/services/api/event.service';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
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
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import useMediaQuery from '@mui/material/useMediaQuery';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
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
  AccountBalanceWallet as Wallet,
  ArrowBack,
  ArrowForward,
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
            ? 'rgba(22, 27, 34, 0.8)'
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
                ? `1px solid ${isDarkMode ? 'rgba(22, 163, 74, 0.3)' : 'rgba(0, 0, 0, 0.2)'}`
                : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)'}`,
          '&:hover': {
            backgroundColor: isDarkMode
              ? 'rgba(22, 27, 34, 0.95)'
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
    // Partial payment settings
    paymentMode?: 'full_only' | 'partial_allowed';
    minimumDepositAmount?: number;
    depositPercentage?: number;
    minimumInstallmentAmount?: number;
    allowedFinancingPlans?: string[];
    allowCustomPaymentPlan?: boolean;
    paymentSettings?: {
      enablePartialPayments?: boolean;
      autoReminderDays?: number[];
      gracePeriodDays?: number;
      lateFeeAmount?: number;
      lateFeePercentage?: number;
      maxPaymentAttempts?: number;
    };
  };
  userId?: string;
  userEmail?: string;
  user?: any; // Full user object for checking approvedForLocalFinancing
}

export function EventRegistrationModal({
  isOpen,
  onClose,
  event,
  userId,
  userEmail,
  user,
}: EventRegistrationModalProps) {
  const router = useRouter();
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  const { t } = useTranslation();
  const { t: tCommunity } = useTranslation('communityEvent');
  const { t: tMasterCourse } = useTranslation('masterCourse');
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'klarna' | 'afterpay' | 'local_financing' | null>(null);

  // Partial payment states
  const [paymentMode, setPaymentMode] = useState<'full' | 'partial'>('full');
  const [depositAmount, setDepositAmount] = useState(0);
  const [selectedDepositOption, setSelectedDepositOption] = useState<'percentage' | 'custom'>('percentage');

  // Feature flags from settings
  const [enableReferralCode, setEnableReferralCode] = useState(false);

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

  // Mobile responsive states
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);

  // Fetch feature flags from settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings/public`);
        const settings = response.data;

        // Check if referral code is enabled in settings
        if (settings?.features?.enable_referral_code !== undefined) {
          setEnableReferralCode(settings.features.enable_referral_code);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Default to false if settings can't be fetched
        setEnableReferralCode(false);
      }
    };

    fetchSettings();
  }, []);

  // Feature flags
  const SHOW_ADDITIONAL_ATTENDEES_STEP = false; // Temporarily disabled - can be re-enabled when needed

  // Price constants
  const ADULT_PRICE = 75;
  const CHILD_PRICE = 48;
  const KLARNA_FEE_PERCENTAGE = 0.0644; // 6.44%
  const AFTERPAY_FEE_PERCENTAGE = 0.06; // 6% (hidden from customer)

  // Mobile transition component
  // Memoize the Transition component to prevent recreation
  const Transition = React.useMemo(
    () => React.forwardRef(function Transition(
      props: TransitionProps & {
        children: React.ReactElement;
      },
      ref: React.Ref<unknown>,
    ) {
      return <Slide direction="up" ref={ref} {...props} />;
    }),
    []
  );

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

    // Calculate default deposit (50% or minimum deposit amount)
    if (event.paymentMode === 'partial_allowed' && paymentMode === 'partial') {
      const defaultDeposit = event.depositPercentage
        ? (finalPrice * event.depositPercentage / 100)
        : event.minimumDepositAmount || (finalPrice * 0.5);
      setDepositAmount(Math.max(event.minimumDepositAmount || 0, defaultDeposit));
    }
  }, [additionalAdults, additionalChildren, event.price, event.paymentMode, event.depositPercentage, event.minimumDepositAmount, codeValidated, discountPercentage, discountFixedAmount, discountType, paymentMode]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveStep(0);
      setSelectedPaymentMethod(null);
    }
  }, [isOpen]);

  // Debug event data and payment settings
  useEffect(() => {
    if (isOpen) {
      console.log('=== Event Registration Modal Debug ===');
      console.log('Full event object:', event);
      console.log('Payment Mode:', event.paymentMode);
      console.log('Minimum Deposit:', event.minimumDepositAmount);
      console.log('Deposit Percentage:', event.depositPercentage);
      console.log('Minimum Installment:', event.minimumInstallmentAmount);
      console.log('Event Type:', event.type);
      console.log('Event Price:', event.price);
    }
  }, [isOpen, event]);

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

  const handleSubmit = async (paymentMethod: 'card' | 'klarna' | 'afterpay' | 'local_financing', financingPlanId?: string) => {
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

      // Validate deposit amount for partial payments
      if (paymentMode === 'partial' && event.paymentMode === 'partial_allowed') {
        const minDeposit = event.minimumDepositAmount || 0;
        if (depositAmount < minDeposit) {
          toast.error(`El depósito mínimo es $${minDeposit.toFixed(2)}`);
          setIsLoading(false);
          setSelectedPaymentMethod(null);
          return;
        }
        if (depositAmount >= totalPrice) {
          toast.error('El depósito debe ser menor al total');
          setIsLoading(false);
          setSelectedPaymentMethod(null);
          return;
        }
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

      // Handle partial payment
      if (paymentMode === 'partial' && event.paymentMode === 'partial_allowed') {
        const partialPaymentData = {
          eventId: event._id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          depositAmount,
          userId,
          financingPlanId,
          paymentMethod,
          additionalInfo,
          affiliateCode: codeValidated && affiliateDetails ? affiliateDetails.affiliateCode : undefined,
        };

        const response = await eventService.initiatePartialPayment(partialPaymentData);

        // Redirect to Stripe checkout for deposit
        if (response.url) {
          window.location.href = response.url;
        } else {
          throw new Error('No checkout URL received');
        }
        return;
      }

      // Full payment flow
      const checkoutData: any = {
        eventId: event._id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        additionalInfo,
        userId,
        paymentMethod,
        financingPlanId,
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

  // Memoize style constants to prevent recalculation
  const modalBackground = React.useMemo(() => isDarkMode ? '#0d1117' : '#ffffff', [isDarkMode]);

  // Premium gradient for header with enhanced depth
  const headerBackground = React.useMemo(() =>
    `linear-gradient(135deg, #16a34a 0%, #15803d 50%, #0d5c2e 100%)`,
    []
  );

  // Always use green theme colors for buttons
  const buttonBackground = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
  const buttonHoverBackground = 'linear-gradient(135deg, #15803d 0%, #14532d 100%)';

  // Define steps based on event type and mobile view
  // Note: Additional attendees step is temporarily disabled for community events
  const steps = React.useMemo(() => {
    return [tMasterCourse('registrationSteps.personalInfo'), tMasterCourse('registrationSteps.paymentMethod')];
  }, [tMasterCourse]);

  // Validate current step before proceeding - memoize to prevent recreation
  const validateStep = React.useCallback((step: number): boolean => {
    if (step === 0) {
      // Validate personal information
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
        toast.error('Por favor complete todos los campos requeridos');
        return false;
      }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Por favor ingrese un email válido');
        return false;
      }
      return true;
    }
    
    return true;
  }, [formData.firstName, formData.lastName, formData.email, formData.phoneNumber]);

  // Handle step navigation - memoize to prevent recreation
  const handleNext = React.useCallback(() => {
    if (!validateStep(activeStep)) return;
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  }, [activeStep, validateStep, steps.length]);

  const handleBack = React.useCallback(() => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  }, []);

  const handleStepClick = React.useCallback((step: number) => {
    // Only allow going back to previous steps
    if (step < activeStep) {
      setActiveStep(step);
    } else if (step === activeStep + 1) {
      // Allow going forward only to the next step if current step is valid
      if (validateStep(activeStep)) {
        setActiveStep(step);
      }
    }
  }, [activeStep, validateStep]);

  // Memoize dialog paper props to prevent recreation
  const dialogPaperProps = React.useMemo(() => ({
    sx: {
      borderRadius: isMobile ? 0 : '12px',
      background: modalBackground,
      backdropFilter: 'blur(10px)',
      border: isMobile ? 'none' : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      boxShadow: isMobile ? 'none' : isDarkMode 
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)' 
        : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      maxWidth: isMobile ? '100%' : '900px',
      width: isMobile ? '100%' : '95vw',
      height: isMobile ? '100vh' : 'fit-content',
      maxHeight: isMobile ? '100vh' : '90vh',
      margin: isMobile ? 0 : 'auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
  }), [isMobile, modalBackground, isDarkMode]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={isMobile ? false : "lg"}
      fullWidth={!isMobile}
      fullScreen={isMobile}
      TransitionComponent={isMobile ? Transition : undefined}
      PaperProps={dialogPaperProps}
    >
      {/* Header */}
      {isMobile ? (
        <AppBar 
          position="static" 
          sx={{ 
            background: headerBackground,
            boxShadow: 'none',
          }}
        >
          <Toolbar sx={{ px: 2, py: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              sx={{ mr: 2 }}
            >
              <Close />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
              {event.title || event.name}
            </Typography>
          </Toolbar>
        </AppBar>
      ) : (
        <Box
          sx={{
            background: headerBackground,
            color: 'white',
            p: 3,
            position: 'relative',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            flexShrink: 0,
            boxShadow: '0 4px 20px rgba(22, 163, 74, 0.3)',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
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
            <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
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
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    py: 2.5,
                    px: 1,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                    '& .MuiChip-icon': {
                      color: '#16a34a',
                    },
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
      )}

      {/* Mobile Stepper */}
      {isMobile && (
        <Box 
          sx={{ 
            backgroundColor: modalBackground,
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            px: 2,
            py: 1.5,
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  onClick={() => handleStepClick(index)}
                  sx={{ 
                    cursor: index <= activeStep ? 'pointer' : 'default',
                    '& .MuiStepLabel-label': {
                      fontSize: '0.75rem',
                      mt: 0.5,
                    },
                    '& .MuiStepIcon-root': {
                      fontSize: '1.2rem',
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      {/* Form Content */}
      <DialogContent sx={{
        p: isMobile ? 2 : 3,
        pt: isMobile ? 2 : 2,
        pb: isMobile ? 10 : 2,
        backgroundColor: modalBackground,
        flex: '1 1 auto',
        overflow: 'auto',
        minHeight: 0,
        maxHeight: isMobile
          ? 'calc(100vh - 200px)' // Account for header and stepper
          : 'calc(100vh - 200px)',
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
          {/* Mobile Step-based Content */}
          {isMobile ? (
            <Box>
              {/* Step 0: Personal Information */}
              {activeStep === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography 
                      variant="h6" 
                      fontWeight={600} 
                      gutterBottom
                      sx={{ 
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                        mb: 2
                      }}
                    >
                      {t('events.registration.modal.personalInformation')}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
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
                  
                  <Grid item xs={12}>
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
                  
                  <Grid item xs={12}>
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
                  
                  <Grid item xs={12}>
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

                  {/* Referral Code Field - Only for Master Course and if enabled in settings */}
                  {enableReferralCode && event.type === 'master_course' && (
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
                  error={Boolean(validationError)}
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
                  {event.type === 'master_course' && (
                    <>
                      <Grid item xs={12}>
                        <Typography 
                          variant="h6" 
                          fontWeight={600} 
                          gutterBottom 
                          sx={{ 
                            mt: 2,
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                            mb: 1
                          }}
                        >
                          {t('events.registration.modal.tradingBackground')}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <CustomInput
                          icon={<TrendingUp />}
                          label={t('events.registration.modal.tradingExperience')}
                          name="tradingExperience"
                          value={formData.tradingExperience}
                          onChange={handleInputChange}
                          placeholder={t('events.registration.modal.tradingExperiencePlaceholder')}
                          multiline
                          rows={3}
                          disabled={isLoading}
                          isDarkMode={isDarkMode}
                          muiTheme={theme}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <CustomInput
                          icon={<Psychology />}
                          label={t('events.registration.modal.expectationsLabel')}
                          name="expectations"
                          value={formData.expectations}
                          onChange={handleInputChange}
                          placeholder={t('events.registration.modal.expectationsShortPlaceholder')}
                          multiline
                          rows={3}
                          disabled={isLoading}
                          isDarkMode={isDarkMode}
                          muiTheme={theme}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              )}

              {/* Step 1: Additional Attendees for Community Event - TEMPORARILY DISABLED */}
              {SHOW_ADDITIONAL_ATTENDEES_STEP && event.type === 'community_event' && activeStep === 1 && (
                <Grid container spacing={2}>
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
                  <Grid item xs={12}>
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

                  <Grid item xs={12}>
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
                </Grid>
              )}


              {/* Step 1 (Payment Methods) - Was Step 2 before additional attendees was disabled */}
              {activeStep === 1 && (
                <Grid container spacing={2}>
                  {/* Payment Mode Selection - Only show if partial payments are allowed */}
                  {event.paymentMode === 'partial_allowed' && (
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                          mb: 1.5
                        }}
                      >
                        {tMasterCourse('paymentModal.paymentOptions')}
                      </Typography>

                      <Stack spacing={2}>
                        {/* Full Payment Option */}
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            border: paymentMode === 'full'
                              ? '2px solid #16a34a'
                              : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                            backgroundColor: paymentMode === 'full'
                              ? alpha('#16a34a', 0.05)
                              : isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: alpha('#16a34a', 0.08),
                            },
                          }}
                          onClick={() => setPaymentMode('full')}
                        >
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                {tMasterCourse('paymentModal.payInFull')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {tMasterCourse('paymentModal.payFullDescription')}
                              </Typography>
                            </Box>
                            <Typography variant="h6" fontWeight={700} color="primary">
                              ${totalPrice.toFixed(2)}
                            </Typography>
                          </Stack>
                        </Paper>

                        {/* Partial Payment Option */}
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            border: paymentMode === 'partial'
                              ? '2px solid #ec4899'
                              : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                            backgroundColor: paymentMode === 'partial'
                              ? alpha('#ec4899', 0.05)
                              : isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: alpha('#ec4899', 0.08),
                            },
                          }}
                          onClick={() => setPaymentMode('partial')}
                        >
                          <Stack spacing={2}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Box>
                                <Typography variant="body1" fontWeight={600}>
                                  {tMasterCourse('paymentModal.partialPayment')}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Paga un depósito ahora y el resto después
                                </Typography>
                              </Box>
                            </Stack>

                            {/* Deposit Amount Selection */}
                            {paymentMode === 'partial' && (
                              <Box>
                                <Divider sx={{ my: 1 }} />
                                <Stack spacing={1.5}>
                                  <Typography variant="body2" fontWeight={600}>
                                    {tMasterCourse('paymentModal.selectDeposit')}
                                  </Typography>

                                  {/* Percentage Options */}
                                  {event.depositPercentage && (
                                    <Button
                                      variant={selectedDepositOption === 'percentage' ? 'contained' : 'outlined'}
                                      size="small"
                                      onClick={() => {
                                        setSelectedDepositOption('percentage');
                                        setDepositAmount(totalPrice * event.depositPercentage! / 100);
                                      }}
                                      sx={{
                                        justifyContent: 'space-between',
                                        textTransform: 'none',
                                      }}
                                    >
                                      <span>{event.depositPercentage}% {tMasterCourse('paymentModal.deposit')}</span>
                                      <span>${(totalPrice * event.depositPercentage / 100).toFixed(2)}</span>
                                    </Button>
                                  )}

                                  {/* Custom Amount */}
                                  <Stack spacing={0.5}>
                                    <Button
                                      variant={selectedDepositOption === 'custom' ? 'contained' : 'outlined'}
                                      size="small"
                                      onClick={() => setSelectedDepositOption('custom')}
                                      sx={{
                                        textTransform: 'none',
                                      }}
                                    >
                                      {tMasterCourse('paymentModal.customAmount')}
                                    </Button>

                                    {selectedDepositOption === 'custom' && (
                                      <CustomInput
                                        icon={<CreditCard />}
                                        label={tMasterCourse('paymentModal.depositAmount')}
                                        name="depositAmount"
                                        type="number"
                                        value={depositAmount.toString()}
                                        onChange={(e) => {
                                          const value = parseFloat(e.target.value) || 0;
                                          setDepositAmount(value);
                                        }}
                                        placeholder={`${tMasterCourse('paymentModal.minimum')} $${event.minimumDepositAmount || 0}`}
                                        isDarkMode={isDarkMode}
                                        muiTheme={theme}
                                      />
                                    )}
                                  </Stack>

                                  {/* Payment Summary */}
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      p: 1.5,
                                      backgroundColor: alpha('#ec4899', 0.1),
                                      border: `1px solid ${alpha('#ec4899', 0.2)}`,
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Stack spacing={0.5}>
                                      <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="caption">Depósito Hoy:</Typography>
                                        <Typography variant="caption" fontWeight={700}>
                                          ${depositAmount.toFixed(2)}
                                        </Typography>
                                      </Stack>
                                      <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="caption">Saldo Pendiente:</Typography>
                                        <Typography variant="caption" fontWeight={700}>
                                          ${(totalPrice - depositAmount).toFixed(2)}
                                        </Typography>
                                      </Stack>
                                    </Stack>
                                  </Paper>
                                </Stack>
                              </Box>
                            )}
                          </Stack>
                        </Paper>
                      </Stack>

                      <Divider sx={{ my: 2 }} />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      sx={{
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                        mb: 2
                      }}
                    >
                      {tMasterCourse('paymentModal.selectPaymentMethod')}
                    </Typography>
                  </Grid>

                  {/* Display price summary if there's a discount */}
                  {codeValidated && discountAmount > 0 && (
                    <Grid item xs={12}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          backgroundColor: alpha('#16a34a', 0.08),
                          border: `1px solid ${alpha('#16a34a', 0.2)}`,
                          borderRadius: 2,
                          mb: 2,
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Precio original:</Typography>
                            <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                              ${(totalPrice + discountAmount).toFixed(2)} USD
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" fontWeight={600}>Descuento aplicado:</Typography>
                            <Typography variant="body2" fontWeight={600} color="success.main">
                              -${discountAmount.toFixed(2)} USD
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body1" fontWeight={700}>Total a pagar:</Typography>
                            <Typography variant="body1" fontWeight={700} color="primary.main">
                              ${totalPrice.toFixed(2)} USD
                            </Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>
                  )}

                  {/* Payment Methods */}
                  <Grid item xs={12}>
                    <Stack spacing={2}>
                      {/* Card Payment */}
                      <Button
                        onClick={() => handleSubmit('card')}
                        disabled={isLoading}
                        variant="contained"
                        fullWidth
                        startIcon={<CreditCard />}
                        sx={{
                          py: 2.5,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                          color: 'white',
                          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                            boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)',
                            transform: 'translateY(-2px)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                            color: 'white',
                            opacity: 0.7,
                          },
                        }}
                      >
                        <Stack alignItems="center" spacing={0.5}>
                          <Typography variant="body1" fontWeight={600} sx={{ color: 'white' }}>
                            {paymentMode === 'partial' ? tMasterCourse('paymentModal.payDepositButton') : tMasterCourse('paymentModal.payWithCard')}
                          </Typography>
                          <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                            ${(paymentMode === 'partial' ? depositAmount : totalPrice).toFixed(2)} USD
                          </Typography>
                          {paymentMode === 'partial' && (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {tMasterCourse('paymentModal.balance')} ${(totalPrice - depositAmount).toFixed(2)}
                            </Typography>
                          )}
                          {isLoading && selectedPaymentMethod === 'card' && (
                            <CircularProgress size={20} sx={{ color: 'white' }} />
                          )}
                        </Stack>
                      </Button>

                      {/* Klarna Payment */}
                      <Button
                        onClick={() => handleSubmit('klarna')}
                        disabled={isLoading}
                        variant="contained"
                        fullWidth
                        startIcon={<Wallet />}
                        sx={{
                          py: 2.5,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                          color: 'white',
                          boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                            boxShadow: '0 6px 20px rgba(236, 72, 153, 0.4)',
                            transform: 'translateY(-2px)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                            color: 'white',
                            opacity: 0.7,
                          },
                        }}
                      >
                        <Stack alignItems="center" spacing={0.5}>
                          <Typography variant="body1" fontWeight={600} sx={{ color: 'white' }}>
                            {paymentMode === 'partial' ? tMasterCourse('paymentModal.financeDepositWith', { provider: 'Klarna' }) : tMasterCourse('paymentModal.financeWith', { provider: 'Klarna' })}
                          </Typography>
                          <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                            ${((paymentMode === 'partial' ? depositAmount : totalPrice) * (1 + KLARNA_FEE_PERCENTAGE)).toFixed(2)} USD
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {tMasterCourse('paymentModal.includes', { fee: (KLARNA_FEE_PERCENTAGE * 100).toFixed(2) })}
                          </Typography>
                          {paymentMode === 'partial' && (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {tMasterCourse('paymentModal.balanceAfterDeposit')} ${(totalPrice - depositAmount).toFixed(2)}
                            </Typography>
                          )}
                          {isLoading && selectedPaymentMethod === 'klarna' && (
                            <CircularProgress size={20} sx={{ color: 'white' }} />
                          )}
                        </Stack>
                      </Button>

                      {/* Afterpay Payment */}
                      <Button
                        onClick={() => handleSubmit('afterpay')}
                        disabled={isLoading}
                        variant="contained"
                        fullWidth
                        startIcon={<CreditCard />}
                        sx={{
                          py: 2.5,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                          color: 'white',
                          boxShadow: '0 4px 14px rgba(0, 212, 170, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #00b894 0%, #00a884 100%)',
                            boxShadow: '0 6px 20px rgba(0, 212, 170, 0.4)',
                            transform: 'translateY(-2px)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                            color: 'white',
                            opacity: 0.7,
                          },
                        }}
                      >
                        <Stack alignItems="center" spacing={0.5}>
                          <Typography variant="body1" fontWeight={600} sx={{ color: 'white' }}>
                            {paymentMode === 'partial' ? tMasterCourse('paymentModal.payDepositWith', { provider: 'Afterpay' }) : tMasterCourse('paymentModal.payWith', { provider: 'Afterpay' })}
                          </Typography>
                          <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                            ${((paymentMode === 'partial' ? depositAmount : totalPrice) * (1 + AFTERPAY_FEE_PERCENTAGE)).toFixed(2)} USD
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {tMasterCourse('paymentModal.interestFree')}
                          </Typography>
                          {paymentMode === 'partial' && (
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              {tMasterCourse('paymentModal.balanceAfterDeposit')} ${(totalPrice - depositAmount).toFixed(2)}
                            </Typography>
                          )}
                          {isLoading && selectedPaymentMethod === 'afterpay' && (
                            <CircularProgress size={20} sx={{ color: 'white' }} />
                          )}
                        </Stack>
                      </Button>

                      {/* Local Financing */}
                      {user?.allowLocalFinancing && (
                        <Button
                          onClick={() => handleSubmit('local_financing', '4_biweekly')}
                          disabled={isLoading}
                          variant="contained"
                          fullWidth
                          startIcon={<Wallet />}
                          sx={{
                            py: 2.5,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                            color: 'white',
                            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                              boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
                              transform: 'translateY(-2px)',
                            },
                            '&:disabled': {
                              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                              color: 'white',
                              opacity: 0.7,
                            },
                          }}
                        >
                          <Stack alignItems="center" spacing={0.5}>
                            <Typography variant="body1" fontWeight={600} sx={{ color: 'white' }}>
                              {paymentMode === 'partial' ? tMasterCourse('paymentModal.financeDeposit') : tMasterCourse('paymentModal.localFinancing')}
                            </Typography>
                            <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                              ${(paymentMode === 'partial' ? depositAmount : totalPrice).toFixed(2)} USD
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                              4 pagos quincenales sin intereses
                            </Typography>
                            {paymentMode === 'partial' && (
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                {tMasterCourse('paymentModal.balanceAfterDeposit')} ${(totalPrice - depositAmount).toFixed(2)}
                              </Typography>
                            )}
                            {isLoading && selectedPaymentMethod === 'local_financing' && (
                              <CircularProgress size={20} sx={{ color: 'white' }} />
                            )}
                          </Stack>
                        </Button>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              )}

              {/* Mobile Navigation Buttons */}
              {isMobile && (
                <Box
                  sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: modalBackground,
                    borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2,
                    zIndex: 1,
                  }}
                >
                  {/* Only show Back button when not on first step */}
                  {activeStep > 0 && (
                    <Button
                      onClick={handleBack}
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      sx={{
                        flex: 1,
                      }}
                    >
                      Anterior
                    </Button>
                  )}
                  {/* Show Next button only if not on last step (step 1 is now payment) */}
                  {activeStep === 0 && (
                    <Button
                      onClick={handleNext}
                      disabled={isLoading}
                      variant="contained"
                      fullWidth
                      endIcon={<ArrowForward />}
                      sx={{
                        background: buttonBackground,
                        '&:hover': {
                          background: buttonHoverBackground,
                        },
                      }}
                    >
                      Continuar al Pago
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            /* Desktop Version - Original Layout */
            <Grid container spacing={2}>
              {/* Info Box */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 1,
                  backgroundColor: isDarkMode
                    ? alpha(event.type === 'master_course' ? '#16a34a' : '#3b82f6', 0.1)
                    : alpha(event.type === 'master_course' ? '#16a34a' : '#3b82f6', 0.05),
                  border: `1px solid ${isDarkMode
                    ? alpha(event.type === 'master_course' ? '#16a34a' : '#3b82f6', 0.3)
                    : alpha(event.type === 'master_course' ? '#16a34a' : '#3b82f6', 0.2)}`,
                  borderRadius: '12px',
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

            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                  mb: 1,
                  mt: 1,
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

            {/* Referral Code Field - Only for Master Course and if enabled in settings */}
            {enableReferralCode && event.type === 'master_course' && (
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
                  error={Boolean(validationError)}
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
            {event.type === 'master_course' && (
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
            )}

            {/* Payment Mode Selection - Desktop Version */}
            {event.paymentMode === 'partial_allowed' && event.price && event.price > 0 && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                      mb: 2
                    }}
                  >
                    {tMasterCourse('paymentModal.paymentOptions')}
                  </Typography>
                </Grid>

                {/* Full Payment Option */}
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      cursor: 'pointer',
                      border: paymentMode === 'full'
                        ? '2px solid #16a34a'
                        : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      backgroundColor: paymentMode === 'full'
                        ? alpha('#16a34a', 0.08)
                        : isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha('#16a34a', 0.12),
                        borderColor: '#16a34a',
                      },
                    }}
                    onClick={() => setPaymentMode('full')}
                  >
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={700}>
                          {tMasterCourse('paymentModal.payInFull')}
                        </Typography>
                        {paymentMode === 'full' && (
                          <CheckCircle sx={{ color: '#16a34a' }} />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {tMasterCourse('paymentModal.payFullDescription')}
                      </Typography>
                      <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ mt: 1 }}>
                        ${totalPrice.toFixed(2)} USD
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Partial Payment Option */}
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      cursor: 'pointer',
                      border: paymentMode === 'partial'
                        ? '2px solid #ec4899'
                        : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      backgroundColor: paymentMode === 'partial'
                        ? alpha('#ec4899', 0.08)
                        : isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha('#ec4899', 0.12),
                        borderColor: '#ec4899',
                      },
                    }}
                    onClick={() => setPaymentMode('partial')}
                  >
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={700}>
                          {tMasterCourse('paymentModal.partialPayment')}
                        </Typography>
                        {paymentMode === 'partial' && (
                          <CheckCircle sx={{ color: '#ec4899' }} />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {tMasterCourse('paymentModal.partialDescription')}
                      </Typography>
                      <Typography variant="h5" fontWeight={700} sx={{ color: '#ec4899', mt: 1 }}>
                        {tMasterCourse('paymentModal.from')} ${event.minimumDepositAmount || 0} USD
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Deposit Amount Selection - Only show when partial mode is selected */}
                {paymentMode === 'partial' && (
                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        backgroundColor: alpha('#ec4899', 0.05),
                        border: `1px solid ${alpha('#ec4899', 0.2)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {tMasterCourse('paymentModal.selectDeposit')}
                      </Typography>

                      <Stack spacing={2}>
                        {/* Percentage-based deposit option */}
                        {event.depositPercentage && (
                          <Button
                            variant={selectedDepositOption === 'percentage' ? 'contained' : 'outlined'}
                            fullWidth
                            onClick={() => {
                              setSelectedDepositOption('percentage');
                              const calculatedDeposit = totalPrice * event.depositPercentage! / 100;
                              setDepositAmount(Math.max(event.minimumDepositAmount || 0, calculatedDeposit));
                            }}
                            sx={{
                              py: 2,
                              justifyContent: 'space-between',
                              textTransform: 'none',
                              background: selectedDepositOption === 'percentage'
                                ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                                : 'transparent',
                              '&:hover': {
                                background: selectedDepositOption === 'percentage'
                                  ? 'linear-gradient(135deg, #db2777 0%, #be185d 100%)'
                                  : alpha('#ec4899', 0.08),
                              },
                            }}
                          >
                            <Box>
                              <Typography variant="body1" fontWeight={600} sx={{ textAlign: 'left' }}>
                                {tMasterCourse('paymentModal.recommendedDeposit', { percentage: event.depositPercentage })}
                              </Typography>
                              <Typography variant="caption" sx={{ textAlign: 'left', display: 'block', opacity: 0.8 }}>
                                {tMasterCourse('paymentModal.mostCommon')}
                              </Typography>
                            </Box>
                            <Typography variant="h6" fontWeight={700}>
                              ${(totalPrice * event.depositPercentage / 100).toFixed(2)}
                            </Typography>
                          </Button>
                        )}

                        {/* Custom amount option */}
                        <Button
                          variant={selectedDepositOption === 'custom' ? 'contained' : 'outlined'}
                          fullWidth
                          onClick={() => setSelectedDepositOption('custom')}
                          sx={{
                            py: 1.5,
                            textTransform: 'none',
                            background: selectedDepositOption === 'custom'
                              ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                              : 'transparent',
                            '&:hover': {
                              background: selectedDepositOption === 'custom'
                                ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)'
                                : alpha('#8b5cf6', 0.08),
                            },
                          }}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            {tMasterCourse('paymentModal.customAmount')}
                          </Typography>
                        </Button>

                        {/* Custom amount input */}
                        {selectedDepositOption === 'custom' && (
                          <Box sx={{ mt: 2 }}>
                            <CustomInput
                              icon={<CreditCard />}
                              label={`${tMasterCourse('paymentModal.depositAmount')} (USD)`}
                              name="depositAmount"
                              type="number"
                              value={depositAmount.toString()}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                setDepositAmount(value);
                              }}
                              placeholder={`Mínimo $${event.minimumDepositAmount || 0}`}
                              isDarkMode={isDarkMode}
                              muiTheme={theme}
                              helperText={`Mínimo: $${event.minimumDepositAmount || 0} | Máximo: $${totalPrice.toFixed(2)}`}
                            />
                          </Box>
                        )}

                        {/* Payment Summary */}
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            backgroundColor: alpha('#ec4899', 0.1),
                            border: `1px solid ${alpha('#ec4899', 0.3)}`,
                            borderRadius: 2,
                          }}
                        >
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" fontWeight={600}>
                                {tMasterCourse('paymentModal.depositToday')}
                              </Typography>
                              <Typography variant="h6" fontWeight={700} sx={{ color: '#ec4899' }}>
                                ${depositAmount.toFixed(2)}
                              </Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" fontWeight={600}>
                                {tMasterCourse('paymentModal.remainingBalance')}
                              </Typography>
                              <Typography variant="h6" fontWeight={700} color="text.secondary">
                                ${(totalPrice - depositAmount).toFixed(2)}
                              </Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" fontWeight={600} sx={{ color: '#16a34a' }}>
                                {tMasterCourse('paymentModal.courseTotal')}
                              </Typography>
                              <Typography variant="h6" fontWeight={700} sx={{ color: '#16a34a' }}>
                                ${totalPrice.toFixed(2)}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Paper>

                        <Alert severity="info" sx={{ mt: 1 }}>
                          <Typography variant="caption">
                            {tMasterCourse('paymentModal.afterDepositNotice')}
                          </Typography>
                        </Alert>
                      </Stack>
                    </Paper>
                  </Grid>
                )}
              </>
            )}

          </Grid>
          )}
        </Box>
      </DialogContent>
      
      {/* Action Buttons - Outside scrollable area */}
      {/* Hide these buttons completely on mobile */}
      {!isMobile && (
        <Box sx={{
          p: 3,
          pt: 2.5,
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
                  borderRadius: '12px',
                  textTransform: 'none',
                  py: { xs: 1.5, sm: 1.5 },
                  px: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  minHeight: { xs: '56px', sm: 'auto' },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                    boxShadow: '0 6px 20px rgba(22, 163, 74, 0.45)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    opacity: 0.7,
                  },
                }}
              >
                {isLoading && selectedPaymentMethod === 'card' ? (
                  t('status.processing')
                ) : (
                  <>
                    <span>
                      {paymentMode === 'partial' ? tMasterCourse('paymentModal.payDeposit') : tMasterCourse('paymentModal.payWithCard')}
                    </span>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {codeValidated && discountAmount > 0 && paymentMode === 'full' && (
                        <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', opacity: 0.7 }}>
                          ${(totalPrice + discountAmount).toFixed(2)} USD
                        </span>
                      )}
                      <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                        ${(paymentMode === 'partial' ? depositAmount : totalPrice).toFixed(2)} USD
                      </span>
                      {paymentMode === 'partial' && (
                        <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                          {tMasterCourse('paymentModal.balance')} ${(totalPrice - depositAmount).toFixed(2)}
                        </span>
                      )}
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
                  borderRadius: '12px',
                  textTransform: 'none',
                  py: { xs: 1.5, sm: 1.5 },
                  px: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  minHeight: { xs: '72px', sm: 'auto' },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                    boxShadow: '0 6px 20px rgba(236, 72, 153, 0.45)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    opacity: 0.7,
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
                    <span>
                      {paymentMode === 'partial' ? tMasterCourse('paymentModal.financeDepositWith', { provider: 'Klarna' }) : tMasterCourse('paymentModal.financeWith', { provider: 'Klarna' })}
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1px' }}>
                      ${((paymentMode === 'partial' ? depositAmount : totalPrice) * (1 + KLARNA_FEE_PERCENTAGE)).toFixed(2)} USD
                    </span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '-1px' }}>
                      {tMasterCourse('paymentModal.includes', { fee: (KLARNA_FEE_PERCENTAGE * 100).toFixed(2) })}
                    </span>
                    {paymentMode === 'partial' && (
                      <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                        {tMasterCourse('paymentModal.balanceAfter')} ${(totalPrice - depositAmount).toFixed(2)}
                      </span>
                    )}
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleSubmit('afterpay')}
                disabled={isLoading && selectedPaymentMethod === 'afterpay'}
                variant="contained"
                size="medium"
                fullWidth
                startIcon={isLoading && selectedPaymentMethod === 'afterpay' ? <CircularProgress size={18} color="inherit" /> : <CreditCard />}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  py: { xs: 1.5, sm: 1.5 },
                  px: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)',
                  boxShadow: '0 4px 14px rgba(0, 212, 170, 0.35)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  minHeight: { xs: '72px', sm: 'auto' },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00B894 0%, #00A884 100%)',
                    boxShadow: '0 6px 20px rgba(0, 212, 170, 0.45)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)',
                    opacity: 0.7,
                  },
                  '@media (max-width: 600px)': {
                    '& .MuiButton-startIcon': {
                      display: 'none',
                    },
                  },
                }}
              >
                {isLoading && selectedPaymentMethod === 'afterpay' ? (
                  t('status.processing')
                ) : (
                  <>
                    <span>
                      {paymentMode === 'partial' ? tMasterCourse('paymentModal.financeDepositWith', { provider: 'Afterpay' }) : tMasterCourse('paymentModal.payWith', { provider: 'Afterpay' })}
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1px' }}>
                      ${((paymentMode === 'partial' ? depositAmount : totalPrice) * (1 + AFTERPAY_FEE_PERCENTAGE)).toFixed(2)} USD
                    </span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '-1px' }}>
                      {tMasterCourse('paymentModal.interestFree')}
                    </span>
                    {paymentMode === 'partial' && (
                      <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                        {tMasterCourse('paymentModal.balanceAfter')} ${(totalPrice - depositAmount).toFixed(2)}
                      </span>
                    )}
                  </>
                )}
              </Button>

              {/* Local Financing Option - Only show if user is approved */}
              {user?.approvedForLocalFinancing && (
                <Button
                  onClick={() => handleSubmit('local_financing', '4_biweekly')}
                  disabled={isLoading && selectedPaymentMethod === 'local_financing'}
                  variant="contained"
                  size="medium"
                  fullWidth
                  startIcon={isLoading && selectedPaymentMethod === 'local_financing' ? <CircularProgress size={18} color="inherit" /> : <Wallet />}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    py: { xs: 1.5, sm: 1.5 },
                    px: { xs: 2, sm: 3 },
                    fontSize: { xs: '0.9rem', sm: '0.95rem' },
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    minHeight: { xs: '72px', sm: 'auto' },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                      boxShadow: '0 6px 20px rgba(139, 92, 246, 0.45)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                      opacity: 0.7,
                    },
                    '@media (max-width: 600px)': {
                      '& .MuiButton-startIcon': {
                        display: 'none',
                      },
                    },
                  }}
                >
                  {isLoading && selectedPaymentMethod === 'local_financing' ? (
                    t('status.processing')
                  ) : (
                    <>
                      <span>
                        {paymentMode === 'partial' ? tMasterCourse('paymentModal.financeDeposit') : tMasterCourse('paymentModal.localFinancing')}
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1px' }}>
                        {paymentMode === 'partial'
                          ? `${depositAmount.toFixed(2)} USD`
                          : `4 pagos de $${(totalPrice / 4).toFixed(2)} USD`
                        }
                      </span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '-1px' }}>
                        {paymentMode === 'partial' ? '4 pagos quincenales' : t('events.registration.modal.localFinancingDescription', 'Sin verificación de crédito')}
                      </span>
                      {paymentMode === 'partial' && (
                        <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                          {tMasterCourse('paymentModal.balanceAfter')} ${(totalPrice - depositAmount).toFixed(2)}
                        </span>
                      )}
                    </>
                  )}
                </Button>
              )}
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
      )}
    </Dialog>
  );
}