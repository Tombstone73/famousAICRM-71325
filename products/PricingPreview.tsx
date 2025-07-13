import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Calculator, Package } from 'lucide-react';

interface OptionRate {
  id: string;
  option_type: string;
  pricing_type: 'flat_fee' | 'per_unit' | 'formula';
  base_price: number;
  formula?: string;
  unit_type?: string;
}

interface PricingPreviewProps {
  selectedOptions: Record<string, any>;
  rates: OptionRate[];
  totalPrice: number;
  basePrice?: number;
}

export const PricingPreview: React.FC<PricingPreviewProps> = ({
  selectedOptions,
  rates,
  totalPrice,
  basePrice = 0
}) => {
  const calculateOptionPrice = (optionId: string, optionValue: any): number => {
    const rate = rates.find(r => r.option_type === optionId);
    if (!rate || !optionValue?.enabled) return 0;

    switch (rate.pricing_type) {
      case 'flat_fee':
        return rate.base_price;
      
      case 'per_unit':
        const quantity = optionValue.quantity || 1;
        return rate.base_price * quantity;
      
      case 'formula':
        // For demo purposes, using simplified calculation
        if (optionId === 'grommets' && optionValue.spacing < 24) {
          const extraGrommets = Math.ceil((24 - optionValue.spacing) / 6);
          return rate.base_price * extraGrommets;
        }
        return rate.base_price;
      
      default:
        return 0;
    }
  };

  const getOptionBreakdown = () => {
    const breakdown: Array<{
      name: string;
      description: string;
      price: number;
      type: string;
    }> = [];

    Object.entries(selectedOptions).forEach(([optionId, optionValue]) => {
      if (optionValue?.enabled) {
        const rate = rates.find(r => r.option_type === optionId);
        const price = calculateOptionPrice(optionId, optionValue);
        
        if (rate && price > 0) {
          let description = '';
          
          switch (optionId) {
            case 'grommets':
              description = `${optionValue.placement || 'standard'} placement, ${optionValue.spacing || 24}" spacing`;
              if (optionValue.spacing < 24) {
                description += ` (extra grommets required)`;
              }
              break;
            
            case 'pole_pockets':
              description = `${optionValue.size || '2-inch'} pockets on ${optionValue.sides || 'top'}`;
              break;
            
            default:
              description = rate.pricing_type === 'flat_fee' ? 'Flat fee' : 
                           rate.pricing_type === 'per_unit' ? `Per ${rate.unit_type || 'unit'}` : 
                           'Formula-based';
          }
          
          breakdown.push({
            name: optionId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description,
            price,
            type: rate.pricing_type
          });
        }
      }
    });

    return breakdown;
  };

  const optionBreakdown = getOptionBreakdown();
  const optionsTotal = optionBreakdown.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = basePrice + optionsTotal;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Base Price */}
          {basePrice > 0 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span>Base Product Price</span>
              </div>
              <Badge variant="outline">${basePrice.toFixed(2)}</Badge>
            </div>
          )}

          {/* Options Breakdown */}
          {optionBreakdown.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">Selected Options:</h4>
                {optionBreakdown.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Badge variant="outline">${item.price.toFixed(2)}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">{item.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Totals */}
          <Separator />
          
          {optionsTotal > 0 && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Options Subtotal</span>
              <Badge variant="outline">${optionsTotal.toFixed(2)}</Badge>
            </div>
          )}
          
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Price</span>
            <Badge className="text-lg px-3 py-1">${grandTotal.toFixed(2)}</Badge>
          </div>

          {/* Live Updates Notice */}
          <div className="text-xs text-gray-500 text-center mt-4">
            Pricing updates automatically as options are changed
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {optionBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pricing Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            {optionBreakdown.some(item => item.type === 'formula') && (
              <p>• Formula-based pricing calculated using product dimensions and specifications</p>
            )}
            {optionBreakdown.some(item => item.type === 'per_unit') && (
              <p>• Per-unit pricing based on quantity or linear measurements</p>
            )}
            {optionBreakdown.some(item => item.type === 'flat_fee') && (
              <p>• Flat fees applied regardless of product size</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};