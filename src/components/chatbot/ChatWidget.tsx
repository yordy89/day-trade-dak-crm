'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Fab,
  Badge,
  Tooltip,
  Fade,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { MessageCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme as useCustomTheme } from '@/components/theme/theme-provider';
import { useAuth } from '@/hooks/use-auth';
import { ChatWindow } from './ChatWindow';

interface ChatWidgetProps {
  region?: 'us' | 'es';
  requireAuth?: boolean;
}

export function ChatWidget({ region = 'es', requireAuth = false }: ChatWidgetProps) {
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();
  const { t } = useTranslation('common');
  const { isAuthenticated, hasHydrated } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Show tooltip after delay on first visit
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('chatbot_tooltip_shown');
    const shouldShowTooltip = !requireAuth || (hasHydrated && isAuthenticated);

    if (!hasSeenTooltip && shouldShowTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        localStorage.setItem('chatbot_tooltip_shown', 'true');

        // Hide tooltip after 5 seconds
        setTimeout(() => setShowTooltip(false), 5000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasHydrated, isAuthenticated, requireAuth]);

  // Listen for global openChatbot event
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
      setIsMinimized(false);
      setUnreadCount(0);
      setShowTooltip(false);
    };

    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openChatbot', handleOpenChatbot);
  }, []);

  // Don't render if auth is required and user is not authenticated
  if (requireAuth && (!hasHydrated || !isAuthenticated)) {
    return null;
  }

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    setShowTooltip(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  // Minimized state - small badge indicator
  if (isMinimized && !isOpen) {
    return (
      <Fade in>
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1398,
          }}
        >
          <Fab
            size="medium"
            onClick={handleOpen}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: '#fff',
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  top: -4,
                  right: -4,
                },
              }}
            >
              <MessageCircle size={24} />
            </Badge>
          </Fab>
        </Box>
      </Fade>
    );
  }

  return (
    <>
      {/* Chat Window */}
      <ChatWindow
        isOpen={isOpen}
        onClose={handleClose}
        onMinimize={handleMinimize}
        region={region}
      />

      {/* Floating Action Button */}
      {!isOpen && (
        <Fade in>
          <Box
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1398,
            }}
          >
            <Tooltip
              title={t('chatbot.tooltip', '¿Necesitas ayuda? ¡Chatea conmigo!')}
              open={showTooltip}
              placement="left"
              arrow
              sx={{
                '& .MuiTooltip-tooltip': {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  boxShadow: theme.shadows[4],
                  fontSize: '0.875rem',
                  padding: '8px 12px',
                },
                '& .MuiTooltip-arrow': {
                  color: theme.palette.background.paper,
                },
              }}
            >
              <Fab
                size={isMobile ? 'medium' : 'large'}
                onClick={handleOpen}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: '#fff',
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  animation: showTooltip ? 'chatPulse 2s infinite' : 'none',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    transform: 'scale(1.1)',
                    boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.5)}`,
                  },
                  transition: 'all 0.3s ease',
                  '@keyframes chatPulse': {
                    '0%': {
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                    '50%': {
                      boxShadow: `0 4px 30px ${alpha(theme.palette.primary.main, 0.6)}`,
                      transform: 'scale(1.05)',
                    },
                    '100%': {
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                  },
                }}
              >
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      top: -4,
                      right: -4,
                      border: `2px solid ${theme.palette.background.paper}`,
                    },
                  }}
                >
                  <MessageCircle size={isMobile ? 22 : 26} />
                </Badge>
              </Fab>
            </Tooltip>
          </Box>
        </Fade>
      )}
    </>
  );
}
