'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  alpha,
  useTheme,
  Stack,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { X, Trash2, Minus, History, Plus, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme as useCustomTheme } from '@/components/theme/theme-provider';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatSuggestions } from './ChatSuggestions';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import { ChatHistoryDrawer } from './ChatHistoryDrawer';
import { useChat } from '@/hooks/use-chat';
import { useAuth } from '@/hooks/use-auth';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  region?: 'us' | 'es';
}

export function ChatWindow({
  isOpen,
  onClose,
  onMinimize,
  region = 'us',
}: ChatWindowProps) {
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();
  const { t } = useTranslation('common');
  const { isAuthenticated } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  const {
    messages,
    isLoading,
    isTyping,
    error,
    conversationId,
    suggestions,
    conversationsList,
    isLoadingHistory,
    hasMoreConversations,
    totalConversations,
    sendMessage,
    clearMessages,
    startNewConversation,
    loadConversation,
    loadConversationsList,
    loadMoreConversations,
    deleteConversation,
  } = useChat({ region });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleHistoryClick = () => {
    setHistoryDrawerOpen(true);
    loadConversationsList(true);
  };

  const handleHistoryClose = () => {
    setHistoryDrawerOpen(false);
  };

  const handleSelectConversation = (selectedConversationId: string) => {
    loadConversation(selectedConversationId);
  };

  if (!isOpen) return null;

  return (
    <>
      <Card
        elevation={16}
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 24,
          width: 380,
          maxWidth: 'calc(100vw - 48px)',
          height: 560,
          maxHeight: 'calc(100vh - 140px)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1399,
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundColor: theme.palette.background.paper,
          backdropFilter: 'blur(10px)',
          animation: 'chatSlideUp 0.3s ease-out',
          '@keyframes chatSlideUp': {
            from: {
              opacity: 0,
              transform: 'translateY(20px) scale(0.95)',
            },
            to: {
              opacity: 1,
              transform: 'translateY(0) scale(1)',
            },
          },
        }}
      >
        {/* Header */}
        <CardHeader
          sx={{
            p: 2,
            pb: 1.5,
            background: isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${theme.palette.background.paper} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
          avatar={
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Sparkles size={22} color="#fff" />
            </Box>
          }
          title={
            <Typography variant="subtitle1" fontWeight={600}>
              {t('chatbot.title', 'DayTradeDak Assistant')}
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.success.main,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              {t('chatbot.online', 'Online')}
            </Typography>
          }
          action={
            <Stack direction="row" spacing={0.5}>
              {/* History button - only for authenticated users */}
              {isAuthenticated && (
                <Tooltip title={t('chatbot.history', 'Chat history')}>
                  <IconButton
                    size="small"
                    onClick={handleHistoryClick}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <History size={18} />
                  </IconButton>
                </Tooltip>
              )}
              {/* New conversation button */}
              {messages.length > 0 && (
                <Tooltip title={t('chatbot.newChat', 'New conversation')}>
                  <IconButton
                    size="small"
                    onClick={startNewConversation}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                      },
                    }}
                  >
                    <Plus size={18} />
                  </IconButton>
                </Tooltip>
              )}
              {messages.length > 0 && (
                <Tooltip title={t('chatbot.clearChat', 'Clear chat')}>
                  <IconButton
                    size="small"
                    onClick={clearMessages}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main,
                      },
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={t('chatbot.minimize', 'Minimize')}>
                <IconButton
                  size="small"
                  onClick={onMinimize}
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.action.hover, 0.1),
                    },
                  }}
                >
                  <Minus size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('chatbot.close', 'Close')}>
                <IconButton
                  size="small"
                  onClick={onClose}
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
              </Tooltip>
            </Stack>
          }
        />

        {/* Messages Area */}
        <CardContent
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 0,
            background: isDarkMode
              ? `linear-gradient(180deg, ${alpha('#141A1F', 0.98)} 0%, ${alpha('#0D1117', 0.95)} 100%)`
              : `linear-gradient(180deg, ${alpha('#FFFFFF', 0.98)} 0%, ${alpha('#F8FAFC', 0.95)} 100%)`,
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: 3,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
              },
            },
          }}
        >
          {isLoadingHistory ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress
                size={32}
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
          ) : messages.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 4,
                px: 2,
                textAlign: 'center',
              }}
            >
              {/* Logo/Avatar */}
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.dark, 0.15)} 100%)`
                    : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.4)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
                  mb: 2.5,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    borderRadius: '22px',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
                    zIndex: -1,
                  },
                }}
              >
                <Sparkles size={36} color={theme.palette.primary.main} />
              </Box>

              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('chatbot.subtitle', 'How can I help you today?')}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  maxWidth: 300,
                  color: alpha(theme.palette.text.secondary, 0.8),
                  lineHeight: 1.6,
                }}
              >
                {t(
                  'chatbot.welcome',
                  'I can help you with information about our courses, events, mentorship programs, and more.',
                )}
              </Typography>

              {/* Suggestions for new chat */}
              <Box sx={{ width: '100%' }}>
                <ChatSuggestions
                  suggestions={suggestions}
                  onSelect={sendMessage}
                  disabled={isLoading}
                />
              </Box>
            </Box>
          ) : (
            <Box sx={{ pt: 2, pb: 1 }}>
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              <ChatTypingIndicator isTyping={isTyping} />
              <div ref={messagesEndRef} />
            </Box>
          )}

          {/* Error Message */}
          {error && (
            <Box
              sx={{
                mx: 2,
                mb: 1,
                p: 2,
                borderRadius: '12px',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0.2)} 0%, ${alpha(theme.palette.error.main, 0.1)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.error.light, 0.3)} 0%, ${alpha(theme.palette.error.main, 0.1)} 100%)`,
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              }}
            >
              <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
                {error}
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </Card>

      {/* History Drawer */}
      <ChatHistoryDrawer
        open={historyDrawerOpen}
        onClose={handleHistoryClose}
        conversations={conversationsList}
        currentConversationId={conversationId}
        isLoading={isLoadingHistory}
        hasMore={hasMoreConversations}
        total={totalConversations}
        onSelectConversation={handleSelectConversation}
        onNewConversation={startNewConversation}
        onDeleteConversation={deleteConversation}
        onLoadMore={loadMoreConversations}
      />
    </>
  );
}
