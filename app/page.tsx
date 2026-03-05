'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StockForm } from '@/components/portfolio/stock-form';
import { ResultsDashboard } from '@/components/portfolio/results-dashboard';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import type { OptimizationResult } from '@/lib/portfolio/types';
import { RotateCcw, BarChart3 } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async (symbols: string[], amount: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stocks: symbols, investmentAmount: amount }),
      });

      if (!response.ok) {
        throw new Error('Optimization failed');
      }

      const data: OptimizationResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to optimize portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              NSE Portfolio Optimizer
            </h1>
            <p className="text-muted-foreground mt-1">
              Markowitz mean-variance optimization with technical signals
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/protected">
              <Button variant="outline" size="sm" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!result ? (
          <div className="max-w-2xl mx-auto">
            <StockForm onSubmit={handleOptimize} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Optimization Results
                </h2>
                <p className="text-muted-foreground mt-1">
                  Based on 2 years of historical data
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                New Portfolio
              </Button>
            </div>

            <ResultsDashboard result={result} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            This tool uses historical NSE data and technical indicators for educational purposes.
            Not investment advice. Please consult a financial advisor before investing.
          </p>
        </div>
      </footer>
    </main>
  );
}
