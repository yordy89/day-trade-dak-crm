'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Button,
  Stack,
  Chip,
  alpha,
  useTheme,
  Fade,
  Slide,
  Paper,
} from '@mui/material';
import {
  X,
  Bell,
  ChevronRight,
  TrendingUp,
  Calendar,
  BookOpen,
  AlertCircle,
  DollarSign,
  BarChart2,
  Minus,
} from 'lucide-react';
import { useTheme as useCustomTheme } from '@/components/theme/theme-provider';
import DOMPurify from 'dompurify';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'webinar' | 'course' | 'mentorship' | 'market_news' | 'fed_meeting' | 'earnings' | 'general';
  link?: string;
  linkText?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dismissible?: boolean;
  dismissDurationHours?: number;
  displayFrequency?: 'once' | 'daily' | 'weekly' | 'always';
  imageUrl?: string;
  template?: string;
  customStyles?: {
    headerBg?: string;
    headerText?: string;
    bodyBg?: string;
    bodyText?: string;
    buttonBg?: string;
    buttonText?: string;
    borderColor?: string;
    animation?: string;
  };
  customHtml?: string;
}

export default function TradingFloatingAnnouncement() {
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [marketPulse, setMarketPulse] = useState(true);

  // Simulate market pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/v1/auth/announcements/active`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data && data.success && data.data) {
          const announcementData = data.data;

          // Check display frequency
          const lastShownKey = `announcement_lastshown_${announcementData._id}`;
          const lastShown = localStorage.getItem(lastShownKey);

          if (shouldShowAnnouncement(announcementData, lastShown)) {
            setAnnouncement(announcementData);

            // Update last shown time
            localStorage.setItem(lastShownKey, new Date().toISOString());

            // Delay showing for better UX
            setTimeout(() => {
              checkUserEngagement();
            }, 3000);
          }
        }
      } catch (err) {
        console.error('[TradingFloatingAnnouncement] Error:', err);
      }
    };

    const shouldShowAnnouncement = (ann: Announcement, lastShown: string | null): boolean => {
      if (!ann.displayFrequency || ann.displayFrequency === 'always') return true;
      if (ann.displayFrequency === 'once' && lastShown) return false;

      if (lastShown) {
        const hoursSinceShown = (Date.now() - new Date(lastShown).getTime()) / (1000 * 60 * 60);

        if (ann.displayFrequency === 'daily' && hoursSinceShown < 24) return false;
        if (ann.displayFrequency === 'weekly' && hoursSinceShown < 168) return false;
      }

      return true;
    };

    const checkUserEngagement = () => {
      let scrolled = false;
      let timeOnPage = 0;

      const scrollHandler = () => {
        if (window.scrollY > 100 && !scrolled) {
          scrolled = true;
          showAnnouncement();
        }
      };

      const timeHandler = setInterval(() => {
        timeOnPage += 1;
        if (timeOnPage >= 5 && !scrolled) {
          clearInterval(timeHandler);
          showAnnouncement();
        }
      }, 1000);

      window.addEventListener('scroll', scrollHandler);

      return () => {
        window.removeEventListener('scroll', scrollHandler);
        clearInterval(timeHandler);
      };
    };

    const showAnnouncement = () => {
      setIsVisible(true);
      setTimeout(() => setIsExpanded(true), 500);
    };

    loadAnnouncement();
  }, []);

  const handleDismiss = () => {
    setIsExpanded(false);
    setTimeout(() => setIsVisible(false), 300);

    if (announcement) {
      const dismissedKey = `announcement_dismissed_${announcement._id}`;
      localStorage.setItem(dismissedKey, new Date().toISOString());

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      fetch(`${apiUrl}/api/v1/auth/announcements/${announcement._id}/track-dismiss`, {
        method: 'POST',
      }).catch(console.error);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setHasInteracted(true);
  };

  const handleAction = () => {
    if (!announcement?.link) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${apiUrl}/api/v1/auth/announcements/${announcement._id}/track-click`, {
      method: 'POST',
    }).catch(console.error);

    window.open(announcement.link, '_blank', 'noopener,noreferrer');
  };

  const getIcon = () => {
    const iconProps = { size: 20, color: theme.palette.text.primary };

    switch (announcement?.type) {
      case 'webinar':
        return <Calendar {...iconProps} />;
      case 'course':
      case 'mentorship':
        return <BookOpen {...iconProps} />;
      case 'market_news':
        return <BarChart2 {...iconProps} />;
      case 'fed_meeting':
        return <AlertCircle {...iconProps} />;
      case 'earnings':
        return <DollarSign {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getTypeColor = () => {
    switch (announcement?.type) {
      case 'fed_meeting':
      case 'earnings':
        return theme.palette.warning.main;
      case 'market_news':
        return theme.palette.info.main;
      case 'webinar':
      case 'course':
      case 'mentorship':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getPriorityGradient = () => {
    if (announcement?.priority === 'critical' || announcement?.priority === 'high') {
      return {
        background: `linear-gradient(45deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`,
        borderColor: theme.palette.error.main,
      };
    }
    return {
      background: 'transparent',
      borderColor: alpha(theme.palette.divider, 0.3),
    };
  };

  const getTypeLabel = () => {
    switch (announcement?.type) {
      case 'fed_meeting': return 'FED Meeting';
      case 'earnings': return 'Earnings Report';
      case 'market_news': return 'Market News';
      case 'webinar': return 'Live Webinar';
      case 'course': return 'New Course';
      case 'mentorship': return 'Mentorship';
      default: return 'Announcement';
    }
  };

  if (!announcement || !isVisible) return null;

  // Minimized state - trading indicator bubble
  if (isMinimized) {
    return (
      <Fade in={true}>
        <Paper
          onClick={handleMinimize}
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 3,
            right: 3,
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.success.dark, 0.9)} 0%, ${alpha(theme.palette.success.main, 0.8)} 100%)`
              : `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1400,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: `2px solid ${alpha(theme.palette.success.light, 0.3)}`,
            animation: hasInteracted ? 'none' : 'tradingPulse 2s infinite',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: `0 0 20px ${alpha(theme.palette.success.main, 0.5)}`,
            },
            '@keyframes tradingPulse': {
              '0%': {
                boxShadow: `0 4px 20px ${alpha(theme.palette.success.main, 0.3)}`,
                border: `2px solid ${alpha(theme.palette.success.light, 0.3)}`,
              },
              '50%': {
                boxShadow: `0 4px 30px ${alpha(theme.palette.success.main, 0.5)}`,
                border: `2px solid ${alpha(theme.palette.success.light, 0.6)}`,
              },
              '100%': {
                boxShadow: `0 4px 20px ${alpha(theme.palette.success.main, 0.3)}`,
                border: `2px solid ${alpha(theme.palette.success.light, 0.3)}`,
              },
            },
          }}
        >
          <Box sx={{ position: 'relative' }}>
            {getIcon()}
            {/* Market indicator dot */}
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: marketPulse ? theme.palette.success.light : theme.palette.error.light,
                transition: 'background-color 0.3s',
              }}
            />
          </Box>
        </Paper>
      </Fade>
    );
  }

  // Expanded trading card
  return (
    <Slide direction="left" in={isVisible} timeout={500}>
      <Card
        elevation={16}
        sx={{
          position: 'fixed',
          bottom: 3,
          right: 3,
          width: isExpanded ? 420 : 64,
          maxWidth: 'calc(100vw - 48px)',
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          zIndex: 1400,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          border: `1px solid ${getPriorityGradient().borderColor}`,
          ...getPriorityGradient(),
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Header with market theme or custom styles */}
        <Box
          sx={{
            background: announcement.customStyles?.headerBg ||
              (isDarkMode
                ? `linear-gradient(90deg, ${alpha('#0a0a0a', 0.95)} 0%, ${alpha('#141414', 0.95)} 100%)`
                : `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" flex={1}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(getTypeColor(), 0.1),
                border: `1px solid ${alpha(getTypeColor(), 0.2)}`,
              }}
            >
              {getIcon()}
            </Box>
            <Box flex={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={getTypeLabel()}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    backgroundColor: alpha(getTypeColor(), 0.15),
                    color: getTypeColor(),
                    border: `1px solid ${alpha(getTypeColor(), 0.3)}`,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
                {announcement.priority === 'high' && (
                  <TrendingUp size={14} color={theme.palette.error.main} />
                )}
              </Stack>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: announcement.customStyles?.headerText || theme.palette.text.primary,
                  mt: 0.5,
                }}
              >
                {announcement.title}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={handleMinimize}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.action.hover, 0.1),
                },
              }}
            >
              <Minus size={18} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDismiss}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                },
              }}
            >
              <X size={18} />
            </IconButton>
          </Stack>
        </Box>

        {/* Content - Custom HTML or Default */}
        <Fade in={isExpanded} timeout={300}>
          <Box
            sx={{
              p: 2.5,
              backgroundColor: announcement.customStyles?.bodyBg || 'transparent',
            }}
          >
            {announcement.customHtml ? (
              <Box
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    announcement.customHtml
                      .replace('{{title}}', announcement.title)
                      .replace('{{content}}', announcement.content),
                    {
                      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'],
                      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
                      ALLOW_DATA_ATTR: false,
                    }
                  )
                }}
                sx={{
                  '& button, & a': {
                    cursor: 'pointer',
                  },
                }}
              />
            ) : (
              <>
                {/* Market chart visualization */}
                <Box
              sx={{
                height: 60,
                mb: 2,
                borderRadius: 1,
                background: isDarkMode
                  ? alpha(theme.palette.success.dark, 0.05)
                  : alpha(theme.palette.success.light, 0.1),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Animated trading line */}
              <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                <polyline
                  points="0,30 50,25 100,20 150,35 200,15 250,25 300,10 350,20 400,15"
                  fill="none"
                  stroke={theme.palette.success.main}
                  strokeWidth="2"
                  opacity="0.3"
                  style={{
                    animation: 'slideChart 10s linear infinite',
                  }}
                />
                <style>{`
                  @keyframes slideChart {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                  }
                `}</style>
              </svg>
            </Box>

            {announcement.imageUrl && (
              <Box
                component="img"
                src={announcement.imageUrl}
                alt={announcement.title}
                sx={{
                  width: '100%',
                  height: 140,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mb: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              />
            )}

            <Typography
              variant="body2"
              sx={{
                color: announcement.customStyles?.bodyText || theme.palette.text.secondary,
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              {announcement.content}
            </Typography>

            {announcement.link && (
              <Button
                fullWidth
                variant="contained"
                onClick={handleAction}
                endIcon={<ChevronRight size={18} />}
                sx={{
                  backgroundColor: announcement.customStyles?.buttonBg || theme.palette.success.main,
                  color: announcement.customStyles?.buttonText || '#fff',
                  fontWeight: 600,
                  py: 1.2,
                  borderRadius: 1,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: announcement.customStyles?.buttonBg
                      ? alpha(announcement.customStyles.buttonBg, 0.9)
                      : theme.palette.success.dark,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 12px ${alpha(announcement.customStyles?.buttonBg || theme.palette.success.main, 0.3)}`,
                  },
                  transition: 'all 0.2s',
                }}
              >
                {announcement.linkText || 'Learn More'}
              </Button>
            )}

            {announcement.dismissible !== false && (
              <Button
                fullWidth
                size="small"
                onClick={handleMinimize}
                sx={{
                  mt: 1,
                  color: theme.palette.text.secondary,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.05),
                  },
                }}
              >
                Minimize
              </Button>
            )}
              </>
            )}
          </Box>
        </Fade>
      </Card>
    </Slide>
  );
}