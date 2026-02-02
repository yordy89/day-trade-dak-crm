'use client';

import React from 'react';
import { Box, Typography, alpha, useTheme, Chip, Stack } from '@mui/material';
import { Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/services/api/chatbot.service';
import { useTheme as useCustomTheme } from '@/components/theme/theme-provider';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();
  const isUser = message.role === 'user';

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Color palette for improved UX
  const colors = {
    userBubble: isDarkMode
      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
      : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    assistantBubble: isDarkMode
      ? `linear-gradient(135deg, ${alpha('#2A3441', 0.95)} 0%, ${alpha('#1E2730', 0.98)} 100%)`
      : `linear-gradient(135deg, ${alpha('#F8FAFC', 0.98)} 0%, ${alpha('#F1F5F9', 0.95)} 100%)`,
    assistantBorder: isDarkMode
      ? `1px solid ${alpha(theme.palette.primary.main, 0.15)}`
      : `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
    userAvatar: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    assistantAvatar: isDarkMode
      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.dark, 0.15)} 100%)`
      : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.3)} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: 1.5,
        mb: 2.5,
        px: 2,
        animation: 'messageSlideIn 0.3s ease-out',
        '@keyframes messageSlideIn': {
          from: {
            opacity: 0,
            transform: isUser ? 'translateX(20px)' : 'translateX(-20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateX(0)',
          },
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
          background: isUser ? colors.userAvatar : colors.assistantAvatar,
          boxShadow: isUser
            ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
            : isDarkMode
              ? `0 4px 12px ${alpha('#000', 0.2)}`
              : `0 4px 12px ${alpha(theme.palette.grey[400], 0.2)}`,
          border: isUser
            ? 'none'
            : `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        {isUser ? (
          <User size={18} color="#fff" />
        ) : (
          <Sparkles size={18} color={theme.palette.primary.main} />
        )}
      </Box>

      {/* Message Content */}
      <Box sx={{ maxWidth: '78%', minWidth: 0 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: '16px',
            borderTopLeftRadius: isUser ? '16px' : '4px',
            borderTopRightRadius: isUser ? '4px' : '16px',
            background: isUser ? colors.userBubble : colors.assistantBubble,
            border: isUser ? 'none' : colors.assistantBorder,
            color: isUser ? '#fff' : theme.palette.text.primary,
            wordBreak: 'break-word',
            boxShadow: isUser
              ? `0 4px 16px ${alpha(theme.palette.primary.main, 0.25)}`
              : isDarkMode
                ? `0 4px 16px ${alpha('#000', 0.15)}`
                : `0 4px 16px ${alpha(theme.palette.grey[400], 0.15)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': isUser ? {} : {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: isDarkMode
                ? `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`
                : `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.7,
              fontSize: '0.9rem',
              fontWeight: 400,
              letterSpacing: '0.01em',
              '& strong': {
                fontWeight: 600,
                color: isUser ? '#fff' : theme.palette.primary.main,
              },
              '& code': {
                backgroundColor: isUser
                  ? alpha('#fff', 0.15)
                  : alpha(theme.palette.primary.main, 0.1),
                padding: '3px 6px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.85em',
              },
              '& a': {
                color: isUser ? '#fff' : theme.palette.primary.main,
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              },
            }}
          >
            {message.content}
          </Typography>

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <Stack
              direction="row"
              spacing={0.5}
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}
            >
              {message.sources.map((source, index) => (
                <Chip
                  key={index}
                  label={source}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                  variant="outlined"
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.75,
            px: 1,
            color: alpha(theme.palette.text.secondary, 0.5),
            textAlign: isUser ? 'right' : 'left',
            fontSize: '0.7rem',
            fontWeight: 500,
          }}
        >
          {formatTime(message.timestamp)}
        </Typography>
      </Box>
    </Box>
  );
}
