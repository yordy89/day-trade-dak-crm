'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Refresh,
  Star,
  StarBorder,
  ShowChart,
} from '@mui/icons-material';
import { useQuery, useMutation } from '@tanstack/react-query';
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

// Commented out unused interface
// interface MarketStatus {
//   exchange: string;
//   holiday: string;
//   isOpen: boolean;
//   timezone: string;
//   t: number;
// }

const _POPULAR_STOCKS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA',
  'META', 'NVDA', 'JPM', 'V', 'JNJ',
];

export default function MarketAcademy() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteStocks');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch market status
  const { data: marketStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['marketStatus'],
    queryFn: async () => {
      const response = await API.get('/market/status');
      return response.data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch popular stocks
  const { 
    data: popularQuotes, 
    isLoading: quotesLoading,
    refetch: refetchQuotes
  } = useQuery({
    queryKey: ['popularQuotes'],
    queryFn: async () => {
      const response = await API.get('/market/popular');
      return response.data;
    },
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  // Search stocks
  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await API.get(`/market/search?q=${query}`);
      return response.data;
    },
  });

  const toggleFavorite = (symbol: string) => {
    const newFavorites = favorites.includes(symbol)
      ? favorites.filter(s => s !== symbol)
      : [...favorites, symbol];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteStocks', JSON.stringify(newFavorites));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getStockData = () => {
    if (!popularQuotes) return [];
    
    return Object.entries(popularQuotes)
      .map(([symbol, quote]) => ({ symbol, ...(quote as StockQuote) }))
      .sort((a, b) => {
        // Favorites first
        const aFav = favorites.includes(a.symbol) ? 1 : 0;
        const bFav = favorites.includes(b.symbol) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;
        
        // Then by symbol
        return a.symbol.localeCompare(b.symbol);
      });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
          Market Overview
        </Typography>
        
        {/* Market Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {statusLoading ? (
            <CircularProgress size={20} />
          ) : marketStatus ? (
            <>
              <Chip
                label={marketStatus.isOpen ? 'Market Open' : 'Market Closed'}
                color={marketStatus.isOpen ? 'success' : 'default'}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                {marketStatus.exchange} • {marketStatus.timezone}
              </Typography>
            </>
          ) : null}
          
          <Box sx={{ ml: 'auto' }}>
            <Button
              startIcon={<Refresh />}
              onClick={() => refetchQuotes()}
              size="small"
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search stocks by symbol or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && searchQuery) {
              searchMutation.mutate(searchQuery);
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />
      </Box>

      {/* Market Indices */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {['SPY', 'QQQ', 'DIA', 'IWM'].map(index => {
          const quote = popularQuotes?.[index];
          if (!quote) return null;
          
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: quote.d >= 0
                    ? alpha(theme.palette.success.main, 0.08)
                    : alpha(theme.palette.error.main, 0.08),
                  border: '1px solid',
                  borderColor: quote.d >= 0
                    ? alpha(theme.palette.success.main, 0.2)
                    : alpha(theme.palette.error.main, 0.2),
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {index}
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {formatPrice(quote.c)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {quote.d >= 0 ? (
                      <TrendingUp color="success" />
                    ) : (
                      <TrendingDown color="error" />
                    )}
                    <Typography
                      variant="body2"
                      color={quote.d >= 0 ? 'success.main' : 'error.main'}
                      fontWeight={600}
                    >
                      {formatPrice(Math.abs(quote.d))} ({formatPercent(quote.dp)})
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Stocks Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Popular Stocks
          </Typography>
          
          {quotesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Change</TableCell>
                    <TableCell align="right">% Change</TableCell>
                    <TableCell align="right">High</TableCell>
                    <TableCell align="right">Low</TableCell>
                    <TableCell align="right">Volume</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getStockData().map((stock) => (
                    <TableRow key={stock.symbol}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => toggleFavorite(stock.symbol)}
                          >
                            {favorites.includes(stock.symbol) ? (
                              <Star sx={{ color: 'warning.main' }} />
                            ) : (
                              <StarBorder />
                            )}
                          </IconButton>
                          <Typography fontWeight={600}>{stock.symbol}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatPrice(stock.c)}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: stock.d >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 600,
                        }}
                      >
                        {stock.d >= 0 ? '+' : ''}{formatPrice(Math.abs(stock.d))}
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: stock.dp >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 600,
                        }}
                      >
                        {formatPercent(stock.dp)}
                      </TableCell>
                      <TableCell align="right">{formatPrice(stock.h)}</TableCell>
                      <TableCell align="right">{formatPrice(stock.l)}</TableCell>
                      <TableCell align="right">-</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" component="a" href={`/academy/companies/${stock.symbol}`}>
                          <ShowChart />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}