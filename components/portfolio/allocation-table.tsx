import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import type { SignalResult } from '@/lib/portfolio/types';

interface AllocationTableProps {
  allocations: Array<{
    symbol: string;
    allocation: number;
    amount: number;
    signal: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
  }>;
  signals: Record<string, SignalResult>;
}

function getSignalColor(signal: string): string {
  switch (signal) {
    case 'BUY':
      return 'bg-gain text-gain-foreground';
    case 'SELL':
      return 'bg-loss text-loss-foreground';
    case 'HOLD':
    default:
      return 'bg-hold text-hold-foreground';
  }
}

export function AllocationTable({ allocations, signals }: AllocationTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Allocations & Signals</CardTitle>
        <CardDescription>
          Recommended allocation with technical analysis signals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead>Allocation %</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Indicators
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>RSI, MACD, SMA Crossover indicators</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocations.map((alloc) => {
                const signal = signals[alloc.symbol];
                const rsi = signal?.indicators.rsi;
                const macd = signal?.indicators.macd;
                const smaGolden = signal?.indicators.smaGoldenCross;

                return (
                  <TableRow key={alloc.symbol}>
                    <TableCell className="font-medium">{alloc.symbol}</TableCell>
                    <TableCell>
                      {(alloc.allocation * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell>₹{alloc.amount.toFixed(0)}</TableCell>
                    <TableCell>
                      <Badge className={getSignalColor(alloc.signal)}>
                        {alloc.signal}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        {!isNaN(rsi) && (
                          <div>
                            RSI: <span className="font-semibold">{rsi.toFixed(1)}</span>
                          </div>
                        )}
                        {!isNaN(macd) && (
                          <div>
                            MACD: <span className="font-semibold">{macd.toFixed(4)}</span>
                          </div>
                        )}
                        {smaGolden !== undefined && (
                          <div>
                            SMA: <span className="font-semibold">{smaGolden ? '✓ Golden' : '✗ Death'}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
