'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Delete,
  Search,
  Refresh,
  MoreVert,
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
  Notifications,
  NotificationsOff,
  ShowChart,
  Info,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '@/lib/axios';

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  marketCap?: number;
  pe?: number;
  isFavorite?: boolean;
  alertEnabled?: boolean;
  targetPrice?: number;
}

interface SearchResult {
  symbol: string;
  description: string;
  type: string;
  currency: string;
}

export function StockWatchlist() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedStock, setSelectedStock] = useState<WatchlistItem | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuStock, setMenuStock] = useState<WatchlistItem | null>(null);

  // Fetch watchlist
  const { data: watchlist, isLoading, error, refetch } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      // For now, using local storage. In production, this would be an API call
      const savedWatchlist = localStorage.getItem('stockWatchlist');
      if (savedWatchlist) {
        const symbols = JSON.parse(savedWatchlist);
        // Fetch real-time data for saved symbols
        const promises = symbols.map((symbol: string) =>
          API.get(`/market/quote/${symbol}`)
        );
        const responses = await Promise.all(promises);
        return responses.map((res, index) => ({
          symbol: symbols[index],
          name: symbols[index], // Would come from company info API
          price: res.data.c,
          change: res.data.d,
          changePercent: res.data.dp,
          volume: res.data.v || 0,
          dayHigh: res.data.h,
          dayLow: res.data.l,
          isFavorite: false,
          alertEnabled: false,
        }));
      }
      return [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Add to watchlist
  const addToWatchlist = useMutation({
    mutationFn: async (symbol: string) => {
      const savedWatchlist = localStorage.getItem('stockWatchlist');
      const currentList = savedWatchlist ? JSON.parse(savedWatchlist) : [];
      if (!currentList.includes(symbol)) {
        currentList.push(symbol);
        localStorage.setItem('stockWatchlist', JSON.stringify(currentList));
      }
      return symbol;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    },
  });

  // Remove from watchlist
  const removeFromWatchlist = useMutation({
    mutationFn: async (symbol: string) => {
      const savedWatchlist = localStorage.getItem('stockWatchlist');
      const currentList = savedWatchlist ? JSON.parse(savedWatchlist) : [];
      const newList = currentList.filter((s: string) => s !== symbol);
      localStorage.setItem('stockWatchlist', JSON.stringify(newList));
      return symbol;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  // Search stocks
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await API.get(`/market/search?q=${searchQuery}`);
      setSearchResults(response.data.result || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, stock: WatchlistItem) => {
    setAnchorEl(event.currentTarget);
    setMenuStock(stock);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuStock(null);
  };

  const toggleFavorite = (symbol: string) => {
    // In production, this would be an API call
    // For now, just updating local state
    queryClient.setQueryData(['watchlist'], (old: WatchlistItem[] | undefined) => {
      if (!old) return [];
      return old.map(item =>
        item.symbol === symbol ? { ...item, isFavorite: !item.isFavorite } : item
      );
    });
  };

  const toggleAlert = (symbol: string) => {
    // In production, this would be an API call
    queryClient.setQueryData(['watchlist'], (old: WatchlistItem[] | undefined) => {
      if (!old) return [];
      return old.map(item =>
        item.symbol === symbol ? { ...item, alertEnabled: !item.alertEnabled } : item
      );
    });
  };

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load watchlist. Please check your connection and try again.
        </Alert>
      </Box>
    );
  }

  const sortedWatchlist = watchlist
    ? [...watchlist].sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return 0;
      })
    : [];

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="bold">
              My Watchlist
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your favorite stocks with real-time data
            </Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={() => setSearchOpen(true)}
            >
              Add Stock
            </Button>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Watchlist Table */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : sortedWatchlist.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <ShowChart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Your watchlist is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Start building your watchlist by adding stocks you want to track
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setSearchOpen(true)}
            >
              Add Your First Stock
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.action.hover }}>
                <TableCell width={40}></TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Change</TableCell>
                <TableCell align="right">% Change</TableCell>
                <TableCell align="right">Volume</TableCell>
                <TableCell align="right">Day Range</TableCell>
                <TableCell width={40}>Alerts</TableCell>
                <TableCell width={40}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedWatchlist.map((stock) => {
                const isPositive = stock.change >= 0;
                
                return (
                  <TableRow
                    key={stock.symbol}
                    sx={{
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleFavorite(stock.symbol)}
                      >
                        {stock.isFavorite ? (
                          <Star color="warning" fontSize="small" />
                        ) : (
                          <StarBorder fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {stock.symbol}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stock.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        ${stock.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        color={isPositive ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {isPositive ? '+' : ''}{stock.change.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        label={`${isPositive ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
                        color={isPositive ? 'success' : 'error'}
                        icon={isPositive ? <TrendingUp /> : <TrendingDown />}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {(stock.volume / 1000000).toFixed(2)}M
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="text.secondary">
                        {stock.dayLow.toFixed(2)} - {stock.dayHigh.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={stock.alertEnabled ? 'Alerts On' : 'Alerts Off'}>
                        <IconButton
                          size="small"
                          onClick={() => toggleAlert(stock.symbol)}
                        >
                          {stock.alertEnabled ? (
                            <Notifications color="primary" fontSize="small" />
                          ) : (
                            <NotificationsOff fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, stock)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Stock Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          setSelectedStock(menuStock);
          handleMenuClose();
        }}>
          <Info fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          if (menuStock) {
            removeFromWatchlist.mutate(menuStock.symbol);
          }
          handleMenuClose();
        }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Remove
        </MenuItem>
      </Menu>

      {/* Add Stock Dialog */}
      <Dialog open={searchOpen} onClose={() => setSearchOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Stock to Watchlist</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              fullWidth
              placeholder="Search by symbol or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              sx={{ mt: 2 }}
            >
              {searching ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>

          {searchResults.length > 0 && (
            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>
                Search Results
              </Typography>
              {searchResults.map((result) => (
                <Box
                  key={result.symbol}
                  sx={{
                    p: 2,
                    mb: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => addToWatchlist.mutate(result.symbol)}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {result.symbol}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {result.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Type: {result.type} | Currency: {result.currency}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Stock Details Dialog */}
      {selectedStock && (
        <Dialog
          open={Boolean(selectedStock)}
          onClose={() => setSelectedStock(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedStock.symbol} - Stock Details
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Current Price
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  ${selectedStock.price.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Change
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={selectedStock.change >= 0 ? 'success.main' : 'error.main'}
                >
                  {selectedStock.changePercent >= 0 ? '+' : ''}
                  {selectedStock.changePercent.toFixed(2)}%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Day High
                </Typography>
                <Typography variant="body1">
                  ${selectedStock.dayHigh.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Day Low
                </Typography>
                <Typography variant="body1">
                  ${selectedStock.dayLow.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Volume
                </Typography>
                <Typography variant="body1">
                  {(selectedStock.volume / 1000000).toFixed(2)}M
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Market Cap
                </Typography>
                <Typography variant="body1">
                  {selectedStock.marketCap
                    ? `$${(selectedStock.marketCap / 1000000000).toFixed(2)}B`
                    : 'N/A'}
                </Typography>
              </Grid>
            </Grid>

            {selectedStock.alertEnabled && (
              <Box mt={3} p={2} bgcolor="info.main" borderRadius={1}>
                <Typography variant="body2" color="white">
                  Price alerts are enabled for this stock
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedStock(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Summary Stats */}
      {watchlist && watchlist.length > 0 && (
        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Total Stocks
                  </Typography>
                  <Typography variant="h4">
                    {watchlist.length}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Gainers
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {watchlist.filter(s => s.change > 0).length}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Losers
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {watchlist.filter(s => s.change < 0).length}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Unchanged
                  </Typography>
                  <Typography variant="h4">
                    {watchlist.filter(s => s.change === 0).length}
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Top Performer
                </Typography>
                {(() => {
                  const topGainer = watchlist.reduce((max, stock) =>
                    stock.changePercent > max.changePercent ? stock : max
                  );
                  return (
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="body1" fontWeight="bold">
                        {topGainer.symbol}
                      </Typography>
                      <Chip
                        size="small"
                        label={`+${topGainer.changePercent.toFixed(2)}%`}
                        color="success"
                        icon={<TrendingUp />}
                      />
                    </Box>
                  );
                })()}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}