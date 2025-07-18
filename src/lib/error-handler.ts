import { toast } from 'react-hot-toast';
import { logger } from './default-logger';

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
  correlationId?: string;
  timestamp?: string;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
  onError?: (error: ApiError) => void;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private correlationIdPrefix = 'dtd';

  private constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  generateCorrelationId(): string {
    return `${this.correlationIdPrefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  parseError(error: any): ApiError {
    // Handle axios errors
    if (error.response) {
      const { data, status } = error.response;
      return {
        message: data?.message || this.getDefaultMessage(status),
        statusCode: status,
        error: data?.error || error.name,
        correlationId: data?.correlationId || this.generateCorrelationId(),
        timestamp: data?.timestamp || new Date().toISOString(),
      };
    }

    // Handle network errors
    if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        statusCode: 0,
        error: 'NetworkError',
        correlationId: this.generateCorrelationId(),
        timestamp: new Date().toISOString(),
      };
    }

    // Handle client errors
    return {
      message: error.message || 'An unexpected error occurred',
      error: error.name || 'UnknownError',
      correlationId: this.generateCorrelationId(),
      timestamp: new Date().toISOString(),
    };
  }

  private getDefaultMessage(statusCode: number): string {
    const messages: Record<number, string> = {
      400: 'Invalid request. Please check your input.',
      401: 'Authentication required. Please sign in.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: 'This action conflicts with existing data.',
      422: 'The provided data is invalid.',
      429: 'Too many requests. Please try again later.',
      500: 'Server error. Please try again later.',
      502: 'Service temporarily unavailable.',
      503: 'Service under maintenance.',
    };

    return messages[statusCode] || 'An error occurred. Please try again.';
  }

  handle(error: any, options: ErrorHandlerOptions = {}): ApiError {
    const {
      showToast = true,
      logError = true,
      fallbackMessage,
      onError,
    } = options;

    const parsedError = this.parseError(error);

    // Use fallback message if provided
    if (fallbackMessage) {
      parsedError.message = fallbackMessage;
    }

    // Log error if enabled
    if (logError) {
      logger.error('API Error:', {
        ...parsedError,
        stack: error.stack,
        originalError: error,
      });
    }

    // Show toast notification if enabled
    if (showToast) {
      this.showErrorToast(parsedError);
    }

    // Call custom error handler if provided
    if (onError) {
      onError(parsedError);
    }

    return parsedError;
  }

  private showErrorToast(error: ApiError): void {
    const toastId = `error-${error.correlationId}`;
    
    // Prevent duplicate toasts
    toast.dismiss(toastId);
    
    toast.error(error.message, {
      id: toastId,
      duration: 5000,
      style: {
        background: '#ef4444',
        color: '#fff',
      },
    });
  }

  // Utility method for handling form validation errors
  handleValidationErrors(errors: Record<string, string[]>): string {
    const messages = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('\n');
    
    this.showErrorToast({
      message: messages,
      error: 'ValidationError',
      correlationId: this.generateCorrelationId(),
      timestamp: new Date().toISOString(),
    });

    return messages;
  }

  // Handle async operations with loading states
  async handleAsync<T>(
    promise: Promise<T>,
    options: ErrorHandlerOptions & { 
      loadingMessage?: string;
      successMessage?: string;
    } = {}
  ): Promise<T | null> {
    const { loadingMessage, successMessage, ...errorOptions } = options;

    // Show loading toast if message provided
    const loadingToastId = loadingMessage ? toast.loading(loadingMessage) : null;

    try {
      const result = await promise;
      
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }

      // Show success toast if message provided
      if (successMessage) {
        toast.success(successMessage);
      }

      return result;
    } catch (error) {
      // Dismiss loading toast
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }

      this.handle(error, errorOptions);
      return null;
    }
  }
}

export const errorHandler = ErrorHandler.getInstance();