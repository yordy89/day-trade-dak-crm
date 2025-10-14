import API from '@/lib/axios';
import {
  Trade,
  CreateTradeDto,
  UpdateTradeDto,
  Feedback,
  CreateFeedbackDto,
  FilterTradesDto,
  TradeStatistics,
  DailyPnl,
  TradesResponse,
} from '../types/trading-journal';

export class TradingJournalService {
  // Trade Operations
  async createTrade(data: CreateTradeDto): Promise<Trade> {
    const response = await API.post('/trading-journal/trades', data);
    return response.data;
  }

  async getTrades(filters: FilterTradesDto = {}): Promise<TradesResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else if (value instanceof Date) {
          params.append(key, value.toISOString());
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await API.get(`/trading-journal/trades?${params.toString()}`);
    return response.data;
  }

  async getTrade(tradeId: string): Promise<Trade> {
    const response = await API.get(`/trading-journal/trades/${tradeId}`);
    return response.data;
  }

  async updateTrade(tradeId: string, data: UpdateTradeDto): Promise<Trade> {
    const response = await API.put(`/trading-journal/trades/${tradeId}`, data);
    return response.data;
  }

  async deleteTrade(tradeId: string): Promise<void> {
    await API.delete(`/trading-journal/trades/${tradeId}`);
  }

  // Analytics
  async getStatistics(filters: FilterTradesDto = {}): Promise<TradeStatistics> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await API.get(`/trading-journal/statistics?${params.toString()}`);
    return response.data;
  }

  async getDailyPnl(days: number = 30): Promise<DailyPnl[]> {
    const response = await API.get(`/trading-journal/daily-pnl?days=${days}`);
    return response.data;
  }

  // Feedback
  async createFeedback(data: CreateFeedbackDto): Promise<Feedback> {
    const response = await API.post('/trading-journal/feedback', data);
    return response.data;
  }

  async getTradeFeedback(tradeId: string): Promise<Feedback[]> {
    const response = await API.get(`/trading-journal/trades/${tradeId}/feedback`);
    return response.data;
  }

  async getMyFeedback(): Promise<Feedback[]> {
    const response = await API.get('/trading-journal/feedback');
    return response.data;
  }

  // Admin Operations
  async getStudentsWithJournals(): Promise<any[]> {
    const response = await API.get('/trading-journal/admin/students');
    return response.data;
  }

  async getStudentTrades(
    studentId: string,
    filters: FilterTradesDto = {}
  ): Promise<TradesResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await API.get(
      `/trading-journal/admin/student/${studentId}/trades?${params.toString()}`
    );
    return response.data;
  }

  async getStudentStatistics(
    studentId: string,
    filters: FilterTradesDto = {}
  ): Promise<TradeStatistics> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await API.get(
      `/trading-journal/admin/student/${studentId}/statistics?${params.toString()}`
    );
    return response.data;
  }

  // Export functionality
  async exportTrades(filters: FilterTradesDto = {}, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    params.append('format', format);

    const response = await API.get(`/trading-journal/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export const tradingJournalService = new TradingJournalService();