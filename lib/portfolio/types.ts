export interface Stock {
  symbol: string;
  name: string;
  sector: string;
}

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  prices: number[];
  dates: string[];
  signals: {
    sma50: number[];
    sma200: number[];
    rsi: number[];
    macd: number[];
    signal: number[];
  };
}

export interface SignalResult {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  indicators: {
    rsi: number;
    macd: number;
    macdSignal: number;
    smaGoldenCross: boolean;
  };
}

export interface OptimizationResult {
  allocations: {
    symbol: string;
    allocation: number;
    amount: number;
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
  }[];
  metrics: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
  };
  efficientFrontier: Array<{
    volatility: number;
    return: number;
  }>;
  currentPrices: Record<string, number>;
  signals: Record<string, SignalResult>;
}

export interface PortfolioRequest {
  stocks: string[];
  investmentAmount: number;
}
