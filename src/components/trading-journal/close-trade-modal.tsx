'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Alert,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
} from '@mui/material';
import {
  X,
  CheckCircle,
  CurrencyDollar,
  Calendar,
  TrendUp,
  TrendDown,
  Warning,
  Heart,
  Notebook,
  Target,
} from '@phosphor-icons/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { Trade, CloseTradeDto, ExitReason, EmotionType, MarketType } from '@/types/trading-journal';
import { tradingJournalService } from '@/services/trading-journal.service';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { CustomInput, CustomSelect } from '@/components/shared/CustomInput';
import { CustomDatePicker } from '@/components/shared/CustomDatePicker';

interface CloseTradeModalProps {
  open: boolean;
  trade: Trade | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CloseTradeModal({ open, trade, onClose, onSuccess }: CloseTradeModalProps) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { t } = useTranslation('academy');

  const [loading, setLoading] = useState(false);
  const [exitPrice, setExitPrice] = useState<number | ''>('');
  const [exitTime, setExitTime] = useState(dayjs());
  const [exitPremium, setExitPremium] = useState<number | ''>('');
  const [underlyingPriceAtExit, setUnderlyingPriceAtExit] = useState<number | ''>('');
  const [exitReason, setExitReason] = useState<ExitReason>(ExitReason.MANUAL_EXIT);
  const [exitNotes, setExitNotes] = useState('');
  const [exitEmotion, setExitEmotion] = useState<EmotionType>(EmotionType.NEUTRAL);
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [wouldRepeat, setWouldRepeat] = useState<boolean | null>(null);

  // Reset form when trade changes
  useEffect(() => {
    if (trade && open) {
      setExitPrice('');
      setExitTime(dayjs());
      setExitPremium('');
      setUnderlyingPriceAtExit('');
      setExitReason(ExitReason.MANUAL_EXIT);
      setExitNotes('');
      setExitEmotion(EmotionType.NEUTRAL);
      setLessonsLearned('');
      setWouldRepeat(null);
    }
  }, [trade, open]);

  if (!trade) return null;

  const isOptions = trade.market === MarketType.OPTIONS;

  // Calculate P&L in real-time
  const calculatePnL = () => {
    const price = isOptions ? Number(exitPremium) : Number(exitPrice);
    if (!price || !trade.entryPrice || !trade.positionSize) return null;

    const priceDiff =
      trade.direction === 'long' ? price - trade.entryPrice : trade.entryPrice - price;

    const grossPnl = priceDiff * trade.positionSize;
    const netPnl = grossPnl - (trade.commission || 0);

    return {
      gross: grossPnl,
      net: netPnl,
      rMultiple: trade.riskAmount ? netPnl / trade.riskAmount : 0,
      isWinner: netPnl > 0,
      percentage: (priceDiff / trade.entryPrice) * 100,
    };
  };

  const pnl = calculatePnL();

