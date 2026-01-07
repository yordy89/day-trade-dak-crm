'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('academy');

  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TimeFilter.MONTH);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

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

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await tradingJournalService.exportTrades({ timeFilter });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trades_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export trades:', err);
      alert(t('tradingJournal.tradesList.exportFailed'));
    } finally {
      setExporting(false);
    }
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

  // Format holding time from minutes to a readable format
  const formatHoldingTime = (minutes: number | null | undefined): string => {
    if (!minutes || minutes <= 0) return '0 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    if (minutes < 1440) return `${(minutes / 60).toFixed(1)} hrs`;
    return `${(minutes / 1440).toFixed(1)} days`;
  };

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: t('tradingJournal.analytics.totalPnl'),
      value: formatCurrency(analytics?.totalPnl || 0),
      change: analytics?.pnlChange,
      icon: <ChartLine size={24} />,
      color: (analytics?.totalPnl || 0) >= 0 ? theme.palette.success.main : theme.palette.error.main,
    },
    {
      label: t('tradingJournal.analytics.totalTrades'),
      value: analytics?.totalTrades || 0,
      icon: <TrendUp size={24} />,
      color: theme.palette.info.main,
    },
    {
      label: t('tradingJournal.analytics.winRate'),
      value: `${analytics?.winRate?.toFixed(1) || 0}%`,
      icon: <Trophy size={24} />,
      color: theme.palette.primary.main,
    },
    {
      label: t('tradingJournal.analytics.profitFactor'),
      value: analytics?.profitFactor?.toFixed(2) || '0.00',
      icon: <Scales size={24} />,
      color: theme.palette.secondary.main,
    },
    {
      label: t('tradingJournal.analytics.expectancy'),
      value: formatCurrency(analytics?.expectancy || 0),
      icon: <Lightning size={24} />,
      color: theme.palette.warning.main,
    },
    {
      label: t('tradingJournal.analytics.avgHoldTime'),
      value: formatHoldingTime(analytics?.avgHoldingTime),
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
            {t('tradingJournal.analytics.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('tradingJournal.analytics.overview')}
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>{t('tradingJournal.tradesList.timePeriod')}</InputLabel>
          <Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
            label={t('tradingJournal.tradesList.timePeriod')}
          >
            <MenuItem value={TimeFilter.TODAY}>{t('tradingJournal.tradesList.today')}</MenuItem>
            <MenuItem value={TimeFilter.WEEK}>{t('tradingJournal.tradesList.thisWeek')}</MenuItem>
            <MenuItem value={TimeFilter.MONTH}>{t('tradingJournal.tradesList.thisMonth')}</MenuItem>
            <MenuItem value={TimeFilter.QUARTER}>{t('tradingJournal.tradesList.quarter')}</MenuItem>
            <MenuItem value={TimeFilter.YEAR}>{t('tradingJournal.tradesList.thisYear')}</MenuItem>
            <MenuItem value={TimeFilter.ALL}>{t('tradingJournal.tradesList.allTime')}</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={exporting ? <CircularProgress size={16} /> : <Download />}
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? t('tradingJournal.analytics.exporting') : t('tradingJournal.analytics.exportReport')}
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
        {/* Performance by Option Type (CALL/PUT) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Brain size={24} color={theme.palette.primary.main} />
              <Typography variant="h6" fontWeight={600}>
                {t('tradingJournal.analytics.byOptionType')}
              </Typography>
            </Stack>
            {analytics?.optionTypeStats && analytics.optionTypeStats.length > 0 ? (
              <List>
                {analytics.optionTypeStats.map((optionType, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: optionType._id === 'call'
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.error.main, 0.1),
                        color: optionType._id === 'call'
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        mr: 2,
                      }}
                    >
                      {optionType._id?.toUpperCase() || 'N/A'}
                    </Avatar>
                    <ListItemText
                      primary={optionType._id === 'call' ? 'CALL Options' : 'PUT Options'}
                      secondary={`${optionType.trades} ${t('tradingJournal.analytics.trades')}`}
                    />
                    <Stack alignItems="flex-end">
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={optionType.pnl >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(optionType.pnl)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('tradingJournal.analytics.winRate')}: {optionType.winRate?.toFixed(1)}%
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                {t('tradingJournal.analytics.noOptionData')}
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Performance by Market */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <ChartLine size={24} color={theme.palette.primary.main} />
              <Typography variant="h6" fontWeight={600}>
                {t('tradingJournal.analytics.byMarket')}
              </Typography>
            </Stack>
            {analytics?.performanceByMarket && analytics.performanceByMarket.length > 0 ? (
              <Stack spacing={2}>
                {analytics.performanceByMarket.map((market, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={market.market?.toUpperCase() || 'Unknown'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {market.trades} {t('tradingJournal.analytics.trades')}
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
                      value={Math.min(market.winRate || 0, 100)}
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
                      {t('tradingJournal.analytics.winRate')}: {market.winRate?.toFixed(1) || 0}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                {t('tradingJournal.analytics.noMarketData')}
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Best & Worst Trades */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Trophy size={24} color={theme.palette.success.main} />
              <Typography variant="h6" fontWeight={600}>
                {t('tradingJournal.analytics.bestTrades')}
              </Typography>
            </Stack>
            {analytics?.bestTrades && analytics.bestTrades.length > 0 ? (
              <List>
                {analytics.bestTrades.slice(0, 5).map((trade, index) => (
                  <ListItem key={trade._id || index} sx={{ px: 0 }}>
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
                        {trade.rMultiple?.toFixed(2) || '0.00'}R
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                {t('tradingJournal.analytics.noBestTrades')}
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <TrendDown size={24} color={theme.palette.error.main} />
              <Typography variant="h6" fontWeight={600}>
                {t('tradingJournal.analytics.worstTrades')}
              </Typography>
            </Stack>
            {analytics?.worstTrades && analytics.worstTrades.length > 0 ? (
              <List>
                {analytics.worstTrades.slice(0, 5).map((trade, index) => (
                  <ListItem key={trade._id || index} sx={{ px: 0 }}>
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
                        {trade.rMultiple?.toFixed(2) || '0.00'}R
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                {t('tradingJournal.analytics.noWorstTrades')}
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Risk Metrics */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Warning size={24} color={theme.palette.warning.main} />
              <Typography variant="h6" fontWeight={600}>
                {t('tradingJournal.analytics.riskAnalysis')}
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.analytics.maxDrawdown')}
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="error.main">
                    {formatCurrency(analytics?.maxDrawdown || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.analytics.maxDrawdownDesc')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.analytics.riskRewardRatio')}
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {analytics?.avgLoss && analytics.avgLoss !== 0
                      ? `1:${Math.abs((analytics?.avgWin || 0) / analytics.avgLoss).toFixed(2)}`
                      : 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.analytics.riskRewardDesc')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.analytics.avgWin')}
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="success.main">
                    {formatCurrency(analytics?.avgWin || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.analytics.avgWinDesc')}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.analytics.avgLoss')}
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="error.main">
                    {formatCurrency(analytics?.avgLoss || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.analytics.avgLossDesc')}
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