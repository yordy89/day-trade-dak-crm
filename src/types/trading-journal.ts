export enum MarketType {
  STOCKS = 'stocks',
  OPTIONS = 'options',
  FUTURES = 'futures',
  FOREX = 'forex',
  CRYPTO = 'crypto',
}

export enum TradeDirection {
  LONG = 'long',
  SHORT = 'short',
}

export enum EmotionType {
  CONFIDENT = 'confident',
  ANXIOUS = 'anxious',
  GREEDY = 'greedy',
  FEARFUL = 'fearful',
  NEUTRAL = 'neutral',
  EXCITED = 'excited',
  FRUSTRATED = 'frustrated',
}

export enum TimeFilter {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  ALL = 'all',
  CUSTOM = 'custom',
}

export enum TradeResult {
  WINNERS = 'winners',
  LOSERS = 'losers',
  BREAKEVEN = 'breakeven',
  ALL = 'all',
}

export enum FeedbackRating {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export interface Trade {
  _id: string;
  userId: string;
  tradeDate: Date;
  symbol: string;
  market: MarketType;
  entryTime: Date;
  entryPrice: number;
  positionSize: number;
  direction: TradeDirection;
  exitTime?: Date;
  exitPrice?: number;
  exitReason?: string;
  stopLoss: number;
  takeProfit?: number;
  riskAmount: number;
  riskPercentage: number;
  setup: string;
  strategy: string;
  timeframe: string;
  confidence: number;
  commission: number;
  emotionBefore?: EmotionType;
  emotionDuring?: EmotionType;
  emotionAfter?: EmotionType;
  preTradeAnalysis?: string;
  postTradeNotes?: string;
  lessonsLearned?: string;
  mistakes?: string[];
  tags?: string[];
  screenshots?: string[];
  isOpen: boolean;
  pnl: number;
  netPnl: number;
  rMultiple: number;
  isWinner: boolean;
  holdingTime?: number;
  isReviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTradeDto {
  tradeDate: Date;
  symbol: string;
  market: MarketType;
  entryTime: Date;
  entryPrice: number;
  positionSize: number;
  direction: TradeDirection;
  exitTime?: Date;
  exitPrice?: number;
  exitReason?: string;
  stopLoss: number;
  takeProfit?: number;
  riskAmount: number;
  riskPercentage: number;
  setup: string;
  strategy: string;
  timeframe: string;
  confidence: number;
  commission?: number;
  emotionBefore?: EmotionType;
  emotionDuring?: EmotionType;
  emotionAfter?: EmotionType;
  preTradeAnalysis?: string;
  postTradeNotes?: string;
  lessonsLearned?: string;
  mistakes?: string[];
  tags?: string[];
  screenshots?: string[];
}

export interface UpdateTradeDto extends Partial<CreateTradeDto> {}

export interface Feedback {
  _id: string;
  tradeId: string;
  mentorId: string;
  studentId: string;
  strengths?: string[];
  improvements?: string[];
  patternsIdentified?: string[];
  entryAnalysis?: string;
  exitAnalysis?: string;
  riskManagementReview?: string;
  psychologyNotes?: string;
  setupQualityReview?: string;
  recommendations?: string[];
  suggestedResources?: string[];
  actionItems?: string[];
  overallRating: FeedbackRating;
  riskManagementRating: FeedbackRating;
  executionRating: FeedbackRating;
  psychologyRating?: FeedbackRating;
  analysisRating?: FeedbackRating;
  requiresFollowUp?: boolean;
  followUpDate?: Date;
  isPinned?: boolean;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeedbackDto {
  tradeId: string;
  studentId: string;
  strengths?: string[];
  improvements?: string[];
  patternsIdentified?: string[];
  entryAnalysis?: string;
  exitAnalysis?: string;
  riskManagementReview?: string;
  psychologyNotes?: string;
  setupQualityReview?: string;
  recommendations?: string[];
  suggestedResources?: string[];
  actionItems?: string[];
  overallRating: FeedbackRating;
  riskManagementRating: FeedbackRating;
  executionRating: FeedbackRating;
  psychologyRating?: FeedbackRating;
  analysisRating?: FeedbackRating;
  requiresFollowUp?: boolean;
  followUpDate?: Date;
  isPinned?: boolean;
}

export interface FilterTradesDto {
  page?: number;
  limit?: number;
  timeFilter?: TimeFilter;
  startDate?: Date;
  endDate?: Date;
  symbol?: string;
  market?: MarketType;
  direction?: TradeDirection;
  strategy?: string;
  setup?: string;
  result?: TradeResult;
  openOnly?: boolean;
  reviewedOnly?: boolean;
  tags?: string[];
  minRMultiple?: number;
  maxRMultiple?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TradeStatistics {
  totalTrades: number;
  winners: number;
  losers: number;
  totalPnl: number;
  totalGross: number;
  totalCommission: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  avgRMultiple: number;
  avgHoldingTime: number;
  totalVolume: number;
  winRate: number;
  profitFactor: number;
  expectancy: number;
  strategyStats: Array<{
    _id: string;
    trades: number;
    pnl: number;
    winRate: number;
  }>;
  marketStats: Array<{
    _id: string;
    trades: number;
    pnl: number;
  }>;
}

export interface DailyPnl {
  date: string;
  pnl: number;
  cumulative: number;
  trades: number;
  winners: number;
}

export interface TradesResponse {
  trades: Trade[];
  total: number;
  page: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Analytics extends TradeStatistics {
  pnlChange?: number;
  maxDrawdown?: number;
  maxDrawdownPercent?: number;
  sharpeRatio?: number;
  avgWinner?: number;
  avgLoser?: number;
  performanceByStrategy?: Array<{
    name: string;
    trades: number;
    pnl: number;
    winRate: number;
  }>;
  performanceByMarket?: Array<{
    market: string;
    trades: number;
    pnl: number;
    winRate: number;
  }>;
  bestTrades?: Trade[];
  worstTrades?: Trade[];
}