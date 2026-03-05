import {
  calculateSMA,
  calculateRSI,
  calculateMACD,
  getLatestValue,
} from './technical-indicators';
import type { SignalResult } from './types';

export function generateTradingSignal(
  symbol: string,
  prices: number[]
): SignalResult {
  if (prices.length < 50) {
    return {
      symbol,
      signal: 'HOLD',
      confidence: 0.5,
      indicators: {
        rsi: NaN,
        macd: NaN,
        macdSignal: NaN,
        smaGoldenCross: false,
      },
    };
  }

  // Calculate indicators
  const sma50 = calculateSMA(prices, 50);
  const sma200 = calculateSMA(prices, 200);
  const rsi = calculateRSI(prices, 14);
  const { macd, signal: macdSignal } = calculateMACD(prices);

  const latestPrice = prices[prices.length - 1];
  const latestRSI = getLatestValue(rsi);
  const latestMACD = getLatestValue(macd);
  const latestMACDSignal = getLatestValue(macdSignal);
  const latestSMA50 = getLatestValue(sma50);
  const latestSMA200 = getLatestValue(sma200);

  // Generate signals from individual indicators
  const signals: { signal: 'BUY' | 'SELL' | 'HOLD'; weight: number }[] = [];

  // SMA Golden Cross (50 > 200)
  if (!isNaN(latestSMA50) && !isNaN(latestSMA200)) {
    if (latestSMA50 > latestSMA200) {
      signals.push({ signal: 'BUY', weight: 1 });
    } else if (latestSMA50 < latestSMA200) {
      signals.push({ signal: 'SELL', weight: 1 });
    }
  }

  // RSI Signal
  if (!isNaN(latestRSI)) {
    if (latestRSI < 30) {
      signals.push({ signal: 'BUY', weight: 1 });
    } else if (latestRSI > 70) {
      signals.push({ signal: 'SELL', weight: 1 });
    } else {
      signals.push({ signal: 'HOLD', weight: 0.5 });
    }
  }

  // MACD Signal
  if (!isNaN(latestMACD) && !isNaN(latestMACDSignal)) {
    if (latestMACD > latestMACDSignal) {
      signals.push({ signal: 'BUY', weight: 1 });
    } else if (latestMACD < latestMACDSignal) {
      signals.push({ signal: 'SELL', weight: 1 });
    } else {
      signals.push({ signal: 'HOLD', weight: 0.5 });
    }
  }

  // Price vs SMA50 position
  if (!isNaN(latestSMA50)) {
    if (latestPrice > latestSMA50) {
      signals.push({ signal: 'BUY', weight: 0.5 });
    } else if (latestPrice < latestSMA50) {
      signals.push({ signal: 'SELL', weight: 0.5 });
    }
  }

  // Majority vote
  if (signals.length === 0) {
    return {
      symbol,
      signal: 'HOLD',
      confidence: 0.5,
      indicators: {
        rsi: latestRSI,
        macd: latestMACD,
        macdSignal: latestMACDSignal,
        smaGoldenCross: latestSMA50 > latestSMA200,
      },
    };
  }

  const buyWeight = signals
    .filter((s) => s.signal === 'BUY')
    .reduce((sum, s) => sum + s.weight, 0);
  const sellWeight = signals
    .filter((s) => s.signal === 'SELL')
    .reduce((sum, s) => sum + s.weight, 0);
  const holdWeight = signals
    .filter((s) => s.signal === 'HOLD')
    .reduce((sum, s) => sum + s.weight, 0);

  const totalWeight = buyWeight + sellWeight + holdWeight;
  const maxWeight = Math.max(buyWeight, sellWeight, holdWeight);
  const confidence = maxWeight / totalWeight;

  let finalSignal: 'BUY' | 'SELL' | 'HOLD';
  if (buyWeight > sellWeight && buyWeight > holdWeight) {
    finalSignal = 'BUY';
  } else if (sellWeight > buyWeight && sellWeight > holdWeight) {
    finalSignal = 'SELL';
  } else {
    finalSignal = 'HOLD';
  }

  return {
    symbol,
    signal: finalSignal,
    confidence: Math.min(confidence, 1),
    indicators: {
      rsi: latestRSI,
      macd: latestMACD,
      macdSignal: latestMACDSignal,
      smaGoldenCross: latestSMA50 > latestSMA200,
    },
  };
}
