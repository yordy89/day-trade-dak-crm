'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Stack,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  ChartLine,
  TrendUp,
  TrendDown,
  Target,
  Lightning,
  Clock,
  Trophy,
  Warning,
  ArrowLeft,
  Download,
  Scales,
  CurrencyCircleDollar,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { tradingJournalService } from '@/services/trading-journal.service';
import { TimeFilter, Analytics } from '@/types/trading-journal';
import { formatCurrency } from '@/utils/format';

interface PerformanceMetric {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

// Helper function to format holding time with appropriate unit
const formatHoldingTime = (minutes: number, t: (key: string) => string): string => {
  if (!minutes || minutes <= 0) return `0 ${t('tradingJournal.analytics.minutes')}`;

  if (minutes < 60) {
    // Less than 1 hour - show minutes
    return `${Math.round(minutes)} ${t('tradingJournal.analytics.minutes')}`;
  } else if (minutes < 1440) {
    // Less than 24 hours - show hours
    const hours = minutes / 60;
    return `${hours.toFixed(1)} ${t('tradingJournal.analytics.hours')}`;
  } else {
    // 24+ hours - show days
    const days = minutes / 1440;
    return `${days.toFixed(1)} ${t('tradingJournal.analytics.days')}`;
  }
};

export default function AnalyticsPage() {
  const { t } = useTranslation('academy');
  const theme = useTheme();
  const router = useRouter();
  const isDarkMode = theme.palette.mode === 'dark';
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TimeFilter.MONTH);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeFilter]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await tradingJournalService.getStatistics({ timeFilter });
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(t('tradingJournal.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/academy/trading-journal');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting analytics report...');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: t('tradingJournal.analytics.totalPnl'),
      value: formatCurrency(analytics?.totalPnl || 0),
      change: analytics?.pnlChange,
      icon: <ChartLine size={24} weight="duotone" />,
      color: (analytics?.totalPnl || 0) >= 0 ? theme.palette.success.main : theme.palette.error.main,
    },
    {
      label: t('tradingJournal.analytics.winRate'),
      value: `${analytics?.winRate?.toFixed(1) || 0}%`,
      icon: <Trophy size={24} weight="duotone" />,
      color: theme.palette.primary.main,
    },
    {
      label: t('tradingJournal.analytics.profitFactor'),
      value: analytics?.profitFactor?.toFixed(2) || '0.00',
      icon: <Scales size={24} weight="duotone" />,
      color: theme.palette.secondary.main,
    },
    {
      label: t('tradingJournal.analytics.avgRMultiple'),
      value: `${analytics?.avgRMultiple?.toFixed(2) || '0.00'}R`,
      icon: <Target size={24} weight="duotone" />,
      color: theme.palette.info.main,
    },
    {
      label: t('tradingJournal.analytics.expectancy'),
      value: formatCurrency(analytics?.expectancy || 0),
      icon: <Lightning size={24} weight="duotone" />,
      color: (analytics?.expectancy || 0) >= 0 ? theme.palette.success.main : theme.palette.error.main,
    },
    {
      label: t('tradingJournal.analytics.avgHoldingTime'),
      value: formatHoldingTime(analytics?.avgHoldingTime || 0, t),
      icon: <Clock size={24} weight="duotone" />,
      color: theme.palette.text.secondary,
    },
  ];

  // Map symbolStats from API to performanceBySymbol format
  const performanceBySymbol = (analytics as any)?.symbolStats?.map((stat: any) => ({
    symbol: stat._id,
    trades: stat.trades,
    pnl: stat.pnl,
    winRate: stat.winRate,
  })) || analytics?.performanceBySymbol || [];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={3} mb={4}>
        <IconButton
          onClick={handleBack}
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            color: theme.palette.primary.main,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              transform: 'translateX(-2px)',
            },
          }}
        >
          <ArrowLeft weight="bold" />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h4" fontWeight={700} mb={0.5}>
            {t('tradingJournal.analytics.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('tradingJournal.analytics.subtitle')}
          </Typography>
        </Box>
        <FormControl
          size="small"
          sx={{
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              '& fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.2),
              },
              '&:hover fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        >
          <InputLabel>{t('tradingJournal.analytics.timePeriod')}</InputLabel>
          <Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            label={t('tradingJournal.analytics.timePeriod')}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: isDarkMode
                    ? `linear-gradient(135deg, #0d1117 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                    : theme.palette.background.paper,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  borderRadius: 2,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.4)}`,
                  mt: 1,
                  overflow: 'hidden',
                  '& .MuiList-root': {
                    py: 1,
                  },
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                    mx: 1,
                    my: 0.5,
                    borderRadius: 1.5,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    },
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      borderLeft: `3px solid ${theme.palette.primary.main}`,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.25),
                      },
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value={TimeFilter.TODAY}>{t('tradingJournal.analytics.timeFilters.today')}</MenuItem>
            <MenuItem value={TimeFilter.WEEK}>{t('tradingJournal.analytics.timeFilters.thisWeek')}</MenuItem>
            <MenuItem value={TimeFilter.MONTH}>{t('tradingJournal.analytics.timeFilters.thisMonth')}</MenuItem>
            <MenuItem value={TimeFilter.QUARTER}>{t('tradingJournal.analytics.timeFilters.quarter')}</MenuItem>
            <MenuItem value={TimeFilter.YEAR}>{t('tradingJournal.analytics.timeFilters.thisYear')}</MenuItem>
            <MenuItem value={TimeFilter.ALL}>{t('tradingJournal.analytics.timeFilters.allTime')}</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<Download weight="bold" />}
          onClick={handleExport}
          sx={{
            borderRadius: 2,
            borderColor: alpha(theme.palette.primary.main, 0.3),
            color: theme.palette.primary.main,
            px: 3,
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          {t('tradingJournal.analytics.exportReport')}
        </Button>
      </Stack>

      {/* Key Performance Metrics */}
      <Grid container spacing={3} mb={4}>
        {performanceMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card
              sx={{
                p: 3,
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(metric.color, 0.08)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(metric.color, 0.05)} 100%)`,
                border: `1px solid ${alpha(metric.color, 0.2)}`,
                boxShadow: `0 4px 20px ${alpha(metric.color, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 30px ${alpha(metric.color, 0.2)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: metric.color,
                },
              }}
            >
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha(metric.color, 0.2)} 0%, ${alpha(metric.color, 0.1)} 100%)`,
                    border: `1px solid ${alpha(metric.color, 0.3)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: metric.color,
                  }}
                >
                  {metric.icon}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {metric.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color={metric.color}>
                    {metric.value}
                  </Typography>
                  {metric.change && (
                    <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                      {metric.change > 0 ? (
                        <TrendUp size={16} color={theme.palette.success.main} weight="bold" />
                      ) : (
                        <TrendDown size={16} color={theme.palette.error.main} weight="bold" />
                      )}
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color={metric.change > 0 ? 'success.main' : 'error.main'}
                      >
                        {Math.abs(metric.change)}% {t('tradingJournal.analytics.fromLastPeriod')}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Performance by Symbol */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CurrencyCircleDollar size={22} color={theme.palette.primary.main} weight="duotone" />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {t('tradingJournal.analytics.performanceBySymbol')}
              </Typography>
            </Stack>
            {performanceBySymbol && performanceBySymbol.length > 0 ? (
              <List sx={{
                '& .MuiListItem-root': { borderRadius: 2, mb: 1 },
                maxHeight: 300,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: 6,
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.3),
                },
              }}>
                {performanceBySymbol.map((symbolData: any, index: number) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                      },
                    }}
                  >
                    <Chip
                      label={symbolData.symbol}
                      size="small"
                      sx={{
                        mr: 2,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        bgcolor: alpha(symbolData.pnl >= 0 ? theme.palette.success.main : theme.palette.error.main, 0.15),
                        color: symbolData.pnl >= 0 ? theme.palette.success.main : theme.palette.error.main,
                        border: `1px solid ${alpha(symbolData.pnl >= 0 ? theme.palette.success.main : theme.palette.error.main, 0.3)}`,
                      }}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary">
                          {symbolData.trades} {t('tradingJournal.analytics.trades')}
                        </Typography>
                      }
                    />
                    <Stack alignItems="flex-end">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={symbolData.pnl >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(symbolData.pnl)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('tradingJournal.analytics.winRate')}: {symbolData.winRate?.toFixed(1)}%
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">{t('tradingJournal.analytics.noSymbolData')}</Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Performance by Market */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChartLine size={22} color={theme.palette.primary.main} weight="duotone" />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {t('tradingJournal.analytics.performanceByMarket')}
              </Typography>
            </Stack>
            {analytics?.performanceByMarket && analytics.performanceByMarket.length > 0 ? (
              <Stack spacing={3}>
                {analytics.performanceByMarket.map((market, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" mb={1.5}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Chip
                          label={t(`tradingJournal.markets.${market.market}`) || market.market}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                            color: theme.palette.primary.main,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {market.trades} {t('tradingJournal.analytics.trades')}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={market.pnl >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(market.pnl)}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={market.winRate || 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(market.pnl >= 0 ? theme.palette.success.main : theme.palette.error.main, 0.15),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: market.pnl >= 0
                            ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                            : `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {t('tradingJournal.analytics.winRate')}: {market.winRate?.toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">{t('tradingJournal.analytics.noMarketData')}</Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Best Trades */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.success.main, 0.06)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.success.main, 0.03)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.success.main, 0.08)}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.2)} 0%, ${alpha(theme.palette.success.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trophy size={22} color={theme.palette.success.main} weight="duotone" />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {t('tradingJournal.analytics.bestTrades')}
              </Typography>
            </Stack>
            {analytics?.bestTrades && analytics.bestTrades.length > 0 ? (
              <List sx={{ '& .MuiListItem-root': { borderRadius: 2, mb: 1 } }}>
                {analytics.bestTrades.slice(0, 5).map((trade, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: alpha(theme.palette.success.main, 0.15),
                        color: theme.palette.success.main,
                        mr: 2,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <ListItemText
                      primary={<Typography fontWeight={600}>{trade.symbol}</Typography>}
                      secondary={new Date(trade.tradeDate).toLocaleDateString()}
                    />
                    <Stack alignItems="flex-end">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="success.main"
                      >
                        {formatCurrency(trade.netPnl || 0)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {trade.rMultiple?.toFixed(2)}R
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">{t('tradingJournal.analytics.noWinningTrades')}</Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Worst Trades */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.error.main, 0.06)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.error.main, 0.03)} 100%)`,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.error.main, 0.08)}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.2)} 0%, ${alpha(theme.palette.error.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendDown size={22} color={theme.palette.error.main} weight="duotone" />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {t('tradingJournal.analytics.worstTrades')}
              </Typography>
            </Stack>
            {analytics?.worstTrades && analytics.worstTrades.length > 0 ? (
              <List sx={{ '& .MuiListItem-root': { borderRadius: 2, mb: 1 } }}>
                {analytics.worstTrades.slice(0, 5).map((trade, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: alpha(theme.palette.error.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: alpha(theme.palette.error.main, 0.15),
                        color: theme.palette.error.main,
                        mr: 2,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                      }}
                    >
                      {index + 1}
                    </Avatar>
                    <ListItemText
                      primary={<Typography fontWeight={600}>{trade.symbol}</Typography>}
                      secondary={new Date(trade.tradeDate).toLocaleDateString()}
                    />
                    <Stack alignItems="flex-end">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="error.main"
                      >
                        {formatCurrency(trade.netPnl || 0)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {trade.rMultiple?.toFixed(2)}R
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">{t('tradingJournal.analytics.noLosingTrades')}</Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Risk Metrics */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.warning.main, 0.06)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.warning.main, 0.03)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.warning.main, 0.08)}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.2)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Warning size={22} color={theme.palette.warning.main} weight="duotone" />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {t('tradingJournal.analytics.riskAnalysis')}
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background: isDarkMode
                      ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`
                      : `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.08)} 0%, ${alpha(theme.palette.error.main, 0.02)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {t('tradingJournal.analytics.maxDrawdown')}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="error.main" sx={{ my: 0.5 }}>
                    {formatCurrency(analytics?.maxDrawdown || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {analytics?.maxDrawdownPercent?.toFixed(2)}% {t('tradingJournal.analytics.ofCapital')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background: isDarkMode
                      ? `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`
                      : `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {t('tradingJournal.analytics.avgRMultiple')}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="info.main" sx={{ my: 0.5 }}>
                    {analytics?.avgRMultiple?.toFixed(2) || '0.00'}R
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.analytics.riskAdjustedReturns')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background: isDarkMode
                      ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`
                      : `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {t('tradingJournal.analytics.avgWinner')}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="success.main" sx={{ my: 0.5 }}>
                    {formatCurrency(analytics?.avgWin || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.analytics.perWinningTrade')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background: isDarkMode
                      ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`
                      : `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.08)} 0%, ${alpha(theme.palette.error.main, 0.02)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {t('tradingJournal.analytics.avgLoser')}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="error.main" sx={{ my: 0.5 }}>
                    {formatCurrency(analytics?.avgLoss || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.analytics.perLosingTrade')}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
