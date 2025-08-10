'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, Grid, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import API from '@/lib/axios';

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  timestamp?: number;
}

const mockTickers: TickerItem[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 195.89,
    change: 2.34,
    changePercent: 1.21,
    volume: 52300000,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 428.52,
    change: -1.23,
    changePercent: -0.29,
    volume: 23100000,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.42,
    change: 5.67,
    changePercent: 2.34,
    volume: 98700000,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 875.28,
    change: 12.45,
    changePercent: 1.44,
    volume: 45200000,
  },
];

export function LiveTicker() {
  // Fetch featured stocks from API
  const { data: tickers, isLoading, error } = useQuery<TickerItem[]>({
    queryKey: ['featured-stocks'],
    queryFn: async () => {
      try {
        const response = await API.get('/market/featured');
        return response.data;
      } catch (error) {
        console.error('Error fetching featured stocks:', error);
        // Return mock data as fallback
        return mockTickers;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });

  const formatVolume = (volume: number): string => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  // Use mock data if API fails
  const displayTickers = tickers || mockTickers;

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
          {isLoading ? (
            // Loading skeletons
            [...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  className="bg-[#1a1f2e] border border-gray-800"
                  elevation={0}
                >
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            displayTickers.slice(0, 4).map((ticker) => (
            <Grid item xs={12} sm={6} md={3} key={ticker.symbol}>
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
                      label={ticker.change >= 0 ? 'UP' : 'DOWN'}
                      size="small"
                      className={
                        ticker.change >= 0 
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
                      Vol: {formatVolume(ticker.volume)}
                    </Typography>
                  </Box>

                  <Typography variant="caption" className="text-gray-500 mt-2 block">
                    {ticker.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
          )}
        </Grid>

        {/* Scrolling ticker */}
        {!isLoading && displayTickers && (
          <Box className="mt-8 overflow-hidden bg-[#1a1f2e] rounded-lg border border-gray-800 py-3">
            <Box className="flex animate-scroll">
              {[...displayTickers, ...displayTickers].map((ticker, _index) => (
              <Box
                key={`${ticker.symbol}-${_index}`}
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
        )}
      </Box>
    </Box>
  );
}