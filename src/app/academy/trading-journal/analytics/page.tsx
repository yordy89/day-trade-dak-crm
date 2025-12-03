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
  Divider,
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
  Calendar,
  Target,
  Lightning,
  Clock,
  Trophy,
  Warning,
  ArrowLeft,
  Download,
  Brain,
  Scales,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { tradingJournalService } from '@/services/trading-journal.service';
import { TimeFilter, MarketType, Analytics } from '@/types/trading-journal';
import { formatCurrency } from '@/utils/format';
import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleType } from '@/types/module-permission';
import { TradingJournalAccessDenied } from '@/components/trading-journal/access-denied';

interface PerformanceMetric {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

export default function AnalyticsPage() {
  const theme = useTheme();
  const router = useRouter();

  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TimeFilter.MONTH);
  const [error, setError] = useState<string | null>(null);

  // Check module access AFTER all useState hooks
  const { hasAccess, loading: accessLoading } = useModuleAccess(ModuleType.TRADING_JOURNAL);

  // useEffect MUST be before early returns
  useEffect(() => {
    if (!hasAccess || accessLoading) return;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await tradingJournalService.getStatistics({ timeFilter });
        setAnalytics(data as any);
      } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
    };

    loadAnalytics();
  }, [timeFilter, hasAccess, accessLoading]);

  // Early returns for access control - AFTER all hooks
  if (accessLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!hasAccess) {
    return <TradingJournalAccessDenied />;
  }

  const handleBack = () => {
    router.push(paths.academy.tradingJournal.trades);
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
      label: 'Total P&L',
      value: formatCurrency(analytics?.totalPnl || 0),
      change: analytics?.pnlChange,
      icon: <ChartLine size={24} />,
      color: (analytics?.totalPnl || 0) >= 0 ? theme.palette.success.main : theme.palette.error.main,
    },
    {
      label: 'Win Rate',
      value: `${analytics?.winRate?.toFixed(1) || 0}%`,
      icon: <Trophy size={24} />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Profit Factor',
      value: analytics?.profitFactor?.toFixed(2) || '0.00',
      icon: <Scales size={24} />,
      color: theme.palette.secondary.main,
    },
    {
      label: 'Avg R-Multiple',
      value: `${analytics?.avgRMultiple?.toFixed(2) || '0.00'}R`,
      icon: <Target size={24} />,
      color: theme.palette.info.main,
    },
    {
      label: 'Expectancy',
      value: formatCurrency(analytics?.expectancy || 0),
      icon: <Lightning size={24} />,
      color: theme.palette.warning.main,
    },
    {
      label: 'Avg Hold Time',
      value: `${analytics?.avgHoldingTime || 0} days`,
      icon: <Clock size={24} />,
      color: theme.palette.text.secondary,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={3} mb={4}>
        <IconButton
          onClick={handleBack}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { boxShadow: 2 }
          }}
        >
          <ArrowLeft />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h4" fontWeight={600} mb={1}>
            Trading Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Performance metrics and insights from your trading journal
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            label="Time Period"
          >
            <MenuItem value={TimeFilter.TODAY}>Today</MenuItem>
            <MenuItem value={TimeFilter.WEEK}>This Week</MenuItem>
            <MenuItem value={TimeFilter.MONTH}>This Month</MenuItem>
            <MenuItem value={TimeFilter.QUARTER}>Quarter</MenuItem>
            <MenuItem value={TimeFilter.YEAR}>This Year</MenuItem>
            <MenuItem value={TimeFilter.ALL}>All Time</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
        >
          Export Report
        </Button>
      </Stack>

      {/* Key Performance Metrics */}
      <Grid container spacing={3} mb={4}>
        {performanceMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: alpha(metric.color, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: metric.color,
                  }}
                >
                  {metric.icon}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    {metric.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color={metric.color}>
                    {metric.value}
                  </Typography>
                  {metric.change && (
                    <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                      {metric.change > 0 ? (
                        <TrendUp size={16} color={theme.palette.success.main} />
                      ) : (
                        <TrendDown size={16} color={theme.palette.error.main} />
                      )}
                      <Typography
                        variant="caption"
                        color={metric.change > 0 ? 'success.main' : 'error.main'}
                      >
                        {Math.abs(metric.change)}% from last period
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
        {/* Performance by Strategy */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Brain size={24} color={theme.palette.primary.main} />
              <Typography variant="h6" fontWeight={600}>
                Performance by Strategy
              </Typography>
            </Stack>
            <List>
              {analytics?.performanceByStrategy?.map((strategy, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemText
                    primary={strategy.name}
                    secondary={`${strategy.trades} trades`}
                  />
                  <Stack alignItems="flex-end">
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={strategy.pnl >= 0 ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(strategy.pnl)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Win Rate: {strategy.winRate?.toFixed(1)}%
                    </Typography>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Performance by Market */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <ChartLine size={24} color={theme.palette.primary.main} />
              <Typography variant="h6" fontWeight={600}>
                Performance by Market
              </Typography>
            </Stack>
            <Stack spacing={2}>
              {analytics?.performanceByMarket?.map((market, index) => (
                <Box key={index}>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={market.market}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {market.trades} trades
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={market.pnl >= 0 ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(market.pnl)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={market.winRate}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: market.pnl >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Win Rate: {market.winRate?.toFixed(1)}%
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Best & Worst Trades */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Best Trades
            </Typography>
            <List>
              {analytics?.bestTrades?.slice(0, 5).map((trade, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      mr: 2,
                    }}
                  >
                    {index + 1}
                  </Avatar>
                  <ListItemText
                    primary={trade.symbol}
                    secondary={new Date(trade.tradeDate).toLocaleDateString()}
                  />
                  <Stack alignItems="flex-end">
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="success.main"
                    >
                      {formatCurrency(trade.netPnl)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {trade.rMultiple?.toFixed(2)}R
                    </Typography>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Worst Trades
            </Typography>
            <List>
              {analytics?.worstTrades?.slice(0, 5).map((trade, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      mr: 2,
                    }}
                  >
                    {index + 1}
                  </Avatar>
                  <ListItemText
                    primary={trade.symbol}
                    secondary={new Date(trade.tradeDate).toLocaleDateString()}
                  />
                  <Stack alignItems="flex-end">
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="error.main"
                    >
                      {formatCurrency(trade.netPnl)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {trade.rMultiple?.toFixed(2)}R
                    </Typography>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Risk Metrics */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Warning size={24} color={theme.palette.warning.main} />
              <Typography variant="h6" fontWeight={600}>
                Risk Analysis
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="caption" color="text.secondary">
                    Max Drawdown
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="error.main">
                    {formatCurrency(analytics?.maxDrawdown || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {analytics?.maxDrawdownPercent?.toFixed(2)}% of capital
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="caption" color="text.secondary">
                    Sharpe Ratio
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {analytics?.sharpeRatio?.toFixed(2) || '0.00'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Risk-adjusted returns
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="caption" color="text.secondary">
                    Avg Winner
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="success.main">
                    {formatCurrency(analytics?.avgWinner || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Per winning trade
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="caption" color="text.secondary">
                    Avg Loser
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="error.main">
                    {formatCurrency(analytics?.avgLoser || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Per losing trade
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