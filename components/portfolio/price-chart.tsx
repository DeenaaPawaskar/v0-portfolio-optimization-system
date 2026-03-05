'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PriceChartProps {
  currentPrices: Record<string, number>;
  allocations: Array<{
    symbol: string;
    allocation: number;
  }>;
}

export function PriceChart({ currentPrices, allocations }: PriceChartProps) {
  // Normalize prices to 100 for comparison
  const maxPrice = Math.max(...Object.values(currentPrices));
  const minPrice = Math.min(...Object.values(currentPrices));

  const data = allocations.map((a) => ({
    symbol: a.symbol,
    normalized:
      maxPrice === minPrice
        ? 100
        : ((currentPrices[a.symbol] - minPrice) /
            (maxPrice - minPrice)) *
          100,
    actual: currentPrices[a.symbol],
  }));

  const chartData = [
    {
      name: 'Price Comparison',
      data: data.map((d) => ({
        symbol: d.symbol,
        normalized: parseFloat(d.normalized.toFixed(2)),
      })),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Normalized Price Comparison</CardTitle>
        <CardDescription>
          Price levels on a 0-100 scale for easy comparison
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
              }}
              formatter={(value, name) => {
                if (name === 'normalized') {
                  return [parseFloat(String(value)).toFixed(2), 'Normalized'];
                }
                return [parseFloat(String(value)).toFixed(2), 'Actual Price'];
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="normalized"
              stroke="var(--chart-1)"
              dot={{ fill: 'var(--chart-1)' }}
              name="Normalized (0-100)"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.map((d) => (
            <div
              key={d.symbol}
              className="rounded-lg border p-3 text-center bg-card"
            >
              <div className="text-sm font-medium">{d.symbol}</div>
              <div className="text-lg font-semibold">
                ₹{d.actual.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
