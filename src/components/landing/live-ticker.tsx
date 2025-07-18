'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, Grid } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface TickerItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  action: 'CALL' | 'PUT';
  image?: string;
}

const mockTickers: TickerItem[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: 195.89,
    change: 2.34,
    changePercent: 1.21,
    volume: '52.3M',
    action: 'CALL',
  },
  {
    id: '2',
    name: 'Microsoft Corp.',
    symbol: 'MSFT',
    price: 428.52,
    change: -1.23,
    changePercent: -0.29,
    volume: '23.1M',
    action: 'PUT',
  },
  {
    id: '3',
    name: 'Tesla Inc.',
    symbol: 'TSLA',
    price: 248.42,
    change: 5.67,
    changePercent: 2.34,
    volume: '98.7M',
    action: 'CALL',
  },
  {
    id: '4',
    name: 'NVIDIA Corp.',
    symbol: 'NVDA',
    price: 875.28,
    change: 12.45,
    changePercent: 1.44,
    volume: '45.2M',
    action: 'CALL',
  },
];

export function LiveTicker() {
  const [tickers, setTickers] = useState(mockTickers);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prevTickers =>
        prevTickers.map(ticker => ({
          ...ticker,
          price: ticker.price + (Math.random() - 0.5) * 2,
          change: ticker.change + (Math.random() - 0.5) * 0.5,
          changePercent: ticker.changePercent + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="bg-[#0a0e17] py-8">
      <Box className="container mx-auto px-4">
        <Box className="flex items-center justify-between mb-6">
          <Box className="flex items-center gap-3">
            <Box className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <Typography variant="h5" className="text-white font-bold">
              Live Market Ticker
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            className="text-green-400 cursor-pointer hover:text-green-300"
          >
            View All →
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {tickers.map((ticker) => (
            <Grid item xs={12} sm={6} md={3} key={ticker.id}>
              <Card
                className="bg-[#1a1f2e] border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                elevation={0}
              >
                <CardContent>
                  <Box className="flex justify-between items-start mb-3">
                    <Box>
                      <Typography variant="h6" className="text-white font-semibold">
                        ${ticker.price.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" className="text-gray-400">
                        {ticker.symbol}
                      </Typography>
                    </Box>
                    <Chip
                      label={ticker.action}
                      size="small"
                      className={
                        ticker.action === 'CALL' 
                          ? 'bg-green-900/50 text-green-400 border border-green-800'
                          : 'bg-red-900/50 text-red-400 border border-red-800'
                      }
                    />
                  </Box>

                  <Box className="flex items-center justify-between">
                    <Box className="flex items-center gap-1">
                      {ticker.change >= 0 ? (
                        <TrendingUp className="text-green-400 text-sm" />
                      ) : (
                        <TrendingDown className="text-red-400 text-sm" />
                      )}
                      <Typography 
                        variant="body2" 
                        className={ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}
                      >
                        {ticker.change >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                      </Typography>
                    </Box>
                    <Typography variant="caption" className="text-gray-500">
                      Vol: {ticker.volume}
                    </Typography>
                  </Box>

                  <Typography variant="caption" className="text-gray-500 mt-2 block">
                    {ticker.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Scrolling ticker */}
        <Box className="mt-8 overflow-hidden bg-[#1a1f2e] rounded-lg border border-gray-800 py-3">
          <Box className="flex animate-scroll">
            {[...tickers, ...tickers].map((ticker, _index) => (
              <Box
                key={`${ticker.id}-${_index}`}
                className="flex items-center px-6 border-r border-gray-800"
              >
                <Typography variant="body2" className="text-gray-400 mr-2">
                  {ticker.symbol}
                </Typography>
                <Typography variant="body2" className="text-white font-mono mr-2">
                  ${ticker.price.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  className={ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}
                >
                  {ticker.change >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}