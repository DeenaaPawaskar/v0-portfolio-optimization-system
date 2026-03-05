'use client';

import { useState, useCallback, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Stock } from '@/lib/portfolio/types';

interface StockFormProps {
  onSubmit: (symbols: string[], amount: number) => Promise<void>;
}

export function StockForm({ onSubmit }: StockFormProps) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [investmentAmount, setInvestmentAmount] = useState<string>('100000');
  const [isLoading, setIsLoading] = useState(false);
  const [availableStocks, setAvailableStocks] = useState<Stock[]>([]);
  const [openPopover, setOpenPopover] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Load available stocks on mount
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const res = await fetch('/api/stocks');
        const data = await res.json();
        setAvailableStocks(data.stocks);
      } catch (error) {
        console.error('Failed to load stocks:', error);
      }
    };
    loadStocks();
  }, []);

  const selectedSymbols = stocks.map((s) => s.symbol);
  const remainingStocks = availableStocks.filter(
    (s) => !selectedSymbols.includes(s.symbol)
  );

  const handleAddStock = (stock: Stock) => {
    if (!selectedSymbols.includes(stock.symbol)) {
      setStocks([...stocks, stock]);
    }
    setSearchValue('');
  };

  const handleRemoveStock = (symbol: string) => {
    setStocks(stocks.filter((s) => s.symbol !== symbol));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (stocks.length === 0) {
      alert('Please select at least one stock');
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(
        stocks.map((s) => s.symbol),
        amount
      );
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('Failed to optimize portfolio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const groupedStocks = availableStocks.reduce(
    (acc, stock) => {
      if (!acc[stock.sector]) {
        acc[stock.sector] = [];
      }
      acc[stock.sector].push(stock);
      return acc;
    },
    {} as Record<string, Stock[]>
  );

  const filteredGroups = Object.entries(groupedStocks).reduce(
    (acc, [sector, sectorStocks]) => {
      const filtered = sectorStocks.filter(
        (s) =>
          !selectedSymbols.includes(s.symbol) &&
          (searchValue === '' ||
            s.symbol.toLowerCase().includes(searchValue.toLowerCase()) ||
            s.name.toLowerCase().includes(searchValue.toLowerCase()))
      );
      if (filtered.length > 0) {
        acc[sector] = filtered;
      }
      return acc;
    },
    {} as Record<string, Stock[]>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Optimizer</CardTitle>
        <CardDescription>
          Select NSE stocks and your investment amount to optimize allocation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stock Selection */}
          <div className="space-y-2">
            <Label htmlFor="stocks">Select Stocks</Label>
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPopover}
                  className="w-full justify-between"
                >
                  {stocks.length === 0
                    ? 'Select stocks...'
                    : `${stocks.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search stocks..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No stocks found.</CommandEmpty>
                    {Object.entries(filteredGroups).map(([sector, sectorStocks]) => (
                      <CommandGroup key={sector} heading={sector}>
                        {sectorStocks.map((stock) => (
                          <CommandItem
                            key={stock.symbol}
                            value={stock.symbol}
                            onSelect={() => handleAddStock(stock)}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedSymbols.includes(stock.symbol)
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{stock.symbol}</div>
                              <div className="text-xs text-muted-foreground">
                                {stock.name}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected Stocks Display */}
            {stocks.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {stocks.map((stock) => (
                  <Badge key={stock.symbol} variant="secondary" className="gap-1">
                    {stock.symbol}
                    <button
                      onClick={() => handleRemoveStock(stock.symbol)}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Investment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              min="10000"
              step="10000"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="Enter investment amount"
            />
            <p className="text-xs text-muted-foreground">
              Minimum ₹10,000. Total portfolio value to allocate.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || stocks.length === 0}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Optimizing...
              </>
            ) : (
              'Optimize Portfolio'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
