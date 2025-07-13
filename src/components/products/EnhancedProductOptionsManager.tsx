import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, DollarSign } from 'lucide-react';
import { ConditionalOptionRenderer } from './ConditionalOptionRenderer';
import { GlobalRateUpdateDialog } from './GlobalRateUpdateDialog';
import { useOptionRates } from '@/hooks/useOptionRates';

interface EnhancedProductOptionsManagerProps {
  productId?: string;
  productDimensions?: { width: number; height: number };
  onOptionsChange?: (options: any) => void;
}

export const EnhancedProductOptionsManager: React.FC<EnhancedProductOptionsManagerProps> = ({
  productId,
  productDimensions = { width: 48, height: 24 },
  onOptionsChange
}) => {
  const { rates, loading } = useOptionRates();
  const [options, setOptions] = useState<any>({});
  const [showRateDialog, setShowRateDialog] = useState(false);
  const [selectedRate, setSelectedRate] = useState<{ name: string; rate: number } | null>(null);

  const handleOptionChange = (optionName: string, value: any) => {
    const newOptions = { ...options, [optionName]: value };
    setOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  const handleRateUpdate = (rateName: string, currentRate: number) => {
    setSelectedRate({ name: rateName, rate: currentRate });
    setShowRateDialog(true);
  };

  const calculateTotalOptionCost = () => {
    let total = 0;
    Object.values(options).forEach((option: any) => {
      if (option?.totalCost) {
        total += option.totalCost;
      }
    });
    return total;
  };

  if (loading) {
    return <div className="p-4">Loading options...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Options</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Total: ${calculateTotalOptionCost().toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* Global Rate Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Global Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rates.map((rate) => (
              <div key={rate.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{rate.name.replace('_', ' ').toUpperCase()}</div>
                  <div className="text-sm text-gray-600">${rate.base_rate.toFixed(2)}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRateUpdate(rate.name, rate.base_rate)}
                >
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Conditional Options */}
      <div className="space-y-4">
        <h4 className="font-medium">Available Options</h4>
        
        <ConditionalOptionRenderer
          optionName="Grommets"
          value={options.Grommets}
          onChange={(value) => handleOptionChange('Grommets', value)}
          productDimensions={productDimensions}
          showPricing={true}
        />
        
        <ConditionalOptionRenderer
          optionName="Pole Pockets"
          value={options['Pole Pockets']}
          onChange={(value) => handleOptionChange('Pole Pockets', value)}
          productDimensions={productDimensions}
          showPricing={true}
        />
      </div>

      {/* Pricing Summary */}
      {calculateTotalOptionCost() > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pricing Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(options).map(([optionName, optionValue]: [string, any]) => {
                if (optionValue?.enabled && optionValue?.totalCost > 0) {
                  return (
                    <div key={optionName} className="flex justify-between">
                      <span>{optionName}</span>
                      <span>${optionValue.totalCost.toFixed(2)}</span>
                    </div>
                  );
                }
                return null;
              })}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total Options Cost</span>
                <span>${calculateTotalOptionCost().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Global Rate Update Dialog */}
      {selectedRate && (
        <GlobalRateUpdateDialog
          open={showRateDialog}
          onOpenChange={setShowRateDialog}
          rateName={selectedRate.name}
          currentRate={selectedRate.rate}
          onUpdate={() => {
            // Refresh rates or handle update
            setSelectedRate(null);
          }}
        />
      )}
    </div>
  );
};