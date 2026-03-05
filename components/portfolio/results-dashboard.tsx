'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricsCards } from './metrics-cards';
import { AllocationChart } from './allocation-chart';
import { AllocationTable } from './allocation-table';
import { EfficientFrontier } from './efficient-frontier';
import { PriceChart } from './price-chart';
import type { OptimizationResult } from '@/lib/portfolio/types';

interface ResultsDashboardProps {
  result: OptimizationResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <MetricsCards
        expectedReturn={result.metrics.expectedReturn}
        volatility={result.metrics.volatility}
        sharpeRatio={result.metrics.sharpeRatio}
        sortinoRatio={result.metrics.sortinoRatio}
        maxDrawdown={result.metrics.maxDrawdown}
        var95={result.metrics.var95}
      />

      {/* Main Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="prices">Prices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AllocationChart allocations={result.allocations} />
            <AllocationTable
              allocations={result.allocations}
              signals={result.signals}
            />
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <EfficientFrontier
            efficientFrontier={result.efficientFrontier}
            currentPortfolio={{
              volatility: result.metrics.volatility,
              return: result.metrics.expectedReturn,
            }}
          />
        </TabsContent>

        <TabsContent value="prices" className="space-y-6">
          <PriceChart
            currentPrices={result.currentPrices}
            allocations={result.allocations}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
