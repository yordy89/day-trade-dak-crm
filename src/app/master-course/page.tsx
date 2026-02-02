'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Alert,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Star,
  PlayCircle,
  CardMembership,
  ExpandMore,
  Group,
  Groups,
  TrendingUp,
  School,
  MoneyOff,
  CreditCard,
  ShoppingCart,
  LiveTv,
  LocationOn,
  CalendarToday,
  Warning,
  Psychology,
  ArrowForward,
  LocalOffer,
  EmojiEvents,
} from '@mui/icons-material';
import { useClientAuth } from '@/hooks/use-client-auth';
import { MainNavbar } from '@/components/landing/main-navbar';
import { ProfessionalFooter } from '@/components/landing/professional-footer';
import { useTheme as useAppTheme } from '@/components/theme/theme-provider';
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal';
import { eventService } from '@/services/api/event.service';
import { useSettings } from '@/services/api/settings.service';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

const _getPaymentOptions = (t: any): PaymentOption[] => [
  {
    id: 'card',
    name: t('pricing.paymentOptions.card.name'),
    description: t('pricing.paymentOptions.card.description'),
    icon: <CreditCard />,
    available: true,
  },
  {
    id: 'klarna',
    name: t('pricing.paymentOptions.klarna.name'),
    description: t('pricing.paymentOptions.klarna.description'),
    icon: <MoneyOff />,
    available: true,
  },
];

const getPhaseDetails = (t: any) => {
  try {
    const phase1Modules = t('phases.phase1.modules', { returnObjects: true });
    const phase2Includes = t('phases.phase2.includes', { returnObjects: true });
    
    return [
      {
        phase: t('phases.phase1.name'),
        days: t('phases.phase1.duration'),
        title: t('phases.phase1.name'),
        subtitle: t('phases.phase1.description'),
        color: '#16a34a',
        icon: <School />,
        highlights: Array.isArray(phase1Modules) ? phase1Modules : [],
        modules: Array.isArray(phase1Modules) ? phase1Modules.map((module: string, index: number) => ({
          number: String(index + 1).padStart(2, '0'),
          title: module,
          topics: [] // No subtopics in the current translation structure
        })) : [],
        mentorships: t('phases.phase1.activities', { returnObjects: true }) || [],
      },
      {
        phase: t('phases.phase2.name'),
        days: t('phases.phase2.duration'),
        title: t('phases.phase2.name'),
        subtitle: t('phases.phase2.description'),
        color: '#3b82f6',
        icon: <LiveTv />,
        dayByDay: Array.isArray(phase2Includes) ? phase2Includes.map((activity: string, index: number) => ({
          day: `Day ${index + 1}`,
          title: activity,
          activities: t('phases.phase2.activities', { returnObjects: true }) || []
        })) : [],
      },
      {
        phase: t('phases.phase3.name'),
        days: t('phases.phase3.duration'),
        title: t('phases.phase3.name'),
        subtitle: t('phases.phase3.description'),
        color: '#f59e0b',
        icon: <Groups />,
        features: t('phases.phase3.activities', { returnObjects: true }) || [],
      },
    ];
  } catch (error) {
    console.error('Error in getPhaseDetails:', error);
    return [];
  }
};

const getHighlights = (t: any) => {
  try {
    const highlightItems = t('highlights.items', { returnObjects: true });
    const icons = [<School key="school" />, <TrendingUp key="trending" />, <Groups key="groups" />, <LiveTv key="live" />, <Group key="group" />, <Psychology key="psychology" />];
    
    if (!Array.isArray(highlightItems)) {
      console.error('highlights.items is not an array:', highlightItems);
      return [];
    }
    
    return highlightItems.map((item: any, index: number) => ({
      title: item.title || '',
      description: item.description || '',
      icon: icons[index] || <Star />,
    }));
  } catch (error) {
    console.error('Error in getHighlights:', error);
    return [];
  }
};

