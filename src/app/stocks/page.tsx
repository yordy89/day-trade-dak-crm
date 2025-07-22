'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Grid, 
  Card, 
  Box, 
  Typography, 
  IconButton, 
  TextField, 
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Divider,
  Avatar,
  LinearProgress,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  Stack
} from '@mui/material'
import { 
  Search, 
 
  Star, 
  StarBorder,
  MoreVert,
  ViewModule,
  ViewList,
  Dashboard,
  ArrowUpward, 
  ArrowDownward, 
  ShowChart,
  Timeline,
  Assessment,
  AccountBalance,
  FilterList,
  Refresh,
  Settings,
  Add,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

// Mock data for stocks and ETFs
const mockStocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.45,
    change: 2.35,
    changePercent: 1.33,
    volume: '52.3M',
    marketCap: '2.8T',
    dayHigh: 179.80,
    dayLow: 175.20,
    weekRange52: '124.17 - 199.62',
    pe: 29.45,
    type: 'stock',
    sector: 'Technology',
    isWatchlist: true,
    sparklineData: [165, 168, 170, 172, 169, 173, 175, 178],
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    price: 456.78,
    change: -1.23,
    changePercent: -0.27,
    volume: '78.9M',
    marketCap: '420.5B',
    dayHigh: 458.90,
    dayLow: 455.10,
    weekRange52: '380.50 - 479.98',
    expenseRatio: 0.09,
    type: 'etf',
    category: 'Large Blend',
    isWatchlist: false,
    sparklineData: [460, 458, 459, 457, 458, 456, 457, 456],
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 245.67,
    change: 8.45,
    changePercent: 3.56,
    volume: '112.4M',
    marketCap: '780.2B',
    dayHigh: 248.90,
    dayLow: 238.40,
    weekRange52: '152.37 - 299.29',
    pe: 78.23,
    type: 'stock',
    sector: 'Automotive',
    isWatchlist: true,
    sparklineData: [235, 237, 240, 238, 242, 244, 243, 245],
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.91,
    change: -2.15,
    changePercent: -0.56,
    volume: '24.6M',
    marketCap: '2.81T',
    dayHigh: 381.45,
    dayLow: 377.20,
    weekRange52: '309.45 - 384.52',
    pe: 35.67,
    type: 'stock',
    sector: 'Technology',
    isWatchlist: false,
    sparklineData: [380, 381, 379, 380, 378, 379, 377, 378],
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    price: 395.23,
    change: 1.87,
    changePercent: 0.48,
    volume: '38.7M',
    marketCap: '155.8B',
    dayHigh: 396.80,
    dayLow: 392.10,
    weekRange52: '287.30 - 408.71',
    expenseRatio: 0.20,
    type: 'etf',
    category: 'Large Growth',
    isWatchlist: false,
    sparklineData: [393, 394, 393, 395, 394, 396, 395, 395],
  },
]

const marketIndices = [
  { name: 'S&P 500', value: 4567.80, change: 0.42, icon: ShowChart, color: '#4CAF50' },
  { name: 'Dow Jones', value: 35678.90, change: -0.18, icon: Timeline, color: '#F44335' },
  { name: 'NASDAQ', value: 14523.45, change: 0.89, icon: Assessment, color: '#4CAF50' },
  { name: 'Russell 2000', value: 1987.65, change: 1.23, icon: AccountBalance, color: '#4CAF50' },
]

