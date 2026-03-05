'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/theme-toggle';
import { Trash2, Plus } from 'lucide-react';

interface SavedPortfolio {
  id: string;
  name: string;
  description?: string;
  stocks: string[];
  expected_return: number;
  volatility: number;
  sharpe_ratio: number;
  created_at: string;
}

interface PortfolioHistory {
  id: string;
  stocks: string[];
  expected_return: number;
  volatility: number;
  sharpe_ratio: number;
  created_at: string;
}

export default function ProtectedPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [portfolios, setPortfolios] = useState<SavedPortfolio[]>([]);
  const [history, setHistory] = useState<PortfolioHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'portfolios' | 'history'>('portfolios');

  useEffect(() => {
    const supabase = createClient();
    
    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/auth/login');
        return;
      }

      setUser(user);
      await fetchPortfolios();
      await fetchHistory();
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolio/list');
      if (response.ok) {
        const data = await response.json();
        setPortfolios(data);
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/portfolio/history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleDelete = async (portfolioId: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;

    try {
      const response = await fetch(`/api/portfolio/delete?id=${portfolioId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPortfolios(portfolios.filter((p) => p.id !== portfolioId));
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div>
            <h1 className="text-2xl font-bold">Portfolio Optimizer</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/">
              <Button variant="outline">New Portfolio</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('portfolios')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'portfolios'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Saved Portfolios ({portfolios.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            History ({history.length})
          </button>
        </div>

        {/* Portfolios Tab */}
        {activeTab === 'portfolios' && (
          <div className="space-y-4">
            {portfolios.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">No saved portfolios yet</p>
                  <Link href="/">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Portfolio
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              portfolios.map((portfolio) => (
                <Card key={portfolio.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                        {portfolio.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {portfolio.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(portfolio.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Stocks</p>
                        <p className="font-semibold">
                          {portfolio.stocks.length} assets
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expected Return</p>
                        <p className="font-semibold text-gain">
                          {(portfolio.expected_return * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Volatility</p>
                        <p className="font-semibold">
                          {(portfolio.volatility * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sharpe Ratio</p>
                        <p className="font-semibold">
                          {portfolio.sharpe_ratio.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Saved on {new Date(portfolio.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No portfolio history yet</p>
                </CardContent>
              </Card>
            ) : (
              history.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Stocks</p>
                        <p className="font-semibold">
                          {item.stocks.join(', ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expected Return</p>
                        <p className="font-semibold text-gain">
                          {(item.expected_return * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Volatility</p>
                        <p className="font-semibold">
                          {(item.volatility * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sharpe Ratio</p>
                        <p className="font-semibold">
                          {item.sharpe_ratio.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-semibold">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
