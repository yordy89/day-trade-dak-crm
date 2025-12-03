'use client';

import React, { useState, useEffect } from 'react';
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

interface Filters {
  search: string;
  market: MarketType | 'all';
  direction: TradeDirection | 'all';
  timeFilter: TimeFilter;
  isWinner: 'all' | 'winner' | 'loser';
}

export default function TradingJournalPage() {
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
  });

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
      setError('Failed to load trades');
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
    if (!confirm('Are you sure you want to delete this trade?')) return;

    try {
      await tradingJournalService.deleteTrade(tradeId);
      loadData();
    } catch (err) {
      console.error('Failed to delete trade:', err);
      alert('Failed to delete trade');
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
            Trading Journal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track, analyze, and improve your trading performance
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
      <Grid container spacing={3} mb={3}>
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
                label={`${statistics?.totalTrades || 0} trades`}
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
              <Typography variant="caption" color="text.secondary">
                Risk/Reward
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
              <Typography variant="caption" color="text.secondary">
                Per Trade Avg
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Filters Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            placeholder="Search by symbol..."
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
            <InputLabel>Market</InputLabel>
            <Select
              value={filters.market}
              onChange={(e) => setFilters({ ...filters, market: e.target.value as any })}
              label="Market"
            >
              <MenuItem value="all">All</MenuItem>
              {Object.values(MarketType).map(market => (
                <MenuItem key={market} value={market}>
                  {market.charAt(0).toUpperCase() + market.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Direction</InputLabel>
            <Select
              value={filters.direction}
              onChange={(e) => setFilters({ ...filters, direction: e.target.value as any })}
              label="Direction"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value={TradeDirection.LONG}>Long</MenuItem>
              <MenuItem value={TradeDirection.SHORT}>Short</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Result</InputLabel>
            <Select
              value={filters.isWinner}
              onChange={(e) => setFilters({ ...filters, isWinner: e.target.value as any })}
              label="Result"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="winner">Winners</MenuItem>
              <MenuItem value="loser">Losers</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={filters.timeFilter}
              onChange={(e) => setFilters({ ...filters, timeFilter: e.target.value as TimeFilter })}
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
            sx={{ ml: 'auto' }}
          >
            Export
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
                    Date
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
                    Symbol
                  </Button>
                </TableCell>
                <TableCell>Market</TableCell>
                <TableCell>Direction</TableCell>
                <TableCell>Entry</TableCell>
                <TableCell>Exit</TableCell>
                <TableCell>Size</TableCell>
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
                    P&L
                  </Button>
                </TableCell>
                <TableCell>R-Multiple</TableCell>
                <TableCell>Setup</TableCell>
                <TableCell align="right">Actions</TableCell>
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
                      label={trade.direction}
                      size="small"
                      variant="outlined"
                      color={trade.direction === TradeDirection.LONG ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
                  <TableCell>
                    {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                  </TableCell>
                  <TableCell>{trade.positionSize}</TableCell>
                  <TableCell>
                    {trade.isOpen ? (
                      <Chip label="Open" size="small" color="info" variant="outlined" />
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
          <Box ml={1}>View Details</Box>
        </MenuItem>
        {selectedTrade?.isOpen && (
          <MenuItem
            onClick={() => {
              if (selectedTrade) handleCloseTrade(selectedTrade);
            }}
            sx={{ color: 'primary.main' }}
          >
            <CheckCircle size={18} />
            <Box ml={1}>Close Position</Box>
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
          <Box ml={1}>Delete</Box>
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
