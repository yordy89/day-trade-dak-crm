'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  MenuItem,
  FormControl,
  InputBase,
  Select,
  useTheme as useMuiTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import { 
  Email, 
  Phone, 
  LocationOn, 
  Schedule,
  Person,
  Message,
  Send,
  Category,
} from '@mui/icons-material';
import { MainNavbar } from '@/components/landing/main-navbar';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/theme-provider';
import { useSettings } from '@/services/api/settings.service';
import { ProfessionalFooter } from '@/components/landing/professional-footer';
import { contactService } from '@/services/api/contact.service';
import { Snackbar, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import API from '@/lib/axios';

interface CustomInputProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  isDarkMode: boolean;
  muiTheme: any;
  multiline?: boolean;
  rows?: number;
  name: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  icon, 
  label, 
  isDarkMode, 
  muiTheme,
  multiline = false,
  rows = 1,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <FormControl fullWidth sx={{ '& .MuiFormControl-root': { border: 'none', outline: 'none' } }}>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 1, 
          fontWeight: 500,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {label} {props.required ? <span style={{ color: muiTheme.palette.error.main }}>*</span> : null}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: multiline ? 'flex-start' : 'center',
          backgroundColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(10px)',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          borderRadius: 2,
          border: 'none !important',
          boxShadow: 'none !important',
          transition: 'all 0.3s',
          overflow: 'hidden',
          position: 'relative',
          outline: 'none !important',
          '&:hover': {
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.12)' 
              : 'rgba(0, 0, 0, 0.06)',
            border: 'none !important',
            outline: 'none !important',
            boxShadow: 'none !important',
          },
          '&:focus, &:focus-visible, &:active': {
            border: 'none !important',
            outline: 'none !important',
            boxShadow: 'none !important',
          },
          '&:focus-within': {
            outline: 'none !important',
            border: 'none !important',
            boxShadow: 'none !important',
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
              ? muiTheme.palette.primary.main 
              : 'rgba(0, 0, 0, 0.6)',
            transition: 'color 0.3s',
          }}
        >
          {icon}
        </Box>
        <InputBase
          {...props}
          multiline={multiline}
          rows={rows}
          className="autofill-input"
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          sx={{
            flex: 1,
            py: 1.75,
            pr: 2,
            fontSize: '16px',
            fontWeight: 400,
            backgroundColor: 'transparent',
            '&.MuiInputBase-root': {
              backgroundColor: 'transparent',
              '&:before': {
                display: 'none !important',
                border: 'none !important',
              },
              '&:after': {
                display: 'none !important',
                border: 'none !important',
              },
              '&:hover:before': {
                display: 'none !important',
                border: 'none !important',
              },
              '&.Mui-focused': {
                backgroundColor: 'transparent',
                outline: 'none !important',
                '&:before': {
                  display: 'none !important',
                  border: 'none !important',
                },
                '&:after': {
                  display: 'none !important',
                  border: 'none !important',
                },
              },
            },
            '& input, & textarea': {
              padding: '0 0 0 8px',
              backgroundColor: 'transparent',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.95) !important' : 'rgba(0, 0, 0, 0.87) !important',
              WebkitTextFillColor: isDarkMode ? 'rgba(255, 255, 255, 0.95) !important' : 'rgba(0, 0, 0, 0.87) !important',
              outline: 'none !important',
              border: 'none !important',
              '&:focus': {
                outline: 'none !important',
                border: 'none !important',
                backgroundColor: 'transparent',
              },
              '&:-webkit-autofill': {
                WebkitBoxShadow: isDarkMode 
                  ? '0 0 0 1000px rgba(255, 255, 255, 0.08) inset !important'
                  : '0 0 0 1000px rgba(0, 0, 0, 0.04) inset !important',
                WebkitTextFillColor: isDarkMode ? 'rgba(255, 255, 255, 0.95) !important' : 'rgba(0, 0, 0, 0.87) !important',
                caretColor: isDarkMode ? 'rgba(255, 255, 255, 0.95) !important' : 'rgba(0, 0, 0, 0.87) !important',
                transition: 'background-color 5000s ease-in-out 0s',
                backgroundColor: 'transparent !important',
              },
              '&:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active': {
                WebkitBoxShadow: isDarkMode 
                  ? '0 0 0 1000px rgba(255, 255, 255, 0.08) inset !important'
                  : '0 0 0 1000px rgba(0, 0, 0, 0.04) inset !important',
                WebkitTextFillColor: isDarkMode ? 'rgba(255, 255, 255, 0.95) !important' : 'rgba(0, 0, 0, 0.87) !important',
                backgroundColor: 'transparent !important',
              },
            },
            '& input::placeholder, & textarea::placeholder': {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              opacity: 1,
            },
          }}
        />
      </Box>
    </FormControl>
  );
};

