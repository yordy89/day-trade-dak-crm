import API from '@/lib/axios';
import { errorHandler } from '@/lib/error-handler';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export interface ChatResponse {
  conversationId: string;
  message: ChatMessage;
  suggestions?: string[];
  metadata?: {
    toolsUsed?: string[];
    sourcesCount?: number;
    processingTime?: number;
  };
}

export interface ConversationHistory {
  conversationId: string;
  region: string;
  language: string;
  messages: ChatMessage[];
  messageCount: number;
  createdAt: Date;
  lastMessageAt?: Date;
}

export interface ConversationListItem {
  conversationId: string;
  preview: string;
  messageCount: number;
  lastMessageAt: Date;
  createdAt: Date;
}

export interface ConversationListResponse {
  conversations: ConversationListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface SendMessageParams {
  message: string;
  conversationId?: string;
  region?: 'us' | 'es';
  language?: 'en' | 'es';
}

class ChatbotService {
  private readonly baseUrl = '/chatbot';
  private readonly GUEST_ID_KEY = 'chatbot_guest_id';

  /**
   * Check if user is authenticated (has token)
   */
  private isAuthenticated(): boolean {
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
   * Check if a string is a valid MongoDB ObjectId (24 hex characters)
   */
  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  /**
   * Get or create a stable guest ID for the current browser session
   * Uses sessionStorage so it persists within the tab but clears on close
   */
  private getGuestId(): string {
    if (typeof window === 'undefined') return '';

    let guestId = sessionStorage.getItem(this.GUEST_ID_KEY);

    // Validate existing guestId - clear if invalid (e.g., old UUID format)
    if (guestId && !this.isValidObjectId(guestId)) {
      sessionStorage.removeItem(this.GUEST_ID_KEY);
      guestId = null;
    }

    if (!guestId) {
      // Generate a MongoDB ObjectId-compatible string (24 hex characters)
      // Format: 8 chars timestamp + 16 chars random
      const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
      const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      guestId = timestamp + randomPart;
      sessionStorage.setItem(this.GUEST_ID_KEY, guestId);
    }
    return guestId;
  }

  /**
   * Send a message to the chatbot
   */
  async sendMessage(params: SendMessageParams): Promise<ChatResponse> {
    try {
      // Use public endpoint if not authenticated
      const isAuth = this.isAuthenticated();
      const endpoint = isAuth
        ? `${this.baseUrl}/message`
        : `${this.baseUrl}/public/message`;

      // For guest users, include the session-stable guestId to maintain context
      const payload = isAuth ? params : { ...params, guestId: this.getGuestId() };

      const response = await API.post<ChatResponse>(endpoint, payload);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to send message. Please try again.',
      });
      throw new Error(apiError.message);
    }
  }

  /**
   * Get conversation history list
   */
  async getConversations(
    page: number = 1,
    limit: number = 20,
  ): Promise<ConversationListResponse> {
    try {
      const response = await API.get<ConversationListResponse>(
        `${this.baseUrl}/history`,
        { params: { page, limit } },
      );
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: false,
        logError: true,
        fallbackMessage: 'Failed to load conversations.',
      });
      throw new Error(apiError.message);
    }
  }

  /**
   * Get specific conversation history
   */
  async getConversationHistory(
    conversationId: string,
  ): Promise<ConversationHistory | null> {
    try {
      const response = await API.get<ConversationHistory>(
        `${this.baseUrl}/history/${conversationId}`,
      );
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: false,
        logError: true,
        fallbackMessage: 'Failed to load conversation history.',
      });
      throw new Error(apiError.message);
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await API.delete(`${this.baseUrl}/history/${conversationId}`);
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to delete conversation.',
      });
      throw new Error(apiError.message);
    }
  }

  /**
   * Get quick suggestions
   */
  async getSuggestions(language: string = 'es'): Promise<string[]> {
    try {
      // Use public endpoint if not authenticated
      const endpoint = this.isAuthenticated()
        ? `${this.baseUrl}/suggestions`
        : `${this.baseUrl}/public/suggestions`;

      const response = await API.get<string[]>(endpoint, {
        params: { language },
      });
      return response.data;
    } catch (error) {
      // Return default suggestions on error
      return language === 'es'
        ? [
            '¿Qué es DayTradeDak?',
            '¿Cómo creo una cuenta?',
            '¿Quién es Mijail Medina?',
          ]
        : [
            'What is DayTradeDak?',
            'How do I create an account?',
            'Who is Mijail Medina?',
          ];
    }
  }
}

export const chatbotService = new ChatbotService();