  const handleSubmit = async () => {
    // Validation
    if (isOptions && !exitPremium) {
      toast.error('Exit premium is required for options');
      return;
    }
    if (!isOptions && !exitPrice) {
      toast.error('Exit price is required');
      return;
    }
    if (wouldRepeat === null) {
      toast.error('Please indicate if you would repeat this trade');
      return;
    }

    try {
      setLoading(true);

      const closeData: CloseTradeDto = {
        exitPrice: isOptions ? Number(exitPremium) : Number(exitPrice),
        exitTime: exitTime.toDate(),
        exitReasonType: exitReason,
        exitReasonNotes: exitNotes || undefined,
        exitEmotionState: exitEmotion,
        lessonsLearnedOnExit: lessonsLearned || undefined,
        wouldRepeatTrade: wouldRepeat,
      };

      // Options-specific data
      if (isOptions) {
        closeData.exitPremium = Number(exitPremium);
        if (underlyingPriceAtExit) {
          closeData.underlyingPriceAtExit = Number(underlyingPriceAtExit);
        }
      }

      await tradingJournalService.closeTrade(trade._id, closeData);

      toast.success('Trade closed successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error closing trade:', error);
      toast.error(error.response?.data?.message || 'Failed to close trade');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const exitReasonOptions = [
    { value: ExitReason.HIT_STOP_LOSS, label: 'Hit Stop Loss' },
    { value: ExitReason.HIT_TAKE_PROFIT, label: 'Hit Take Profit' },
    { value: ExitReason.MANUAL_EXIT, label: 'Manual Exit' },
    { value: ExitReason.TIME_BASED_EXIT, label: 'Time-Based Exit' },
    { value: ExitReason.TRAILING_STOP, label: 'Trailing Stop' },
    { value: ExitReason.TECHNICAL_SIGNAL, label: 'Technical Signal' },
    { value: ExitReason.NEWS_EVENT, label: 'News Event' },
    { value: ExitReason.RISK_MANAGEMENT, label: 'Risk Management' },
    ...(isOptions ? [
      { value: ExitReason.EXPIRED_WORTHLESS, label: 'Expired Worthless' },
      { value: ExitReason.SOLD_FOR_PROFIT, label: 'Sold for Profit' },
      { value: ExitReason.SOLD_FOR_LOSS, label: 'Sold for Loss' },
      { value: ExitReason.EXERCISED, label: 'Exercised' },
      { value: ExitReason.ASSIGNED, label: 'Assigned' },
    ] : []),
  ];

  const emotionOptions = [
    { value: EmotionType.CONFIDENT, label: 'Confident' },
    { value: EmotionType.CALM, label: 'Calm' },
    { value: EmotionType.NEUTRAL, label: 'Neutral' },
    { value: EmotionType.ANXIOUS, label: 'Anxious' },
    { value: EmotionType.FEARFUL, label: 'Fearful' },
    { value: EmotionType.GREEDY, label: 'Greedy' },
    { value: EmotionType.FRUSTRATED, label: 'Frustrated' },
    { value: EmotionType.EXCITED, label: 'Excited' },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: isDarkMode ? 'background.paper' : 'background.paper',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.5)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${theme.palette.background.paper} 100%)`,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target size={24} color={theme.palette.primary.main} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Close Position
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {trade.symbol} • {trade.market.toUpperCase()} • {trade.direction.toUpperCase()}
                </Typography>
              </Box>
            </Stack>
            <Button
              onClick={onClose}
              sx={{
                minWidth: 40,
                height: 40,
                p: 0,
                borderRadius: 2,
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              }}
            >
              <X size={20} />
            </Button>
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Entry Summary */}
            <Alert
              severity="info"
              sx={{
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.info.main, 0.2),
              }}
            >
              <Typography variant="body2">
                <strong>Entry:</strong> {formatCurrency(trade.entryPrice)} on{' '}
                {new Date(trade.entryTime).toLocaleString()} • Position: {trade.positionSize}{' '}
                {isOptions ? 'contracts' : 'shares'}
              </Typography>
            </Alert>

            {/* Exit Price & Time */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.5) : 'background.paper',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CurrencyDollar size={20} color={theme.palette.success.main} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Exit Details
                </Typography>
              </Stack>

              <Grid container spacing={3}>
                {isOptions ? (
                  <>
                    <Grid item xs={12} md={4}>
                      <CustomInput
                        label="Option Price (Exit)"
                        type="number"
                        value={exitPremium}
                        onChange={(e) => setExitPremium(e.target.value ? parseFloat(e.target.value) : '')}
                        placeholder="e.g., 6.25"
                        required
                        helperText="Price you sold the option for (per share)"
                        icon={<CurrencyDollar size={20} />}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <CustomInput
                        label="Stock Price (at Exit)"
                        type="number"
                        value={underlyingPriceAtExit}
                        onChange={(e) => setUnderlyingPriceAtExit(e.target.value ? parseFloat(e.target.value) : '')}
                        placeholder="e.g., 185.50"
                        helperText="Stock market price when you closed"
                        icon={<CurrencyDollar size={20} />}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <CustomDatePicker
                        label="Exit Time"
                        value={exitTime}
                        onChange={(value) => setExitTime(value || dayjs())}
                        dateTime
                        required
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} md={6}>
                      <CustomInput
                        label="Exit Price"
                        type="number"
                        value={exitPrice}
                        onChange={(e) => setExitPrice(e.target.value ? parseFloat(e.target.value) : '')}
                        placeholder="e.g., 178.50"
                        required
                        icon={<CurrencyDollar size={20} />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomDatePicker
                        label="Exit Time"
                        value={exitTime}
                        onChange={(value) => setExitTime(value || dayjs())}
                        dateTime
                        required
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>

            {/* Real-time P&L Display */}
            {pnl && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: pnl.isWinner
                    ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`
                    : `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.15)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                  border: '2px solid',
                  borderColor: pnl.isWinner ? theme.palette.success.main : theme.palette.error.main,
                }}
              >
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      bgcolor: alpha(pnl.isWinner ? theme.palette.success.main : theme.palette.error.main, 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {pnl.isWinner ? (
                      <TrendUp size={32} color={theme.palette.success.main} />
                    ) : (
                      <TrendDown size={32} color={theme.palette.error.main} />
                    )}
                  </Box>
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary">
                      Projected Net P&L
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      color={pnl.isWinner ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(pnl.net)}
                    </Typography>
                    <Stack direction="row" spacing={2} mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        {pnl.percentage.toFixed(2)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        •
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {pnl.rMultiple.toFixed(2)}R
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            )}

            {/* Exit Reason */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.5) : 'background.paper',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Warning size={20} color={theme.palette.warning.main} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Exit Analysis
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <CustomSelect
                  label="Exit Reason"
                  value={exitReason}
                  onChange={(value) => setExitReason(value)}
                  options={exitReasonOptions}
                  required
                  icon={<Target size={20} />}
                />

                <CustomInput
                  label="Exit Notes"
                  value={exitNotes}
                  onChange={(e) => setExitNotes(e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Why did you exit at this price? What happened?"
                  icon={<Notebook size={20} />}
                />
              </Stack>
            </Paper>

            {/* Self-Reflection */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.5) : 'background.paper',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Heart size={20} color={theme.palette.info.main} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Self-Reflection
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <CustomInput
                  label="Lessons Learned"
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  multiline
                  rows={3}
                  placeholder="What did you learn from this trade? What will you do differently?"
                  icon={<Notebook size={20} />}
                />

                <CustomSelect
                  label="Emotion at Exit"
                  value={exitEmotion}
                  onChange={(value) => setExitEmotion(value)}
                  options={emotionOptions}
                  icon={<Heart size={20} />}
                />

                <Box>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    Would you repeat this trade? <span style={{ color: theme.palette.error.main }}>*</span>
                  </Typography>
                  <ToggleButtonGroup
                    value={wouldRepeat === null ? '' : wouldRepeat.toString()}
                    exclusive
                    onChange={(e, value) => value !== null && setWouldRepeat(value === 'true')}
                    fullWidth
                    sx={{
                      '& .MuiToggleButton-root': {
                        py: 1.5,
                        border: '1px solid',
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        '&.Mui-selected': {
                          bgcolor: wouldRepeat
                            ? alpha(theme.palette.success.main, 0.15)
                            : alpha(theme.palette.error.main, 0.15),
                          color: wouldRepeat
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          borderColor: wouldRepeat
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                        },
                      },
                    }}
                  >
                    <ToggleButton value="true">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircle size={20} />
                        <Typography>Yes, good setup</Typography>
                      </Stack>
                    </ToggleButton>
                    <ToggleButton value="false">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <X size={20} />
                        <Typography>No, won't repeat</Typography>
                      </Stack>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Box>

        {/* Footer Actions */}
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.5) : 'background.paper',
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outlined"
              size="large"
              sx={{
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
              disabled={loading || (!exitPrice && !exitPremium) || wouldRepeat === null}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle size={20} />}
            >
              {loading ? 'Closing Position...' : 'Close Position'}
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
}
