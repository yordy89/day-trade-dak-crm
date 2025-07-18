'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  PaperPlaneTilt,
  X,
} from '@phosphor-icons/react';
import { usePubSub } from '@videosdk.live/react-sdk';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

interface ChatPanelProps {
  onClose: () => void;
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const theme = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { publish } = usePubSub('CHAT', {
    onMessageReceived: (message) => {
      const chatMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random()}`,
        senderId: message.senderId,
        senderName: message.senderName || 'Anonymous',
        message: message.message,
        timestamp: new Date(message.timestamp),
      };
      setMessages(prev => [...prev, chatMessage]);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    publish(newMessage, { persist: false });
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Chat
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Stack>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((msg) => (
              <Box key={msg.id}>
                <Stack spacing={0.5}>
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="primary"
                    >
                      {msg.senderName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontSize="0.65rem"
                    >
                      {format(msg.timestamp, 'HH:mm')}
                    </Typography>
                  </Stack>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" style={{ wordBreak: 'break-word' }}>
                      {msg.message}
                    </Typography>
                  </Paper>
                </Stack>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <PaperPlaneTilt size={20} />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}