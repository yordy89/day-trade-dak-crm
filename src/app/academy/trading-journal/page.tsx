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
  Tooltip,
  ListItemIcon,
  ListItemText,
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
  Check,
  X,
  CaretDown,
  FileCsv,
  Eye,
  Trash,
  CheckCircle,
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
import toast from 'react-hot-toast';
import { CloseTradeModal } from '@/components/trading-journal/close-trade-modal';

type ResultFilter = 'all' | 'winners' | 'losers';

export default function TradingJournalPage() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation('academy');
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [statistics, setStatistics] = useState<TradeStatistics | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TimeFilter.MONTH);
  const [error, setError] = useState<string | null>(null);

  // Filter menu state
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all');
  const filterMenuOpen = Boolean(filterAnchorEl);

  // Action menu state
  const [actionAnchorEl, setActionAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const actionMenuOpen = Boolean(actionAnchorEl);

  // Close trade modal state
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [tradeToClose, setTradeToClose] = useState<Trade | null>(null);

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
      setError(t('tradingJournal.errors.loadFailed'));
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

  // Filter handlers
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleResultFilterChange = (filter: ResultFilter) => {
    setResultFilter(filter);
    handleFilterClose();
  };

  // Action menu handlers
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, trade: Trade) => {
    event.stopPropagation();
    setActionAnchorEl(event.currentTarget);
    setSelectedTrade(trade);
  };

  const handleActionMenuClose = () => {
    setActionAnchorEl(null);
    setSelectedTrade(null);
  };

  const handleViewTrade = (tradeId: string) => {
    router.push(`${paths.academy.tradingJournal.trades}/${tradeId}`);
  };

  const handleCloseTrade = (trade: Trade) => {
    setTradeToClose(trade);
    setCloseModalOpen(true);
    handleActionMenuClose();
  };

  const handleCloseSuccess = () => {
    setCloseModalOpen(false);
    setTradeToClose(null);
    loadData();
  };

  const handleDeleteTrade = async (tradeId: string) => {
    if (!confirm(t('tradingJournal.tradesList.confirmDelete'))) return;

    try {
      await tradingJournalService.deleteTrade(tradeId);
      toast.success(t('tradingJournal.tradesList.deleteSuccess'));
      loadData();
    } catch (err) {
      console.error('Failed to delete trade:', err);
      toast.error(t('tradingJournal.tradesList.deleteFailed'));
    }
    handleActionMenuClose();
  };

  // Get filtered trades
  const filteredTrades = trades.filter(trade => {
    if (resultFilter === 'all') return true;
    if (resultFilter === 'winners') return trade.netPnl >= 0;
    if (resultFilter === 'losers') return trade.netPnl < 0;
    return true;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (trades.length === 0) {
      toast.error(t('tradingJournal.export.noTrades'));
      return;
    }

    const headers = [
      t('tradingJournal.export.headers.date'),
      t('tradingJournal.export.headers.symbol'),
      t('tradingJournal.export.headers.market'),
      t('tradingJournal.export.headers.direction'),
      t('tradingJournal.export.headers.entryPrice'),
      t('tradingJournal.export.headers.exitPrice'),
      t('tradingJournal.export.headers.positionSize'),
      t('tradingJournal.export.headers.netPnl'),
      t('tradingJournal.export.headers.rMultiple'),
      t('tradingJournal.export.headers.strategy'),
    ];
    const csvData = filteredTrades.map(trade => [
      new Date(trade.tradeDate).toLocaleDateString(),
      trade.symbol,
      trade.market,
      trade.direction,
      trade.entryPrice,
      trade.exitPrice || '',
      trade.positionSize,
      trade.netPnl,
      trade.rMultiple?.toFixed(2) || '',
      trade.strategy || '',
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `trading-journal-${timeFilter}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success(t('tradingJournal.export.success', { count: filteredTrades.length }));
  };

  // Helper to get performance color
  const getPerformanceColor = (value: number) => {
    return value >= 0 ? theme.palette.success.main : theme.palette.error.main;
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
            {t('tradingJournal.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('tradingJournal.subtitle')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ChartLine />}
            onClick={handleViewAnalytics}
          >
            {t('tradingJournal.buttons.analytics')}
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={handleAddTrade}
          >
            {t('tradingJournal.buttons.addTrade')}
          </Button>
        </Stack>
      </Stack>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          {(() => {
            const pnlValue = statistics?.totalPnl || 0;
            const isPositive = pnlValue >= 0;
            const performanceColor = isPositive ? theme.palette.success.main : theme.palette.error.main;
            return (
              <Card
                sx={{
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(performanceColor, 0.12)} 100%)`
                    : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(performanceColor, 0.08)} 100%)`,
                  border: `1px solid ${alpha(performanceColor, 0.3)}`,
                  boxShadow: `0 4px 20px ${alpha(performanceColor, 0.15)}`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: performanceColor,
                  },
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.stats.totalPnl')}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color={isPositive ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(pnlValue)}
                  </Typography>
                  <Chip
                    label={`${statistics?.totalTrades || 0} ${t('tradingJournal.stats.trades')}`}
                    size="small"
                    sx={{
                      bgcolor: alpha(performanceColor, 0.15),
                      color: performanceColor,
                      border: 'none',
                      fontWeight: 500,
                    }}
                  />
                </Stack>
              </Card>
            );
          })()}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
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
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                {t('tradingJournal.stats.winRate')}
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {statistics?.winRate?.toFixed(1) || 0}%
              </Typography>
              <Typography variant="caption">
                {t('tradingJournal.stats.winsLosses', { wins: statistics?.winners || 0, losses: statistics?.losers || 0 })}
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
                : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
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
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                {t('tradingJournal.stats.profitFactor')}
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {statistics?.profitFactor?.toFixed(2) || 0}
              </Typography>
              <Typography variant="caption">
                {t('tradingJournal.stats.riskRewardRatio')}
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {(() => {
            const expectancyValue = statistics?.expectancy || 0;
            const isPositive = expectancyValue >= 0;
            const performanceColor = isPositive ? theme.palette.success.main : theme.palette.error.main;
            return (
              <Card
                sx={{
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(performanceColor, 0.12)} 100%)`
                    : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(performanceColor, 0.08)} 100%)`,
                  border: `1px solid ${alpha(performanceColor, 0.3)}`,
                  boxShadow: `0 4px 20px ${alpha(performanceColor, 0.15)}`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: performanceColor,
                  },
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.stats.expectancy')}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color={isPositive ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(expectancyValue)}
                  </Typography>
                  <Typography variant="caption">
                    {t('tradingJournal.stats.perTradeAvg')}
                  </Typography>
                </Stack>
              </Card>
            );
          })()}
        </Grid>
      </Grid>

      {/* Time Filter Buttons */}
      <Paper
        sx={{
          mb: 3,
          p: 1.5,
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`
            : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.06)}`,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
          {[
            { label: t('tradingJournal.timeFilters.today'), value: TimeFilter.TODAY },
            { label: t('tradingJournal.timeFilters.thisWeek'), value: TimeFilter.WEEK },
            { label: t('tradingJournal.timeFilters.thisMonth'), value: TimeFilter.MONTH },
            { label: t('tradingJournal.timeFilters.thisQuarter'), value: TimeFilter.QUARTER },
            { label: t('tradingJournal.timeFilters.thisYear'), value: TimeFilter.YEAR },
            { label: t('tradingJournal.timeFilters.allTime'), value: TimeFilter.ALL },
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
      <Card
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark'
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
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" fontWeight={600}>
                {t('tradingJournal.recentTrades.title')}
              </Typography>
              {resultFilter !== 'all' && (
                <Chip
                  label={resultFilter === 'winners' ? t('tradingJournal.filter.winnersOnly') : t('tradingJournal.filter.losersOnly')}
                  size="small"
                  color={resultFilter === 'winners' ? 'success' : 'error'}
                  onDelete={() => setResultFilter('all')}
                />
              )}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Tooltip title={t('tradingJournal.filter.title')}>
                <IconButton
                  size="small"
                  onClick={handleFilterClick}
                  sx={{
                    color: resultFilter !== 'all' ? (resultFilter === 'winners' ? 'success.main' : 'error.main') : 'primary.main',
                    bgcolor: resultFilter !== 'all'
                      ? alpha(resultFilter === 'winners' ? theme.palette.success.main : theme.palette.error.main, 0.1)
                      : alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: resultFilter !== 'all'
                        ? alpha(resultFilter === 'winners' ? theme.palette.success.main : theme.palette.error.main, 0.2)
                        : alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <Funnel />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('tradingJournal.export.title')}>
                <IconButton
                  size="small"
                  onClick={handleExportCSV}
                  sx={{
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <Download />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Filter Menu */}
          <Menu
            anchorEl={filterAnchorEl}
            open={filterMenuOpen}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem
              onClick={() => handleResultFilterChange('all')}
              selected={resultFilter === 'all'}
            >
              <ListItemIcon>
                {resultFilter === 'all' && <Check size={18} />}
              </ListItemIcon>
              <ListItemText>{t('tradingJournal.filter.allTrades')}</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => handleResultFilterChange('winners')}
              selected={resultFilter === 'winners'}
              sx={{ color: 'success.main' }}
            >
              <ListItemIcon>
                {resultFilter === 'winners' ? <Check size={18} color={theme.palette.success.main} /> : <TrendUp size={18} color={theme.palette.success.main} />}
              </ListItemIcon>
              <ListItemText>{t('tradingJournal.filter.winnersOnly')}</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => handleResultFilterChange('losers')}
              selected={resultFilter === 'losers'}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                {resultFilter === 'losers' ? <Check size={18} color={theme.palette.error.main} /> : <TrendDown size={18} color={theme.palette.error.main} />}
              </ListItemIcon>
              <ListItemText>{t('tradingJournal.filter.losersOnly')}</ListItemText>
            </MenuItem>
          </Menu>

          {trades.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Notebook size={48} color={theme.palette.text.disabled} />
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                {t('tradingJournal.tradesList.noTrades')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('tradingJournal.tradesList.noTradesMessage')}
              </Typography>
              <Button variant="contained" startIcon={<Plus />} onClick={handleAddTrade}>
                {t('tradingJournal.tradesList.addFirstTrade')}
              </Button>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredTrades.map((trade) => {
                const isOpen = trade.isOpen;
                const isWinner = !isOpen && (trade.netPnl || 0) >= 0;
                const performanceColor = isOpen
                  ? theme.palette.info.main
                  : (isWinner ? theme.palette.success.main : theme.palette.error.main);
                return (
                  <Paper
                    key={trade._id}
                    sx={{
                      p: 2.5,
                      background: theme.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(performanceColor, 0.1)} 100%)`
                        : `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(performanceColor, 0.06)} 100%)`,
                      border: `1px solid ${alpha(performanceColor, 0.25)}`,
                      borderLeft: `4px solid ${performanceColor}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(performanceColor, 0.1),
                        border: `1px solid ${alpha(performanceColor, 0.4)}`,
                        borderLeft: `4px solid ${performanceColor}`,
                        transform: 'translateX(4px)',
                      },
                    }}
                    onClick={() => router.push(`${paths.academy.tradingJournal.trades}/${trade._id}`)}
                  >
                    {/* Top Row: Symbol, chips, and actions */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 1,
                            bgcolor: alpha(performanceColor, 0.15),
                            border: `1px solid ${alpha(performanceColor, 0.3)}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isOpen ? (
                            <ChartLine size={22} color={performanceColor} />
                          ) : isWinner ? (
                            <TrendUp size={22} color={performanceColor} />
                          ) : (
                            <TrendDown size={22} color={performanceColor} />
                          )}
                        </Box>
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h6" fontWeight={700}>
                              {trade.symbol}
                            </Typography>
                            {getMarketChip(trade.market)}
                            <Chip
                              label={trade.direction}
                              size="small"
                              variant="outlined"
                              color={trade.direction === 'long' ? 'success' : 'error'}
                            />
                            {isOpen ? (
                              <Chip
                                label={t('tradingJournal.status.open')}
                                size="small"
                                color="info"
                                variant="filled"
                              />
                            ) : trade.isReviewed ? (
                              <Chip
                                label={t('tradingJournal.status.reviewed')}
                                size="small"
                                color="success"
                                variant="outlined"
                                icon={<CheckCircle size={14} />}
                              />
                            ) : (
                              <Chip
                                label={t('tradingJournal.status.pendingReview')}
                                size="small"
                                color="warning"
                                variant="outlined"
                              />
                            )}
                          </Stack>
                          <Typography variant="body2" color="text.secondary" mt={0.5}>
                            {new Date(trade.tradeDate).toLocaleDateString()} • {trade.strategy || trade.setup || '-'}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {isOpen && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckCircle size={16} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloseTrade(trade);
                            }}
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                              },
                            }}
                          >
                            {t('tradingJournal.tradesList.closePosition')}
                          </Button>
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionMenuOpen(e, trade)}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              bgcolor: alpha(performanceColor, 0.1),
                              color: performanceColor,
                            },
                          }}
                        >
                          <DotsThreeVertical size={20} />
                        </IconButton>
                      </Stack>
                    </Stack>

                    {/* Bottom Row: Trade details grid */}
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={2}>
                        <Typography variant="caption" color="text.secondary">
                          {t('tradingJournal.tradesList.entry')}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(trade.entryPrice)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <Typography variant="caption" color="text.secondary">
                          {t('tradingJournal.tradesList.exit')}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <Typography variant="caption" color="text.secondary">
                          {t('tradingJournal.tradesList.size')}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {trade.positionSize}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <Typography variant="caption" color="text.secondary">
                          P&L
                        </Typography>
                        {isOpen ? (
                          <Typography variant="body2" fontWeight={600} color="info.main">
                            -
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color={isWinner ? 'success.main' : 'error.main'}
                          >
                            {formatCurrency(trade.netPnl || 0)}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <Typography variant="caption" color="text.secondary">
                          R-Multiple
                        </Typography>
                        {isOpen ? (
                          <Typography variant="body2" fontWeight={600} color="info.main">
                            -
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={(trade.rMultiple || 0) >= 0 ? 'success.main' : 'error.main'}
                          >
                            {trade.rMultiple?.toFixed(2) || '0.00'}R
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <Typography variant="caption" color="text.secondary">
                          Setup
                        </Typography>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {trade.setup || '-'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                );
              })}
            </Stack>
          )}

          {filteredTrades.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button variant="text" onClick={() => router.push(paths.academy.tradingJournal.trades)}>
                {t('tradingJournal.recentTrades.viewAll')} {resultFilter !== 'all' && t('tradingJournal.recentTrades.shown', { count: filteredTrades.length })}
              </Button>
            </Box>
          )}

          {trades.length > 0 && filteredTrades.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                {resultFilter === 'winners' ? t('tradingJournal.filter.noWinning') : t('tradingJournal.filter.noLosing')}
              </Typography>
              <Button
                variant="text"
                onClick={() => setResultFilter('all')}
                sx={{ mt: 1 }}
              >
                {t('tradingJournal.filter.showAll')}
              </Button>
            </Box>
          )}
        </Box>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={actionAnchorEl}
        open={actionMenuOpen}
        onClose={handleActionMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 12,
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.25 : 0.15)}`,
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(180deg, ${alpha('#1a1a1a', 0.98)} 0%, ${alpha('#0f0f0f', 0.99)} 100%)`
              : `linear-gradient(180deg, #ffffff 0%, ${alpha('#f8fafc', 0.98)} 100%)`,
            overflow: 'hidden',
            boxShadow: theme.palette.mode === 'dark'
              ? `0 12px 40px ${alpha('#000', 0.5)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}`
              : `0 12px 40px ${alpha('#000', 0.12)}`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedTrade) handleViewTrade(selectedTrade._id);
            handleActionMenuClose();
          }}
          sx={{
            py: 1.5,
            px: 2,
            mx: 1,
            my: 0.5,
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:first-of-type': { mt: 1 },
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.08),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Eye size={18} color={theme.palette.primary.main} />
          </ListItemIcon>
          <ListItemText
            primary={t('tradingJournal.tradesList.viewDetails')}
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </MenuItem>
        {selectedTrade?.isOpen && (
          <MenuItem
            onClick={() => {
              if (selectedTrade) handleCloseTrade(selectedTrade);
            }}
            sx={{
              py: 1.5,
              px: 2,
              mx: 1,
              my: 0.5,
              borderRadius: 2,
              transition: 'all 0.2s ease',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircle size={18} color={theme.palette.primary.main} weight="fill" />
            </ListItemIcon>
            <ListItemText
              primary={t('tradingJournal.tradesList.closePosition')}
              primaryTypographyProps={{ fontWeight: 600, color: 'primary.main' }}
            />
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            if (selectedTrade) handleDeleteTrade(selectedTrade._id);
          }}
          sx={{
            py: 1.5,
            px: 2,
            mx: 1,
            my: 0.5,
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:last-of-type': { mb: 1 },
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Trash size={18} color={theme.palette.error.main} />
          </ListItemIcon>
          <ListItemText
            primary={t('tradingJournal.tradesList.delete')}
            primaryTypographyProps={{ fontWeight: 500, color: 'error.main' }}
          />
        </MenuItem>
      </Menu>

      {/* Close Trade Modal */}
      <CloseTradeModal
        open={closeModalOpen}
        trade={tradeToClose}
        onClose={() => setCloseModalOpen(false)}
        onSuccess={handleCloseSuccess}
      />
    </Box>
  );
}
