'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  alpha,
  useTheme,
  InputAdornment,
} from '@mui/material';
import { Send, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme as useCustomTheme } from '@/components/theme/theme-provider';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();
  const { t } = useTranslation('common');
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const canSend = message.trim() && !isLoading && !disabled;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        pt: 1.5,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        background: isDarkMode
          ? `linear-gradient(180deg, ${alpha('#1A2027', 0.95)} 0%, ${alpha('#141A1F', 0.98)} 100%)`
          : `linear-gradient(180deg, ${alpha('#FFFFFF', 0.98)} 0%, ${alpha('#F8FAFC', 0.95)} 100%)`,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: '16px',
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha('#2A3441', 0.5)} 0%, ${alpha('#1E2730', 0.7)} 100%)`
            : `linear-gradient(135deg, ${alpha('#FFFFFF', 0.9)} 0%, ${alpha('#F1F5F9', 0.8)} 100%)`,
          border: isDarkMode
            ? `1px solid ${alpha(isFocused ? theme.palette.primary.main : theme.palette.divider, isFocused ? 0.5 : 0.15)}`
            : `1px solid ${alpha(isFocused ? theme.palette.primary.main : theme.palette.grey[300], isFocused ? 0.5 : 0.3)}`,
          boxShadow: isFocused
            ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}, 0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
            : isDarkMode
              ? `0 2px 8px ${alpha('#000', 0.1)}`
              : `0 2px 8px ${alpha(theme.palette.grey[400], 0.1)}`,
          transition: 'all 0.25s ease',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: isFocused
              ? `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.4)}, transparent)`
              : 'transparent',
            transition: 'all 0.25s ease',
          },
        }}
      >
        <TextField
          inputRef={inputRef}
          fullWidth
          variant="standard"
          placeholder={t('chatbot.placeholder', 'Type your message...')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading || disabled}
          multiline
          maxRows={4}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="submit"
                  disabled={!canSend}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: canSend
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                      : 'transparent',
                    color: canSend ? '#fff' : alpha(theme.palette.text.disabled, 0.5),
                    boxShadow: canSend
                      ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`
                      : 'none',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      background: canSend
                        ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
                        : 'transparent',
                      boxShadow: canSend
                        ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.45)}`
                        : 'none',
                      transform: canSend ? 'translateY(-1px)' : 'none',
                    },
                    '&:active': {
                      transform: canSend ? 'translateY(0)' : 'none',
                    },
                    '&:disabled': {
                      color: alpha(theme.palette.text.disabled, 0.4),
                    },
                  }}
                >
                  {isLoading ? (
                    <Loader2
                      size={20}
                      style={{
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                  ) : (
                    <Send size={18} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              px: 2,
              py: 1.25,
              fontSize: '0.95rem',
              '& input::placeholder, & textarea::placeholder': {
                color: alpha(theme.palette.text.secondary, 0.5),
                opacity: 1,
              },
            },
          }}
          sx={{
            '& .MuiInputBase-root': {
              alignItems: 'center',
            },
            '@keyframes spin': {
              from: { transform: 'rotate(0deg)' },
              to: { transform: 'rotate(360deg)' },
            },
          }}
        />
      </Box>
    </Box>
  );
}
