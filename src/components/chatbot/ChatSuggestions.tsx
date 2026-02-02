'use client';

import React from 'react';
import { Box, Button, Stack, Typography, alpha, useTheme } from '@mui/material';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme as useCustomTheme } from '@/components/theme/theme-provider';

interface ChatSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

export function ChatSuggestions({
  suggestions,
  onSelect,
  disabled,
}: ChatSuggestionsProps) {
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();
  const { t } = useTranslation('common');

  if (!suggestions.length) return null;

  return (
    <Box sx={{ p: 2, pt: 1.5 }}>
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.5 }}>
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.dark, 0.15)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.4)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
          }}
        >
          <Sparkles size={12} color={theme.palette.primary.main} />
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {t('chatbot.suggestions.title', 'Quick questions')}
        </Typography>
      </Stack>

      <Stack spacing={1}>
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            onClick={() => !disabled && onSelect(suggestion)}
            disabled={disabled}
            fullWidth
            sx={{
              justifyContent: 'space-between',
              textAlign: 'left',
              py: 1.25,
              px: 2,
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: theme.palette.text.primary,
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha('#2A3441', 0.6)} 0%, ${alpha('#1E2730', 0.8)} 100%)`
                : `linear-gradient(135deg, ${alpha('#FFFFFF', 0.9)} 0%, ${alpha('#F8FAFC', 0.95)} 100%)`,
              border: isDarkMode
                ? `1px solid ${alpha(theme.palette.primary.main, 0.15)}`
                : `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
              boxShadow: isDarkMode
                ? `0 2px 8px ${alpha('#000', 0.1)}`
                : `0 2px 8px ${alpha(theme.palette.grey[400], 0.1)}`,
              transition: 'all 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: isDarkMode
                  ? `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`
                  : `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.15)}, transparent)`,
                opacity: 0,
                transition: 'opacity 0.25s ease',
              },
              '&:hover': {
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha('#2A3441', 0.9)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha('#FFFFFF', 0.95)} 100%)`,
                borderColor: alpha(theme.palette.primary.main, 0.4),
                boxShadow: isDarkMode
                  ? `0 4px 16px ${alpha(theme.palette.primary.main, 0.15)}`
                  : `0 4px 16px ${alpha(theme.palette.primary.main, 0.12)}`,
                transform: 'translateY(-1px)',
                '&::before': {
                  opacity: 1,
                },
                '& .arrow-icon': {
                  transform: 'translateX(4px)',
                  color: theme.palette.primary.main,
                },
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
              },
            }}
          >
            <span style={{ flex: 1, lineHeight: 1.4 }}>{suggestion}</span>
            <ArrowRight
              className="arrow-icon"
              size={16}
              style={{
                marginLeft: 8,
                opacity: 0.5,
                transition: 'all 0.25s ease',
                flexShrink: 0,
              }}
            />
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
