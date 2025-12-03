'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    if (!confirm('Are you sure you want to delete this trade?')) return;

    try {
      await tradingJournalService.deleteTrade(tradeId);
      router.push(paths.academy.tradingJournal.trades);
    } catch (err) {
      console.error('Failed to delete trade:', err);
      alert('Failed to delete trade');
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
          {error || 'Trade not found'}
        </Alert>
        <Button startIcon={<ArrowLeft />} onClick={handleBack}>
          Back to Trades
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
                label={trade.direction}
                size="small"
                variant="outlined"
                color={trade.direction === TradeDirection.LONG ? 'success' : 'error'}
              />
              {trade.isOpen && (
                <Chip label="Open" size="small" color="info" />
              )}
              {trade.isReviewed && (
                <Chip
                  icon={<CheckCircle size={16} />}
                  label="Reviewed"
                  size="small"
                  color="success"
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
              Close Position
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
                  {trade.isOpen ? 'Current Status' : 'Net Profit/Loss'}
                </Typography>
                {trade.isOpen ? (
                  <Typography variant="h3" fontWeight={700} color="info.main">
                    OPEN
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
                      Entry Price
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {formatCurrency(trade.entryPrice)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Exit Price
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
              Trade Details
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Entry Time
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(trade.entryTime).toLocaleString()}
                </Typography>
              </Stack>
              {trade.exitTime && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Exit Time
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(trade.exitTime).toLocaleString()}
                  </Typography>
                </Stack>
              )}
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Position Size
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {trade.positionSize} {trade.market === MarketType.OPTIONS ? 'contracts' : 'shares'}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Entry Price
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatCurrency(trade.entryPrice)}
                </Typography>
              </Stack>
              {hasExitData && trade.exitPrice && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Exit Price
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
                      Holding Time
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {trade.holdingTime} minutes
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
              Risk Management
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Stop Loss
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatCurrency(trade.stopLoss)}
                </Typography>
              </Stack>
              {trade.takeProfit && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Take Profit
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(trade.takeProfit)}
                  </Typography>
                </Stack>
              )}
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Risk Amount
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatCurrency(trade.riskAmount)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Risk Percentage
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {trade.riskPercentage}%
                </Typography>
              </Stack>
              {hasExitData && trade.rMultiple !== undefined && trade.rMultiple !== null && (
                <>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      R-Multiple
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
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Confidence Level
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {trade.confidence}/10
                </Typography>
              </Stack>
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
                  Pre-Trade Analysis
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
                  Post-Trade Notes
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
                Exit Analysis
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Exit Reason
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {trade.exitReasonType.replace(/_/g, ' ').toUpperCase()}
                  </Typography>
                </Box>
                {trade.exitReasonNotes && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Notes
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {trade.exitReasonNotes}
                    </Typography>
                  </Box>
                )}
                {trade.lessonsLearnedOnExit && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Lessons Learned
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {trade.lessonsLearnedOnExit}
                    </Typography>
                  </Box>
                )}
                {trade.wouldRepeatTrade !== undefined && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Would Repeat?
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={trade.wouldRepeatTrade ? 'success.main' : 'warning.main'}
                    >
                      {trade.wouldRepeatTrade ? 'Yes' : 'No'}
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
                  Emotional State
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                {trade.emotionBefore && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Before Trade
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
                        During Trade
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
                        After Trade
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
                        At Exit
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
                Tags
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
                Mentor Feedback
              </Typography>
              {feedback.map((fb, index) => (
                <Box key={index} sx={{ mb: index < feedback.length - 1 ? 3 : 0 }}>
                  <Stack spacing={2}>
                    {fb.strengths && fb.strengths.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="success.main" gutterBottom>
                          Strengths
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
                          Areas for Improvement
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
                          Entry Analysis
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fb.entryAnalysis}
                        </Typography>
                      </Box>
                    )}
                    {fb.exitAnalysis && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Exit Analysis
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fb.exitAnalysis}
                        </Typography>
                      </Box>
                    )}
                    {fb.recommendations && fb.recommendations.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="primary.main" gutterBottom>
                          Recommendations
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
