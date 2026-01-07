'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Stack,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  ArrowLeft,
  Trash,
  TrendUp,
  TrendDown,
  CurrencyDollar,
  Target,
  Warning,
  Brain,
  Heart,
  ChartLine,
  CheckCircle,
} from '@phosphor-icons/react';
import { paths } from '@/paths';
import { tradingJournalService } from '@/services/trading-journal.service';
import { Trade, MarketType, TradeDirection, Feedback } from '@/types/trading-journal';
import { formatCurrency } from '@/utils/format';
import { useModuleAccess } from '@/hooks/use-module-access';
import { ModuleType } from '@/types/module-permission';
import { TradingJournalAccessDenied } from '@/components/trading-journal/access-denied';
import { CloseTradeModal } from '@/components/trading-journal/close-trade-modal';

export default function TradeDetailPage() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const tradeId = params.id as string;
  const { t } = useTranslation('academy');

  // All hooks must be called before any early returns
  const [loading, setLoading] = useState(true);
  const [trade, setTrade] = useState<Trade | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [closeModalOpen, setCloseModalOpen] = useState(false);

  const { hasAccess, loading: accessLoading } = useModuleAccess(ModuleType.TRADING_JOURNAL);

  useEffect(() => {
    if (hasAccess && !accessLoading && tradeId) {
      loadTradeData();
    }
  }, [tradeId, hasAccess, accessLoading]);

  // Early returns AFTER all hooks
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

  const loadTradeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tradeData, feedbackData] = await Promise.all([
        tradingJournalService.getTrade(tradeId),
        tradingJournalService.getTradeFeedback(tradeId).catch(() => []),
      ]);

      setTrade(tradeData);
      setFeedback(feedbackData);
    } catch (err: any) {
      console.error('Failed to load trade:', err);
      setError(err.response?.data?.message || 'Failed to load trade details');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(paths.academy.tradingJournal.trades);
  };

  const handleDelete = async () => {
    if (!confirm(t('tradingJournal.detail.confirmDelete'))) return;

    try {
      await tradingJournalService.deleteTrade(tradeId);
      router.push(paths.academy.tradingJournal.trades);
    } catch (err) {
      console.error('Failed to delete trade:', err);
      alert(t('tradingJournal.detail.failedToDelete'));
    }
  };

  const handleCloseTrade = () => {
    setCloseModalOpen(true);
  };

  const handleCloseSuccess = () => {
    setCloseModalOpen(false);
    loadTradeData();
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !trade) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || t('tradingJournal.detail.tradeNotFound')}
        </Alert>
        <Button startIcon={<ArrowLeft />} onClick={handleBack}>
          {t('tradingJournal.detail.backToTrades')}
        </Button>
      </Box>
    );
  }

  // Handle open trades that don't have P&L yet
  const isWinner = trade.netPnl ? trade.netPnl >= 0 : false;
  const profitColor = isWinner ? theme.palette.success.main : theme.palette.error.main;
  const hasExitData = !trade.isOpen && trade.exitPrice;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={handleBack}>
            <ArrowLeft />
          </IconButton>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h4" fontWeight={600}>
                {trade.symbol}
              </Typography>
              <Chip
                label={trade.market}
                size="small"
                sx={{
                  bgcolor: alpha(getMarketColor(trade.market), 0.1),
                  color: getMarketColor(trade.market),
                }}
              />
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
              {trade.isOpen ? (
                <Chip label={t('tradingJournal.status.open')} size="small" color="info" />
              ) : trade.isReviewed ? (
                <Chip
                  icon={<CheckCircle size={16} />}
                  label={t('tradingJournal.status.reviewed')}
                  size="small"
                  color="success"
                  variant="filled"
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
              {new Date(trade.tradeDate).toLocaleDateString()} • {trade.setup}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          {trade.isOpen && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircle />}
              onClick={handleCloseTrade}
            >
              {t('tradingJournal.detail.closePosition')}
            </Button>
          )}
          <IconButton onClick={handleDelete} color="error">
            <Trash />
          </IconButton>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* P&L Overview */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${alpha(profitColor, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.5)} 100%)`,
              border: `2px solid ${alpha(profitColor, 0.2)}`,
            }}
          >
            <Stack direction="row" spacing={4} alignItems="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  bgcolor: alpha(profitColor, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isWinner ? (
                  <TrendUp size={40} color={profitColor} />
                ) : (
                  <TrendDown size={40} color={profitColor} />
                )}
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  {trade.isOpen ? t('tradingJournal.detail.currentStatus') : t('tradingJournal.detail.netPnl')}
                </Typography>
                {trade.isOpen ? (
                  <Typography variant="h3" fontWeight={700} color="info.main">
                    {t('tradingJournal.status.open').toUpperCase()}
                  </Typography>
                ) : (
                  <Typography variant="h3" fontWeight={700} color={profitColor}>
                    {formatCurrency(trade.netPnl || 0)}
                  </Typography>
                )}
                {hasExitData && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {trade.pnlPercentage?.toFixed(2) || '0.00'}% • {trade.rMultiple?.toFixed(2) || '0.00'}R
                  </Typography>
                )}
              </Box>
              {hasExitData && (
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('tradingJournal.fields.entryPrice')}
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatCurrency(trade.entryPrice)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('tradingJournal.fields.exitPrice')}
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatCurrency(trade.exitPrice || 0)}
                    </Typography>
                  </Box>
                </Stack>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Trade Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              {t('tradingJournal.tradeDetails')}
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {t('tradingJournal.fields.entryTime')}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(trade.entryTime).toLocaleString()}
                </Typography>
              </Stack>
              {trade.exitTime && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {t('tradingJournal.fields.exitTime')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(trade.exitTime).toLocaleString()}
                  </Typography>
                </Stack>
              )}
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {t('tradingJournal.fields.positionSize')}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {trade.positionSize} {trade.market === MarketType.OPTIONS ? t('tradingJournal.detail.contracts') : t('tradingJournal.detail.shares')}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {t('tradingJournal.fields.entryPrice')} {trade.market === MarketType.OPTIONS && t('tradingJournal.detail.perShare')}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatCurrency(trade.entryPrice)}
                </Typography>
              </Stack>
              {trade.market === MarketType.OPTIONS && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {t('tradingJournal.detail.totalInvestment')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(trade.entryPrice * trade.positionSize * 100)}
                  </Typography>
                </Stack>
              )}
              {hasExitData && trade.exitPrice && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {t('tradingJournal.fields.exitPrice')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(trade.exitPrice)}
                  </Typography>
                </Stack>
              )}
              {trade.holdingTime && (
                <>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      {t('tradingJournal.detail.holdingTime')}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {trade.holdingTime} {t('tradingJournal.detail.minutes')}
                    </Typography>
                  </Stack>
                </>
              )}
            </Stack>
          </Card>
        </Grid>

        {/* Risk Management */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              {t('tradingJournal.riskManagement')}
            </Typography>
            <Stack spacing={2}>
              {trade.stopLoss !== undefined && trade.stopLoss !== null && trade.stopLoss > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {t('tradingJournal.fields.stopLoss')} {trade.market === MarketType.OPTIONS && t('tradingJournal.detail.perShare')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(trade.stopLoss)}
                  </Typography>
                </Stack>
              )}
              {trade.takeProfit !== undefined && trade.takeProfit !== null && trade.takeProfit > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {t('tradingJournal.fields.takeProfit')} {trade.market === MarketType.OPTIONS && t('tradingJournal.detail.perShare')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(trade.takeProfit)}
                  </Typography>
                </Stack>
              )}
              {(trade.riskAmount || trade.riskPercentage) && <Divider />}
              {trade.riskAmount !== undefined && trade.riskAmount !== null && trade.riskAmount > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {t('tradingJournal.fields.riskAmount')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(trade.riskAmount)}
                  </Typography>
                </Stack>
              )}
              {trade.riskPercentage !== undefined && trade.riskPercentage !== null && trade.riskPercentage > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {t('tradingJournal.fields.riskPercentage')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {trade.riskPercentage}%
                  </Typography>
                </Stack>
              )}
              {hasExitData && trade.rMultiple !== undefined && trade.rMultiple !== null && (
                <>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      {t('tradingJournal.fields.rMultiple')}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={trade.rMultiple >= 0 ? 'success.main' : 'error.main'}
                    >
                      {trade.rMultiple.toFixed(2)}R
                    </Typography>
                  </Stack>
                </>
              )}
              {trade.confidence !== undefined && trade.confidence !== null && trade.confidence > 0 && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {t('tradingJournal.fields.confidenceLevel')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {trade.confidence}/10
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Card>
        </Grid>

        {/* Trade Analysis */}
        {trade.preTradeAnalysis && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Brain size={24} color={theme.palette.primary.main} />
                <Typography variant="h6" fontWeight={600}>
                  {t('tradingJournal.detail.preTradeAnalysis')}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {trade.preTradeAnalysis}
              </Typography>
            </Card>
          </Grid>
        )}

        {trade.postTradeNotes && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <ChartLine size={24} color={theme.palette.secondary.main} />
                <Typography variant="h6" fontWeight={600}>
                  {t('tradingJournal.detail.postTradeNotes')}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {trade.postTradeNotes}
              </Typography>
            </Card>
          </Grid>
        )}

        {/* Exit Analysis */}
        {trade.exitReasonType && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                {t('tradingJournal.detail.exitAnalysis')}
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('tradingJournal.detail.exitReason')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {trade.exitReasonType.replace(/_/g, ' ').toUpperCase()}
                  </Typography>
                </Box>
                {trade.exitReasonNotes && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('tradingJournal.detail.notes')}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {trade.exitReasonNotes}
                    </Typography>
                  </Box>
                )}
                {trade.lessonsLearnedOnExit && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('tradingJournal.detail.lessonsLearned')}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {trade.lessonsLearnedOnExit}
                    </Typography>
                  </Box>
                )}
                {trade.wouldRepeatTrade !== undefined && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('tradingJournal.detail.wouldRepeat')}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={trade.wouldRepeatTrade ? 'success.main' : 'warning.main'}
                    >
                      {trade.wouldRepeatTrade ? t('tradingJournal.detail.yes') : t('tradingJournal.detail.no')}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Card>
          </Grid>
        )}

        {/* Emotional States */}
        {(trade.emotionBefore || trade.emotionDuring || trade.emotionAfter || trade.exitEmotionState) && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Heart size={24} color={theme.palette.info.main} />
                <Typography variant="h6" fontWeight={600}>
                  {t('tradingJournal.emotionalState')}
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {trade.emotionBefore && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('tradingJournal.detail.beforeTrade')}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} textTransform="capitalize">
                        {trade.emotionBefore}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {trade.emotionDuring && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('tradingJournal.detail.duringTrade')}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} textTransform="capitalize">
                        {trade.emotionDuring}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {trade.emotionAfter && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('tradingJournal.detail.afterTrade')}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} textTransform="capitalize">
                        {trade.emotionAfter}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {trade.exitEmotionState && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('tradingJournal.detail.atExit')}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} textTransform="capitalize">
                        {trade.exitEmotionState}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>
          </Grid>
        )}

        {/* Tags */}
        {trade.tags && trade.tags.length > 0 && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                {t('tradingJournal.detail.tags')}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {trade.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Stack>
            </Card>
          </Grid>
        )}

        {/* Mentor Feedback */}
        {feedback.length > 0 && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={3}>
                {t('tradingJournal.detail.mentorFeedback')}
              </Typography>
              {feedback.map((fb, index) => (
                <Box key={index} sx={{ mb: index < feedback.length - 1 ? 3 : 0 }}>
                  <Stack spacing={2}>
                    {fb.strengths && fb.strengths.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="success.main" gutterBottom>
                          {t('tradingJournal.detail.strengths')}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {fb.strengths.map((strength, i) => (
                            <Chip
                              key={i}
                              label={strength}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                    {fb.improvements && fb.improvements.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="warning.main" gutterBottom>
                          {t('tradingJournal.detail.areasForImprovement')}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {fb.improvements.map((improvement, i) => (
                            <Chip
                              key={i}
                              label={improvement}
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                    {fb.entryAnalysis && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {t('tradingJournal.detail.entryAnalysis')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fb.entryAnalysis}
                        </Typography>
                      </Box>
                    )}
                    {fb.exitAnalysis && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {t('tradingJournal.detail.exitAnalysis')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fb.exitAnalysis}
                        </Typography>
                      </Box>
                    )}
                    {fb.recommendations && fb.recommendations.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="primary.main" gutterBottom>
                          {t('tradingJournal.detail.recommendations')}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {fb.recommendations.map((rec, i) => (
                            <Chip
                              key={i}
                              label={rec}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                  {index < feedback.length - 1 && <Divider sx={{ my: 3 }} />}
                </Box>
              ))}
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Close Trade Modal */}
      <CloseTradeModal
        open={closeModalOpen}
        trade={trade}
        onClose={() => setCloseModalOpen(false)}
        onSuccess={handleCloseSuccess}
      />
    </Box>
  );
}
