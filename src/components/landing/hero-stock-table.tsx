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
    <Box
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        background: `linear-gradient(145deg, ${alpha('#0d1a14', 0.98)} 0%, ${alpha('#0a0f0c', 0.99)} 50%, ${alpha('#0d1117', 0.98)} 100%)`,
        border: '1px solid',
        borderColor: alpha('#16a34a', 0.25),
        boxShadow: `0 20px 60px ${alpha('#000000', 0.5)}, 0 0 60px ${alpha('#16a34a', 0.1)}, inset 0 1px 0 ${alpha('#16a34a', 0.1)}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #16a34a, #22c55e, #4ade80, #22c55e, #16a34a)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at top right, ${alpha('#16a34a', 0.08)} 0%, transparent 50%),
                       radial-gradient(ellipse at bottom left, ${alpha('#16a34a', 0.05)} 0%, transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Premium Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: alpha('#ffffff', 0.05),
          background: `linear-gradient(135deg, ${alpha('#16a34a', 0.05)} 0%, transparent 100%)`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha('#16a34a', 0.2)} 0%, ${alpha('#16a34a', 0.1)} 100%)`,
                border: '1px solid',
                borderColor: alpha('#16a34a', 0.3),
                boxShadow: `0 4px 12px ${alpha('#16a34a', 0.2)}`,
              }}
            >
              <TrendingUp sx={{ color: '#16a34a', fontSize: 24 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('market.marketsToday')}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              borderRadius: 2,
              background: alpha(marketStatus.color, 0.1),
              border: '1px solid',
              borderColor: alpha(marketStatus.color, 0.3),
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: marketStatus.color,
                animation: marketStatus.status === 'market.open' ? 'pulse 2s infinite' : 'none',
                boxShadow: `0 0 8px ${marketStatus.color}`,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: marketStatus.color,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                fontSize: '0.7rem',
              }}
            >
              {t(marketStatus.status)}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: alpha('#ffffff', 0.5),
            pl: 7,
            fontWeight: 500,
          }}
        >
          {new Date().toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
      </Box>

      {/* Stock List */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {stocks?.map((stock, index) => {
          const isPositive = stock.change >= 0;
          const isExpanded = expandedStock === stock.symbol;
          const accentColor = isPositive ? '#16a34a' : '#ef4444';

          return (
            <Paper
              key={stock.symbol}
              elevation={0}
              sx={{
                background: isExpanded
                  ? `linear-gradient(135deg, ${alpha(accentColor, 0.08)} 0%, ${alpha('#0d1117', 0.95)} 100%)`
                  : `linear-gradient(135deg, ${alpha(accentColor, 0.03)} 0%, ${alpha('#0d1117', 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: isExpanded
                  ? alpha(accentColor, 0.4)
                  : alpha(accentColor, 0.15),
                borderRadius: 2.5,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                  background: `linear-gradient(135deg, ${alpha(accentColor, 0.1)} 0%, ${alpha('#0d1117', 0.95)} 100%)`,
                  borderColor: alpha(accentColor, 0.4),
                  transform: 'translateX(4px)',
                  boxShadow: `0 4px 24px ${alpha(accentColor, 0.2)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: isExpanded ? '4px' : '2px',
                  background: `linear-gradient(180deg, ${accentColor} 0%, ${alpha(accentColor, 0.5)} 100%)`,
                  opacity: isExpanded ? 1 : 0.5,
                },
              }}
              onClick={() => setExpandedStock(isExpanded ? null : stock.symbol)}
            >
              {/* Main Content */}
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Left: Symbol & Name */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        backgroundColor: alpha(isPositive ? '#16a34a' : '#ef4444', 0.15),
                        border: '2px solid',
                        borderColor: alpha(isPositive ? '#16a34a' : '#ef4444', 0.3),
                        boxShadow: `0 4px 12px ${alpha(isPositive ? '#16a34a' : '#ef4444', 0.2)}`,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '13px',
                          fontWeight: 800,
                          color: isPositive ? '#16a34a' : '#ef4444',
                          letterSpacing: '-0.5px',
                        }}
                      >
                        {stock.symbol.substring(0, 2)}
                      </Typography>
                    </Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: '0.5px' }}>
                          {stock.symbol}
                        </Typography>
                        <Tooltip title="View Details">
                          <IconButton size="small" sx={{ opacity: 0.4, '&:hover': { opacity: 1 } }}>
                            <InfoOutlined sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.5) }}>
                        {stock.name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Center: Mini Chart */}
                  <Box
                    sx={{
                      flex: 1,
                      display: { xs: 'none', sm: 'flex' },
                      justifyContent: 'center',
                      alignItems: 'center',
                      px: 2,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 36,
                      }}
                    >
                      <svg width="100" height="36" viewBox="0 0 100 36">
                        <defs>
                          <linearGradient id={`gradient-${stock.symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={isPositive ? '#16a34a' : '#ef4444'} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={isPositive ? '#16a34a' : '#ef4444'} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d={`M0,${isPositive ? 30 : 6} Q20,20 40,${isPositive ? 16 : 24} T80,${isPositive ? 8 : 28} L100,${isPositive ? 6 : 30} L100,36 L0,36 Z`}
                          fill={`url(#gradient-${stock.symbol})`}
                        />
                        <polyline
                          fill="none"
                          stroke={isPositive ? '#16a34a' : '#ef4444'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={`0,${isPositive ? 30 : 6} 20,22 40,${isPositive ? 16 : 24} 60,14 80,${isPositive ? 8 : 28} 100,${isPositive ? 6 : 30}`}
                        />
                      </svg>
                    </Box>
                  </Box>

                  {/* Right: Price & Change */}
                  <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#ffffff' }}>
                      {formatCurrency(stock.price)}
                    </Typography>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        background: alpha(isPositive ? '#16a34a' : '#ef4444', 0.1),
                      }}
                    >
                      {isPositive ? (
                        <TrendingUp sx={{ fontSize: 12, color: '#16a34a' }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 12, color: '#ef4444' }} />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color: isPositive ? '#16a34a' : '#ef4444',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      >
                        {formatCurrency(Math.abs(stock.change))} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </Typography>
                    </Box>
                  </Box>

                  {/* Expand Icon */}
                  <Box sx={{ ml: 1 }}>
                    <IconButton
                      size="small"
                      sx={{
                        color: alpha('#ffffff', 0.5),
                        transition: 'all 0.3s ease',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        '&:hover': {
                          color: '#ffffff',
                          background: alpha('#ffffff', 0.1),
                        },
                      }}
                    >
                      <KeyboardArrowDown />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Expanded Details */}
              <Fade in={isExpanded}>
                <Box
                  sx={{
                    borderTop: '1px solid',
                    borderColor: alpha(accentColor, 0.2),
                    p: 2,
                    background: `linear-gradient(180deg, ${alpha(accentColor, 0.08)} 0%, ${alpha('#0a0e14', 0.95)} 100%)`,
                    display: isExpanded ? 'block' : 'none',
                  }}
                >
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
                    {[
                      { label: 'Open', value: formatCurrency(stock.open || 0) },
                      { label: 'Previous Close', value: formatCurrency(stock.previousClose || 0) },
                      { label: 'Day Range', value: `${formatCurrency(stock.low || 0)} - ${formatCurrency(stock.high || 0)}` },
                      { label: 'Volume', value: formatVolume(stock.volume) },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${alpha(accentColor, 0.1)} 0%, ${alpha(accentColor, 0.03)} 100%)`,
                          border: '1px solid',
                          borderColor: alpha(accentColor, 0.2),
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: `linear-gradient(135deg, ${alpha(accentColor, 0.15)} 0%, ${alpha(accentColor, 0.05)} 100%)`,
                            borderColor: alpha(accentColor, 0.3),
                          },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: alpha(accentColor, 0.8), fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={700} sx={{ color: '#ffffff', mt: 0.5 }}>
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Day Range Visual */}
                  <Box sx={{ mt: 2.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: alpha(accentColor, 0.8), fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}
                    >
                      Today&apos;s Range
                    </Typography>
                    <Box sx={{ position: 'relative', mt: 1.5 }}>
                      <Box
                        sx={{
                          height: 6,
                          background: `linear-gradient(90deg, ${alpha('#ef4444', 0.4)}, ${alpha('#fbbf24', 0.3)}, ${alpha('#16a34a', 0.4)})`,
                          borderRadius: 3,
                          boxShadow: `inset 0 1px 3px ${alpha('#000000', 0.3)}`,
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: `${Math.min(Math.max(((stock.price - (stock.low || 0)) / ((stock.high || 1) - (stock.low || 0))) * 100, 5), 95)}%`,
                          transform: 'translate(-50%, -50%)',
                          width: 16,
                          height: 16,
                          backgroundColor: accentColor,
                          borderRadius: '50%',
                          border: '3px solid #0d1117',
                          boxShadow: `0 0 12px ${accentColor}, 0 2px 8px ${alpha('#000000', 0.5)}`,
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
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: alpha('#ffffff', 0.05),
          background: alpha('#000000', 0.2),
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: alpha('#ffffff', 0.35),
            fontSize: '0.65rem',
          }}
        >
          {t('market.dataProvidedBy')} • {t('market.refreshesEvery')}
        </Typography>
      </Box>
    </Box>
  );
}