import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Grid, Scissors } from 'lucide-react';

interface SheetUsageCalculatorProps {
  itemWidth: number;
  itemHeight: number;
  sheetWidth: number;
  sheetHeight: number;
  quantity: number;
  className?: string;
}

const SheetUsageCalculator: React.FC<SheetUsageCalculatorProps> = ({
  itemWidth,
  itemHeight,
  sheetWidth,
  sheetHeight,
  quantity,
  className
}) => {
  const calculateUsage = () => {
    const sheetArea = sheetWidth * sheetHeight;
    const itemArea = itemWidth * itemHeight;
    
    // Calculate how many items fit per sheet
    const itemsPerRowWidth = Math.floor(sheetWidth / itemWidth);
    const itemsPerRowHeight = Math.floor(sheetHeight / itemHeight);
    const itemsPerSheet = itemsPerRowWidth * itemsPerRowHeight;
    
    // Calculate sheets needed
    const sheetsNeeded = Math.ceil(quantity / itemsPerSheet);
    
    // Calculate waste
    const usedArea = itemArea * Math.min(quantity, itemsPerSheet * sheetsNeeded);
    const totalSheetArea = sheetArea * sheetsNeeded;
    const wasteArea = totalSheetArea - usedArea;
    const wastePercentage = (wasteArea / totalSheetArea) * 100;
    
    // Calculate reusable cutoffs
    const cutoffWidth = sheetWidth - (itemsPerRowWidth * itemWidth);
    const cutoffHeight = sheetHeight - (itemsPerRowHeight * itemHeight);
    const cutoffArea = (cutoffWidth * sheetHeight) + (cutoffHeight * itemWidth * itemsPerRowWidth);
    
    return {
      itemsPerSheet,
      sheetsNeeded,
      wastePercentage: wastePercentage.toFixed(1),
      cutoffWidth,
      cutoffHeight,
      cutoffArea: cutoffArea.toFixed(0),
      itemsPerRowWidth,
      itemsPerRowHeight
    };
  };

  const usage = calculateUsage();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5" />
          Sheet Usage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Grid Representation */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-center mb-2 text-sm font-medium">
            Sheet Layout: {usage.itemsPerRowWidth} × {usage.itemsPerRowHeight} = {usage.itemsPerSheet} items per sheet
          </div>
          <div 
            className="mx-auto border-2 border-gray-400 bg-white relative"
            style={{
              width: '200px',
              height: `${(sheetHeight / sheetWidth) * 200}px`,
              maxHeight: '150px'
            }}
          >
            {/* Grid lines to show item placement */}
            <div className="absolute inset-0">
              {Array.from({ length: usage.itemsPerRowWidth + 1 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute top-0 bottom-0 border-l border-blue-300"
                  style={{ left: `${(i / usage.itemsPerRowWidth) * 100}%` }}
                />
              ))}
              {Array.from({ length: usage.itemsPerRowHeight + 1 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute left-0 right-0 border-t border-blue-300"
                  style={{ top: `${(i / usage.itemsPerRowHeight) * 100}%` }}
                />
              ))}
            </div>
            
            {/* Items */}
            {Array.from({ length: Math.min(quantity, usage.itemsPerSheet) }).map((_, i) => {
              const row = Math.floor(i / usage.itemsPerRowWidth);
              const col = i % usage.itemsPerRowWidth;
              return (
                <div
                  key={i}
                  className="absolute bg-blue-200 border border-blue-400 flex items-center justify-center text-xs"
                  style={{
                    left: `${(col / usage.itemsPerRowWidth) * 100}%`,
                    top: `${(row / usage.itemsPerRowHeight) * 100}%`,
                    width: `${(1 / usage.itemsPerRowWidth) * 100}%`,
                    height: `${(1 / usage.itemsPerRowHeight) * 100}%`
                  }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          <div className="text-center mt-2 text-xs text-muted-foreground">
            Sheet #{usage.sheetsNeeded > 1 ? '1' : '1'} / {sheetWidth}" × {sheetHeight}" / Front Side
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Items per sheet</div>
                <div className="text-lg font-bold">{usage.itemsPerSheet}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-sm font-medium">Sheets needed</div>
                <div className="text-lg font-bold">{usage.sheetsNeeded}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-sm font-medium">Waste</div>
                <div className="text-lg font-bold">{usage.wastePercentage}%</div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <div>Cutoff: {usage.cutoffWidth}" × {usage.cutoffHeight}"</div>
              <div>Area: {usage.cutoffArea} sq in</div>
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          <div>Total quantity: {quantity} items</div>
          <div>Item size: {itemWidth}" × {itemHeight}"</div>
          <div>Sheet size: {sheetWidth}" × {sheetHeight}"</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SheetUsageCalculator;