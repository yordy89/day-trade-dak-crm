'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  chatbotService,
  ChatMessage,
  ChatResponse,
  SendMessageParams,
  ConversationListItem,
} from '@/services/api/chatbot.service';

const CONVERSATION_ID_KEY = 'chatbot_conversation_id';

interface UseChatOptions {
  region?: 'us' | 'es';
  onError?: (error: Error) => void;
}

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  conversationId: string | null;
  suggestions: string[];
  conversationsList: ConversationListItem[];
  isLoadingHistory: boolean;
  hasMoreConversations: boolean;
  totalConversations: number;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  loadConversation: (conversationId: string) => Promise<void>;
  startNewConversation: () => void;
  loadConversationsList: (reset?: boolean) => Promise<void>;
  loadMoreConversations: () => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  // Token is stored in Zustand auth-storage as JSON
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return false;

    const parsed = JSON.parse(authStorage);
    return !!parsed?.state?.authToken;
  } catch {
    return false;
  }
}

/**
 * Save conversation ID to localStorage (only for authenticated users)
 */
function saveConversationId(convId: string | null): void {
  if (typeof window === 'undefined') return;
  if (!isAuthenticated()) return;

  if (convId) {
    localStorage.setItem(CONVERSATION_ID_KEY, convId);
  } else {
    localStorage.removeItem(CONVERSATION_ID_KEY);
  }
}

/**
 * Get saved conversation ID from localStorage
 */
function getSavedConversationId(): string | null {
  if (typeof window === 'undefined') return null;
  if (!isAuthenticated()) return null;
  return localStorage.getItem(CONVERSATION_ID_KEY);
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { region = 'es', onError } = options;
  const { i18n } = useTranslation();
  const language = (i18n.language || 'es') as 'en' | 'es';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversationsList, setConversationsList] = useState<ConversationListItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasMoreConversations, setHasMoreConversations] = useState(false);
  const [totalConversations, setTotalConversations] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const CONVERSATIONS_PER_PAGE = 10;

  const abortControllerRef = useRef<AbortController | null>(null);
  const hasLoadedInitialConversation = useRef(false);

  // Load suggestions on mount
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const suggestionsData = await chatbotService.getSuggestions(language);
        setSuggestions(suggestionsData);
      } catch (err) {
        console.error('Failed to load suggestions:', err);
      }
    };
    loadSuggestions();
  }, [language]);

  // Load saved conversation on mount (for authenticated users)
  useEffect(() => {
    if (hasLoadedInitialConversation.current) return;
    hasLoadedInitialConversation.current = true;

    const loadSavedConversation = async () => {
      const savedConvId = getSavedConversationId();
      if (savedConvId && isAuthenticated()) {
        setIsLoadingHistory(true);
        try {
          const history = await chatbotService.getConversationHistory(savedConvId);
          if (history && history.messages.length > 0) {
            setConversationId(history.conversationId);
            setMessages(history.messages);
          }
        } catch (err) {
          // If failed to load, clear the saved ID (conversation might be deleted)
          console.error('Failed to load saved conversation:', err);
          saveConversationId(null);
        } finally {
          setIsLoadingHistory(false);
        }
      }
    };

    loadSavedConversation();
  }, []);

  // Save conversationId to localStorage when it changes
  useEffect(() => {
    if (conversationId) {
      saveConversationId(conversationId);
    }
  }, [conversationId]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setError(null);
      setIsLoading(true);
      setIsTyping(true);

      // Add user message immediately
      const userMessage: ChatMessage = {
        role: 'user',
        content: message.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const params: SendMessageParams = {
          message: message.trim(),
          conversationId: conversationId || undefined,
          region,
          language,
        };

        const response: ChatResponse = await chatbotService.sendMessage(params);

        // Update conversation ID
        if (response.conversationId) {
          setConversationId(response.conversationId);
        }

        // Add assistant message
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.message.content,
          timestamp: new Date(response.message.timestamp),
          sources: response.message.sources,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Update suggestions if provided
        if (response.suggestions?.length) {
          setSuggestions(response.suggestions);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : language === 'es'
              ? 'Error al enviar el mensaje. Por favor, intenta de nuevo.'
              : 'Failed to send message. Please try again.';
        setError(errorMessage);

        // Remove the optimistic user message on error
        setMessages((prev) => prev.slice(0, -1));

        if (onError) {
          onError(err instanceof Error ? err : new Error(errorMessage));
        }
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    },
    [conversationId, region, language, isLoading, onError],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    saveConversationId(null);
    setError(null);
  }, []);

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    saveConversationId(null);
    setError(null);
  }, []);

  const loadConversation = useCallback(
    async (convId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const history = await chatbotService.getConversationHistory(convId);
        if (history) {
          setConversationId(history.conversationId);
          setMessages(history.messages);
          saveConversationId(history.conversationId);
        }
      } catch (err) {
        const errorMessage =
          language === 'es'
            ? 'Error al cargar la conversación.'
            : 'Failed to load conversation.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [language],
  );

  const loadConversationsList = useCallback(async (reset: boolean = true) => {
    if (!isAuthenticated()) {
      setConversationsList([]);
      return;
    }

    setIsLoadingHistory(true);
    try {
      const page = reset ? 1 : currentPage;
      const response = await chatbotService.getConversations(page, CONVERSATIONS_PER_PAGE);

      if (reset) {
        setConversationsList(response.conversations);
        setCurrentPage(1);
      } else {
        setConversationsList(response.conversations);
      }

      setTotalConversations(response.total);
      setHasMoreConversations(response.conversations.length === CONVERSATIONS_PER_PAGE &&
        page * CONVERSATIONS_PER_PAGE < response.total);
    } catch (err) {
      console.error('Failed to load conversations list:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [currentPage]);

  const loadMoreConversations = useCallback(async () => {
    if (!isAuthenticated() || !hasMoreConversations || isLoadingHistory) {
      return;
    }

    setIsLoadingHistory(true);
    try {
      const nextPage = currentPage + 1;
      const response = await chatbotService.getConversations(nextPage, CONVERSATIONS_PER_PAGE);

      setConversationsList(prev => [...prev, ...response.conversations]);
      setCurrentPage(nextPage);
      setTotalConversations(response.total);
      setHasMoreConversations(response.conversations.length === CONVERSATIONS_PER_PAGE &&
        nextPage * CONVERSATIONS_PER_PAGE < response.total);
    } catch (err) {
      console.error('Failed to load more conversations:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [currentPage, hasMoreConversations, isLoadingHistory]);

  const deleteConversation = useCallback(async (convId: string) => {
    try {
      await chatbotService.deleteConversation(convId);

      // Remove from list
      setConversationsList(prev => prev.filter(c => c.conversationId !== convId));
      setTotalConversations(prev => Math.max(0, prev - 1));

      // If deleting current conversation, clear it
      if (conversationId === convId) {
        setMessages([]);
        setConversationId(null);
        saveConversationId(null);
      }
    } catch (err) {
      const errorMessage =
        language === 'es'
          ? 'Error al eliminar la conversación.'
          : 'Failed to delete conversation.';
      setError(errorMessage);
    }
  }, [conversationId, language]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
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
    loadConversation,
    startNewConversation,
    loadConversationsList,
    loadMoreConversations,
    deleteConversation,
  };
}
