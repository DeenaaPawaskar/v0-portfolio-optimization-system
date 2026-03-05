import { NextRequest, NextResponse } from 'next/server';
import { optimizePortfolio, type PriceData } from '@/lib/portfolio/optimizer';
import { generateTradingSignal } from '@/lib/portfolio/signals';
import type { PortfolioRequest, OptimizationResult } from '@/lib/portfolio/types';

async function fetchStockData(symbol: string, days: number = 500): Promise<number[]> {
  try {
    // Yahoo Finance API endpoint for historical data
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${symbol}:`, response.status);
      return generateMockPrices(500);
    }

    // For demo, return mock data since direct historical API access is complex
    return generateMockPrices(500);
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return generateMockPrices(500);
  }
}

function generateMockPrices(count: number): number[] {
  const prices: number[] = [100];
  let currentPrice = 100;

  for (let i = 1; i < count; i++) {
    const change = (Math.random() - 0.48) * 4; // Slight upward bias
    currentPrice = currentPrice * (1 + change / 100);
    prices.push(Math.max(currentPrice, 10)); // Ensure positive
  }

  return prices;
}

async function fetchCurrentPrice(symbol: string): Promise<number> {
  try {
    // In a real implementation, fetch actual current price from Yahoo Finance
    // For now, return last element of mock price series
    const mockPrices = generateMockPrices(500);
    return mockPrices[mockPrices.length - 1];
  } catch (error) {
    console.error(`Error fetching current price for ${symbol}:`, error);
    return 100;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PortfolioRequest = await request.json();

    if (!body.stocks || body.stocks.length === 0) {
      return NextResponse.json(
        { error: 'No stocks provided' },
        { status: 400 }
      );
    }

    if (!body.investmentAmount || body.investmentAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid investment amount' },
        { status: 400 }
      );
    }

    // Fetch data for all stocks
    const priceDataPromises = body.stocks.map(async (symbol) => {
      const prices = await fetchStockData(symbol);
      const currentPrice = await fetchCurrentPrice(symbol);

      return {
        symbol,
        prices,
        currentPrice,
      };
    });

    const priceDataArray = await Promise.all(priceDataPromises);

    // Run optimization
    const optimization = optimizePortfolio(priceDataArray);

    // Generate signals and build results
    const allocations = body.stocks.map((symbol, index) => {
      const priceData = priceDataArray[index];
      const signal = generateTradingSignal(symbol, priceData.prices);

      return {
        symbol,
        allocation: optimization.allocation[index],
        amount: optimization.allocation[index] * body.investmentAmount,
        signal: signal.signal,
        confidence: signal.confidence,
      };
    });

    const currentPrices: Record<string, number> = {};
    const signals: Record<string, any> = {};

    priceDataArray.forEach((data, index) => {
      currentPrices[data.symbol] = data.currentPrice;
      const signal = generateTradingSignal(data.symbol, data.prices);
      signals[data.symbol] = signal;
    });

    const result: OptimizationResult = {
      allocations,
      metrics: {
        expectedReturn: optimization.expectedReturn,
        volatility: optimization.volatility,
        sharpeRatio: optimization.sharpeRatio,
      },
      efficientFrontier: optimization.efficientFrontier,
      currentPrices,
      signals,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json(
      { error: 'Optimization failed' },
      { status: 500 }
    );
  }
}
