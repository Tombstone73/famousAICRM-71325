import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign } from 'lucide-react';
import { useProductOptions } from '@/hooks/useProductOptions';
import { usePricingModels } from '@/hooks/usePricingModels';

interface PriceTestSectionProps {
  productId?: string;
  pricingModelId: string;
  selectedOptions: string[];
}

export const PriceTestSection: React.FC<PriceTestSectionProps> = ({
  productId,
  pricingModelId,
  selectedOptions
}) => {
  const [testValues, setTestValues] = useState<Record<string, any>>({});
  const [optionSelections, setOptionSelections] = useState<Record<string, any>>({});
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [priceBreakdown, setPriceBreakdown] = useState<any[]>([]);
  
  const { productOptions } = useProductOptions();
  const { pricingModels } = usePricingModels();

  const selectedProductOptions = productOptions.filter(opt => selectedOptions.includes(opt.id));
  const pricingModel = pricingModels.find(m => m.id === pricingModelId);

  const calculatePrice = () => {
    if (!pricingModel) {
      setCalculatedPrice(null);
      setPriceBreakdown([]);
      return;
    }

    try {
      let basePrice = 0;
      let setupFees = 0;
      let breakdown = [];

      // Calculate base price using pricing model
      if (pricingModel.formula && testValues) {
        // Simple formula evaluation (in real app, use a proper formula engine)
        let formula = pricingModel.formula;
        
        // Replace variables with test values
        Object.entries(testValues).forEach(([key, value]) => {
          formula = formula.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
        });
        
        // Basic evaluation (replace with proper formula engine)
        try {
          basePrice = eval(formula.replace(/[^0-9+\-*/.() ]/g, '')) || 0;
        } catch {
          basePrice = 0;
        }
        
        breakdown.push({
          label: 'Base Price',
          formula: pricingModel.formula,
          value: basePrice
        });
      }

      // Add option pricing
      selectedProductOptions.forEach(option => {
        const selection = optionSelections[option.id];
        if (selection && option.settings?.options) {
          const selectedValue = option.settings.options.find((opt: any) => opt.value === selection);
          if (selectedValue) {
            if (selectedValue.setupFee) {
              setupFees += selectedValue.setupFee;
              breakdown.push({
                label: `${option.name} Setup`,
                formula: `+${selectedValue.setupFee}`,
                value: selectedValue.setupFee
              });
            }
            
            if (selectedValue.priceFormula) {
              let optionPrice = 0;
              try {
                let formula = selectedValue.priceFormula;
                formula = formula.replace(/base_price/g, basePrice.toString());
                formula = formula.replace(/setup_fee/g, (selectedValue.setupFee || 0).toString());
                
                Object.entries(testValues).forEach(([key, value]) => {
                  formula = formula.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString());
                });
                
                optionPrice = eval(formula.replace(/[^0-9+\-*/.() ]/g, '')) || 0;
              } catch {
                optionPrice = 0;
              }
              
              breakdown.push({
                label: `${option.name} (${selectedValue.label})`,
                formula: selectedValue.priceFormula,
                value: optionPrice
              });
              
              basePrice += optionPrice;
            }
          }
        }
      });

      const totalPrice = basePrice + setupFees;
      setCalculatedPrice(totalPrice);
      setPriceBreakdown(breakdown);
    } catch (error) {
      console.error('Error calculating price:', error);
      setCalculatedPrice(null);
      setPriceBreakdown([]);
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [testValues, optionSelections, pricingModelId, selectedOptions]);

  if (!pricingModel) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            Select a pricing model to test pricing
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Price Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Pricing Model Variables</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {pricingModel.variables && Object.entries(pricingModel.variables).map(([key, defaultValue]) => (
                <div key={key}>
                  <Label htmlFor={key}>{key}</Label>
                  <Input
                    id={key}
                    type="number"
                    step="0.01"
                    value={testValues[key] || defaultValue || ''}
                    onChange={(e) => setTestValues(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {selectedProductOptions.length > 0 && (
            <div>
              <Label className="text-base font-medium">Product Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {selectedProductOptions.map(option => (
                  <div key={option.id}>
                    <Label>{option.name}</Label>
                    {option.type === 'dropdown' && option.settings?.options && (
                      <Select
                        value={optionSelections[option.id] || ''}
                        onValueChange={(value) => setOptionSelections(prev => ({ ...prev, [option.id]: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${option.name}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {option.settings.options.map((opt: any, idx: number) => (
                            <SelectItem key={idx} value={opt.value}>
                              {opt.label}
                              {opt.setupFee && opt.setupFee > 0 && (
                                <span className="text-green-600 ml-2">
                                  (+${opt.setupFee} setup)
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {option.type === 'toggle' && (
                      <Select
                        value={optionSelections[option.id] || 'false'}
                        onValueChange={(value) => setOptionSelections(prev => ({ ...prev, [option.id]: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false">No</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={calculatePrice} className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Price
          </Button>
        </CardContent>
      </Card>

      {calculatedPrice !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Price Calculation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priceBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <div className="text-sm text-gray-500">{item.formula}</div>
                  </div>
                  <Badge variant="outline">
                    ${item.value.toFixed(2)}
                  </Badge>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t-2">
                <span className="text-lg font-bold">Total Price</span>
                <span className="text-2xl font-bold text-green-600">
                  ${calculatedPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};