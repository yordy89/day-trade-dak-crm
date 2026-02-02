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
import { Trade, CloseTradeDto, ExitReason, EmotionType, MarketType, OptionType } from '@/types/trading-journal';
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

  // For options: get the option type label (CALL/PUT)
  const getOptionLabel = () => {
    if (!isOptions) return trade.direction.toUpperCase();
    // For options, show CALL/PUT if available
    if (trade.optionType) {
      return trade.optionType.toUpperCase();
    }
    // Fallback: return empty if we don't know the type (avoid redundant "OPTION")
    return '';
  };

  // Calculate total investment for options
  const getTotalInvestment = () => {
    if (isOptions) {
      return trade.entryPrice * trade.positionSize * 100;
    }
    return trade.entryPrice * trade.positionSize;
  };

  // Calculate P&L in real-time
  const calculatePnL = () => {
    const price = isOptions ? Number(exitPremium) : Number(exitPrice);
    if (!price || !trade.entryPrice || !trade.positionSize) return null;

    // For OPTIONS: P&L is ALWAYS (exit - entry) because:
    // - You BUY an option (pay premium) and SELL to close (receive premium)
    // - Profit = What you received - What you paid = exit - entry
    // - This is true for BOTH calls and puts!
    //
    // For STOCKS: Use direction to determine P&L
    // - Long: profit when price goes up (exit - entry)
    // - Short: profit when price goes down (entry - exit)
    const priceDiff = isOptions
      ? price - trade.entryPrice  // Options: always exit - entry
      : (trade.direction === 'long' ? price - trade.entryPrice : trade.entryPrice - price);

    // For options, positionSize is number of contracts, each contract = 100 shares
    const contractMultiplier = isOptions ? 100 : 1;

    const grossPnl = priceDiff * trade.positionSize * contractMultiplier;
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
      toast.error(t('tradingJournal.closeModal.exitPremiumRequired'));
      return;
    }
    if (!isOptions && !exitPrice) {
      toast.error(t('tradingJournal.closeModal.exitPriceRequired'));
      return;
    }
    if (wouldRepeat === null) {
      toast.error(t('tradingJournal.validation.wouldRepeatRequired'));
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

      toast.success(t('tradingJournal.closeModal.tradeClosedSuccess'));
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error closing trade:', error);
      toast.error(error.response?.data?.message || t('tradingJournal.closeModal.failedToClose'));
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
    { value: ExitReason.MANUAL_EXIT, label: t('tradingJournal.closeModal.exitReasonManual') },
    { value: ExitReason.HIT_TAKE_PROFIT, label: t('tradingJournal.closeModal.exitReasonLimit') },
  ];

  const emotionOptions = [
    { value: EmotionType.CONFIDENT, label: t('tradingJournal.emotions.confident') },
    { value: EmotionType.CALM, label: t('tradingJournal.emotions.calm') },
    { value: EmotionType.NEUTRAL, label: t('tradingJournal.emotions.neutral') },
    { value: EmotionType.ANXIOUS, label: t('tradingJournal.emotions.anxious') },
    { value: EmotionType.FEARFUL, label: t('tradingJournal.emotions.fearful') },
    { value: EmotionType.GREEDY, label: t('tradingJournal.emotions.greedy') },
    { value: EmotionType.FRUSTRATED, label: t('tradingJournal.emotions.frustrated') },
    { value: EmotionType.EXCITED, label: t('tradingJournal.emotions.excited') },
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
            overflow: 'hidden',
            bgcolor: isDarkMode ? 'background.paper' : 'background.paper',
            boxShadow: `0 24px 48px ${alpha(theme.palette.primary.main, 0.15)}`,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            position: 'relative',
            background: isDarkMode
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha('#ffffff', 0.98)} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            },
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <Target size={26} color={theme.palette.primary.main} weight="duotone" />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  {t('tradingJournal.closeModal.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {trade.symbol} • {trade.market.toUpperCase()}{getOptionLabel() ? ` • ${getOptionLabel()}` : ''}
                </Typography>
              </Box>
            </Stack>
            <Button
              onClick={onClose}
              sx={{
                minWidth: 42,
                height: 42,
                p: 0,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                color: theme.palette.error.main,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.2),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.4)}`,
                  transform: 'scale(1.05)',
                },
              }}
            >
              <X size={20} weight="bold" />
            </Button>
          </Stack>
        </Box>

        {/* Content */}
        <Box
          sx={{
            p: 3,
            background: isDarkMode
              ? alpha(theme.palette.background.default, 0.5)
              : alpha(theme.palette.grey[50], 0.5),
            maxHeight: '65vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: alpha(theme.palette.primary.main, 0.2),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: alpha(theme.palette.primary.main, 0.3),
            },
          }}
        >
          <Stack spacing={3}>
            {/* Entry Summary */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.12)} 0%, ${alpha(theme.palette.info.main, 0.04)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.25)}`,
                borderLeft: `4px solid ${theme.palette.info.main}`,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.info.main, 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Target size={18} color={theme.palette.info.main} weight="duotone" />
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                  <strong>Entry:</strong> {formatCurrency(trade.entryPrice)}{isOptions ? '/share' : ''} on{' '}
                  {new Date(trade.entryTime).toLocaleString()} • Position: {trade.positionSize}{' '}
                  {isOptions ? 'contracts' : 'shares'}
                  {isOptions && (
                    <> • <strong>Total:</strong> {formatCurrency(getTotalInvestment())} ({trade.positionSize} × 100 × {formatCurrency(trade.entryPrice)})</>
                  )}
                </Typography>
              </Stack>
            </Paper>

            {/* Exit Price & Time */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
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
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CurrencyDollar size={20} color={theme.palette.primary.main} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {t('tradingJournal.closeModal.exitDetails')}
                </Typography>
              </Stack>

              <Grid container spacing={3}>
                {isOptions ? (
                  <>
                    <Grid item xs={12} md={4}>
                      <CustomInput
                        label={t('tradingJournal.fields.exitPriceOptions')}
                        type="number"
                        value={exitPremium}
                        onChange={(e) => setExitPremium(e.target.value ? parseFloat(e.target.value) : '')}
                        placeholder="e.g., 6.25"
                        required
                        helperText={t('tradingJournal.fields.exitPriceOptionsHelper')}
                        icon={<CurrencyDollar size={20} />}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <CustomInput
                        label={t('tradingJournal.fields.stockPriceExit')}
                        type="number"
                        value={underlyingPriceAtExit}
                        onChange={(e) => setUnderlyingPriceAtExit(e.target.value ? parseFloat(e.target.value) : '')}
                        placeholder="e.g., 185.50"
                        helperText={t('tradingJournal.fields.stockPriceExitHelper')}
                        icon={<CurrencyDollar size={20} />}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <CustomDatePicker
                        label={t('tradingJournal.closeModal.exitTime')}
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
                        label={t('tradingJournal.fields.exitPrice')}
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
                        label={t('tradingJournal.closeModal.exitTime')}
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
                      {t('tradingJournal.closeModal.projectedPnl')}
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
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
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
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Warning size={20} color={theme.palette.primary.main} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {t('tradingJournal.closeModal.exitAnalysis')}
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <CustomSelect
                  label={t('tradingJournal.fields.exitReason')}
                  value={exitReason}
                  onChange={(value) => setExitReason(value)}
                  options={exitReasonOptions}
                  required
                  icon={<Target size={20} />}
                />

                <CustomInput
                  label={t('tradingJournal.fields.exitNotes')}
                  value={exitNotes}
                  onChange={(e) => setExitNotes(e.target.value)}
                  multiline
                  rows={3}
                  placeholder={t('tradingJournal.fields.exitNotesPlaceholder')}
                  icon={<Notebook size={20} />}
                />
              </Stack>
            </Paper>

            {/* Self-Reflection */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                  : `linear-gradient(135deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
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
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Heart size={20} color={theme.palette.primary.main} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {t('tradingJournal.closeModal.selfReflection')}
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <CustomInput
                  label={t('tradingJournal.fields.lessonsLearned')}
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  multiline
                  rows={3}
                  placeholder={t('tradingJournal.fields.lessonsPlaceholder')}
                  icon={<Notebook size={20} />}
                />

                <CustomSelect
                  label={t('tradingJournal.fields.exitEmotion')}
                  value={exitEmotion}
                  onChange={(value) => setExitEmotion(value)}
                  options={emotionOptions}
                  icon={<Heart size={20} />}
                />

                <Box>
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                    {t('tradingJournal.fields.wouldRepeat')} <span style={{ color: theme.palette.error.main }}>*</span>
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
                        <Typography>{t('tradingJournal.closeModal.wouldRepeatYes')}</Typography>
                      </Stack>
                    </ToggleButton>
                    <ToggleButton value="false">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <X size={20} />
                        <Typography>{t('tradingJournal.closeModal.wouldRepeatNo')}</Typography>
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
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            background: isDarkMode
              ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
              : `linear-gradient(180deg, ${alpha('#ffffff', 0.98)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                borderRadius: 2,
                borderColor: alpha(theme.palette.text.secondary, 0.3),
                color: 'text.secondary',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: alpha(theme.palette.text.secondary, 0.5),
                  bgcolor: alpha(theme.palette.text.secondary, 0.05),
                },
              }}
            >
              {t('tradingJournal.closeModal.cancel')}
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading || (!exitPrice && !exitPremium) || wouldRepeat === null}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle size={20} weight="bold" />}
              sx={{
                px: 4,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: alpha(theme.palette.text.secondary, 0.2),
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? t('tradingJournal.closeModal.closing') : t('tradingJournal.closeModal.closeTradeButton')}
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
}
