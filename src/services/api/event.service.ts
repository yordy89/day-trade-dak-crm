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
      const response = await API.get<Event[]>('/events/upcoming', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load upcoming events.',
      });
      throw new Error(apiError.message);
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
}

export const eventService = new EventService();