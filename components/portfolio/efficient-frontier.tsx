'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface EfficientFrontierProps {
  efficientFrontier: Array<{
    volatility: number;
    return: number;
  }>;
  currentPortfolio?: {
    volatility: number;
    return: number;
  };
}

export function EfficientFrontier({
  efficientFrontier,
  currentPortfolio,
}: EfficientFrontierProps) {
  const data = efficientFrontier.map((point) => ({
    volatility: parseFloat((point.volatility * 100).toFixed(2)),
    return: parseFloat((point.return * 100).toFixed(2)),
  }));

  const currentData = currentPortfolio
    ? [
        {
          volatility: parseFloat(
            (currentPortfolio.volatility * 100).toFixed(2)
          ),
          return: parseFloat((currentPortfolio.return * 100).toFixed(2)),
        },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Efficient Frontier</CardTitle>
        <CardDescription>
          Risk-return tradeoff of optimized portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="volatility"
              name="Volatility (%)"
              unit="%"
              type="number"
            />
            <YAxis
              dataKey="return"
              name="Expected Return (%)"
              unit="%"
              type="number"
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
              }}
              formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)}
            />
            <Legend />
            <Scatter
              name="Frontier Points"
              data={data}
              fill="var(--chart-1)"
              opacity={0.6}
            />
            {currentData.length > 0 && (
              <Scatter
                name="Your Portfolio"
                data={currentData}
                fill="var(--gain)"
                shape="diamond"
                size={150}
              />
            )}
            <ReferenceLine
              x={data[0]?.volatility || 0}
              stroke="var(--muted-foreground)"
              strokeDasharray="3 3"
              opacity={0.3}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
