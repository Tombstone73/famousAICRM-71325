import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProductOption {
  id: string;
  name: string;
  price_modifier: number;
  required: boolean;
  is_default: boolean;
  conditional_media_type_id?: string;
}

interface OptionPricingCalculatorProps {
  basePrice: number;
  options: ProductOption[];
  selectedOptions?: string[];
  selectedMediaTypeId?: string;
  dimensions?: { width: number; height: number };
}

export const OptionPricingCalculator: React.FC<OptionPricingCalculatorProps> = ({
  basePrice,
  options,
  selectedOptions = [],
  selectedMediaTypeId,
  dimensions
}) => {
  // Filter options based on conditional logic
  const availableOptions = options.filter(option => {
    if (!option.conditional_media_type_id) return true;
    return option.conditional_media_type_id === selectedMediaTypeId;
  });

  // Get applicable options (selected + required + default)
  const applicableOptions = availableOptions.filter(option => {
    return selectedOptions.includes(option.id) || option.required || option.is_default;
  });

  // Calculate total option cost
  const totalOptionCost = applicableOptions.reduce((total, option) => {
    return total + option.price_modifier;
  }, 0);

  const finalPrice = basePrice + totalOptionCost;
  const area = dimensions ? (dimensions.width * dimensions.height) / 144 : 0; // sq ft

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Pricing Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Base Price</span>
          <span className="font-mono">${basePrice.toFixed(2)}</span>
        </div>

        {/* Area calculation if dimensions provided */}
        {dimensions && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Area ({dimensions.width}" × {dimensions.height}")</span>
            <span>{area.toFixed(2)} sq ft</span>
          </div>
        )}

        {/* Options */}
        {applicableOptions.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium border-t pt-2">Applied Options:</div>
            {applicableOptions.map((option) => (
              <div key={option.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span>{option.name}</span>
                  <div className="flex gap-1">
                    {option.required && (
                      <Badge variant="destructive" className="text-xs px-1 py-0">REQ</Badge>
                    )}
                    {option.is_default && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">DEF</Badge>
                    )}
                  </div>
                </div>
                <span className="font-mono">
                  {option.price_modifier >= 0 ? '+' : ''}${option.price_modifier.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center font-medium text-lg border-t pt-2">
          <span>Total Price</span>
          <span className="font-mono">${finalPrice.toFixed(2)}</span>
        </div>

        {/* Conditional options info */}
        {options.some(opt => opt.conditional_media_type_id) && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Some options are only available with specific media types.
            </AlertDescription>
          </Alert>
        )}

        {/* Pricing breakdown */}
        {totalOptionCost !== 0 && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Options Total:</span>
              <span>{totalOptionCost >= 0 ? '+' : ''}${totalOptionCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Price Increase:</span>
              <span>{((totalOptionCost / basePrice) * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};