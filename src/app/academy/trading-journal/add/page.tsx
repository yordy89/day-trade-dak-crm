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
  Alert,
  useTheme,
  alpha,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import {
  ArrowLeft,
  X,
  FloppyDisk,
  ChartLine,
  CurrencyDollar,
  TrendUp,
  TrendDown,
  Warning,
  Brain,
  Heart,
  ChartBar,
  Clock,
  Hash,
  Calendar,
  Target,
  Wallet,
  Tag,
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { tradingJournalService } from '@/services/trading-journal.service';
import {
  CreateTradeDto,
  MarketType,
  TradeDirection,
  EmotionType,
} from '@/types/trading-journal';
import { CustomInput, CustomSelect } from '@/components/shared/CustomInput';
import { CustomDatePicker } from '@/components/shared/CustomDatePicker';
import { CustomAutocomplete } from '@/components/shared/CustomAutocomplete';
import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleType } from '@/types/module-permission';
import { TradingJournalAccessDenied } from '@/components/trading-journal/access-denied';
import { useTranslation } from 'react-i18next';
import API from '@/lib/axios';

// Options specific enums
enum OptionType {
  CALL = 'call',
  PUT = 'put',
}

enum OptionStrategy {
  SINGLE = 'single',
  COVERED_CALL = 'covered_call',
  CASH_SECURED_PUT = 'cash_secured_put',
  VERTICAL_SPREAD = 'vertical_spread',
  IRON_CONDOR = 'iron_condor',
  STRADDLE = 'straddle',
  STRANGLE = 'strangle',
  BUTTERFLY = 'butterfly',
  CALENDAR = 'calendar',
  DIAGONAL = 'diagonal',
}

interface OptionsData {
  optionType?: OptionType;
  strikePrice?: number;
  expirationDate?: Date;
  premium?: number;
  contracts?: number;
  impliedVolatility?: number;
  daysToExpiration?: number;
  underlyingPrice?: number;
  optionStrategy?: OptionStrategy;
  legs?: Array<{
    optionType: OptionType;
    strikePrice: number;
    premium: number;
    contracts: number;
    action: 'buy' | 'sell';
  }>;
}

// Form data interface that extends CreateTradeDto with additional UI fields
interface TradeFormData extends Partial<CreateTradeDto> {
  setupNotes?: string;
  exitNotes?: string;
}

