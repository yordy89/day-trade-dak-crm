import API from '@/lib/axios';
import { errorHandler } from '@/lib/error-handler';

export interface Company {
  _id: string;
  symbol: string;
  name: string;
  sector?: string;
  industry?: string;
  marketCap?: number;
  description?: string;
  logo?: string;
  website?: string;
  employees?: number;
  headquarters?: string;
  founded?: number;
  ipoDate?: string;
  exchange?: string;
  currency?: string;
  currentPrice?: number;
  previousClose?: number;
  dayChange?: number;
  dayChangePercent?: number;
  weekChange?: number;
  monthChange?: number;
  yearChange?: number;
  marketCapFormatted?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySearchParams {
  search?: string;
  sector?: string;
  page?: number;
  limit?: number;
  sortBy?: 'symbol' | 'name' | 'marketCap';
  order?: 'asc' | 'desc';
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: string;
}

export interface CompanyNews {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  image?: string;
}

class CompanyService {
  async searchCompanies(params?: CompanySearchParams): Promise<{
    companies: Company[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const response = await API.get('/companies', { params });
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to search companies.',
      });
    }
  }

  async getCompany(symbol: string): Promise<Company> {
    try {
      const response = await API.get<Company>(`/companies/${symbol}`);
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load company details.',
      });
    }
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await API.get<StockQuote>(`/companies/${symbol}/quote`);
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load stock quote.',
      });
    }
  }

  async getCompanyNews(symbol: string, limit: number = 10): Promise<CompanyNews[]> {
    try {
      const response = await API.get<CompanyNews[]>(`/companies/${symbol}/news`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load company news.',
      });
    }
  }

  async getTopMovers(type: 'gainers' | 'losers' = 'gainers', limit: number = 10): Promise<Company[]> {
    try {
      const response = await API.get<Company[]>(`/companies/top-${type}`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: `Failed to load top ${type}.`,
      });
    }
  }

  async getMarketOverview(): Promise<{
    totalCompanies: number;
    sectors: { name: string; count: number }[];
    topGainers: Company[];
    topLosers: Company[];
    mostActive: Company[];
  }> {
    try {
      const response = await API.get('/companies/market-overview');
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load market overview.',
      });
    }
  }

  async addToWatchlist(symbol: string): Promise<void> {
    try {
      await API.post(`/companies/${symbol}/watchlist`);
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to add to watchlist.',
      });
    }
  }

  async removeFromWatchlist(symbol: string): Promise<void> {
    try {
      await API.delete(`/companies/${symbol}/watchlist`);
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to remove from watchlist.',
      });
    }
  }

  async getWatchlist(): Promise<Company[]> {
    try {
      const response = await API.get<Company[]>('/companies/watchlist');
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load watchlist.',
      });
    }
  }

  // Admin endpoints
  async createCompany(data: Partial<Company>): Promise<Company> {
    try {
      const response = await API.post<Company>('/companies', data);
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to create company.',
      });
    }
  }

  async updateCompany(symbol: string, data: Partial<Company>): Promise<Company> {
    try {
      const response = await API.put<Company>(`/companies/${symbol}`, data);
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to update company.',
      });
    }
  }

  async deleteCompany(symbol: string): Promise<void> {
    try {
      await API.delete(`/companies/${symbol}`);
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to delete company.',
      });
    }
  }

  async syncCompanyData(symbol: string): Promise<Company> {
    try {
      const response = await API.post<Company>(`/companies/${symbol}/sync`);
      return response.data;
    } catch (error) {
      throw errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to sync company data.',
      });
    }
  }
}

export const companyService = new CompanyService();