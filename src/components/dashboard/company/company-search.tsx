'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCompanyStore } from '@/store/company-store';
import type { StockData } from '@/store/company-store';
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Plus } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import API from '@/lib/axios';

const API_KEY = 'Z23B66HGDZ65UMPP';
const API_URL = 'https://www.alphavantage.co/query';
const STOCK_API_URL = '/company';

const CompanySearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { companies, addCompany } = useCompanyStore();
  const searchRef = useRef<HTMLDivElement>(null);

  // React Query Mutation to fetch company details
  const { mutate: fetchStockData, isPending: isFetchingStock } = useMutation({
    mutationFn: async (symbol: string) => {
      const response = await API.post(STOCK_API_URL, { symbol });
      return response.data;
    },
    onSuccess: (stockData: StockData) => {
      addCompany(stockData);
      resetSearch();
    },
    onError: (error) => {
      console.error('Error fetching stock data:', error);
    },
  });

  // Check if company already exists in store
  const companyExists = (symbol: string) => companies.some((c) => c.symbol === symbol);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: value,
          apikey: API_KEY,
        },
      });

      setResults(response.data.bestMatches || []);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = (company: any) => {
    if (!companyExists(company['1. symbol'])) {
      fetchStockData(company['1. symbol']);
    }
  };

  // Reset search
  const resetSearch = () => {
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  // Close list when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        resetSearch();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 3 }} ref={searchRef}>
      <TextField
        fullWidth
        label="Search for a company..."
        variant="outlined"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)} // Keep list open while typing
      />

      {loading || isFetchingStock ? <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} /> : null}

      {isFocused && results.length > 0 ? (
        <Paper sx={{ mt: 1, maxHeight: 300, overflowY: 'auto', boxShadow: 3 }}>
          <List>
            {results.map((company) => {
              const exists = companyExists(company['1. symbol']);
              return (
                <ListItem key={company['1. symbol']} sx={{ backgroundColor: exists ? '#f0f0f0' : 'white' }}>
                  <ListItemText
                    primary={
                      <Typography color={exists ? 'gray' : 'black'} fontWeight={exists ? 'bold' : 'normal'}>
                        {company['1. symbol']}
                      </Typography>
                    }
                    secondary={company['2. name']}
                  />
                  {!exists && (
                    <IconButton color="primary" onClick={() => handleAddCompany(company)} disabled={isFetchingStock}>
                      <Plus size={20} weight="bold" />
                    </IconButton>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Paper>
      ) : null}
    </Box>
  );
};

export default CompanySearch;
