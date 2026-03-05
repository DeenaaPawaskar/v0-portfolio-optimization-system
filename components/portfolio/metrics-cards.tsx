import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface MetricsCardsProps {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio?: number;
  maxDrawdown?: number;
  var95?: number;
}

export function MetricsCards({
  expectedReturn,
  volatility,
  sharpeRatio,
  sortinoRatio,
  maxDrawdown,
  var95,
}: MetricsCardsProps) {
  const returnPercent = (expectedReturn * 100).toFixed(2);
  const volatilityPercent = (volatility * 100).toFixed(2);
  const maxDrawdownPercent = maxDrawdown ? (maxDrawdown * 100).toFixed(2) : '0.00';
  const var95Percent = var95 ? (var95 * 100).toFixed(2) : '0.00';

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Expected Annual Return
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gain">{returnPercent}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            2-year historical
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Volatility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{volatilityPercent}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Standard deviation
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
            Risk-adjusted (6% RFR)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Max Drawdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-loss">{maxDrawdownPercent}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Peak-to-trough decline
          </p>
        </CardContent>
      </Card>

      {sortinoRatio !== undefined && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sortino Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sortinoRatio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Downside risk-adjusted
            </p>
          </CardContent>
        </Card>
      )}

      {var95 !== undefined && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Value at Risk (95%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-loss">{var95Percent}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Worst daily loss (95%)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