interface CustomSelectProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: any) => void;
  required?: boolean;
  isDarkMode: boolean;
  muiTheme: any;
  name: string;
  children: React.ReactNode;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  icon, 
  label, 
  isDarkMode, 
  muiTheme,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useTranslation();
  
  return (
    <FormControl fullWidth sx={{ '& .MuiFormControl-root': { border: 'none', outline: 'none' } }}>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 1, 
          fontWeight: 500,
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        }}
      >
        {label} {props.required ? <span style={{ color: muiTheme.palette.error.main }}>*</span> : null}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isDarkMode 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(10px)',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          borderRadius: 2,
          border: 'none !important',
          boxShadow: 'none !important',
          transition: 'all 0.3s',
          overflow: 'hidden',
          position: 'relative',
          outline: 'none !important',
          '&:hover': {
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.12)' 
              : 'rgba(0, 0, 0, 0.06)',
            border: 'none !important',
            outline: 'none !important',
            boxShadow: 'none !important',
          },
          '&:focus, &:focus-visible, &:active': {
            border: 'none !important',
            outline: 'none !important',
            boxShadow: 'none !important',
          },
          '&:focus-within': {
            outline: 'none !important',
            border: 'none !important',
            boxShadow: 'none !important',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 1.5,
            color: isFocused 
              ? muiTheme.palette.primary.main 
              : 'rgba(0, 0, 0, 0.6)',
            transition: 'color 0.3s',
          }}
        >
          {icon}
        </Box>
        <Select
          {...props}
          variant="standard"
          displayEmpty
          renderValue={(selected) => {
            if (!selected || selected === '') {
              return <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }}>{props.placeholder || t('contact.form.selectType')}</span>;
            }
            return selected;
          }}
          onOpen={() => setIsFocused(true)}
          onClose={() => setIsFocused(false)}
          sx={{
            flex: 1,
            height: '100%',
            pr: 2,
            pl: 1,
            fontSize: '16px',
            fontWeight: 400,
            backgroundColor: 'transparent',
            color: isDarkMode ? 'rgba(255, 255, 255, 0.87) !important' : 'rgba(0, 0, 0, 0.87) !important',
            '& .MuiSelect-select': {
              py: 1.75,
              display: 'flex',
              alignItems: 'center',
            },
            '&:before': {
              display: 'none !important',
            },
            '&:after': {
              display: 'none !important',
            },
            '&:hover:before': {
              display: 'none !important',
            },
            '&.Mui-focused:before': {
              display: 'none !important',
            },
            '&.Mui-focused:after': {
              display: 'none !important',
            },
            '& .MuiSelect-icon': {
              color: isDarkMode ? 'rgba(255, 255, 255, 0.54)' : 'rgba(0, 0, 0, 0.54)',
            },
          }}
        >
          {props.children}
        </Select>
      </Box>
    </FormControl>
  );
};

// Professional Market Chart Pattern
const MarketChartPattern = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Box
    sx={{
      position: 'absolute',
      top: '40px',
      right: '40px',
      width: '250px',
      height: '150px',
      opacity: isDarkMode ? 0.08 : 0.06,
      pointerEvents: 'none',
    }}
  >
    <svg width="250" height="150" viewBox="0 0 250 150">
      {/* Grid Lines */}
      {[...Array(5)].map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 30}
          x2="250"
          y2={i * 30}
          stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
          strokeWidth="0.5"
        />
      ))}
      {[...Array(9)].map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 30}
          y1="0"
          x2={i * 30}
          y2="150"
          stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
          strokeWidth="0.5"
        />
      ))}
      
      {/* Price Line Chart */}
      <path
        d="M 10 100 L 40 85 L 70 95 L 100 60 L 130 70 L 160 45 L 190 55 L 220 30 L 240 40"
        stroke="#16a34a"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Volume Bars */}
      {[...Array(8)].map((_, i) => {
        const height = Math.random() * 30 + 10;
        const x = i * 30 + 10;
        const isGreen = Math.random() > 0.5;
        
        return (
          <rect
            key={i}
            x={x}
            y={150 - height}
            width="20"
            height={height}
            fill={isGreen ? '#16a34a' : '#ef4444'}
            opacity="0.3"
          />
        );
      })}
      
      {/* Moving Average Line */}
      <path
        d="M 10 90 Q 50 85 90 80 T 170 75 T 240 70"
        stroke="#eab308"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="3,3"
      />
    </svg>
  </Box>
);

