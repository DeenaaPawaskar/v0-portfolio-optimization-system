import type { OptimizationResult } from './types';
import { generateTradingSignal } from './signals';

export interface PriceData {
  symbol: string;
  prices: number[];
  currentPrice: number;
}

export function calculateReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
}

export function calculateCovarianceMatrix(
  returnsSeries: number[][]
): number[][] {
  const n = returnsSeries.length;
  const m = returnsSeries[0].length;

  // Calculate means
  const means = returnsSeries.map(
    (series) => series.reduce((a, b) => a + b, 0) / m
  );

  // Calculate covariance matrix
  const cov: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < m; k++) {
        sum += (returnsSeries[i][k] - means[i]) * (returnsSeries[j][k] - means[j]);
      }
      cov[i][j] = sum / m;
    }
  }

  return cov;
}

export function generateRandomAllocation(n: number): number[] {
  const allocation = Array(n)
    .fill(0)
    .map(() => Math.random());
  const sum = allocation.reduce((a, b) => a + b, 0);
  return allocation.map((x) => x / sum);
}

export function calculatePortfolioReturn(
  allocation: number[],
  expectedReturns: number[]
): number {
  return allocation.reduce((sum, w, i) => sum + w * expectedReturns[i], 0);
}

export function calculatePortfolioVolatility(
  allocation: number[],
  covMatrix: number[][]
): number {
  let variance = 0;
  for (let i = 0; i < allocation.length; i++) {
    for (let j = 0; j < allocation.length; j++) {
      variance += allocation[i] * allocation[j] * covMatrix[i][j];
    }
  }
  return Math.sqrt(Math.max(variance, 0));
}

export function optimizePortfolio(
  priceData: PriceData[],
  rfRate: number = 0.06
): {
  allocation: number[];
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  efficientFrontier: Array<{ volatility: number; return: number }>;
} {
  const n = priceData.length;

  // Calculate returns
  const returnsSeries = priceData.map((p) => calculateReturns(p.prices));
  const expectedReturns = returnsSeries.map(
    (r) => r.reduce((a, b) => a + b, 0) / r.length
  );

  // Calculate covariance matrix
  const covMatrix = calculateCovarianceMatrix(returnsSeries);

  // Generate efficient frontier via Monte Carlo
  const frontierPoints: Array<{
    volatility: number;
    return: number;
    allocation: number[];
  }> = [];
  const numSimulations = 10000;

  for (let sim = 0; sim < numSimulations; sim++) {
    const allocation = generateRandomAllocation(n);
    const expectedReturn = calculatePortfolioReturn(allocation, expectedReturns);
    const volatility = calculatePortfolioVolatility(allocation, covMatrix);

    frontierPoints.push({ volatility, return: expectedReturn, allocation });
  }

  // Sort by Sharpe ratio
  const sharpePoints = frontierPoints.map((p) => ({
    ...p,
    sharpeRatio: (p.return - rfRate) / (p.volatility + 1e-6),
  }));

  sharpePoints.sort((a, b) => b.sharpeRatio - a.sharpeRatio);
  const optimalPoint = sharpePoints[0];

  // Refine with coordinate descent
  let refined = [...optimalPoint.allocation];
  for (let iter = 0; iter < 20; iter++) {
    for (let i = 0; i < n; i++) {
      let bestAlloc = [...refined];
      let bestSharpe = (
        (calculatePortfolioReturn(refined, expectedReturns) - rfRate) /
        (calculatePortfolioVolatility(refined, covMatrix) + 1e-6)
      );

      for (const delta of [-0.01, -0.005, 0.005, 0.01]) {
        const candidate = [...refined];
        candidate[i] += delta;

        // Normalize
        const sum = candidate.reduce((a, b) => a + b, 0);
        for (let j = 0; j < n; j++) {
          candidate[j] /= sum;
          candidate[j] = Math.max(0, Math.min(1, candidate[j]));
        }

        const sumAfter = candidate.reduce((a, b) => a + b, 0);
        for (let j = 0; j < n; j++) {
          candidate[j] /= sumAfter;
        }

        const candSharpe = (
          (calculatePortfolioReturn(candidate, expectedReturns) - rfRate) /
          (calculatePortfolioVolatility(candidate, covMatrix) + 1e-6)
        );

        if (candSharpe > bestSharpe) {
          bestSharpe = candSharpe;
          bestAlloc = candidate;
        }
      }

      refined = bestAlloc;
    }
  }

  const finalReturn = calculatePortfolioReturn(refined, expectedReturns);
  const finalVolatility = calculatePortfolioVolatility(refined, covMatrix);
  const finalSharpe = (finalReturn - rfRate) / (finalVolatility + 1e-6);

  // Build efficient frontier
  const uniqueVolatilities = new Map<number, number>();
  for (const point of frontierPoints) {
    const vol = Math.round(point.volatility * 10000) / 10000;
    if (!uniqueVolatilities.has(vol) || uniqueVolatilities.get(vol)! < point.return) {
      uniqueVolatilities.set(vol, point.return);
    }
  }

  const efficientFrontier = Array.from(uniqueVolatilities.entries())
    .map(([vol, ret]) => ({ volatility: vol, return: ret }))
    .sort((a, b) => a.volatility - b.volatility);

  return {
    allocation: refined,
    expectedReturn: finalReturn,
    volatility: finalVolatility,
    sharpeRatio: finalSharpe,
    efficientFrontier,
  };
}
