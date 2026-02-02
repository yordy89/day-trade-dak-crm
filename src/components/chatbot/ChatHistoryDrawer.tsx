'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  alpha,
  useTheme,
  Stack,
  Button,
  CircularProgress,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  X,
  Search,
  Plus,
  MessageSquare,
  Trash2,
  Clock,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme as useCustomTheme } from '@/components/theme/theme-provider';
import { ConversationListItem } from '@/services/api/chatbot.service';

interface ChatHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  conversations: ConversationListItem[];
  currentConversationId: string | null;
  isLoading: boolean;
  hasMore: boolean;
  total: number;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  onLoadMore: () => void;
}

interface GroupedConversations {
  today: ConversationListItem[];
  yesterday: ConversationListItem[];
  thisWeek: ConversationListItem[];
  thisMonth: ConversationListItem[];
  older: ConversationListItem[];
}

export function ChatHistoryDrawer({
  open,
  onClose,
  conversations,
  currentConversationId,
  isLoading,
  hasMore,
  total,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onLoadMore,
}: ChatHistoryDrawerProps) {
  const theme = useTheme();
  const { isDarkMode } = useCustomTheme();
  const { t } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter conversations by search
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (conv) =>
        conv.preview?.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  // Group conversations by date
  const groupedConversations = useMemo((): GroupedConversations => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const groups: GroupedConversations = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: [],
    };

    filteredConversations.forEach((conv) => {
      const convDate = new Date(conv.lastMessageAt);
      if (convDate >= today) {
        groups.today.push(conv);
      } else if (convDate >= yesterday) {
        groups.yesterday.push(conv);
      } else if (convDate >= weekAgo) {
        groups.thisWeek.push(conv);
      } else if (convDate >= monthAgo) {
        groups.thisMonth.push(conv);
      } else {
        groups.older.push(conv);
      }
    });

    return groups;
  }, [filteredConversations]);

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleDelete = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    setDeletingId(convId);
    await onDeleteConversation(convId);
    setDeletingId(null);
  };

  const handleSelect = (convId: string) => {
    onSelectConversation(convId);
    onClose();
  };

  const handleNewConversation = () => {
    onNewConversation();
    onClose();
  };

  // Generate title from preview
  const getConversationTitle = (preview: string | undefined): string => {
    if (!preview) return t('chatbot.emptyConversation', 'New conversation');
    // Truncate and clean up
    const title = preview.slice(0, 50);
    return title.length < preview.length ? `${title}...` : title;
  };

  const renderConversationItem = (conv: ConversationListItem, showDate = false) => {
    const isActive = conv.conversationId === currentConversationId;
    const isDeleting = deletingId === conv.conversationId;

    return (
      <Box
        key={conv.conversationId}
        onClick={() => !isDeleting && handleSelect(conv.conversationId)}
        sx={{
          p: 1.5,
          mx: 1,
          mb: 0.5,
          borderRadius: '12px',
          cursor: isDeleting ? 'default' : 'pointer',
          opacity: isDeleting ? 0.5 : 1,
          background: isActive
            ? isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.dark, 0.15)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`
            : 'transparent',
          border: isActive
            ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
            : `1px solid transparent`,
          transition: 'all 0.2s ease',
          '&:hover': {
            background: isActive
              ? undefined
              : isDarkMode
                ? alpha('#2A3441', 0.6)
                : alpha(theme.palette.grey[100], 0.8),
            '& .delete-button': {
              opacity: 1,
            },
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          {/* Icon */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: isActive
                ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                : isDarkMode
                  ? alpha(theme.palette.primary.main, 0.15)
                  : alpha(theme.palette.primary.main, 0.1),
            }}
          >
            {isActive ? (
              <Sparkles size={16} color="#fff" />
            ) : (
              <MessageSquare
                size={16}
                color={isDarkMode ? theme.palette.primary.light : theme.palette.primary.main}
              />
            )}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: isActive ? 600 : 500,
                color: theme.palette.text.primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 0.25,
              }}
            >
              {getConversationTitle(conv.preview)}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Clock size={12} color={theme.palette.text.secondary} />
              <Typography
                variant="caption"
                sx={{ color: alpha(theme.palette.text.secondary, 0.7) }}
              >
                {showDate ? formatDate(conv.lastMessageAt) : formatTime(conv.lastMessageAt)}
                {' · '}
                {conv.messageCount} {t('chatbot.messages', 'msgs')}
              </Typography>
            </Stack>
          </Box>

          {/* Delete button */}
          <Tooltip title={t('chatbot.deleteConversation', 'Delete')}>
            <IconButton
              className="delete-button"
              size="small"
              onClick={(e) => handleDelete(e, conv.conversationId)}
              disabled={isDeleting}
              sx={{
                opacity: 0,
                width: 28,
                height: 28,
                color: theme.palette.text.secondary,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: theme.palette.error.main,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                },
              }}
            >
              {isDeleting ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <Trash2 size={14} />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    );
  };

  const renderGroup = (
    title: string,
    items: ConversationListItem[],
    showDate = false
  ) => {
    if (items.length === 0) return null;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            color: alpha(theme.palette.text.secondary, 0.7),
            fontWeight: 600,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </Typography>
        {items.map((conv) => renderConversationItem(conv, showDate))}
      </Box>
    );
  };

  const hasConversations = filteredConversations.length > 0;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          maxWidth: '85vw',
          background: isDarkMode
            ? `linear-gradient(180deg, ${alpha('#1A2027', 0.98)} 0%, ${alpha('#0D1117', 0.95)} 100%)`
            : `linear-gradient(180deg, #FFFFFF 0%, ${alpha('#F8FAFC', 0.95)} 100%)`,
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: isDarkMode
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.15)} 0%, transparent 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 100%)`,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            >
              <Sparkles size={18} color="#fff" />
            </Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {t('chatbot.history', 'Chat History')}
            </Typography>
          </Stack>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.action.hover, 0.1),
              },
            }}
          >
            <X size={18} />
          </IconButton>
        </Stack>

        {/* New Conversation Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleNewConversation}
          sx={{
            mb: 2,
            py: 1.25,
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        >
          {t('chatbot.newChat', 'New Conversation')}
        </Button>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder={t('chatbot.searchConversations', 'Search conversations...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color={theme.palette.text.secondary} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: isDarkMode
                ? alpha('#2A3441', 0.5)
                : alpha(theme.palette.grey[100], 0.8),
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />

        {/* Total count */}
        {total > 0 && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1.5,
              color: alpha(theme.palette.text.secondary, 0.6),
              textAlign: 'center',
            }}
          >
            {total} {t('chatbot.totalConversations', 'conversations')}
          </Typography>
        )}
      </Box>

      {/* Conversations List */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          py: 1,
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
        {isLoading && conversations.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : !hasConversations ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDarkMode
                  ? alpha(theme.palette.primary.main, 0.15)
                  : alpha(theme.palette.primary.main, 0.1),
                mb: 2,
              }}
            >
              <MessageSquare
                size={28}
                color={isDarkMode ? theme.palette.primary.light : theme.palette.primary.main}
              />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 200 }}
            >
              {searchQuery
                ? t('chatbot.noSearchResults', 'No conversations found')
                : t('chatbot.noHistory', 'No conversation history yet')}
            </Typography>
          </Box>
        ) : (
          <>
            {renderGroup(t('chatbot.today', 'Today'), groupedConversations.today)}
            {renderGroup(t('chatbot.yesterday', 'Yesterday'), groupedConversations.yesterday)}
            {renderGroup(t('chatbot.thisWeek', 'This Week'), groupedConversations.thisWeek, true)}
            {renderGroup(t('chatbot.thisMonth', 'This Month'), groupedConversations.thisMonth, true)}
            {renderGroup(t('chatbot.older', 'Older'), groupedConversations.older, true)}

            {/* Load More */}
            {hasMore && !searchQuery && (
              <Box sx={{ px: 2, py: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={onLoadMore}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={16} /> : <ChevronDown size={18} />}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  {t('chatbot.loadMore', 'Load more')}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
}
