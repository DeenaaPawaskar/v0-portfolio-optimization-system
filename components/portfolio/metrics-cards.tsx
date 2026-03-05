import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface MetricsCardsProps {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

export function MetricsCards({
  expectedReturn,
  volatility,
  sharpeRatio,
}: MetricsCardsProps) {
  const returnPercent = (expectedReturn * 100).toFixed(2);
  const volatilityPercent = (volatility * 100).toFixed(2);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Expected Annual Return
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gain">{returnPercent}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on 2-year historical data
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Volatility (Risk)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{volatilityPercent}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Standard deviation of returns
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Sharpe Ratio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sharpeRatio.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Risk-adjusted return (6% RFR)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
