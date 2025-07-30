import API from '@/lib/axios';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  inquiryType: 'general' | 'technical' | 'billing' | 'partnership' | 'media' | 'other';
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    createdAt: string;
  };
}

export const contactService = {
  async submitContactForm(data: ContactFormData): Promise<ContactFormResponse> {
    try {
      const response = await API.post('/contact-messages', data);
      return response.data;
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit contact form');
    }
  },
};