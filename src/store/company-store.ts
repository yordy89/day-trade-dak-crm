import { create } from 'zustand';

export interface Company {
  symbol: string;
  name: string;
  currentPrice: number;
}

export interface StockData {
  symbol: string;
  price: {
    shortName: string;
  };
  financialData: {
    currentPrice: number;
  };
}

interface CompanyStore {
  companies: Company[];
  addCompany: (company: StockData) => void;
  removeCompany: (symbol: string) => void;
  setCompanies: (companies: Company[]) => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  companies: [],
  setCompanies: (companies) => set({ companies }),
  addCompany: (company: StockData) =>
    set((state) => ({
      companies: state.companies.some((c) => c.symbol === company.symbol)
        ? state.companies
        : [
            ...state.companies,
            { symbol: company.symbol, name: company.price.shortName, currentPrice: company.financialData.currentPrice },
          ],
    })),
  removeCompany: (symbol: string) =>
    set((state) => ({
      companies: state.companies.filter((c) => c.symbol !== symbol),
    })),
}));
