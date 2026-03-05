import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      name,
      description,
      stocks,
      allocations,
      investmentAmount,
      metrics,
    } = body;

    const { data, error } = await supabase
      .from('saved_portfolios')
      .insert([
        {
          user_id: user.id,
          name,
          description,
          stocks,
          allocations,
          investment_amount: investmentAmount,
          expected_return: metrics.expectedReturn,
          volatility: metrics.volatility,
          sharpe_ratio: metrics.sharpeRatio,
          sortino_ratio: metrics.sortinoRatio,
          max_drawdown: metrics.maxDrawdown,
          var95: metrics.var95,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Save portfolio error:', error);
    return NextResponse.json(
      { error: 'Failed to save portfolio' },
      { status: 500 }
    );
  }
}
