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
  Tooltip,
} from '@mui/material';
import {
  Plus,
  MagnifyingGlass,
  Funnel,
  Download,
  DotsThreeVertical,
  TrendUp,
  TrendDown,
  Eye,
  Trash,
  PencilSimple,
  Calendar,
  ChartLine,
  CaretUp,
  CaretDown,
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
} from '@/types/trading-journal';
import { formatCurrency } from '@/utils/format';

interface Filters {
  search: string;
  market: MarketType | 'all';
  direction: TradeDirection | 'all';
  timeFilter: TimeFilter;
  isWinner: 'all' | 'winner' | 'loser';
}

export default function TradesListPage() {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<'date' | 'pnl' | 'symbol'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const [filters, setFilters] = useState<Filters>({
    search: '',
    market: 'all',
    direction: 'all',
    timeFilter: TimeFilter.MONTH,
    isWinner: 'all',
  });

  useEffect(() => {
    loadTrades();
  }, [page, rowsPerPage, filters, sortBy, sortOrder]);

  const loadTrades = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tradingJournalService.getTrades({
        timeFilter: filters.timeFilter,
        limit: rowsPerPage,
        page: page + 1, // API expects 1-based page numbering
        symbol: filters.search || undefined,
        market: filters.market !== 'all' ? filters.market : undefined,
        direction: filters.direction !== 'all' ? filters.direction : undefined,
        result: filters.isWinner !== 'all'
          ? filters.isWinner === 'winner' ? TradeResult.WINNERS : TradeResult.LOSERS
          : undefined,
        sortBy,
        sortOrder,
      });

      setTrades(response.trades);
      setTotalCount(response.total);
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

  const handleViewTrade = (tradeId: string) => {
    router.push(`${paths.academy.tradingJournal.trades}/${tradeId}`);
  };

  const handleEditTrade = (tradeId: string) => {
    router.push(`${paths.academy.tradingJournal.edit}/${tradeId}`);
  };

  const handleDeleteTrade = async (tradeId: string) => {
    if (!confirm('Are you sure you want to delete this trade?')) return;

    try {
      await tradingJournalService.deleteTrade(tradeId);
      loadTrades();
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

  const handleSort = (field: 'date' | 'pnl' | 'symbol') => {
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} mb={1}>
            All Trades
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and analyze your complete trading history
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={handleAddTrade}
        >
          Add Trade
        </Button>
      </Stack>

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
                    onClick={() => handleSort('date')}
                    endIcon={
                      sortBy === 'date' ? (
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
                    onClick={() => handleSort('pnl')}
                    endIcon={
                      sortBy === 'pnl' ? (
                        sortOrder === 'asc' ? <CaretUp /> : <CaretDown />
                      ) : null
                    }
                  >
                    P&L
                  </Button>
                </TableCell>
                <TableCell>R-Multiple</TableCell>
                <TableCell>Strategy</TableCell>
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
                    <Typography
                      fontWeight={600}
                      color={trade.netPnl >= 0 ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(trade.netPnl)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={trade.rMultiple >= 0 ? 'success.main' : 'error.main'}
                    >
                      {trade.rMultiple?.toFixed(2) || '0.00'}R
                    </Typography>
                  </TableCell>
                  <TableCell>{trade.strategy}</TableCell>
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
        <MenuItem
          onClick={() => {
            if (selectedTrade) handleEditTrade(selectedTrade._id);
            handleMenuClose();
          }}
        >
          <PencilSimple size={18} />
          <Box ml={1}>Edit</Box>
        </MenuItem>
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
    </Box>
  );
}