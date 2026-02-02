'use client';

import React from 'react';
import { Box, alpha, useTheme } from '@mui/material';
import { Sparkles } from 'lucide-react';
import { useTheme as useCustomTheme } from '@/components/theme/theme-provider';

interface ChatTypingIndicatorProps {
  isTyping: boolean;
}

export function ChatTypingIndicator({ isTyping }: ChatTypingIndicatorProps) {
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();

  if (!isTyping) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        mb: 2,
        animation: 'fadeIn 0.3s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.dark, 0.15)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.3)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: isDarkMode
            ? `0 4px 12px ${alpha('#000', 0.2)}`
            : `0 4px 12px ${alpha(theme.palette.grey[400], 0.2)}`,
        }}
      >
        <Sparkles
          size={18}
          color={theme.palette.primary.main}
          style={{
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        />
      </Box>

      {/* Typing bubble */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          py: 1.5,
          px: 2,
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha('#2A3441', 0.95)} 0%, ${alpha('#1E2730', 0.98)} 100%)`
            : `linear-gradient(135deg, ${alpha('#F8FAFC', 0.98)} 0%, ${alpha('#F1F5F9', 0.95)} 100%)`,
          border: isDarkMode
            ? `1px solid ${alpha(theme.palette.primary.main, 0.15)}`
            : `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
          borderRadius: '16px',
          borderTopLeftRadius: '4px',
          boxShadow: isDarkMode
            ? `0 4px 16px ${alpha('#000', 0.15)}`
            : `0 4px 16px ${alpha(theme.palette.grey[400], 0.15)}`,
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              animation: 'typingBounce 1.4s infinite ease-in-out both',
              animationDelay: `${index * 0.16}s`,
              '@keyframes typingBounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0.6)',
                  opacity: 0.4,
                },
                '40%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
