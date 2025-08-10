'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Tooltip,
  IconButton,
  Fade,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  InfoOutlined,
  KeyboardArrowUp,
  KeyboardArrowDown,
  CircleOutlined,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import API from '@/lib/axios';
import { useTranslation } from 'react-i18next';

interface StockData {
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
}

export function HeroStockTable() {
  const [expandedStock, setExpandedStock] = useState<string | null>(null);
  const { t, i18n } = useTranslation('common');

  const { data: stocks, isLoading } = useQuery<StockData[]>({
    queryKey: ['featured-stocks-v3'],
    queryFn: async () => {
      const response = await API.get('/market/featured');
      return response.data.slice(0, 5);
    },
    refetchInterval: 30000,
  });

  const formatVolume = (volume: number): string => {
    if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(1)}B`;
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getMarketStatus = () => {
    const now = new Date();
    
    // Convert to Eastern Time (ET)
    // Get UTC time and adjust for ET (UTC-5 for EST, UTC-4 for EDT)
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcDay = now.getUTCDay();
    
    // Determine if we're in EDT (March-November) or EST (November-March)
    // For simplicity, we'll use a fixed offset. In production, consider using a library like date-fns-tz
    const isDST = () => {
      const month = now.getUTCMonth();
      return month >= 2 && month <= 10; // Approximate DST period (March-November)
    };
    
    const etOffset = isDST() ? 4 : 5;
    let etHours = utcHours - etOffset;
    let etDay = utcDay;
    
    // Adjust day if we crossed midnight
    if (etHours < 0) {
      etHours += 24;
      etDay = (etDay - 1 + 7) % 7;
    }
    
    const etTime = etHours * 100 + utcMinutes;
    
    // Market is closed on weekends
    if (etDay === 0 || etDay === 6) return { status: 'market.closed', color: '#ef4444' };
    
    // Check market hours (all times in ET)
    if (etTime >= 930 && etTime < 1600) return { status: 'market.open', color: '#16a34a' };
    if (etTime >= 400 && etTime < 930) return { status: 'market.preMarket', color: '#fbbf24' };
    if (etTime >= 1600 && etTime < 2000) return { status: 'market.afterHours', color: '#fbbf24' };
    return { status: 'market.closed', color: '#ef4444' };
  };

  const marketStatus = getMarketStatus();

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, backgroundColor: 'transparent' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#374151',
                animation: `pulse 1.5s infinite ${i * 0.2}s`,
              }}
            />
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Minimal Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('market.marketsToday')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CircleOutlined
              sx={{
                fontSize: 8,
                color: marketStatus.color,
                animation: marketStatus.status === 'market.open' ? 'pulse 2s infinite' : 'none',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: marketStatus.color,
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              {t(marketStatus.status)}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {new Date().toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
      </Box>

      {/* Stock List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {stocks?.map((stock) => {
          const isPositive = stock.change >= 0;
          const isExpanded = expandedStock === stock.symbol;
          
          return (
            <Paper
              key={stock.symbol}
              elevation={0}
              sx={{
                backgroundColor: alpha('#ffffff', 0.03),
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: alpha('#ffffff', 0.05),
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.05),
                  borderColor: alpha(isPositive ? '#16a34a' : '#ef4444', 0.3),
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => setExpandedStock(isExpanded ? null : stock.symbol)}
            >
              {/* Main Content */}
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Left: Symbol & Name */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: alpha(isPositive ? '#16a34a' : '#ef4444', 0.1),
                        border: '2px solid',
                        borderColor: alpha(isPositive ? '#16a34a' : '#ef4444', 0.2),
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: isPositive ? '#16a34a' : '#ef4444',
                        }}
                      >
                        {stock.symbol.substring(0, 2)}
                      </Typography>
                    </Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" fontWeight={700}>
                          {stock.symbol}
                        </Typography>
                        <Tooltip title="View Details">
                          <IconButton size="small" sx={{ opacity: 0.5 }}>
                            <InfoOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {stock.name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Center: Mini Chart Placeholder */}
                  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <svg width="120" height="40">
                      <polyline
                        fill="none"
                        stroke={isPositive ? '#16a34a' : '#ef4444'}
                        strokeWidth="2"
                        points={`0,${isPositive ? 35 : 5} 20,25 40,${isPositive ? 20 : 30} 60,15 80,${isPositive ? 10 : 25} 100,${isPositive ? 5 : 35} 120,${isPositive ? 8 : 38}`}
                      />
                    </svg>
                  </Box>

                  {/* Right: Price & Change */}
                  <Box sx={{ textAlign: 'right', flex: 0.8 }}>
                    <Typography variant="h6" fontWeight={700}>
                      {formatCurrency(stock.price)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      {isPositive ? (
                        <TrendingUp sx={{ fontSize: 14, color: '#16a34a' }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 14, color: '#ef4444' }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: isPositive ? '#16a34a' : '#ef4444',
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(Math.abs(stock.change))} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </Typography>
                    </Box>
                  </Box>

                  {/* Expand Icon */}
                  <Box sx={{ ml: 2 }}>
                    <IconButton size="small">
                      {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Expanded Details */}
              <Fade in={isExpanded}>
                <Box
                  sx={{
                    borderTop: '1px solid',
                    borderColor: alpha('#ffffff', 0.05),
                    p: 2.5,
                    backgroundColor: alpha('#000000', 0.2),
                    display: isExpanded ? 'block' : 'none',
                  }}
                >
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Open
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(stock.open || 0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Previous Close
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(stock.previousClose || 0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Day Range
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(stock.low || 0)} - {formatCurrency(stock.high || 0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Volume
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatVolume(stock.volume)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Day Range Visual */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Today's Range
                    </Typography>
                    <Box sx={{ position: 'relative', mt: 1 }}>
                      <Box
                        sx={{
                          height: 6,
                          backgroundColor: alpha('#ffffff', 0.1),
                          borderRadius: 3,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: `${((stock.price - (stock.low || 0)) / ((stock.high || 1) - (stock.low || 0))) * 100}%`,
                          transform: 'translateX(-50%)',
                          width: 12,
                          height: 12,
                          backgroundColor: isPositive ? '#16a34a' : '#ef4444',
                          borderRadius: '50%',
                          border: '3px solid #0a0e17',
                          mt: '-3px',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Fade>
            </Paper>
          );
        })}
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {t('market.dataProvidedBy')} • {t('market.refreshesEvery')}
        </Typography>
      </Box>
    </Box>
  );
}