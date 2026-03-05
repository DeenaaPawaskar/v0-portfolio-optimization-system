export function calculateSMA(prices: number[], period: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sum += prices[j];
      }
      result.push(sum / period);
    }
  }
  
  return result;
}

export function calculateEMA(prices: number[], period: number): number[] {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Calculate initial SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  let ema = sum / period;
  result[period - 1] = ema;
  
  // Calculate EMA for remaining prices
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * multiplier + ema * (1 - multiplier);
    result.push(ema);
  }
  
  // Fill initial NaN values
  for (let i = 0; i < period - 1; i++) {
    result.unshift(NaN);
  }
  
  return result;
}

export function calculateRSI(prices: number[], period: number = 14): number[] {
  const result: number[] = [];
  const changes: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }
  
  for (let i = 0; i < changes.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
      continue;
    }
    
    let gains = 0;
    let losses = 0;
    
    for (let j = i - period + 1; j <= i; j++) {
      if (changes[j] > 0) {
        gains += changes[j];
      } else {
        losses += Math.abs(changes[j]);
      }
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      result.push(rsi);
    }
  }
  
  result.unshift(NaN);
  return result;
}

export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: number[]; signal: number[]; histogram: number[] } {
  const ema12 = calculateEMA(prices, fastPeriod);
  const ema26 = calculateEMA(prices, slowPeriod);
  
  const macd: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (isNaN(ema12[i]) || isNaN(ema26[i])) {
      macd.push(NaN);
    } else {
      macd.push(ema12[i] - ema26[i]);
    }
  }
  
  const signal = calculateEMA(macd.filter(x => !isNaN(x)), signalPeriod);
  
  // Pad signal line to match MACD length
  const paddedSignal: number[] = [];
  let signalIdx = 0;
  for (let i = 0; i < macd.length; i++) {
    if (isNaN(macd[i])) {
      paddedSignal.push(NaN);
    } else {
      if (signalIdx < signal.length) {
        paddedSignal.push(signal[signalIdx]);
        signalIdx++;
      } else {
        paddedSignal.push(NaN);
      }
    }
  }
  
  const histogram: number[] = [];
  for (let i = 0; i < macd.length; i++) {
    if (isNaN(macd[i]) || isNaN(paddedSignal[i])) {
      histogram.push(NaN);
    } else {
      histogram.push(macd[i] - paddedSignal[i]);
    }
  }
  
  return { macd, signal: paddedSignal, histogram };
}

export function getLatestValue(values: number[]): number {
  for (let i = values.length - 1; i >= 0; i--) {
    if (!isNaN(values[i])) {
      return values[i];
    }
  }
  return NaN;
}