export default function StocksPage() {
  const { t: _t } = useTranslation('common')
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDesign, setSelectedDesign] = useState<'modern' | 'professional' | 'dashboard'>('modern')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [stocks, setStocks] = useState(mockStocks)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [_selectedTab, _setSelectedTab] = useState(0)

  const toggleWatchlist = (symbol: string) => {
    setStocks(stocks.map(stock => 
      stock.symbol === symbol 
        ? { ...stock, isWatchlist: !stock.isWatchlist }
        : stock
    ))
  }

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || stock.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const handleDesignChange = (
    event: React.MouseEvent<HTMLElement>,
    newDesign: 'modern' | 'professional' | 'dashboard' | null,
  ) => {
    if (newDesign !== null) {
      setSelectedDesign(newDesign)
    }
  }

  // Design 1: Modern Gradient Cards
  const ModernDesign = () => (
    <Box sx={{ p: 3 }}>
      {/* Market Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {marketIndices.map((index) => (
          <Grid item xs={12} sm={6} md={3} key={index.name}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(145deg, ${alpha(index.color, 0.2)} 0%, ${alpha(index.color, 0.05)} 100%)`
                    : `linear-gradient(145deg, ${alpha(index.color, 0.1)} 0%, ${alpha('#ffffff', 0.9)} 100%)`,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(index.color, 0.2)}`,
                  boxShadow: `0 8px 32px ${alpha(index.color, 0.15)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 48px ${alpha(index.color, 0.25)}`,
                  }
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(index.color, 0.1),
                        color: index.color,
                        width: 48,
                        height: 48,
                      }}
                    >
                      <index.icon />
                    </Avatar>
                    <Box sx={{ ml: 'auto' }}>
                      <Chip
                        size="small"
                        icon={index.change >= 0 ? <ArrowUpward /> : <ArrowDownward />}
                        label={`${index.change >= 0 ? '+' : ''}${index.change}%`}
                        sx={{
                          bgcolor: alpha(index.color, 0.1),
                          color: index.color,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    {index.name}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {index.value.toLocaleString()}
                  </Typography>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, background: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(20px)' }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search stocks or ETFs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ButtonGroup fullWidth>
                <Button
                  variant={selectedFilter === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedFilter('all')}
                  sx={{ borderRadius: '12px 0 0 12px' }}
                >
                  All
                </Button>
                <Button
                  variant={selectedFilter === 'stock' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedFilter('stock')}
                >
                  Stocks
                </Button>
                <Button
                  variant={selectedFilter === 'etf' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedFilter('etf')}
                  sx={{ borderRadius: '0 12px 12px 0' }}
                >
                  ETFs
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Stocks Grid */}
      <Grid container spacing={3}>
        {filteredStocks.map((stock) => (
          <Grid item xs={12} md={6} lg={4} key={stock.symbol}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.8)
                    : '#ffffff',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[10],
                  }
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {stock.symbol}
                        </Typography>
                        <Chip
                          size="small"
                          label={stock.type.toUpperCase()}
                          sx={{
                            bgcolor: stock.type === 'etf' 
                              ? alpha(theme.palette.secondary.main, 0.1)
                              : alpha(theme.palette.primary.main, 0.1),
                            color: stock.type === 'etf'
                              ? theme.palette.secondary.main
                              : theme.palette.primary.main,
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {stock.name}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => toggleWatchlist(stock.symbol)}>
                      {stock.isWatchlist ? (
                        <Star sx={{ color: '#FFD700' }} />
                      ) : (
                        <StarBorder />
                      )}
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ${stock.price.toFixed(2)}
                    </Typography>
                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                      {stock.change >= 0 ? (
                        <ArrowUpward sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                      ) : (
                        <ArrowDownward sx={{ color: theme.palette.error.main, fontSize: 16 }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: stock.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                          fontWeight: 600,
                        }}
                      >
                        ${Math.abs(stock.change).toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </Typography>
                    </Box>
                  </Box>

                  {/* Mini Chart */}
                  <Box sx={{ height: 60, mb: 2, position: 'relative' }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 60">
                      <defs>
                        <linearGradient id={`gradient-${stock.symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={stock.change >= 0 ? theme.palette.success.main : theme.palette.error.main} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={stock.change >= 0 ? theme.palette.success.main : theme.palette.error.main} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={`M ${stock.sparklineData.map((value, index) => 
                          `${(index / (stock.sparklineData.length - 1)) * 100},${60 - (value - Math.min(...stock.sparklineData)) / (Math.max(...stock.sparklineData) - Math.min(...stock.sparklineData)) * 50}`
                        ).join(' L ')}`}
                        fill="none"
                        stroke={stock.change >= 0 ? theme.palette.success.main : theme.palette.error.main}
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${stock.sparklineData.map((value, index) => 
                          `${(index / (stock.sparklineData.length - 1)) * 100},${60 - (value - Math.min(...stock.sparklineData)) / (Math.max(...stock.sparklineData) - Math.min(...stock.sparklineData)) * 50}`
                        ).join(' L ')} L 100,60 L 0,60 Z`}
                        fill={`url(#gradient-${stock.symbol})`}
                      />
                    </svg>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Volume
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {stock.volume}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Market Cap
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {stock.marketCap}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  )

  // Design 2: Professional Data Table
  const ProfessionalDesign = () => (
    <Box sx={{ p: 3 }}>
      {/* Header Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {marketIndices.map((index) => (
          <Grid item xs={12} sm={6} md={3} key={index.name}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {index.name}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {index.value.toLocaleString()}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  icon={index.change >= 0 ? <ArrowUpward sx={{ fontSize: 12 }} /> : <ArrowDownward sx={{ fontSize: 12 }} />}
                  label={`${index.change >= 0 ? '+' : ''}${index.change}%`}
                  sx={{
                    bgcolor: index.change >= 0 ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                    color: index.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                    '& .MuiChip-icon': {
                      color: 'inherit',
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Controls */}
      <Paper elevation={0} sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Tabs
                value={selectedFilter}
                onChange={(e, v) => setSelectedFilter(v)}
                variant="fullWidth"
                sx={{
                  minHeight: 36,
                  '& .MuiTab-root': {
                    minHeight: 36,
                    textTransform: 'none',
                  },
                }}
              >
                <Tab value="all" label="All Assets" />
                <Tab value="stock" label="Stocks" />
                <Tab value="etf" label="ETFs" />
              </Tabs>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  startIcon={<Refresh />}
                  variant="outlined"
                  size="small"
                >
                  Refresh
                </Button>
                <Button
                  startIcon={<FilterList />}
                  variant="outlined"
                  size="small"
                >
                  Filters
                </Button>
                <Button
                  startIcon={<Settings />}
                  variant="outlined"
                  size="small"
                >
                  Settings
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Data Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Symbol</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Change</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>% Change</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Volume</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Market Cap</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStocks.map((stock) => (
              <TableRow
                key={stock.symbol}
                sx={{
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{stock.symbol}</Typography>
                    <Chip
                      size="small"
                      label={stock.type.toUpperCase()}
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: stock.type === 'etf' 
                          ? alpha(theme.palette.secondary.main, 0.1)
                          : alpha(theme.palette.primary.main, 0.1),
                        color: stock.type === 'etf'
                          ? theme.palette.secondary.main
                          : theme.palette.primary.main,
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  ${stock.price.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                    {stock.change >= 0 ? (
                      <ArrowUpward sx={{ fontSize: 16, color: theme.palette.success.main }} />
                    ) : (
                      <ArrowDownward sx={{ fontSize: 16, color: theme.palette.error.main }} />
                    )}
                    <Typography
                      sx={{
                        color: stock.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                        fontWeight: 600,
                      }}
                    >
                      ${Math.abs(stock.change).toFixed(2)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    sx={{
                      color: stock.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                      fontWeight: 600,
                    }}
                  >
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </Typography>
                </TableCell>
                <TableCell align="right">{stock.volume}</TableCell>
                <TableCell align="right">{stock.marketCap}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => toggleWatchlist(stock.symbol)}
                    >
                      {stock.isWatchlist ? (
                        <Star sx={{ fontSize: 18, color: '#FFD700' }} />
                      ) : (
                        <StarBorder sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                    <IconButton size="small">
                      <ShowChart sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                      <MoreVert sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )

  // Design 3: Interactive Dashboard
  const DashboardDesign = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Column - Market Overview */}
        <Grid item xs={12} md={8}>
          {/* Market Indices */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Market Overview
            </Typography>
            <Grid container spacing={2}>
              {marketIndices.map((index) => (
                <Grid item xs={6} key={index.name}>
                  <Card
                    sx={{
                      p: 2,
                      background: `linear-gradient(135deg, ${alpha(index.color, 0.1)} 0%, ${alpha(index.color, 0.05)} 100%)`,
                      border: `1px solid ${alpha(index.color, 0.2)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(index.color, 0.2),
                          color: index.color,
                          width: 40,
                          height: 40,
                        }}
                      >
                        <index.icon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {index.name}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                          {index.value.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: index.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          {index.change >= 0 ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
                          {Math.abs(index.change)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Main Content Area */}
          <Card>
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Stocks & ETFs
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ fontSize: 18 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 200 }}
                  />
                  <ToggleButtonGroup
                    value={selectedFilter}
                    exclusive
                    onChange={(e, v) => v && setSelectedFilter(v)}
                    size="small"
                  >
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="stock">Stocks</ToggleButton>
                    <ToggleButton value="etf">ETFs</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
            </Box>
            <Box sx={{ p: 0 }}>
              {filteredStocks.map((stock, index) => (
                <Box
                  key={stock.symbol}
                  sx={{
                    p: 2,
                    borderBottom: index < filteredStocks.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                    cursor: 'pointer',
                  }}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleWatchlist(stock.symbol)}
                        >
                          {stock.isWatchlist ? (
                            <Star sx={{ fontSize: 20, color: '#FFD700' }} />
                          ) : (
                            <StarBorder sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontWeight: 600 }}>{stock.symbol}</Typography>
                            <Chip
                              size="small"
                              label={stock.type.toUpperCase()}
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                bgcolor: stock.type === 'etf' 
                                  ? alpha(theme.palette.secondary.main, 0.1)
                                  : alpha(theme.palette.primary.main, 0.1),
                                color: stock.type === 'etf'
                                  ? theme.palette.secondary.main
                                  : theme.palette.primary.main,
                              }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {stock.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box sx={{ height: 40 }}>
                        <svg width="100%" height="100%" viewBox="0 0 100 40">
                          <path
                            d={`M ${stock.sparklineData.map((value, idx) => 
                              `${(idx / (stock.sparklineData.length - 1)) * 100},${40 - (value - Math.min(...stock.sparklineData)) / (Math.max(...stock.sparklineData) - Math.min(...stock.sparklineData)) * 35}`
                            ).join(' L ')}`}
                            fill="none"
                            stroke={stock.change >= 0 ? theme.palette.success.main : theme.palette.error.main}
                            strokeWidth="1.5"
                            opacity="0.8"
                          />
                        </svg>
                      </Box>
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 600 }}>
                        ${stock.price.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stock.volume}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ textAlign: 'right' }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: stock.change >= 0 
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1),
                        }}
                      >
                        {stock.change >= 0 ? (
                          <ArrowUpward sx={{ fontSize: 14, color: theme.palette.success.main }} />
                        ) : (
                          <ArrowDownward sx={{ fontSize: 14, color: theme.palette.error.main }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            color: stock.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                            fontWeight: 600,
                          }}
                        >
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Right Column - Watchlist & Stats */}
        <Grid item xs={12} md={4}>
          {/* Watchlist */}
          <Card sx={{ mb: 3 }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Watchlist
                </Typography>
                <IconButton size="small">
                  <Add />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              {stocks.filter(s => s.isWatchlist).length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No items in watchlist
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {stocks.filter(s => s.isWatchlist).map((stock) => (
                    <Box
                      key={stock.symbol}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontWeight: 600 }}>{stock.symbol}</Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          ${stock.price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {stock.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: stock.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                            fontWeight: 600,
                          }}
                        >
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Card>

          {/* Quick Stats */}
          <Card>
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Market Stats
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Most Active
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography sx={{ fontWeight: 600 }}>TSLA</Typography>
                    <Typography variant="body2">112.4M vol</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Top Gainer
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography sx={{ fontWeight: 600 }}>TSLA</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.success.main, fontWeight: 600 }}>
                      +3.56%
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Market Sentiment
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={65}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.error.main, 0.2),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: theme.palette.success.main,
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption">65% Bullish</Typography>
                      <Typography variant="caption">35% Bearish</Typography>
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header with Design Switcher */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          p: 3,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Stocks & ETFs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time market data and portfolio tracking
              </Typography>
            </Box>
            
            {/* Design Switcher */}
            <ToggleButtonGroup
              value={selectedDesign}
              exclusive
              onChange={handleDesignChange}
              aria-label="design switcher"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    },
                  },
                },
              }}
            >
              <ToggleButton value="modern" aria-label="modern design">
                <ViewModule sx={{ mr: 1 }} />
                Modern Cards
              </ToggleButton>
              <ToggleButton value="professional" aria-label="professional design">
                <ViewList sx={{ mr: 1 }} />
                Professional Table
              </ToggleButton>
              <ToggleButton value="dashboard" aria-label="dashboard design">
                <Dashboard sx={{ mr: 1 }} />
                Dashboard View
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Box>

      {/* Content Area with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDesign}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedDesign === 'modern' && <ModernDesign />}
          {selectedDesign === 'professional' && <ProfessionalDesign />}
          {selectedDesign === 'dashboard' && <DashboardDesign />}
        </motion.div>
      </AnimatePresence>

      {/* More Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>View Details</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Add to Portfolio</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Set Alert</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Export Data</MenuItem>
      </Menu>
    </Box>
  )
}