// Bull and Bear Background Component
const BullBearBackground = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}
  >
    {/* Bull on the right */}
    <Box
      sx={{
        position: 'absolute',
        right: -50,
        top: '20%',
        width: 400,
        height: 400,
        opacity: isDarkMode ? 0.08 : 0.05,
        background: 'radial-gradient(circle, #16a34a 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
    {/* Bear on the left */}
    <Box
      sx={{
        position: 'absolute',
        left: -50,
        bottom: '20%',
        width: 400,
        height: 400,
        opacity: isDarkMode ? 0.08 : 0.05,
        background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
    {/* Trading Chart Pattern */}
    <svg width="100%" height="100%" viewBox="0 0 1200 800" style={{ opacity: 0.1 }}>
      {/* Candlestick patterns */}
      {[...Array(20)].map((_, i) => {
        const x = 50 + i * 50;
        const isGreen = Math.random() > 0.5;
        const height = Math.random() * 100 + 50;
        const y = 400 - height / 2;
        return (
          <g key={`candle-${x}`}>
            <rect
              x={x - 15}
              y={y}
              width={30}
              height={height}
              fill={isGreen ? '#16a34a' : '#ef4444'}
              opacity={0.3}
            />
            <line
              x1={x}
              y1={y - 20}
              x2={x}
              y2={y + height + 20}
              stroke={isGreen ? '#16a34a' : '#ef4444'}
              strokeWidth="2"
              opacity={0.5}
            />
          </g>
        );
      })}
    </svg>
  </Box>
);

// Trading Pattern Component
const TradingPatternGraphic = () => (
  <Box sx={{ position: 'relative', width: '100%', height: 200, mt: 4 }}>
    <svg width="100%" height="200" viewBox="0 0 800 200">
      {/* Grid lines */}
      {[...Array(5)].map((_, i) => (
        <line
          key={`h-line-${i * 40}`}
          x1="0"
          y1={i * 40}
          x2="800"
          y2={i * 40}
          stroke="#e0e0e0"
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      
      {/* Candlestick chart */}
      {[
        { x: 50, high: 120, low: 180, open: 140, close: 160, bull: false },
        { x: 100, high: 100, low: 160, open: 150, close: 110, bull: true },
        { x: 150, high: 80, low: 140, open: 130, close: 90, bull: true },
        { x: 200, high: 60, low: 120, open: 100, close: 80, bull: true },
        { x: 250, high: 40, low: 100, open: 50, close: 90, bull: false },
        { x: 300, high: 60, low: 120, open: 70, close: 110, bull: false },
        { x: 350, high: 80, low: 140, open: 130, close: 90, bull: true },
        { x: 400, high: 60, low: 120, open: 70, close: 110, bull: false },
        { x: 450, high: 40, low: 100, open: 90, close: 50, bull: true },
        { x: 500, high: 20, low: 80, open: 30, close: 70, bull: false },
        { x: 550, high: 40, low: 100, open: 50, close: 90, bull: false },
        { x: 600, high: 60, low: 120, open: 110, close: 70, bull: true },
        { x: 650, high: 40, low: 100, open: 50, close: 90, bull: false },
        { x: 700, high: 20, low: 80, open: 70, close: 30, bull: true },
      ].map((candle, _i) => (
        <g key={`candlestick-${candle.x}`}>
          {/* Wick */}
          <line
            x1={candle.x}
            y1={candle.high}
            x2={candle.x}
            y2={candle.low}
            stroke={candle.bull ? '#16a34a' : '#ef4444'}
            strokeWidth="2"
          />
          {/* Body */}
          <rect
            x={candle.x - 10}
            y={Math.min(candle.open, candle.close)}
            width="20"
            height={Math.abs(candle.open - candle.close)}
            fill={candle.bull ? '#16a34a' : '#ef4444'}
          />
        </g>
      ))}
      
      {/* Trend line */}
      <path
        d="M 50 160 Q 200 100 350 90 T 700 30"
        fill="none"
        stroke="#16a34a"
        strokeWidth="3"
        strokeDasharray="5,5"
        opacity="0.7"
      />
    </svg>
  </Box>
);

export default function MasterCoursePage() {
  const router = useRouter();
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  const { user } = useClientAuth();
  const { t, ready } = useTranslation('masterCourse');
  const { data: settings } = useSettings();
  const [pricing, setPricing] = useState<{ basePrice: number; currency: string } | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [, setIsLoadingEvent] = useState(true);
  
  // Get translated data (only if translations are ready)
  const phaseDetails = ready ? getPhaseDetails(t) : [];
  const highlights = ready ? getHighlights(t) : [];

  useEffect(() => {
    // Fetch event data and pricing
    const fetchData = async () => {
      try {
        // First, get all events and find the master course
        const eventsResponse = await eventService.getEvents({
          isActive: true
        });

        // Find the featured master course event (or fall back to first active one)
        const masterCourseEvents = eventsResponse.data.filter(
          (e: any) => e.type === 'master_course' && e.isActive
        );

        // Prioritize the featured event
        const masterCourseEvent = masterCourseEvents.find((e: any) => e.featuredInCRM) || masterCourseEvents[0];

        console.log('=== Master Course Event Selection Debug ===');
        console.log('All Master Course Events:', masterCourseEvents);
        console.log('Featured Event:', masterCourseEvents.find((e: any) => e.featuredInCRM));
        console.log('Selected Event:', masterCourseEvent);

        if (masterCourseEvent) {
          // Use the real event from database
          setEvent(masterCourseEvent);
          setPricing({
            basePrice: masterCourseEvent.price || 2999.99,
            currency: 'usd'
          });
          console.log('=== Event Loaded ===');
          console.log('Event ID:', masterCourseEvent._id);
          console.log('Event Name:', masterCourseEvent.name);
          console.log('Payment Mode:', masterCourseEvent.paymentMode);
          console.log('Featured in CRM:', masterCourseEvent.featuredInCRM);
          console.log('Minimum Deposit:', masterCourseEvent.minimumDepositAmount);
          console.log('Deposit Percentage:', masterCourseEvent.depositPercentage);
        } else {
          // No master course event found
          console.warn('No active Master Course event found in database');
          console.warn('Please run: npm run seed:events in the API to create the event');
          
          // Try to get pricing from API
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/public-pricing/MasterCourse`
            );
            setPricing(response.data);
          } catch {
            setPricing({ basePrice: 2999.99, currency: 'usd' });
          }
          
          // For now, still create a temporary event so the page works
          // In production, you should handle this differently
          setEvent({
            _id: 'master-course-default',
            name: t('hero.title'),
            title: t('hero.title'),
            type: 'master_course',
            price: 2999.99,
            requiresActiveSubscription: false,
            isActive: true,
            // Add a warning flag
            _isTemporary: true,
          });
        }
      } catch (error) {
        console.error('Error fetching Master Course event:', error);
        
        // Set default pricing for display
        setPricing({ basePrice: 2999.99, currency: 'usd' });
        
        // Create temporary event for development
        setEvent({
          _id: 'master-course-default',
          name: 'Master Trading Course',
          title: 'Curso Intensivo de Trading',
          type: 'master_course',
          price: 2500,
          requiresActiveSubscription: false,
          isActive: true,
          _isTemporary: true,
        });
      } finally {
        setIsLoadingPrice(false);
        setIsLoadingEvent(false);
      }
    };

    void fetchData();
  }, [t]);

  const handlePurchase = async () => {
    // Open the registration modal for all users (logged in or not)
    setIsRegistrationModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: pricing?.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Show loading state if translations aren't ready
  if (!ready) {
    return (
      <>
        <MainNavbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <MainNavbar />
      
      {/* Warning Banner for Temporary Event */}
      {event?._isTemporary ? (
        <Alert 
          severity="warning" 
          sx={{ 
            borderRadius: 0,
            backgroundColor: '#ff9800',
            color: 'white',
            '& .MuiAlert-icon': { color: 'white' }
          }}
        >
          <Typography variant="body2">
            <strong>{t('ui.messages.developmentMode')}:</strong> {t('ui.messages.noEventFound')}
          </Typography>
        </Alert>
      ) : null}
      
      <Box
        sx={{
          pt: { xs: 12, md: 14 },
          minHeight: '100vh',
          position: 'relative',
          background: isDarkMode ? '#0d1117' : '#ffffff',
        }}
      > {/* Adjusted padding for TopBar + Navbar */}
        <BullBearBackground isDarkMode={isDarkMode} />

        {/* Hero Section */}
        <Box
        sx={{
          backgroundImage: 'url(/assets/images/comunity-event-backgorund.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha('#0a0a0a', 0.95)} 0%, ${alpha('#16a34a', 0.75)} 25%, ${alpha('#0d1117', 0.85)} 50%, ${alpha('#991b1b', 0.75)} 75%, ${alpha('#0a0a0a', 0.95)} 100%)`,
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '150px',
            background: isDarkMode
              ? 'linear-gradient(to bottom, transparent 0%, #0d1117 100%)'
              : 'linear-gradient(to bottom, transparent 0%, #ffffff 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Chip
                  label={t('hero.badge')}
                  color="warning"
                  icon={<Star />}
                  sx={{ width: 'fit-content' }}
                />
                <Typography variant="h2" fontWeight={800}>
                  {t('hero.title')}
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9 }}>
                  {t('hero.subtitle')}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mt: 2 }}>
                  {t('hero.description')}
                </Typography>
                <Stack direction="row" spacing={3} sx={{ my: 3 }}>
                  {[
                    { value: '3', label: t('hero.stats.intensiveDays'), color: '#16a34a' },
                    { value: '100%', label: t('hero.stats.realPractice'), color: '#3b82f6' },
                    { value: t('hero.stats.live'), label: t('hero.stats.tradingSessions'), color: '#f59e0b' },
                  ].map((stat, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        borderRadius: 2,
                        background: alpha('#ffffff', 0.1),
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha('#ffffff', 0.2)}`,
                        minWidth: 100,
                      }}
                    >
                      <Typography
                        variant="h3"
                        fontWeight={800}
                        sx={{
                          background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>{stat.label}</Typography>
                    </Box>
                  ))}
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    sx={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                      color: '#16a34a',
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    {isLoadingPrice ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      t('hero.buttons.registerNow')
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayCircle />}
                    onClick={() => document.getElementById('program-details')?.scrollIntoView({ behavior: 'smooth' })}
                    sx={{
                      borderColor: alpha('#ffffff', 0.5),
                      borderWidth: 2,
                      color: 'white',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        backgroundColor: alpha('#fff', 0.15),
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {t('hero.buttons.viewProgram')}
                  </Button>
                </Stack>
                
                {/* BNPL Payment Options Message */}
                {pricing ? (
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: alpha('#fff', 0.1),
                      border: `1px solid ${alpha('#fff', 0.3)}`,
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LocalOffer sx={{ color: 'white' }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="white">
                          {t('hero.flexiblePayments', 'Flexible Payment Options Available!')}
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.9) }}>
                          {t('hero.bnplOptions', 'Opciones de pago flexible disponibles con Klarna y Afterpay')}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ) : null}
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ position: 'relative', height: '100%', minHeight: 400 }}>
                {/* Trading Pattern Graphic */}
                <Box 
                  sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(ellipse at center, rgba(22, 163, 74, 0.05) 0%, transparent 70%)',
                  }}
                >
                  <TradingPatternGraphic />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Timeline Section */}
      <Box
        sx={{
          py: 10,
          position: 'relative',
          background: isDarkMode
            ? `linear-gradient(180deg, #0d1117 0%, ${alpha('#161b22', 1)} 50%, #0d1117 100%)`
            : `linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight={800}
            mb={2}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)'
                : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('yourJourney.title')}
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            mb={6}
          >
            Your path to professional trading
          </Typography>
          <Box sx={{ position: 'relative', mb: 8 }}>
            {/* Timeline line */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 4,
                backgroundColor: 'divider',
                zIndex: 0,
              }}
            />

            {/* Timeline items */}
            <Grid container justifyContent="space-between" position="relative">
              {phaseDetails.map((phase, index) => ({
                phase: phase.phase,
                days: phase.days.replace(/[()]/g, ''),
                color: phase.color,
                icon: ['📚', '📈', '💹'][index],
                title: phase.title
              })).map((item, _index) => (
                <Grid item xs={12} md={4} key={item.phase}>
                  <Box sx={{ textAlign: 'center', position: 'relative' }}>
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: isDarkMode
                          ? `linear-gradient(145deg, ${alpha(item.color, 0.2)} 0%, ${alpha(item.color, 0.05)} 100%)`
                          : `linear-gradient(145deg, ${alpha(item.color, 0.15)} 0%, ${alpha(item.color, 0.03)} 100%)`,
                        border: `3px solid ${item.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        fontSize: '3rem',
                        boxShadow: `0 12px 40px ${alpha(item.color, 0.25)}`,
                        position: 'relative',
                        zIndex: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          boxShadow: `0 16px 50px ${alpha(item.color, 0.35)}`,
                        },
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Chip
                      label={item.phase}
                      sx={{
                        background: `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color, 0.8)} 100%)`,
                        color: 'white',
                        fontWeight: 700,
                        mb: 1.5,
                        px: 2,
                        boxShadow: `0 4px 12px ${alpha(item.color, 0.3)}`,
                      }}
                    />
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.days}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* CTA */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              {t('hero.tagline')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                px: 4,
                py: 1.5,
              }}
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('hero.wantMySpot')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Course Features */}
      <Box
        sx={{
          py: 10,
          background: isDarkMode
            ? `linear-gradient(180deg, #0d1117 0%, ${alpha('#161b22', 1)} 50%, #0d1117 100%)`
            : `linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight={800}
            mb={2}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)'
                : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('targetAudience.title')}
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" mb={6}>
            Designed for different levels and goals
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                icon: <TrendingUp />,
                title: t('targetAudience.beginners.title'),
                description: t('targetAudience.beginners.description'),
                color: '#16a34a',
              },
              {
                icon: <School />,
                title: t('targetAudience.experiencedTraders.title'),
                description: t('targetAudience.experiencedTraders.description'),
                color: '#3b82f6',
              },
              {
                icon: <Group />,
                title: t('targetAudience.investors.title'),
                description: t('targetAudience.investors.description'),
                color: '#8b5cf6',
              },
              {
                icon: <CardMembership />,
                title: t('targetAudience.entrepreneurs.title'),
                description: t('targetAudience.entrepreneurs.description'),
                color: '#f59e0b',
              },
            ].map((feature, _index) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    textAlign: 'center',
                    background: isDarkMode
                      ? `linear-gradient(145deg, ${alpha(feature.color, 0.1)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                      : `linear-gradient(145deg, ${alpha(feature.color, 0.08)} 0%, #ffffff 100%)`,
                    border: '1px solid',
                    borderColor: alpha(feature.color, 0.2),
                    borderRadius: 3,
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: feature.color,
                      boxShadow: `0 20px 40px ${alpha(feature.color, 0.2)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: '18px',
                      background: `linear-gradient(135deg, ${feature.color} 0%, ${alpha(feature.color, 0.7)} 100%)`,
                      mx: 'auto',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 8px 24px ${alpha(feature.color, 0.35)}`,
                      color: 'white',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight={700}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Detailed Phase Breakdown */}
      <Box
        id="program-details"
        sx={{
          py: 10,
          position: 'relative',
          background: isDarkMode
            ? `linear-gradient(180deg, #0d1117 0%, ${alpha('#161b22', 1)} 50%, #0d1117 100%)`
            : `linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)`,
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h2"
            textAlign="center"
            fontWeight={800}
            mb={2}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)'
                : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('programComplete.title')}
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" mb={8}>
            From beginner to consistent trader in 3 phases
          </Typography>

          {/* Phase 1 */}
          <Box sx={{ mb: 10 }}>
            <Paper
              elevation={0}
              sx={{
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha('#16a34a', 0.08)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#16a34a', 0.06)} 0%, #ffffff 100%)`,
                border: '2px solid',
                borderColor: alpha('#16a34a', 0.4),
                borderRadius: 4,
                p: { xs: 4, md: 6 },
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                '&:hover': {
                  borderColor: '#16a34a',
                  boxShadow: `0 20px 60px ${alpha('#16a34a', 0.15)}`,
                },
              }}
            >
              <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                <TrendingUp sx={{ fontSize: 200, color: '#16a34a' }} />
              </Box>
              <Stack spacing={4} position="relative">
                <Box>
                  <Chip
                    label={t('programComplete.phase1.badge')}
                    sx={{
                      backgroundColor: '#16a34a',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 3,
                      height: 'auto',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h3" fontWeight={700} color="#16a34a" gutterBottom>
                    {t('programComplete.phase1.title')}
                  </Typography>
                  <Typography variant="h5" color="text.secondary">
                    {t('programComplete.phase1.subtitle')}
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  {phaseDetails[0]?.highlights?.map((highlight: string, _idx: number) => (
                    <Grid item xs={12} md={6} key={highlight}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <CheckCircle sx={{ color: '#16a34a', flexShrink: 0, mt: 0.5 }} />
                        <Typography variant="body1">{highlight}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>

                {/* Modules */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" fontWeight={600} mb={3}>
                    {t('programComplete.phase1.modulesTitle')}
                  </Typography>
                  <Grid container spacing={2}>
                    {phaseDetails[0]?.modules?.map((module: any) => (
                      <Grid item xs={12} md={6} lg={3} key={`module-${module.number}`}>
                        <Card sx={{ height: '100%', backgroundColor: alpha('#16a34a', 0.05) }}>
                          <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                              <Avatar sx={{ backgroundColor: '#16a34a', width: 36, height: 36 }}>
                                <Typography variant="body2" fontWeight={700}>{module.number}</Typography>
                              </Avatar>
                              <Typography variant="body1" fontWeight={600}>
                                {module.title}
                              </Typography>
                            </Stack>
                            <List dense sx={{ py: 0 }}>
                              {module.topics.map((topic: string, _idx: number) => (
                                <ListItem key={topic} sx={{ px: 0, py: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 24 }}>
                                    <ArrowForward sx={{ fontSize: 14, color: '#16a34a' }} />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={topic} 
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
                </Box>

                {/* Mentorships */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" fontWeight={600} mb={3}>
                    {t('programComplete.phase1.mentorshipsTitle')}
                  </Typography>
                  <Grid container spacing={2}>
                    {phaseDetails[0]?.mentorships?.map((mentorship: string, _idx: number) => (
                      <Grid item xs={12} md={6} key={mentorship}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Groups sx={{ color: '#16a34a' }} />
                          <Typography variant="body1">{mentorship}</Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Phase 2 */}
          <Box sx={{ mb: 10 }}>
            <Paper
              elevation={0}
              sx={{
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha('#3b82f6', 0.08)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#3b82f6', 0.06)} 0%, #ffffff 100%)`,
                border: '2px solid',
                borderColor: alpha('#3b82f6', 0.4),
                borderRadius: 4,
                p: { xs: 4, md: 6 },
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                '&:hover': {
                  borderColor: '#3b82f6',
                  boxShadow: `0 20px 60px ${alpha('#3b82f6', 0.15)}`,
                },
              }}
            >
              <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                <LiveTv sx={{ fontSize: 200, color: '#3b82f6' }} />
              </Box>
              <Stack spacing={4} position="relative">
                <Box>
                  <Chip
                    label={t('programComplete.phase2.badge')}
                    sx={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 3,
                      height: 'auto',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h3" fontWeight={700} color="#3b82f6" gutterBottom>
                    {t('programComplete.phase2.title')}
                  </Typography>
                  <Typography variant="h5" color="text.secondary">
                    {phaseDetails[1]?.subtitle}
                  </Typography>
                </Box>

                {/* Day by Day Breakdown */}
                <Grid container spacing={3}>
                  {phaseDetails[1]?.dayByDay?.map((day: any, _index: number) => (
                    <Grid item xs={12} key={day.title}>
                      <Card 
                        sx={{ 
                          backgroundColor: alpha('#3b82f6', 0.05),
                          borderLeft: `4px solid #3b82f6`,
                        }}
                      >
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                            <Avatar sx={{ backgroundColor: '#3b82f6', width: 50, height: 50 }}>
                              <CalendarToday />
                            </Avatar>
                            <Box>
                              <Typography variant="h5" fontWeight={700} color="#3b82f6">
                                {day.day}
                              </Typography>
                              <Typography variant="h6" color="text.secondary">
                                {day.title}
                              </Typography>
                            </Box>
                          </Stack>
                          <Grid container spacing={2}>
                            {day.activities.map((activity: string, _idx: number) => (
                              <Grid item xs={12} md={6} key={activity}>
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                  <CheckCircle sx={{ color: '#3b82f6', flexShrink: 0, mt: 0.5 }} />
                                  <Typography variant="body1">{activity}</Typography>
                                </Stack>
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Location Info */}
                <Alert 
                  icon={<LocationOn />} 
                  severity="info"
                  sx={{ 
                    backgroundColor: alpha('#3b82f6', 0.1),
                    '& .MuiAlert-icon': { color: '#3b82f6' }
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {t('phases.phase2.location')}
                  </Typography>
                </Alert>
              </Stack>
            </Paper>
          </Box>

          {/* Phase 3 */}
          <Box sx={{ mb: 10 }}>
            <Paper
              elevation={0}
              sx={{
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha('#f59e0b', 0.08)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#f59e0b', 0.06)} 0%, #ffffff 100%)`,
                border: '2px solid',
                borderColor: alpha('#f59e0b', 0.4),
                borderRadius: 4,
                p: { xs: 4, md: 6 },
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                '&:hover': {
                  borderColor: '#f59e0b',
                  boxShadow: `0 20px 60px ${alpha('#f59e0b', 0.15)}`,
                },
              }}
            >
              <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                <Groups sx={{ fontSize: 200, color: '#f59e0b' }} />
              </Box>
              <Stack spacing={4} position="relative">
                <Box>
                  <Chip
                    label={t('programComplete.phase3.badge')}
                    sx={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 3,
                      height: 'auto',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h3" fontWeight={700} color="#f59e0b" gutterBottom>
                    {phaseDetails[2]?.title}
                  </Typography>
                  <Typography variant="h5" color="text.secondary">
                    {phaseDetails[2]?.subtitle}
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  {phaseDetails[2]?.features?.map((feature: string, _idx: number) => (
                    <Grid item xs={12} md={6} key={feature}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <CheckCircle sx={{ color: '#f59e0b', flexShrink: 0, mt: 0.5 }} />
                        <Typography variant="body1">{feature}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Paper>
          </Box>

          {/* BONO EXTRA - Personalized Trade Follow-Up */}
          <Box sx={{ mb: 10 }}>
            <Paper
              elevation={0}
              sx={{
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha('#9333ea', 0.1)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#9333ea', 0.08)} 0%, #ffffff 100%)`,
                border: '2px solid',
                borderColor: alpha('#9333ea', 0.4),
                borderRadius: 4,
                p: { xs: 4, md: 6 },
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                '&:hover': {
                  borderColor: '#9333ea',
                  boxShadow: `0 20px 60px ${alpha('#9333ea', 0.15)}`,
                },
              }}
            >
              <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                <EmojiEvents sx={{ fontSize: 200, color: '#9333ea' }} />
              </Box>
              <Stack spacing={4} position="relative">
                <Box>
                  <Chip
                    icon={<EmojiEvents sx={{ color: 'white !important' }} />}
                    label="BONUS"
                    sx={{
                      backgroundColor: '#9333ea',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 3,
                      height: 'auto',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h3" fontWeight={700} color="#9333ea" gutterBottom>
                    {t('bonusExtra.title')}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    {t('bonusExtra.description')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {t('bonusExtra.subtitle')}
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="#9333ea">
                    {t('bonusExtra.benefits')}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {(t('bonusExtra.features', { returnObjects: true }) as string[])?.map((feature: string, _idx: number) => (
                    <Grid item xs={12} md={6} key={feature}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <CheckCircle sx={{ color: '#9333ea', flexShrink: 0, mt: 0.5 }} />
                        <Typography variant="body1">{feature}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Paper>
          </Box>

          {/* Why This Course Works */}
          <Box sx={{ mt: 10 }}>
            <Typography
              variant="h3"
              textAlign="center"
              fontWeight={800}
              mb={2}
              sx={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)'
                  : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('whyItWorks.title')}
            </Typography>
            <Typography variant="h6" textAlign="center" color="text.secondary" mb={6}>
              {t('whyItWorks.subtitle')}
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    background: isDarkMode
                      ? `linear-gradient(145deg, ${alpha('#ef4444', 0.1)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                      : `linear-gradient(145deg, ${alpha('#ef4444', 0.06)} 0%, #ffffff 100%)`,
                    border: '1px solid',
                    borderColor: alpha('#ef4444', 0.3),
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      background: 'linear-gradient(180deg, #ef4444, #dc2626)',
                    },
                    '&:hover': {
                      borderColor: '#ef4444',
                      boxShadow: `0 20px 40px ${alpha('#ef4444', 0.15)}`,
                    },
                  }}
                >
                  <Typography variant="h5" fontWeight={700} color="#ef4444" gutterBottom>
                    {t('whyItWorks.whatWeDont.title')} ❌
                  </Typography>
                  <List dense>
                    {(t('whyItWorks.whatWeDont.items', { returnObjects: true }) as string[]).map((item, _idx) => (
                      <ListItem key={item} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Warning sx={{ color: '#ef4444' }} />
                        </ListItemIcon>
                        <ListItemText primary={item} primaryTypographyProps={{ fontWeight: 500 }} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    background: isDarkMode
                      ? `linear-gradient(145deg, ${alpha('#16a34a', 0.1)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                      : `linear-gradient(145deg, ${alpha('#16a34a', 0.06)} 0%, #ffffff 100%)`,
                    border: '1px solid',
                    borderColor: alpha('#16a34a', 0.3),
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      background: 'linear-gradient(180deg, #16a34a, #15803d)',
                    },
                    '&:hover': {
                      borderColor: '#16a34a',
                      boxShadow: `0 20px 40px ${alpha('#16a34a', 0.15)}`,
                    },
                  }}
                >
                  <Typography variant="h5" fontWeight={700} color="#16a34a" gutterBottom>
                    {t('whyItWorks.whatWeDo.title')} ✓
                  </Typography>
                  <List dense>
                    {(t('whyItWorks.whatWeDo.items', { returnObjects: true }) as string[]).map((item, _idx) => (
                      <ListItem key={item} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle sx={{ color: '#16a34a' }} />
                        </ListItemIcon>
                        <ListItemText primary={item} primaryTypographyProps={{ fontWeight: 500 }} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>

            {/* Success Formula */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  background: isDarkMode
                    ? `linear-gradient(145deg, ${alpha('#16a34a', 0.08)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                    : `linear-gradient(145deg, ${alpha('#16a34a', 0.05)} 0%, #ffffff 100%)`,
                  border: '2px solid',
                  borderColor: alpha('#16a34a', 0.3),
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #16a34a, #22c55e, #16a34a)',
                  },
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={800}
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {t('successFormula.title')}
                </Typography>
                <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
                  <Grid item>
                    <Chip
                      label={t('successFormula.technicalKnowledge')}
                      sx={{
                        fontSize: '1rem',
                        py: 2.5,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                        color: 'white',
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" fontWeight={700} color="text.secondary">+</Typography>
                  </Grid>
                  <Grid item>
                    <Chip
                      label={t('successFormula.emotionalControl')}
                      sx={{
                        fontSize: '1rem',
                        py: 2.5,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                        color: 'white',
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" fontWeight={700} color="text.secondary">+</Typography>
                  </Grid>
                  <Grid item>
                    <Chip
                      label={t('successFormula.supervisedPractice')}
                      sx={{
                        fontSize: '1rem',
                        py: 2.5,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                        color: 'white',
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" fontWeight={700} color="text.secondary">=</Typography>
                  </Grid>
                  <Grid item>
                    <Chip
                      label={t('successFormula.consistentTrader')}
                      sx={{
                        fontSize: '1.1rem',
                        py: 3,
                        px: 3,
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                        color: 'white',
                        boxShadow: `0 4px 20px ${alpha('#16a34a', 0.4)}`,
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Box>

          {/* What&apos;s Included */}
          <Box sx={{ mt: 10 }}>
            <Typography
              variant="h3"
              textAlign="center"
              fontWeight={800}
              mb={2}
              sx={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)'
                  : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('whatIncludes.title')}
            </Typography>
            <Typography variant="h6" textAlign="center" color="text.secondary" mb={6}>
              Everything you need to become a professional trader
            </Typography>
            <Grid container spacing={4}>
              {[
                {
                  icon: <PlayCircle sx={{ fontSize: 40 }} />,
                  number: t('whatIncludes.onlineModules.number'),
                  title: t('whatIncludes.onlineModules.title'),
                  description: t('whatIncludes.onlineModules.description'),
                  color: '#3b82f6',
                },
                {
                  icon: <Groups sx={{ fontSize: 40 }} />,
                  number: t('whatIncludes.groupMentoring.number'),
                  title: t('whatIncludes.groupMentoring.title'),
                  description: t('whatIncludes.groupMentoring.description'),
                  color: '#8b5cf6',
                },
                {
                  icon: <LocationOn sx={{ fontSize: 40 }} />,
                  number: t('whatIncludes.inPersonDays.number'),
                  title: t('whatIncludes.inPersonDays.title'),
                  description: t('whatIncludes.inPersonDays.description'),
                  color: '#16a34a',
                },
                {
                  icon: <LiveTv sx={{ fontSize: 40 }} />,
                  number: t('whatIncludes.practiceMonths.number'),
                  title: t('whatIncludes.practiceMonths.title'),
                  description: t('whatIncludes.practiceMonths.description'),
                  color: '#f59e0b',
                },
              ].map((item, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 4,
                      background: isDarkMode
                        ? `linear-gradient(145deg, ${alpha(item.color, 0.1)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                        : `linear-gradient(145deg, ${alpha(item.color, 0.08)} 0%, #ffffff 100%)`,
                      border: '1px solid',
                      borderColor: alpha(item.color, 0.2),
                      borderRadius: 3,
                      transition: 'all 0.4s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        borderColor: item.color,
                        boxShadow: `0 20px 40px ${alpha(item.color, 0.2)}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color, 0.7)} 100%)`,
                        mx: 'auto',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 8px 24px ${alpha(item.color, 0.35)}`,
                        color: 'white',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      sx={{
                        background: `linear-gradient(135deg, ${item.color} 0%, ${alpha(item.color, 0.7)} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                      }}
                    >
                      {item.number}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {item.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Key Highlights */}
      <Box
        sx={{
          py: 10,
          background: isDarkMode
            ? `linear-gradient(180deg, #0d1117 0%, ${alpha('#161b22', 1)} 50%, #0d1117 100%)`
            : `linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight={800}
            mb={2}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)'
                : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('whatMakesUnique.title')}
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" mb={6}>
            What makes us different from other courses
          </Typography>
          <Grid container spacing={4}>
            {highlights.map((highlight, index) => {
              const colors = ['#16a34a', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
              const color = colors[index % colors.length];
              return (
                <Grid item xs={12} sm={6} md={3} key={highlight.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      textAlign: 'center',
                      background: isDarkMode
                        ? `linear-gradient(145deg, ${alpha(color, 0.1)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                        : `linear-gradient(145deg, ${alpha(color, 0.08)} 0%, #ffffff 100%)`,
                      border: '1px solid',
                      borderColor: alpha(color, 0.2),
                      borderRadius: 3,
                      transition: 'all 0.4s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        borderColor: color,
                        boxShadow: `0 20px 40px ${alpha(color, 0.2)}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
                        mx: 'auto',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 8px 24px ${alpha(color, 0.35)}`,
                        color: 'white',
                      }}
                    >
                      {highlight.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight={700}>
                      {highlight.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {highlight.description}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Module Details Section */}
      <Box
        sx={{
          py: 10,
          background: isDarkMode
            ? `linear-gradient(180deg, #0d1117 0%, ${alpha('#161b22', 1)} 50%, #0d1117 100%)`
            : `linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight={800}
            mb={2}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)'
                : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('sessionContent.title')}
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" mb={6}>
            Detailed content for each in-person day
          </Typography>
          <Grid container spacing={4}>
            {[
              { title: t('sessionContent.day1.title'), items: t('sessionContent.day1.items', { returnObjects: true }) as string[], color: '#3b82f6' },
              { title: t('sessionContent.day2.title'), items: t('sessionContent.day2.items', { returnObjects: true }) as string[], color: '#8b5cf6' },
              { title: t('sessionContent.day3.title'), items: t('sessionContent.day3.items', { returnObjects: true }) as string[], color: '#16a34a' },
            ].map((day, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    background: isDarkMode
                      ? `linear-gradient(145deg, ${alpha(day.color, 0.1)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                      : `linear-gradient(145deg, ${alpha(day.color, 0.08)} 0%, #ffffff 100%)`,
                    border: '1px solid',
                    borderColor: alpha(day.color, 0.3),
                    borderRadius: 3,
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${day.color}, ${alpha(day.color, 0.6)})`,
                    },
                    '&:hover': {
                      borderColor: day.color,
                      boxShadow: `0 20px 40px ${alpha(day.color, 0.15)}`,
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        background: `linear-gradient(135deg, ${day.color} 0%, ${alpha(day.color, 0.7)} 100%)`,
                        boxShadow: `0 4px 14px ${alpha(day.color, 0.4)}`,
                      }}
                    >
                      <CalendarToday />
                    </Avatar>
                    <Typography variant="h5" fontWeight={700} sx={{ color: day.color }}>
                      {day.title}
                    </Typography>
                  </Stack>
                  <List dense>
                    {day.items.map((item, _idx) => (
                      <ListItem key={item} sx={{ py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle sx={{ color: '#16a34a' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Important Notice */}
      <Box
        sx={{
          py: 6,
          background: isDarkMode
            ? `linear-gradient(180deg, #0d1117 0%, ${alpha('#f59e0b', 0.05)} 50%, #0d1117 100%)`
            : `linear-gradient(180deg, #ffffff 0%, ${alpha('#f59e0b', 0.05)} 50%, #ffffff 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: isDarkMode
                ? `linear-gradient(145deg, ${alpha('#f59e0b', 0.1)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                : `linear-gradient(145deg, ${alpha('#f59e0b', 0.08)} 0%, #ffffff 100%)`,
              border: '2px solid',
              borderColor: alpha('#f59e0b', 0.4),
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(180deg, #f59e0b, #fbbf24)',
              },
            }}
          >
            <Stack direction="row" spacing={3} alignItems="flex-start">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 4px 14px ${alpha('#f59e0b', 0.4)}`,
                }}
              >
                <Warning sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="#f59e0b" gutterBottom>
                  {t('pricing.importantNotice.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {t('pricing.importantNotice.description')}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box
        id="pricing"
        sx={{
          py: 10,
          background: isDarkMode
            ? `linear-gradient(180deg, #0d1117 0%, ${alpha('#16a34a', 0.05)} 30%, ${alpha('#16a34a', 0.08)} 50%, ${alpha('#16a34a', 0.05)} 70%, #0d1117 100%)`
            : `linear-gradient(180deg, #ffffff 0%, ${alpha('#16a34a', 0.03)} 30%, ${alpha('#16a34a', 0.06)} 50%, ${alpha('#16a34a', 0.03)} 70%, #ffffff 100%)`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: `radial-gradient(circle, ${alpha('#16a34a', 0.1)} 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight={800}
            mb={2}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)'
                : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('pricing.pricingSection.title')}
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            mb={2}
          >
            {t('pricing.pricingSection.subtitle')}
          </Typography>
          
          {/* Limited Spots Alert */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Alert 
              severity="warning"
              icon={<Warning sx={{ fontSize: 24 }} />}
              sx={{ 
                maxWidth: 600,
                backgroundColor: isDarkMode 
                  ? alpha('#fbbf24', 0.08)  // Very subtle yellow for dark mode
                  : alpha('#fbbf24', 0.12), // Slightly more visible for light mode
                border: `1px solid ${alpha('#f59e0b', isDarkMode ? 0.3 : 0.4)}`,
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                '& .MuiAlert-icon': { 
                  color: isDarkMode ? '#fbbf24' : '#f59e0b',
                  alignSelf: 'flex-start',
                  mt: 0.3,
                  opacity: 0.9
                },
                '& .MuiAlert-message': {
                  width: '100%'
                },
                boxShadow: isDarkMode 
                  ? '0 4px 20px rgba(251, 191, 36, 0.05)'
                  : '0 4px 20px rgba(245, 158, 11, 0.08)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
                  animation: 'shimmer 3s infinite',
                },
                '@keyframes shimmer': {
                  '0%': { 
                    transform: 'translateX(-100%)',
                  },
                  '100%': { 
                    transform: 'translateX(100%)',
                  },
                },
              }}
            >
              <Stack spacing={0.5}>
                <Typography 
                  variant="body1" 
                  fontWeight={600} 
                  sx={{
                    color: isDarkMode ? '#fde68a' : '#92400e',
                    letterSpacing: '0.3px'
                  }}
                >
                  {t('pricing.pricingSection.limitedSpotsAlert.title')}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.7)' 
                      : 'rgba(0, 0, 0, 0.65)',
                    lineHeight: 1.6
                  }}
                >
                  {t('pricing.pricingSection.limitedSpotsAlert.description')}
                </Typography>
              </Stack>
            </Alert>
          </Box>

          <Paper
            elevation={0}
            sx={{
              mb: 4,
              background: isDarkMode
                ? `linear-gradient(145deg, ${alpha('#16a34a', 0.1)} 0%, ${alpha('#0d1117', 0.98)} 100%)`
                : `linear-gradient(145deg, ${alpha('#16a34a', 0.05)} 0%, #ffffff 100%)`,
              border: '2px solid',
              borderColor: alpha('#16a34a', 0.3),
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: 'linear-gradient(90deg, #16a34a, #22c55e, #16a34a)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Stack spacing={4}>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{
                      background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                  >
                    {isLoadingPrice ? (
                      <CircularProgress size={24} />
                    ) : (
                      formatPrice(pricing?.basePrice || 2500)
                    )}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {t('pricing.pricingSection.regularSubtitle')}
                  </Typography>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={{ xs: 1, sm: 3 }} 
                    justifyContent="center" 
                    alignItems="center"
                    sx={{ mt: 2 }}
                  >
                    <Chip 
                      icon={<CalendarToday />} 
                      label={t('phases.phase2.dates')} 
                      color="primary"
                      sx={{ 
                        width: { xs: 'fit-content', sm: 'auto' },
                        maxWidth: { xs: '100%', sm: 'auto' }
                      }} 
                    />
                    <Chip 
                      icon={<LocationOn />} 
                      label="Tampa, FL" 
                      color="secondary"
                      sx={{ 
                        width: { xs: 'fit-content', sm: 'auto' },
                        maxWidth: { xs: '100%', sm: 'auto' }
                      }} 
                    />
                  </Stack>
                </Box>

                <Divider />

                <Alert severity="info">
                  <strong>{t('pricing.pricingSection.modalitiesInfo')}</strong> {t('pricing.pricingSection.modalitiesDescription')}
                </Alert>

                {/* Non-refundable Policy Warning */}
                <Alert 
                  severity="warning"
                  icon={<Warning />}
                  sx={{ 
                    backgroundColor: alpha(theme.palette.warning.main, 0.12),
                    '& .MuiAlert-icon': {
                      color: theme.palette.warning.main,
                    },
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="body2" fontWeight={700}>
                      ⚠️ {t('noRefundPolicy.title')}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.5 }}>
                      {t('noRefundPolicy.description')}
                    </Typography>
                  </Stack>
                </Alert>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handlePurchase}
                  startIcon={<ShoppingCart />}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(22, 163, 74, 0.3)',
                    animation: 'offerPulse 3s infinite',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                      boxShadow: '0 6px 30px rgba(22, 163, 74, 0.4)',
                    },
                    '@keyframes offerPulse': {
                      '0%, 100%': { 
                        transform: 'scale(1)',
                      },
                      '50%': { 
                        transform: 'scale(1.02)',
                      },
                    },
                  }}
                >
                  {t('pricing.pricingSection.registerButton')}
                </Button>

                {/* Payment Options Message */}
                {event?.paymentMode === 'partial_allowed' ? (
                  <Alert
                    severity="success"
                    icon={<LocalOffer />}
                    sx={{
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {t('flexiblePaymentOptions.title')}
                    </Typography>
                    <Typography variant="caption" component="div">
                      {t('flexiblePaymentOptions.option1')}
                    </Typography>
                    <Typography variant="caption" component="div">
                      {t('flexiblePaymentOptions.option2', { amount: event.minimumDepositAmount || 0, percentage: event.depositPercentage || 50 })}
                    </Typography>
                    <Typography variant="caption" component="div">
                      {t('flexiblePaymentOptions.option3')}
                    </Typography>
                  </Alert>
                ) : (
                  <Alert
                    severity="success"
                    icon={<LocalOffer />}
                    sx={{
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {t('pricing.flexiblePayments', 'Multiple Payment Options Available')}
                    </Typography>
                    <Typography variant="caption">
                      {t('pricing.bnplOptions', 'Paga completo con tarjeta o elige Klarna y Afterpay para pagos flexibles')}
                    </Typography>
                  </Alert>
                )}

                {/* Always show the "search my registration" button - users with partial payments need to complete them */}
                <Button
                  variant="outlined"
                  size="medium"
                  fullWidth
                  onClick={() => router.push('/master-course/my-registration')}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  {t('alreadyRegistered.button')}
                </Button>

                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">
                      {t('pricing.pricingSection.features.0')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">
                      {t('pricing.regular.features.0')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">
                      {t('pricing.regular.features.1')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">
                      {t('pricing.regular.features.2')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">
                      {t('pricing.regular.features.3')}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: isDarkMode
                ? `linear-gradient(145deg, ${alpha('#f59e0b', 0.08)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                : `linear-gradient(145deg, ${alpha('#f59e0b', 0.06)} 0%, #ffffff 100%)`,
              border: '1px solid',
              borderColor: alpha('#f59e0b', 0.3),
              borderRadius: 3,
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Star color="warning" />
                <Typography variant="subtitle1" fontWeight={600}>
                  {t('support.contactTitle')}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Email:</strong> {settings?.contact?.contact_email || 'support@daytradedak.com'}
                </Typography>
                <Typography variant="body2">
                  <strong>{t('support.phone')}:</strong> {settings?.contact?.contact_phone || '786.356.7260'}
                </Typography>
                <Typography variant="body2">
                  <strong>{t('support.web')}:</strong> www.DayTradeDAK.com
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box
        sx={{
          py: 10,
          background: isDarkMode
            ? `linear-gradient(180deg, #0d1117 0%, ${alpha('#161b22', 1)} 50%, #0d1117 100%)`
            : `linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight={800}
            mb={2}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)'
                : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('faq.mainTitle')}
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" mb={6}>
            Answers to your most common questions
          </Typography>
          {(t('faq.questions', { returnObjects: true }) as {question: string, answer: string}[]).map((faq, index) => {
            const colors = ['#16a34a', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
            const color = colors[index % colors.length];
            return (
              <Accordion
                key={faq.question}
                sx={{
                  mb: 2,
                  background: isDarkMode
                    ? `linear-gradient(145deg, ${alpha(color, 0.05)} 0%, ${alpha('#0d1117', 0.98)} 100%)`
                    : `linear-gradient(145deg, ${alpha(color, 0.03)} 0%, #ffffff 100%)`,
                  border: '1px solid',
                  borderColor: alpha(color, 0.2),
                  borderRadius: '12px !important',
                  overflow: 'hidden',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                  '&::before': {
                    display: 'none',
                  },
                  '&:hover': {
                    borderColor: alpha(color, 0.4),
                    boxShadow: `0 8px 24px ${alpha(color, 0.1)}`,
                  },
                  '&.Mui-expanded': {
                    borderColor: color,
                    boxShadow: `0 12px 32px ${alpha(color, 0.15)}`,
                    margin: '0 0 16px 0',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMore
                      sx={{
                        color: color,
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  }
                  sx={{
                    px: 3,
                    py: 1,
                    '& .MuiAccordionSummary-content': {
                      my: 2,
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    px: 3,
                    pb: 3,
                    pt: 0,
                    borderTop: `1px solid ${alpha(color, 0.1)}`,
                  }}
                >
                  <Typography
                    sx={{
                      lineHeight: 1.8,
                      color: 'text.secondary',
                      pt: 2,
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Container>
      </Box>
    </Box>
    <ProfessionalFooter />
    
    {/* Event Registration Modal */}
    {event ? (
      <EventRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        event={event}
        userId={user?._id}
        userEmail={user?.email}
        user={user}
      />
    ) : null}
    </>
  );
}