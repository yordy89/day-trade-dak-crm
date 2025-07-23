import ClassesAPI from '@/lib/axios-classes';
import { errorHandler } from '@/lib/error-handler';

export interface ClassesCheckoutData {
  userId?: string;
  paymentMethod?: 'card' | 'klarna';
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
}

class PaymentService {
  async createClassesCheckout(data: ClassesCheckoutData): Promise<CheckoutResponse> {
    try {
      // Use ClassesAPI for classes-related checkout
      const response = await ClassesAPI.post<CheckoutResponse>('/payments/classes-checkout', data);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: false,
        logError: true,
      });
      throw new Error(apiError.message);
    }
  }
}

export const paymentService = new PaymentService();