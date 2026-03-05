import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';

export interface SavedPortfolio {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  stocks: string[];
  allocations: number[];
  investment_amount: number;
  expected_return: number;
  volatility: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  max_drawdown: number;
  var95: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioHistory {
  id: string;
  user_id: string;
  portfolio_id?: string;
  stocks: string[];
  allocations: number[];
  investment_amount: number;
  expected_return: number;
  volatility: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  max_drawdown: number;
  var95: number;
  created_at: string;
}

// Client-side functions
export async function savePortfolio(
  name: string,
  description: string | undefined,
  stocks: string[],
  allocations: number[],
  investmentAmount: number,
  metrics: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number;
    var95: number;
  }
): Promise<SavedPortfolio | null> {
  const supabase = createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');

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
  return data;
}

export async function getSavedPortfolios(): Promise<SavedPortfolio[]> {
  const supabase = createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('saved_portfolios')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getPortfolioHistory(): Promise<PortfolioHistory[]> {
  const supabase = createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('portfolio_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}

export async function deletePortfolio(portfolioId: string): Promise<void> {
  const supabase = createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('saved_portfolios')
    .delete()
    .eq('id', portfolioId)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function updatePortfolio(
  portfolioId: string,
  updates: Partial<SavedPortfolio>
): Promise<SavedPortfolio | null> {
  const supabase = createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('saved_portfolios')
    .update(updates)
    .eq('id', portfolioId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Server-side function for adding to history
export async function addPortfolioHistory(
  userId: string,
  stocks: string[],
  allocations: number[],
  investmentAmount: number,
  metrics: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number;
    var95: number;
  },
  portfolioId?: string
): Promise<PortfolioHistory | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('portfolio_history')
    .insert([
      {
        user_id: userId,
        portfolio_id: portfolioId,
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

  if (error) {
    console.error('Error adding portfolio history:', error);
    return null;
  }
  return data;
}
