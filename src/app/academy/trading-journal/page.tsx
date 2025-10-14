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
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Plus,
  TrendUp,
  TrendDown,
  DotsThreeVertical,
  Download,
  Funnel,
  Calendar,
  ChartLine,
  Notebook,
  Warning,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { tradingJournalService } from '@/services/trading-journal.service';
import {
  Trade,
  TradeStatistics,
  TimeFilter,
  MarketType,
} from '@/types/trading-journal';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/format';

export default function TradingJournalPage() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation('trading');
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [statistics, setStatistics] = useState<TradeStatistics | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TimeFilter.MONTH);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    loadData();
  }, [timeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tradesResponse, statsData] = await Promise.all([
        tradingJournalService.getTrades({ timeFilter, limit: 10 }),
        tradingJournalService.getStatistics({ timeFilter }),
      ]);

      setTrades(tradesResponse.trades);
      setStatistics(statsData);
    } catch (err) {
      console.error('Failed to load trading journal data:', err);
      setError('Failed to load trading journal data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrade = () => {
    router.push(paths.academy.tradingJournal.add);
  };

  const handleViewAnalytics = () => {
    router.push(paths.academy.tradingJournal.analytics);
  };

  const getMarketChip = (market: MarketType) => {
    const colors = {
      [MarketType.STOCKS]: 'primary',
      [MarketType.OPTIONS]: 'secondary',
      [MarketType.FUTURES]: 'warning',
      [MarketType.FOREX]: 'info',
      [MarketType.CRYPTO]: 'success',
    };
    return <Chip label={market} size="small" color={colors[market] as any} />;
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

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} mb={1}>
            Trading Journal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your trades, analyze performance, and improve your strategy
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ChartLine />}
            onClick={handleViewAnalytics}
          >
            Analytics
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={handleAddTrade}
          >
            Add Trade
          </Button>
        </Stack>
      </Stack>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Total P&L
              </Typography>
              <Typography
                variant="h5"
                fontWeight={600}
                color={(statistics?.totalPnl || 0) >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(statistics?.totalPnl || 0)}
              </Typography>
              <Chip
                label={statistics?.totalTrades || 0 + ' trades'}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Win Rate
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {statistics?.winRate?.toFixed(1) || 0}%
              </Typography>
              <Typography variant="caption">
                {statistics?.winners || 0}W / {statistics?.losers || 0}L
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Profit Factor
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {statistics?.profitFactor?.toFixed(2) || 0}
              </Typography>
              <Typography variant="caption">
                Risk/Reward Ratio
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Expectancy
              </Typography>
              <Typography 
                variant="h5" 
                fontWeight={600}
                color={(statistics?.expectancy || 0) >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(statistics?.expectancy || 0)}
              </Typography>
              <Typography variant="caption">
                Per Trade Average
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Time Filter Buttons */}
      <Paper sx={{ mb: 3, p: 1 }}>
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
          {[
            { label: 'Today', value: TimeFilter.TODAY },
            { label: 'This Week', value: TimeFilter.WEEK },
            { label: 'This Month', value: TimeFilter.MONTH },
            { label: 'Quarter', value: TimeFilter.QUARTER },
            { label: 'This Year', value: TimeFilter.YEAR },
            { label: 'All Time', value: TimeFilter.ALL },
          ].map((filter, index) => (
            <Button
              key={filter.value}
              variant={timeFilter === filter.value ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setTimeFilter(filter.value);
              }}
              sx={{
                minWidth: 100,
                whiteSpace: 'nowrap'
              }}
            >
              {filter.label}
            </Button>
          ))}
        </Stack>
      </Paper>

      {/* Recent Trades List */}
      <Card>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600}>
              Recent Trades
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small">
                <Funnel />
              </IconButton>
              <IconButton size="small">
                <Download />
              </IconButton>
            </Stack>
          </Stack>

          {trades.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Notebook size={48} color={theme.palette.text.disabled} />
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                No trades yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start tracking your trades to see analytics and improve your performance
              </Typography>
              <Button variant="contained" startIcon={<Plus />} onClick={handleAddTrade}>
                Add Your First Trade
              </Button>
            </Box>
          ) : (
            <Stack spacing={2}>
              {trades.map((trade) => (
                <Paper
                  key={trade._id}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                    },
                  }}
                  onClick={() => router.push(`${paths.academy.tradingJournal.trades}/${trade._id}`)}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          bgcolor: trade.isWinner
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {trade.isWinner ? (
                          <TrendUp size={24} color={theme.palette.success.main} />
                        ) : (
                          <TrendDown size={24} color={theme.palette.error.main} />
                        )}
                      </Box>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {trade.symbol}
                          </Typography>
                          {getMarketChip(trade.market)}
                          <Chip
                            label={trade.direction}
                            size="small"
                            variant="outlined"
                            color={trade.direction === 'long' ? 'success' : 'error'}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(trade.tradeDate).toLocaleDateString()} • {trade.strategy}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack alignItems="flex-end" spacing={0.5}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color={trade.netPnl >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(trade.netPnl)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        R: {trade.rMultiple?.toFixed(2) || 0}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}

          {trades.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button variant="text" onClick={() => router.push(paths.academy.tradingJournal.trades)}>
                View All Trades
              </Button>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
}