// Trading Signals Pattern
const SignalWaves = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 800 200"
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      opacity: isDarkMode ? 0.2 : 0.15,
      pointerEvents: 'none',
    }}
  >
    {[...Array(3)].map((_, i) => (
      <g key={i}>
        <path
          d={`M 0 ${100 + i * 20} Q 200 ${80 + i * 20} 400 ${100 + i * 20} T 800 ${100 + i * 20}`}
          stroke={i === 0 ? '#16a34a' : i === 1 ? '#eab308' : '#ef4444'}
          strokeWidth="2"
          fill="none"
          opacity={1 - i * 0.2}
        >
          <animate
            attributeName="d"
            values={`
              M 0 ${100 + i * 20} Q 200 ${80 + i * 20} 400 ${100 + i * 20} T 800 ${100 + i * 20};
              M 0 ${100 + i * 20} Q 200 ${120 + i * 20} 400 ${100 + i * 20} T 800 ${100 + i * 20};
              M 0 ${100 + i * 20} Q 200 ${80 + i * 20} 400 ${100 + i * 20} T 800 ${100 + i * 20}
            `}
            dur={`${4 + i}s`}
            repeatCount="indefinite"
          />
        </path>
      </g>
    ))}
  </svg>
);

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const muiTheme = useMuiTheme();
  const { isDarkMode } = useTheme();
  const { data: settings } = useSettings();
  
  // Fetch real stock data
  const { data: stockData } = useQuery<StockData[]>({
    queryKey: ['contact-stocks'],
    queryFn: async () => {
      const response = await API.get('/market/featured');
      // Get 8 stocks for the floating tags
      return response.data.slice(0, 8);
    },
    refetchInterval: 60000, // Refresh every minute
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  });

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: 32 }} />,
      titleKey: 'contact.info.email.title',
      details: settings?.contact?.contact_email || 'support@daytradedk.com',
      actionKey: 'contact.info.email.action',
      href: `mailto:${settings?.contact?.contact_email || 'support@daytradedk.com'}`,
    },
    {
      icon: <Phone sx={{ fontSize: 32 }} />,
      titleKey: 'contact.info.phone.title',
      details: settings?.contact?.contact_phone || '+1 (800) 123-4567',
      actionKey: 'contact.info.phone.action',
      href: `tel:${settings?.contact?.contact_phone?.replace(/[^0-9+]/g, '') || '+18001234567'}`,
    },
    {
      icon: <LocationOn sx={{ fontSize: 32 }} />,
      titleKey: 'contact.info.office.title',
      details: settings?.contact?.contact_address || 'Miami, FL 33131',
      actionKey: 'contact.info.office.action',
    },
    {
      icon: <Schedule sx={{ fontSize: 32 }} />,
      titleKey: 'contact.info.hours.title',
      detailsKey: 'contact.info.hours.details',
      actionKey: 'contact.info.hours.action',
    },
  ];

  const inquiryTypes = [
    { key: 'general', labelKey: 'contact.inquiryTypes.general' },
    { key: 'technical', labelKey: 'contact.inquiryTypes.technical' },
    { key: 'billing', labelKey: 'contact.inquiryTypes.billing' },
    { key: 'partnership', labelKey: 'contact.inquiryTypes.partnership' },
    { key: 'media', labelKey: 'contact.inquiryTypes.media' },
    { key: 'other', labelKey: 'contact.inquiryTypes.other' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const _result = await contactService.submitContactForm({
        ...formData,
        inquiryType: formData.inquiryType as any,
      });
      
      setSnackbar({
        open: true,
        message: t('contact.form.successMessage', 'Your message has been sent successfully! We will get back to you soon.'),
        severity: 'success',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: '',
        message: '',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: t('contact.form.errorMessage', 'Failed to send message. Please try again later.'),
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <MainNavbar />
      <Box 
        sx={{ pt: 18, pb: 10, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}
      >
        {/* Animated Trading Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          {/* Floating Price Tags with Real Data */}
          {stockData ? stockData.map((stock, i) => {
            const isPositive = stock.changePercent > 0;
            const isNeutral = stock.changePercent === 0;
            const borderColor = isPositive ? '#16a34a' : isNeutral ? '#eab308' : '#ef4444';
            const textColor = isPositive ? '#16a34a' : isNeutral ? '#eab308' : '#ef4444';
            
            return (
              <Box
                key={stock.symbol}
                sx={{
                  position: 'absolute',
                  left: `${10 + (i % 4) * 23}%`,
                  top: `${15 + Math.floor(i / 4) * 45}%`,
                  animation: `floatPrice ${15 + i * 3}s ease-in-out infinite`,
                  '@keyframes floatPrice': {
                    '0%, 100%': { 
                      transform: 'translate(0, 0) scale(1)',
                      opacity: 0.1,
                    },
                    '50%': { 
                      transform: `translate(${i % 2 === 0 ? '30px' : '-30px'}, -30px) scale(1.1)`,
                      opacity: 0.2,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                    border: `1px solid ${borderColor}`,
                    fontSize: '12px',
                    fontWeight: 600,
                    minWidth: '120px',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary' }}>
                        {stock.symbol}
                      </Typography>
                      <Typography sx={{ fontSize: '10px', color: textColor }}>
                        {isPositive ? '▲' : isNeutral ? '=' : '▼'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }}>
                        ${stock.price.toFixed(2)}
                      </Typography>
                      <Typography sx={{ fontSize: '10px', color: textColor }}>
                        {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          }) : 
          // Fallback static data while loading
          [...Array(8)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                left: `${10 + (i % 4) * 23}%`,
                top: `${15 + Math.floor(i / 4) * 45}%`,
                animation: `floatPrice ${15 + i * 3}s ease-in-out infinite`,
                '@keyframes floatPrice': {
                  '0%, 100%': { 
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 0.1,
                  },
                  '50%': { 
                    transform: `translate(${i % 2 === 0 ? '30px' : '-30px'}, -30px) scale(1.1)`,
                    opacity: 0.2,
                  },
                },
              }}
            >
              <Box
                sx={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  border: `1px solid ${i % 3 === 0 ? '#16a34a' : i % 3 === 1 ? '#eab308' : '#ef4444'}`,
                  fontSize: '12px',
                  fontWeight: 600,
                  minWidth: '120px',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary' }}>
                      {['SPY', 'QQQ', 'AAPL', 'MSFT', 'NVDA', 'TSLA', 'META', 'GOOGL'][i]}
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: '#16a34a' }}>
                      ▲
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }}>
                      Loading...
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: '#16a34a' }}>
                      ...
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
            {t('contact.title')}
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 6 }}>
            {t('contact.subtitle')}
          </Typography>

          {/* Contact Info Cards */}
          <Box sx={{ position: 'relative', mb: 8 }}>
            {/* Market Depth Background */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                opacity: isDarkMode ? 0.15 : 0.1,
                pointerEvents: 'none',
              }}
            >
              {[...Array(8)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: `${100 + i * 80}px`,
                    height: `${100 + i * 80}px`,
                    border: `1px solid ${i % 2 === 0 ? '#16a34a' : '#ef4444'}`,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: `pulse ${3 + i * 0.5}s ease-in-out infinite`,
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 0.5 },
                      '50%': { opacity: 1 },
                    },
                  }}
                />
              ))}
            </Box>
            <Grid container spacing={3} sx={{ position: 'relative' }}>
              {contactInfo.map((info) => (
                <Grid item xs={12} sm={6} md={3} key={info.titleKey}>
                <Card sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                  backdropFilter: 'blur(10px)',
                }}>
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {info.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {t(info.titleKey)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {info.detailsKey ? t(info.detailsKey) : info.details}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      {...(info.href ? { component: 'a', href: info.href } : {})}
                    >
                      {t(info.actionKey)}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            </Grid>
          </Box>

          {/* Contact Form */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card sx={{
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <MarketChartPattern isDarkMode={isDarkMode} />
                <CardContent sx={{ p: 4, position: 'relative' }}>
                  <Typography variant="h4" gutterBottom>
                    {t('contact.form.title')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {t('contact.form.subtitle')}
                  </Typography>

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <CustomInput
                          icon={<Person sx={{ fontSize: 20 }} />}
                          label={t('contact.form.name')}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={i18n.language === 'es' ? 'Juan Pérez' : 'John Doe'}
                          required
                          isDarkMode={isDarkMode}
                          muiTheme={muiTheme}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomInput
                          icon={<Email sx={{ fontSize: 20 }} />}
                          label={t('contact.form.email')}
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={i18n.language === 'es' ? 'juan@ejemplo.com' : 'john@example.com'}
                          required
                          isDarkMode={isDarkMode}
                          muiTheme={muiTheme}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomInput
                          icon={<Phone sx={{ fontSize: 20 }} />}
                          label={t('contact.form.phone')}
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                          isDarkMode={isDarkMode}
                          muiTheme={muiTheme}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomSelect
                          icon={<Category sx={{ fontSize: 20 }} />}
                          label={t('contact.form.inquiryType')}
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                          required
                          isDarkMode={isDarkMode}
                          muiTheme={muiTheme}
                          placeholder={t('contact.form.selectType')}
                        >
                          {inquiryTypes.map((type) => (
                            <MenuItem key={type.key} value={type.key}>
                              {t(type.labelKey)}
                            </MenuItem>
                          ))}
                        </CustomSelect>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomInput
                          icon={<Message sx={{ fontSize: 20 }} />}
                          label={t('contact.form.message')}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder={t('contact.form.messagePlaceholder')}
                          multiline
                          rows={4}
                          required
                          isDarkMode={isDarkMode}
                          muiTheme={muiTheme}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          fullWidth
                          disabled={isSubmitting}
                          sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: 2,
                            background: isSubmitting
                              ? undefined
                              : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                            boxShadow: isSubmitting ? 0 : 4,
                            transition: 'all 0.3s',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                              boxShadow: 6,
                              transform: 'translateY(-1px)',
                            },
                            '&:disabled': {
                              backgroundColor: alpha(muiTheme.palette.primary.main, 0.5),
                            },
                          }}
                        >
                          {isSubmitting ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CircularProgress size={20} sx={{ color: 'white' }} />
                              {t('contact.form.sending')}
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Send />
                              {t('contact.form.send')}
                            </Box>
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>

            {/* FAQ Section */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <SignalWaves isDarkMode={isDarkMode} />
                {/* Candlestick Chart Pattern */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    opacity: isDarkMode ? 0.1 : 0.08,
                    pointerEvents: 'none',
                  }}
                >
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    {[...Array(8)].map((_, i) => {
                      const x = i * 18 + 10;
                      const height = Math.random() * 40 + 20;
                      const y = 75 - height / 2 + (Math.random() - 0.5) * 30;
                      const wickHeight = height + Math.random() * 20;
                      const isGreen = Math.random() > 0.5;
                      
                      return (
                        <g key={i}>
                          <line
                            x1={x + 5}
                            y1={y - (wickHeight - height) / 2}
                            x2={x + 5}
                            y2={y + height + (wickHeight - height) / 2}
                            stroke={isGreen ? '#16a34a' : '#ef4444'}
                            strokeWidth="1"
                          />
                          <rect
                            x={x}
                            y={y}
                            width="10"
                            height={height}
                            fill={isGreen ? '#16a34a' : '#ef4444'}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </Box>
                <CardContent sx={{ position: 'relative' }}>
                  <Typography variant="h5" gutterBottom>
                    {t('contact.faq.title')}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {t('contact.faq.q1')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('contact.faq.a1')}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {t('contact.faq.q2')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('contact.faq.a2')}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {t('contact.faq.q3')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('contact.faq.a3')}
                    </Typography>
                  </Box>

                  <Button 
                    variant="outlined" 
                    fullWidth
                    component="a"
                    href="/faq"
                  >
                    {t('contact.faq.viewAll')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <ProfessionalFooter />
      
      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}