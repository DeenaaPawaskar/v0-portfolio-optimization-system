'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface AllocationChartProps {
  allocations: Array<{
    symbol: string;
    allocation: number;
    amount: number;
  }>;
}

const COLORS = [
  '#0x6b9cff',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
  '#84cc16',
];

export function AllocationChart({ allocations }: AllocationChartProps) {
  const chartData = allocations.map((a) => ({
    name: a.symbol,
    value: parseFloat((a.allocation * 100).toFixed(2)),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>Percentage distribution of your investment</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
