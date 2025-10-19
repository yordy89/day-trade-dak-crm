import API from '@/lib/axios';
import { errorHandler } from '@/lib/error-handler';

export interface Event {
  _id: string;
  name: string;
  title?: string;
  description?: string;
  date: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  bannerImage?: string;
  vipPrice?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  // New fields
  type?: 'master_course' | 'community_event' | 'general';
  price?: number;
  requiresActiveSubscription?: boolean;
  capacity?: number;
  currentRegistrations?: number;
  featuredInCRM?: boolean; // Whether this event is featured in the CRM
  // Partial payment fields
  paymentMode?: 'full_only' | 'partial_allowed';
  minimumDepositAmount?: number;
  depositPercentage?: number;
  minimumInstallmentAmount?: number;
  allowedFinancingPlans?: string[];
  allowCustomPaymentPlan?: boolean;
  paymentSettings?: {
    enablePartialPayments?: boolean;
    autoReminderDays?: number[];
    gracePeriodDays?: number;
    lateFeeAmount?: number;
    lateFeePercentage?: number;
    maxPaymentAttempts?: number;
  };
}

export interface CreateEventData {
  name: string;
  title?: string;
  description?: string;
  date: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  bannerImage?: string;
  vipPrice?: number;
  isActive?: boolean;
}

export interface EventRegistration {
  _id: string;
  eventId: string;
  userId: string;
  userEmail: string;
  userName: string;
  vipAccess: boolean;
  registeredAt: string;
}

export interface RegisterEventData {
  eventId: string;
  vipAccess?: boolean;
}

export interface EventRegistrationData {
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  additionalInfo?: {
    tradingExperience?: string;
    expectations?: string;
    dietaryRestrictions?: string;
    roomPreference?: string;
    [key: string]: any;
  };
  userId?: string;
  paymentMethod?: 'card' | 'klarna';
}

export interface EventCheckoutResponse {
  url: string;
  sessionId: string;
}

