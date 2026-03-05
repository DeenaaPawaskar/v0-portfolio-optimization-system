import { NSE_STOCKS, getStocksBySector, PRESET_PORTFOLIOS } from '@/lib/portfolio/stocks';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bySector = getStocksBySector();

    return NextResponse.json({
      stocks: NSE_STOCKS,
      bySector,
      presets: PRESET_PORTFOLIOS,
    });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
}
