'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Refresh,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import API from '@/lib/axios';

interface StockQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

interface MarketData {
  indices: Record<string, StockQuote>;
  topGainers: StockData[];
  topLosers: StockData[];
  mostActive: StockData[];
  marketStatus: any;
}

interface StockData {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
}

const INDEX_NAMES: Record<string, string> = {
  SPY: 'S&P 500',
  QQQ: 'NASDAQ',
  DIA: 'Dow Jones',
  IWM: 'Russell 2000',
  VTI: 'Total Market',
};

function StockCard({ symbol, quote, name }: { symbol: string; quote: StockQuote; name?: string }) {
  const isPositive = quote.d >= 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {symbol}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {name || symbol}
            </Typography>
          </Box>
          <Chip
            size="small"
            icon={isPositive ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
            label={`${isPositive ? '+' : ''}${quote.dp.toFixed(2)}%`}
            color={isPositive ? 'success' : 'error'}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        
        <Typography variant="h4" fontWeight="bold" mb={1}>
          ${quote.c.toFixed(2)}
        </Typography>
        
        <Typography
          variant="body2"
          color={isPositive ? 'success.main' : 'error.main'}
          sx={{ fontWeight: 500 }}
        >
          {isPositive ? '+' : ''}{quote.d.toFixed(2)}
        </Typography>
        
        <Box mt={2} pt={1} borderTop={1} borderColor="divider">
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Open</Typography>
              <Typography variant="body2" fontWeight={500}>${quote.o.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Prev Close</Typography>
              <Typography variant="body2" fontWeight={500}>${quote.pc.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">High</Typography>
              <Typography variant="body2" fontWeight={500}>${quote.h.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Low</Typography>
              <Typography variant="body2" fontWeight={500}>${quote.l.toFixed(2)}</Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

function MoversList({ title, stocks, icon }: { title: string; stocks: StockData[]; icon: React.ReactNode }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          {icon}
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        
        {stocks.length > 0 ? (
          <Box>
            {stocks.map((stock) => (
              <Box
                key={stock.symbol}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 0 },
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {stock.symbol}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ${stock.price.toFixed(2)}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={`${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
                  color={stock.changePercent >= 0 ? 'success' : 'error'}
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export function MarketOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Fetch market overview
  const { data: marketData, isLoading, error, refetch } = useQuery({
    queryKey: ['marketOverview'],
    queryFn: async () => {
      const response = await API.get('/market/overview');
      return response.data as MarketData;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2,
  });

  // Search symbols
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await API.get(`/market/search?q=${searchQuery}`);
      setSearchResults(response.data.result || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load market data. Please check your connection and try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Search Bar */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search stocks by symbol or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
            >
              {searching ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box mb={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Search Results
              </Typography>
              <Grid container spacing={2}>
                {searchResults.slice(0, 6).map((result: any) => (
                  <Grid item xs={12} sm={6} md={4} key={result.symbol}>
                    <Box
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {result.symbol}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {result.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Market Indices */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Market Indices
      </Typography>
      <Grid container spacing={3} mb={4}>
        {isLoading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <Grid item xs={12} sm={6} md={2.4} key={i}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))
        ) : marketData?.indices ? (
          Object.entries(marketData.indices).map(([symbol, quote]) => (
            <Grid item xs={12} sm={6} md={2.4} key={symbol}>
              <StockCard symbol={symbol} quote={quote} name={INDEX_NAMES[symbol]} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">No index data available</Alert>
          </Grid>
        )}
      </Grid>

      {/* Market Movers */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Market Movers
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <MoversList
              title="Top Gainers"
              stocks={marketData?.topGainers || []}
              icon={<TrendingUp color="success" />}
            />
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <MoversList
              title="Top Losers"
              stocks={marketData?.topLosers || []}
              icon={<TrendingDown color="error" />}
            />
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <MoversList
              title="Most Active"
              stocks={marketData?.mostActive || []}
              icon={<TrendingUp color="primary" />}
            />
          )}
        </Grid>
      </Grid>

      {/* Market Status */}
      {marketData?.marketStatus && (
        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Status
              </Typography>
              <Chip
                label={marketData.marketStatus.isOpen ? 'Market Open' : 'Market Closed'}
                color={marketData.marketStatus.isOpen ? 'success' : 'default'}
                sx={{ fontWeight: 'bold' }}
              />
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}