export default function AddTradePage() {
  const theme = useTheme();
  const router = useRouter();
  const isDarkMode = theme.palette.mode === 'dark';
  const { t } = useTranslation('academy');

  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enabledMarkets, setEnabledMarkets] = useState<string[]>([
    'stocks',
    'forex',
    'crypto',
    'futures',
    'options',
  ]);
  const [formData, setFormData] = useState<TradeFormData>({
    symbol: '',
    market: MarketType.OPTIONS,
    direction: TradeDirection.LONG,
    positionSize: 1,
    entryPrice: 0,
    entryTime: new Date(),
    stopLoss: 0,
    takeProfit: 0,
    tradeDate: new Date(),
    setup: '',
    riskAmount: 0,
    riskPercentage: 1,
    confidence: 7,
    emotionBefore: EmotionType.NEUTRAL,
    setupNotes: '',
    tags: [],
  });
  const [optionsData, setOptionsData] = useState<OptionsData>({
    optionType: OptionType.CALL,
    contracts: 1,
    optionStrategy: OptionStrategy.SINGLE,
  });

  // Check module access AFTER all useState hooks
  const { hasAccess, loading: accessLoading } = useModuleAccess(ModuleType.TRADING_JOURNAL);

  // Fetch enabled markets on mount
  useEffect(() => {
    const fetchEnabledMarkets = async () => {
      try {
        const response = await API.get('/settings/trading/markets');
        if (response.data?.markets) {
          setEnabledMarkets(response.data.markets);
        }
      } catch (err) {
        console.error('Failed to fetch enabled markets:', err);
        // Use default markets if fetch fails
      }
    };
    fetchEnabledMarkets();
  }, []);

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

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-calculate risk amount
    if ((field === 'stopLoss' || field === 'entryPrice' || field === 'positionSize') &&
        formData.entryPrice && formData.stopLoss && formData.positionSize) {
      const riskPerShare = Math.abs(formData.entryPrice - formData.stopLoss);
      const riskAmount = riskPerShare * formData.positionSize;
      setFormData(prev => ({ ...prev, riskAmount }));
    }
  };

  const handleOptionsChange = (field: string, value: any) => {
    setOptionsData(prev => ({ ...prev, [field]: value }));

    // Auto-set direction based on option type
    if (field === 'optionType') {
      if (value === OptionType.CALL) {
        setFormData(prev => ({ ...prev, direction: TradeDirection.LONG }));
      } else if (value === OptionType.PUT) {
        setFormData(prev => ({ ...prev, direction: TradeDirection.SHORT }));
      }
    }

    // Auto-calculate risk amount for options
    if (field === 'premium' || field === 'contracts') {
      const premium = field === 'premium' ? value : optionsData.premium;
      const contracts = field === 'contracts' ? value : optionsData.contracts;

      if (premium && contracts) {
        const totalRisk = premium * 100 * contracts;
        setFormData(prev => ({ ...prev, riskAmount: totalRisk }));
      }
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.symbol || formData.symbol.trim() === '') {
      errors.push('Symbol is required');
    }

    if (formData.market === MarketType.OPTIONS) {
      if (!optionsData.strikePrice) {
        errors.push(t('tradingJournal.validation.strikePriceRequired'));
      }
      if (!optionsData.expirationDate) {
        errors.push(t('tradingJournal.validation.expirationRequired'));
      }
      if (!optionsData.premium) {
        errors.push(t('tradingJournal.validation.optionPriceRequired'));
      }
    } else {
      if (!formData.entryPrice || formData.entryPrice <= 0) {
        errors.push(t('tradingJournal.validation.entryPriceRequired'));
      }
      if (!formData.positionSize || formData.positionSize <= 0) {
        errors.push(t('tradingJournal.validation.positionSizeRequired'));
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const errors = validateForm();
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Build options metadata string for notes if this is an options trade
      let optionsMetadata = '';
      if (formData.market === MarketType.OPTIONS) {
        optionsMetadata = `\n\n--- Options Details ---\n`;
        optionsMetadata += `Type: ${optionsData.optionType || 'N/A'}\n`;
        optionsMetadata += `Strike: $${optionsData.strikePrice || 0}\n`;
        optionsMetadata += `Option Price: $${optionsData.premium || 0}\n`;
        optionsMetadata += `Contracts: ${optionsData.contracts || 0}\n`;
        optionsMetadata += `Expiration: ${optionsData.expirationDate ? new Date(optionsData.expirationDate).toLocaleDateString() : 'N/A'}\n`;
        optionsMetadata += `Strategy: ${optionsData.optionStrategy || 'single'}\n`;

        if (optionsData.impliedVolatility) optionsMetadata += `IV: ${optionsData.impliedVolatility}%\n`;
      }

      const submitData: any = {
        symbol: formData.symbol,
        market: formData.market,
        direction: formData.direction,
        setup: formData.setupNotes || 'Manual Trade',
        entryPrice: formData.market === MarketType.OPTIONS ? (optionsData.premium || formData.entryPrice) : formData.entryPrice,
        positionSize: formData.market === MarketType.OPTIONS ? (optionsData.contracts || formData.positionSize) : formData.positionSize,
        stopLoss: formData.stopLoss || 0,
        takeProfit: formData.takeProfit || 0,
        entryTime: formData.entryTime || new Date(),
        tradeDate: formData.tradeDate || new Date(),
        riskAmount: formData.riskAmount || 0,
        riskPercentage: formData.riskPercentage || 1.5,
        confidence: formData.confidence || 7,
        emotionBefore: formData.emotionBefore || EmotionType.NEUTRAL,
        preTradeAnalysis: (formData.setupNotes || '') + optionsMetadata,
        postTradeNotes: formData.exitNotes || '',
        tags: formData.tags || [],
        screenshots: formData.screenshots || [],
      };

      await tradingJournalService.createTrade(submitData);
      router.push(paths.academy.tradingJournal.trades);
    } catch (err: any) {
      console.error('Failed to create trade:', err);
      setError(err.message || 'Failed to create trade');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(paths.academy.tradingJournal.trades);
  };

  const commonStrategies = [
    'Breakout', 'Pullback', 'Reversal', 'Momentum', 'Mean Reversion',
    'Gap Fill', 'Support/Resistance', 'Trend Following', 'Range Trading',
    'Scalping', 'Swing Trade', 'Position Trade', 'Day Trade',
  ];

  const optionStrategies = [
    { value: OptionStrategy.SINGLE, label: 'Single Option' },
    { value: OptionStrategy.COVERED_CALL, label: 'Covered Call' },
    { value: OptionStrategy.CASH_SECURED_PUT, label: 'Cash Secured Put' },
    { value: OptionStrategy.VERTICAL_SPREAD, label: 'Vertical Spread' },
    { value: OptionStrategy.IRON_CONDOR, label: 'Iron Condor' },
    { value: OptionStrategy.STRADDLE, label: 'Straddle' },
    { value: OptionStrategy.STRANGLE, label: 'Strangle' },
    { value: OptionStrategy.BUTTERFLY, label: 'Butterfly' },
    { value: OptionStrategy.CALENDAR, label: 'Calendar Spread' },
    { value: OptionStrategy.DIAGONAL, label: 'Diagonal Spread' },
  ];

  const allMarketOptions = [
    { value: MarketType.STOCKS, label: t('tradingJournal.markets.stocks') },
    { value: MarketType.OPTIONS, label: t('tradingJournal.markets.options') },
    { value: MarketType.FUTURES, label: t('tradingJournal.markets.futures') },
    { value: MarketType.FOREX, label: t('tradingJournal.markets.forex') },
    { value: MarketType.CRYPTO, label: t('tradingJournal.markets.crypto') },
  ];

  // Filter market options based on enabled markets from settings
  const marketOptions = allMarketOptions.filter((option) =>
    enabledMarkets.includes(option.value)
  );

  const timeframeOptions = [
    { value: '1m', label: '1 Minute' },
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '30m', label: '30 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1D', label: 'Daily' },
    { value: '1W', label: 'Weekly' },
    { value: '1M', label: 'Monthly' },
  ];

  const emotionOptions = Object.values(EmotionType).map(emotion => ({
    value: emotion,
    label: t(`tradingJournal.emotions.${emotion}`),
  }));

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: isDarkMode
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.5)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              <Button
                onClick={handleCancel}
                sx={{
                  minWidth: 44,
                  height: 44,
                  p: 0,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    transform: 'translateX(-2px)',
                    borderColor: theme.palette.primary.main,
                  }
                }}
              >
                <ArrowLeft size={20} />
              </Button>

              <Box flex={1}>
                <Typography variant="h4" fontWeight={700} mb={0.5}>
                  {t('tradingJournal.addTrade')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('tradingJournal.subtitle')}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<X size={20} />}
                  onClick={handleCancel}
                  size="large"
                  sx={{
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                    }
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<FloppyDisk size={20} />}
                  onClick={handleSubmit}
                  disabled={loading}
                  size="large"
                >
                  {loading ? t('common.loading') : t('common.save')}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Left Column - Main Trade Details */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={3}>
                {/* Basic Trade Information */}
                <Card sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Box sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ChartLine size={24} color={theme.palette.primary.main} />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {t('tradingJournal.tradeDetails')}
                    </Typography>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <CustomInput
                        label={t('tradingJournal.fields.symbol')}
                        value={formData.symbol}
                        onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
                        placeholder="AAPL"
                        required
                        icon={<CurrencyDollar size={20} />}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <CustomSelect
                        label={t('tradingJournal.fields.market')}
                        value={formData.market}
                        onChange={(value) => handleChange('market', value)}
                        options={marketOptions}
                        required
                        icon={<ChartBar size={20} />}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    {/* Trade Direction - Hidden for Options (auto-set based on CALL/PUT) */}
                    {formData.market !== MarketType.OPTIONS && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          {t('tradingJournal.fields.direction')}
                        </Typography>
                        <ToggleButtonGroup
                          value={formData.direction}
                          exclusive
                          onChange={(e, value) => value && handleChange('direction', value)}
                          fullWidth
                          sx={{
                            '& .MuiToggleButton-root': {
                              py: 1.5,
                              border: '1px solid',
                              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                              '&.Mui-selected': {
                                bgcolor: formData.direction === TradeDirection.LONG
                                  ? alpha(theme.palette.success.main, 0.15)
                                  : alpha(theme.palette.error.main, 0.15),
                                color: formData.direction === TradeDirection.LONG
                                  ? theme.palette.success.main
                                  : theme.palette.error.main,
                                borderColor: formData.direction === TradeDirection.LONG
                                  ? theme.palette.success.main
                                  : theme.palette.error.main,
                              }
                            }
                          }}
                        >
                          <ToggleButton value={TradeDirection.LONG}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TrendUp size={20} />
                              <Typography>{t('tradingJournal.fields.long')}</Typography>
                            </Stack>
                          </ToggleButton>
                          <ToggleButton value={TradeDirection.SHORT}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TrendDown size={20} />
                              <Typography>{t('tradingJournal.fields.short')}</Typography>
                            </Stack>
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <CustomDatePicker
                        label="Trade Date & Time"
                        value={dayjs(formData.entryTime)}
                        onChange={(value) => {
                          const date = value?.toDate();
                          handleChange('entryTime', date);
                          handleChange('tradeDate', date);
                        }}
                        dateTime
                        required
                      />
                    </Grid>
                  </Grid>
                </Card>

                {/* Options Specific Fields */}
                {formData.market === MarketType.OPTIONS && (
                  <Card sx={{ p: 3, border: '1px solid', borderColor: alpha(theme.palette.warning.main, 0.2) }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                      <Box sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ChartBar size={24} color={theme.palette.warning.main} />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {t('tradingJournal.optionsDetails')}
                      </Typography>
                    </Stack>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <CustomSelect
                          label="Option Strategy"
                          value={optionsData.optionStrategy}
                          onChange={(value) => handleOptionsChange('optionStrategy', value)}
                          options={optionStrategies}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          {t('tradingJournal.fields.optionType')}
                        </Typography>
                        <ToggleButtonGroup
                          value={optionsData.optionType}
                          exclusive
                          onChange={(e, value) => value && handleOptionsChange('optionType', value)}
                          fullWidth
                          sx={{
                            '& .MuiToggleButton-root': {
                              py: 1,
                              border: '1px solid',
                              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            }
                          }}
                        >
                          <ToggleButton value={OptionType.CALL} color="success">
                            CALL
                          </ToggleButton>
                          <ToggleButton value={OptionType.PUT} color="error">
                            PUT
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomDatePicker
                          label="Expiration Date"
                          value={optionsData.expirationDate ? dayjs(optionsData.expirationDate) : null}
                          onChange={(value) => handleOptionsChange('expirationDate', value?.toDate())}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomInput
                          label="Strike Price"
                          type="number"
                          value={optionsData.strikePrice || ''}
                          onChange={(e) => handleOptionsChange('strikePrice', parseFloat(e.target.value))}
                          required
                          icon={<CurrencyDollar size={20} />}
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomInput
                          label="Option Price"
                          type="number"
                          value={optionsData.premium || ''}
                          onChange={(e) => handleOptionsChange('premium', parseFloat(e.target.value))}
                          required
                          icon={<CurrencyDollar size={20} />}
                          helperText="Price you paid per share"
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomInput
                          label="Contracts"
                          type="number"
                          value={optionsData.contracts || 1}
                          onChange={(e) => handleOptionsChange('contracts', parseInt(e.target.value))}
                          required
                          icon={<Hash size={20} />}
                          helperText="1 contract = 100 shares"
                        />
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <CustomInput
                          label="Stock Price"
                          type="number"
                          value={optionsData.underlyingPrice || ''}
                          onChange={(e) => handleOptionsChange('underlyingPrice', parseFloat(e.target.value))}
                          icon={<CurrencyDollar size={20} />}
                          helperText="Current market price"
                        />
                      </Grid>
                    </Grid>
                  </Card>
                )}

                {/* Position & Pricing (for non-options) */}
                {formData.market !== MarketType.OPTIONS && (
                  <Card sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                      <Box sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CurrencyDollar size={24} color={theme.palette.success.main} />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        Position & Pricing
                      </Typography>
                    </Stack>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <CustomInput
                          label={t('tradingJournal.fields.positionSize')}
                          type="number"
                          value={formData.positionSize}
                          onChange={(e) => handleChange('positionSize', parseInt(e.target.value))}
                          required
                          helperText="Number of shares/contracts"
                          icon={<Hash size={20} />}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomInput
                          label={t('tradingJournal.fields.entryPrice')}
                          type="number"
                          value={formData.entryPrice || ''}
                          onChange={(e) => handleChange('entryPrice', parseFloat(e.target.value))}
                          required
                          icon={<CurrencyDollar size={20} />}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomInput
                          label="Position Value"
                          value={formatCurrency((formData.entryPrice || 0) * (formData.positionSize || 0))}
                          disabled
                          onChange={() => {}}
                          icon={<Wallet size={20} />}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                )}

                {/* Risk Management */}
                <Card sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Box sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Warning size={24} color={theme.palette.error.main} />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {t('tradingJournal.riskManagement')}
                    </Typography>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <CustomInput
                        label={t('tradingJournal.fields.stopLoss')}
                        type="number"
                        value={formData.stopLoss || ''}
                        onChange={(e) => handleChange('stopLoss', parseFloat(e.target.value))}
                        helperText={t('tradingJournal.fields.stopLossHelper')}
                        icon={<TrendDown size={20} />}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <CustomInput
                        label={t('tradingJournal.fields.takeProfit')}
                        type="number"
                        value={formData.takeProfit || ''}
                        onChange={(e) => handleChange('takeProfit', parseFloat(e.target.value))}
                        helperText={t('tradingJournal.fields.takeProfitHelper')}
                        icon={<Target size={20} />}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <CustomInput
                        label={t('tradingJournal.fields.totalRisk')}
                        value={formatCurrency(formData.riskAmount || 0)}
                        disabled
                        onChange={() => {}}
                        icon={<Warning size={20} />}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('tradingJournal.fields.riskPercentage')}: {formData.riskPercentage}%
                      </Typography>
                      <Slider
                        value={formData.riskPercentage}
                        onChange={(e, value) => handleChange('riskPercentage', value)}
                        min={0.1}
                        max={100}
                        step={0.1}
                        valueLabelDisplay="auto"
                        sx={{
                          color: (formData.riskPercentage || 0) > 5
                            ? theme.palette.error.main
                            : (formData.riskPercentage || 0) > 2
                            ? theme.palette.warning.main
                            : theme.palette.success.main,
                        }}
                      />
                      <Stack direction="row" justifyContent="space-between" mt={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          0.1% ({t('tradingJournal.fields.conservative')})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('tradingJournal.fields.accountSize')}: {formData.riskAmount && (formData.riskPercentage ?? 0) > 0
                            ? `$${((formData.riskAmount / ((formData.riskPercentage ?? 1) / 100))).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                            : '$0'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          100% ({t('tradingJournal.fields.maxRisk')})
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Stack>
            </Grid>

            {/* Right Column - Strategy & Analysis */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                {/* Trade Setup */}
                <Card sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Brain size={22} color={theme.palette.secondary.main} />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {t('tradingJournal.tradeSetup')}
                    </Typography>
                  </Stack>

                  <Stack spacing={3}>
                    <CustomInput
                      label={t('tradingJournal.fields.setupDescription')}
                      value={formData.setupNotes}
                      onChange={(e) => handleChange('setupNotes', e.target.value)}
                      multiline
                      rows={4}
                      placeholder={t('tradingJournal.fields.setupPlaceholder')}
                    />

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('tradingJournal.fields.confidenceLevel')}: {formData.confidence}/10
                      </Typography>
                      <Slider
                        value={formData.confidence}
                        onChange={(e, value) => handleChange('confidence', value)}
                        min={1}
                        max={10}
                        marks
                        valueLabelDisplay="auto"
                        sx={{
                          color: (formData.confidence || 0) >= 7
                            ? theme.palette.success.main
                            : (formData.confidence || 0) >= 5
                              ? theme.palette.warning.main
                              : theme.palette.error.main,
                        }}
                      />
                    </Box>
                  </Stack>
                </Card>

                {/* Emotional State */}
                <Card sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Heart size={22} color={theme.palette.info.main} />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {t('tradingJournal.emotionalState')}
                    </Typography>
                  </Stack>

                  <CustomSelect
                    label={t('tradingJournal.fields.emotionBefore')}
                    value={formData.emotionBefore || EmotionType.NEUTRAL}
                    onChange={(value) => handleChange('emotionBefore', value)}
                    options={emotionOptions}
                  />
                </Card>

                {/* Tags */}
                <Card sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Tag size={22} color={theme.palette.primary.main} />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      Tags & Notes
                    </Typography>
                  </Stack>

                  <CustomAutocomplete
                    label="Tags"
                    value={formData.tags || []}
                    onChange={(value) => handleChange('tags', value)}
                    options={['earnings', 'news', 'technical', 'fundamental', 'momentum', 'reversal', 'breakout']}
                    placeholder="Add tags..."
                    multiple
                  />
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}