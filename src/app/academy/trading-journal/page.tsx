'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Plus,
  MagnifyingGlass,
  Download,
  DotsThreeVertical,
  TrendUp,
  TrendDown,
  Eye,
  Trash,
  ChartLine,
  CaretUp,
  CaretDown,
  CheckCircle,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { tradingJournalService } from '@/services/trading-journal.service';
import {
  Trade,
  TimeFilter,
  MarketType,
  TradeDirection,
  TradeResult,
  TradeStatistics,
} from '@/types/trading-journal';
import { formatCurrency } from '@/utils/format';
import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleType } from '@/types/module-permission';
import { TradingJournalAccessDenied } from '@/components/trading-journal/access-denied';
import { CloseTradeModal } from '@/components/trading-journal/close-trade-modal';

type TradeStatus = 'all' | 'open' | 'pending_review' | 'reviewed';

interface Filters {
  search: string;
  market: MarketType | 'all';
  direction: TradeDirection | 'all';
  timeFilter: TimeFilter;
  isWinner: 'all' | 'winner' | 'loser';
  status: TradeStatus;
}

export default function TradingJournalPage() {
  const { t } = useTranslation('academy');
  const theme = useTheme();
  const router = useRouter();

  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [statistics, setStatistics] = useState<TradeStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<'tradeDate' | 'netPnl' | 'symbol'>('tradeDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [tradeToClose, setTradeToClose] = useState<Trade | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    market: 'all',
    direction: 'all',
    timeFilter: TimeFilter.MONTH,
    isWinner: 'all',
    status: 'all',
  });
  const [exporting, setExporting] = useState(false);

  // Check module access AFTER all useState hooks
  const { hasAccess, loading: accessLoading } = useModuleAccess(ModuleType.TRADING_JOURNAL);

  // useEffect MUST be before early returns
  useEffect(() => {
    if (hasAccess && !accessLoading) {
      loadData();
    }
  }, [page, rowsPerPage, filters, sortBy, sortOrder, hasAccess, accessLoading]);

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

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build status filter params
      const statusParams: { openOnly?: boolean; reviewedOnly?: boolean } = {};
      if (filters.status === 'open') {
        statusParams.openOnly = true;
      } else if (filters.status === 'reviewed') {
        statusParams.reviewedOnly = true;
      } else if (filters.status === 'pending_review') {
        statusParams.openOnly = false;
        statusParams.reviewedOnly = false;
      }

      const [tradesResponse, statsData] = await Promise.all([
        tradingJournalService.getTrades({
          timeFilter: filters.timeFilter,
          limit: rowsPerPage,
          page: page + 1,
          symbol: filters.search || undefined,
          market: filters.market !== 'all' ? filters.market : undefined,
          direction: filters.direction !== 'all' ? filters.direction : undefined,
          result: filters.isWinner !== 'all'
            ? filters.isWinner === 'winner' ? TradeResult.WINNERS : TradeResult.LOSERS
            : undefined,
          ...statusParams,
          sortBy,
          sortOrder,
        }),
        tradingJournalService.getStatistics({ timeFilter: filters.timeFilter }),
      ]);

      setTrades(tradesResponse.trades);
      setTotalCount(tradesResponse.total);
      setStatistics(statsData);
    } catch (err) {
      console.error('Failed to load trades:', err);
      setError(t('tradingJournal.tradesList.loadFailed'));
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

  const handleViewTrade = (tradeId: string) => {
    router.push(`/academy/trading-journal/${tradeId}`);
  };

  const handleCloseTrade = (trade: Trade) => {
    setTradeToClose(trade);
    setCloseModalOpen(true);
    handleMenuClose();
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
      loadData();
    } catch (err) {
      console.error('Failed to delete trade:', err);
      alert(t('tradingJournal.tradesList.deleteFailed'));
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, trade: Trade) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrade(trade);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTrade(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: 'tradeDate' | 'netPnl' | 'symbol') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await tradingJournalService.exportTrades({
        timeFilter: filters.timeFilter,
        symbol: filters.search || undefined,
        market: filters.market !== 'all' ? filters.market : undefined,
        direction: filters.direction !== 'all' ? filters.direction : undefined,
        result: filters.isWinner !== 'all'
          ? filters.isWinner === 'winner' ? TradeResult.WINNERS : TradeResult.LOSERS
          : undefined,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trades_${new Date().toISOString().split('T')[0]}.csv`;
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

  const getMarketColor = (market: MarketType) => {
    const colors = {
      [MarketType.STOCKS]: theme.palette.primary.main,
      [MarketType.OPTIONS]: theme.palette.secondary.main,
      [MarketType.FUTURES]: theme.palette.warning.main,
      [MarketType.FOREX]: theme.palette.info.main,
      [MarketType.CRYPTO]: theme.palette.success.main,
    };
    return colors[market];
  };

  if (loading && trades.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={600} mb={1}>
            {t('tradingJournal.tradesList.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('tradingJournal.tradesList.subtitle')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ChartLine />}
            onClick={handleViewAnalytics}
          >
            {t('tradingJournal.analytics.title')}
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={handleAddTrade}
          >
            {t('tradingJournal.addTrade')}
          </Button>
        </Stack>
      </Stack>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                {t('tradingJournal.stats.totalPnl')}
              </Typography>
              <Typography
                variant="h5"
                fontWeight={600}
                color={(statistics?.totalPnl || 0) >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(statistics?.totalPnl || 0)}
              </Typography>
              <Chip
                label={t('tradingJournal.stats.tradesCount', { count: statistics?.totalTrades || 0 })}
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
                {t('tradingJournal.stats.winRate')}
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
                {t('tradingJournal.stats.profitFactor')}
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {statistics?.profitFactor?.toFixed(2) || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('tradingJournal.stats.riskReward')}
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                {t('tradingJournal.stats.expectancy')}
              </Typography>
              <Typography
                variant="h5"
                fontWeight={600}
                color={(statistics?.expectancy || 0) >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(statistics?.expectancy || 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('tradingJournal.stats.perTradeAvg')}
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Filters Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            placeholder={t('tradingJournal.tradesList.searchPlaceholder')}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlass />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>{t('tradingJournal.tradesList.market')}</InputLabel>
            <Select
              value={filters.market}
              onChange={(e) => setFilters({ ...filters, market: e.target.value as any })}
              label={t('tradingJournal.tradesList.market')}
            >
              <MenuItem value="all">{t('tradingJournal.tradesList.allMarkets')}</MenuItem>
              <MenuItem value={MarketType.STOCKS}>{t('tradingJournal.markets.stocks')}</MenuItem>
              <MenuItem value={MarketType.OPTIONS}>{t('tradingJournal.markets.options')}</MenuItem>
              <MenuItem value={MarketType.FUTURES}>{t('tradingJournal.markets.futures')}</MenuItem>
              <MenuItem value={MarketType.FOREX}>{t('tradingJournal.markets.forex')}</MenuItem>
              <MenuItem value={MarketType.CRYPTO}>{t('tradingJournal.markets.crypto')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>{t('tradingJournal.tradesList.direction')}</InputLabel>
            <Select
              value={filters.direction}
              onChange={(e) => setFilters({ ...filters, direction: e.target.value as any })}
              label={t('tradingJournal.tradesList.direction')}
            >
              <MenuItem value="all">{t('tradingJournal.tradesList.allDirections')}</MenuItem>
              <MenuItem value={TradeDirection.LONG}>{t('tradingJournal.directions.longCall')}</MenuItem>
              <MenuItem value={TradeDirection.SHORT}>{t('tradingJournal.directions.shortPut')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>{t('tradingJournal.tradesList.result')}</InputLabel>
            <Select
              value={filters.isWinner}
              onChange={(e) => setFilters({ ...filters, isWinner: e.target.value as any })}
              label={t('tradingJournal.tradesList.result')}
            >
              <MenuItem value="all">{t('tradingJournal.tradesList.allResults')}</MenuItem>
              <MenuItem value="winner">{t('tradingJournal.tradesList.winners')}</MenuItem>
              <MenuItem value="loser">{t('tradingJournal.tradesList.losers')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>{t('tradingJournal.tradesList.status')}</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as TradeStatus })}
              label={t('tradingJournal.tradesList.status')}
            >
              <MenuItem value="all">{t('tradingJournal.status.allStatus')}</MenuItem>
              <MenuItem value="open">{t('tradingJournal.status.open')}</MenuItem>
              <MenuItem value="pending_review">{t('tradingJournal.status.pendingReview')}</MenuItem>
              <MenuItem value="reviewed">{t('tradingJournal.status.reviewed')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>{t('tradingJournal.tradesList.timePeriod')}</InputLabel>
            <Select
              value={filters.timeFilter}
              onChange={(e) => setFilters({ ...filters, timeFilter: e.target.value as TimeFilter })}
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
            sx={{ ml: 'auto' }}
          >
            {exporting ? t('tradingJournal.tradesList.exporting') : t('tradingJournal.tradesList.export')}
          </Button>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Trades Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleSort('tradeDate')}
                    endIcon={
                      sortBy === 'tradeDate' ? (
                        sortOrder === 'asc' ? <CaretUp /> : <CaretDown />
                      ) : null
                    }
                  >
                    {t('tradingJournal.tradesList.date')}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleSort('symbol')}
                    endIcon={
                      sortBy === 'symbol' ? (
                        sortOrder === 'asc' ? <CaretUp /> : <CaretDown />
                      ) : null
                    }
                  >
                    {t('tradingJournal.tradesList.symbol')}
                  </Button>
                </TableCell>
                <TableCell>{t('tradingJournal.tradesList.market')}</TableCell>
                <TableCell>{t('tradingJournal.tradesList.direction')}</TableCell>
                <TableCell>{t('tradingJournal.tradesList.entry')}</TableCell>
                <TableCell>{t('tradingJournal.tradesList.exit')}</TableCell>
                <TableCell>{t('tradingJournal.tradesList.size')}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleSort('netPnl')}
                    endIcon={
                      sortBy === 'netPnl' ? (
                        sortOrder === 'asc' ? <CaretUp /> : <CaretDown />
                      ) : null
                    }
                  >
                    {t('tradingJournal.tradesList.pnl')}
                  </Button>
                </TableCell>
                <TableCell>{t('tradingJournal.tradesList.rMultiple')}</TableCell>
                <TableCell>{t('tradingJournal.tradesList.status')}</TableCell>
                <TableCell>{t('tradingJournal.tradesList.setup')}</TableCell>
                <TableCell align="right">{t('tradingJournal.tradesList.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trades.map((trade) => (
                <TableRow
                  key={trade._id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleViewTrade(trade._id)}
                >
                  <TableCell>
                    {new Date(trade.tradeDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: trade.isWinner
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1),
                        }}
                      >
                        {trade.isWinner ? (
                          <TrendUp size={18} color={theme.palette.success.main} />
                        ) : (
                          <TrendDown size={18} color={theme.palette.error.main} />
                        )}
                      </Avatar>
                      <Typography fontWeight={600}>{trade.symbol}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={trade.market}
                      size="small"
                      sx={{
                        bgcolor: alpha(getMarketColor(trade.market), 0.1),
                        color: getMarketColor(trade.market),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        trade.market === MarketType.OPTIONS
                          ? (trade.optionType?.toUpperCase() || 'OPTION')
                          : trade.direction
                      }
                      size="small"
                      variant="outlined"
                      color={
                        trade.market === MarketType.OPTIONS
                          ? (trade.optionType === 'call' ? 'success' : 'error')
                          : (trade.direction === TradeDirection.LONG ? 'success' : 'error')
                      }
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
                  <TableCell>
                    {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                  </TableCell>
                  <TableCell>{trade.positionSize}</TableCell>
                  <TableCell>
                    {trade.isOpen ? (
                      <Chip label={t('tradingJournal.status.open')} size="small" color="info" variant="outlined" />
                    ) : (
                      <Typography
                        fontWeight={600}
                        color={(trade.netPnl || 0) >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(trade.netPnl || 0)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {trade.isOpen ? (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    ) : (
                      <Typography
                        color={(trade.rMultiple || 0) >= 0 ? 'success.main' : 'error.main'}
                      >
                        {trade.rMultiple?.toFixed(2) || '0.00'}R
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {trade.isOpen ? (
                      <Chip
                        label={t('tradingJournal.status.open')}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    ) : trade.isReviewed ? (
                      <Chip
                        label={t('tradingJournal.status.reviewed')}
                        size="small"
                        color="success"
                        variant="filled"
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
                  </TableCell>
                  <TableCell>{trade.setup}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, trade);
                      }}
                    >
                      <DotsThreeVertical />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedTrade) handleViewTrade(selectedTrade._id);
            handleMenuClose();
          }}
        >
          <Eye size={18} />
          <Box ml={1}>{t('tradingJournal.tradesList.viewDetails')}</Box>
        </MenuItem>
        {selectedTrade?.isOpen && (
          <MenuItem
            onClick={() => {
              if (selectedTrade) handleCloseTrade(selectedTrade);
            }}
            sx={{ color: 'primary.main' }}
          >
            <CheckCircle size={18} />
            <Box ml={1}>{t('tradingJournal.tradesList.closePosition')}</Box>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            if (selectedTrade) handleDeleteTrade(selectedTrade._id);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Trash size={18} />
          <Box ml={1}>{t('tradingJournal.tradesList.delete')}</Box>
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
