'use client';

import React from 'react';
import { useSettings } from '@/services/api/settings.service';
import { ChatWidget } from './ChatWidget';

interface ChatWidgetWrapperProps {
  region?: 'us' | 'es';
  requireAuth?: boolean;
}

export function ChatWidgetWrapper({ region = 'us', requireAuth = false }: ChatWidgetWrapperProps) {
  const { data: settings, isLoading } = useSettings();

  // Don't render while loading to prevent flash
  if (isLoading) return null;

  // Check if chatbot is enabled (default to true if not set)
  const isChatbotEnabled = settings?.features?.chatbot_enabled !== false;

  if (!isChatbotEnabled) return null;

  return <ChatWidget region={region} requireAuth={requireAuth} />;
}