class EventService {
  async getEvents(params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    data: Event[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const response = await API.get('/events', { params });
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load events.',
      });
      throw new Error(apiError.message);
    }
  }

  async getEvent(eventId: string): Promise<Event> {
    try {
      const response = await API.get<Event>(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load event details.',
      });
      throw new Error(apiError.message);
    }
  }

  async createEvent(data: CreateEventData): Promise<Event> {
    try {
      const response = await API.post<Event>('/events', data);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to create event.',
      });
      throw new Error(apiError.message);
    }
  }

  async updateEvent(eventId: string, data: Partial<CreateEventData>): Promise<Event> {
    try {
      const response = await API.put<Event>(`/events/${eventId}`, data);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to update event.',
      });
      throw new Error(apiError.message);
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await API.delete(`/events/${eventId}`);
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to delete event.',
      });
      throw new Error(apiError.message);
    }
  }

  async getUpcomingEvents(limit = 10): Promise<Event[]> {
    try {
      // Use the regular events endpoint with filters instead of /events/upcoming
      // to avoid routing conflicts with /events/:id
      const response = await API.get('/events', {
        params: {
          isActive: true,
          limit,
          startDate: new Date().toISOString(),
        },
      });
      // Handle both possible response formats
      const events = response.data.data || response.data.events || response.data || [];
      return Array.isArray(events) ? events : [];
    } catch (error) {
      console.error('Failed to load upcoming events:', error);
      // Return empty array instead of throwing to prevent UI breaks
      return [];
    }
  }

  // Event registration endpoints
  async registerForEvent(data: RegisterEventData): Promise<EventRegistration> {
    try {
      const response = await API.post<EventRegistration>('/event-registrations', data);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to register for event.',
      });
      throw new Error(apiError.message);
    }
  }

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    try {
      const response = await API.get<EventRegistration[]>(`/event-registrations/event/${eventId}`);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load event registrations.',
      });
      throw new Error(apiError.message);
    }
  }

  async getUserRegistrations(userId?: string): Promise<EventRegistration[]> {
    try {
      const endpoint = userId 
        ? `/event-registrations/user/${userId}`
        : '/event-registrations/my-registrations';
      
      const response = await API.get<EventRegistration[]>(endpoint);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load user registrations.',
      });
      throw new Error(apiError.message);
    }
  }

  async checkRegistration(eventId: string): Promise<boolean> {
    try {
      const response = await API.get<{ isRegistered: boolean }>(
        `/event-registrations/check/${eventId}`
      );
      return response.data.isRegistered;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: false,
        logError: true,
      });
      throw new Error(apiError.message);
    }
  }

  async cancelRegistration(registrationId: string): Promise<void> {
    try {
      await API.delete(`/event-registrations/${registrationId}`);
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to cancel registration.',
      });
      throw new Error(apiError.message);
    }
  }

  // New methods for event checkout
  async createEventCheckout(data: EventRegistrationData): Promise<EventCheckoutResponse> {
    try {
      const response = await API.post<EventCheckoutResponse>('/payments/event-checkout', data);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: false, // Don't show toast here, let the component handle it
        logError: true,
        // Don't use fallbackMessage to preserve the original API error message
      });
      // Throw the error with the parsed message
      throw new Error(apiError.message);
    }
  }

  async checkEventCapacity(eventId: string): Promise<{ available: boolean; remaining: number }> {
    try {
      const event = await this.getEvent(eventId);
      const capacity = event.capacity || 0;
      const currentRegistrations = event.currentRegistrations || 0;
      const remaining = capacity - currentRegistrations;
      return {
        available: capacity === 0 || remaining > 0,
        remaining: capacity === 0 ? -1 : Math.max(0, remaining),
      };
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to check event capacity.',
      });
      throw new Error(apiError.message);
    }
  }

  // Partial Payment Methods

  async initiatePartialPayment(data: {
    eventId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    depositAmount: number;
    userId?: string;
    financingPlanId?: string;
    paymentMethod?: string;
    additionalInfo?: any;
    promoCode?: string;
    affiliateCode?: string;
  }): Promise<any> {
    try {
      const response = await API.post('/event-registrations/initiate-partial', data);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to initiate partial payment.',
      });
      throw apiError;
    }
  }

  async searchRegistrations(data: {
    email?: string;
    phoneNumber?: string;
    registrationId?: string;
    eventId?: string;
    eventType?: string;
  }): Promise<any[]> {
    try {
      const response = await API.post('/event-registrations/search', data);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to search registrations.',
      });
      throw apiError;
    }
  }

  async getRegistrationBalance(registrationId: string): Promise<any> {
    try {
      const response = await API.get(`/event-registrations/check-balance/${registrationId}`);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to get registration balance.',
      });
      throw apiError;
    }
  }

  async makePartialPayment(registrationId: string, data: {
    amount: number;
    paymentMethod?: string;
    description?: string;
    metadata?: any;
  }): Promise<any> {
    try {
      const response = await API.post(`/event-registrations/make-payment/${registrationId}`, data);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to process payment.',
      });
      throw apiError;
    }
  }

  async getPaymentHistory(registrationId: string): Promise<any> {
    try {
      const response = await API.get(`/event-registrations/payment-history/${registrationId}`);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to get payment history.',
      });
      throw apiError;
    }
  }

  async updateEventPaymentSettings(eventId: string, settings: {
    paymentMode?: 'full_only' | 'partial_allowed';
    minimumDepositAmount?: number;
    depositPercentage?: number;
    minimumInstallmentAmount?: number;
    allowedFinancingPlans?: string[];
    allowCustomPaymentPlan?: boolean;
    paymentSettings?: any;
  }): Promise<any> {
    try {
      const response = await API.put(`/event-registrations/events/${eventId}/payment-settings`, settings);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to update payment settings.',
      });
      throw apiError;
    }
  }

  async togglePaymentMode(eventId: string): Promise<any> {
    try {
      const response = await API.post(`/event-registrations/events/${eventId}/toggle-payment-mode`);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to toggle payment mode.',
      });
      throw apiError;
    }
  }
}

export const eventService = new EventService();