import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductOptionRenderer, ProductOptionConfig } from '@/components/products/ProductOptionTypes';
import { ConditionalOptionRenderer } from '@/components/products/ConditionalOptionRenderer';

interface SelectedOption {
  optionId: string;
  value: any;
  priceOverride?: number;
  customFormula?: string;
}

interface EnhancedProductOptionsSelectorProps {
  productId: string;
  options: ProductOptionConfig[];
  selectedOptions: SelectedOption[];
  onOptionsChange: (options: SelectedOption[]) => void;
  productDimensions?: { width: number; height: number };
  showPricing?: boolean;
}

// Define conditional option types
const CONDITIONAL_OPTIONS = ['Grommets', 'Pole Pockets', 'Hemming', 'Lamination'];

export const EnhancedProductOptionsSelector: React.FC<EnhancedProductOptionsSelectorProps> = ({
  productId,
  options,
  selectedOptions,
  onOptionsChange,
  productDimensions = { width: 48, height: 24 },
  showPricing = true
}) => {
  const [totalPriceImpact, setTotalPriceImpact] = useState(0);
  const [conditionalOptionsValues, setConditionalOptionsValues] = useState<Record<string, any>>({});

  useEffect(() => {
    calculateTotalPriceImpact();
  }, [selectedOptions, options, conditionalOptionsValues]);

  const calculateTotalPriceImpact = () => {
    let total = 0;
    
    // Calculate standard options pricing
    selectedOptions.forEach(selected => {
      const option = options.find(opt => opt.id === selected.optionId);
      if (!option) return;
      
      // Skip conditional options (they have their own pricing)
      if (CONDITIONAL_OPTIONS.includes(option.name)) return;
      
      // Use price override if available
      if (selected.priceOverride !== undefined) {
        total += selected.priceOverride;
        return;
      }
      
      // Use option-level pricing
      if (option.type === 'toggle' && selected.value) {
        total += option.price_modifier || 0;
      } else if (option.type === 'dropdown' || option.type === 'radio') {
        const selectedValue = option.values?.find(v => v.value === selected.value);
        if (selectedValue) {
          total += selectedValue.price_modifier || 0;
        }
      } else if (option.type === 'numeric' && selected.value) {
        total += (option.price_modifier || 0) * selected.value;
      }
    });
    
    // Add conditional options pricing
    Object.values(conditionalOptionsValues).forEach(value => {
      if (value?.totalCost) {
        total += value.totalCost;
      }
    });
    
    setTotalPriceImpact(total);
  };

  const handleStandardOptionChange = (optionId: string, value: any) => {
    const existingIndex = selectedOptions.findIndex(opt => opt.optionId === optionId);
    
    if (existingIndex >= 0) {
      const updated = [...selectedOptions];
      updated[existingIndex] = { ...updated[existingIndex], value };
      onOptionsChange(updated);
    } else {
      onOptionsChange([...selectedOptions, { optionId, value }]);
    }
  };

  const handleConditionalOptionChange = (optionName: string, value: any) => {
    setConditionalOptionsValues(prev => ({
      ...prev,
      [optionName]: value
    }));
    
    // Also update the selected options for consistency
    const option = options.find(opt => opt.name === optionName);
    if (option) {
      handleStandardOptionChange(option.id, value);
    }
  };

  const getSelectedValue = (optionId: string) => {
    return selectedOptions.find(opt => opt.optionId === optionId)?.value;
  };

  const standardOptions = options.filter(opt => !CONDITIONAL_OPTIONS.includes(opt.name));
  const conditionalOptions = options.filter(opt => CONDITIONAL_OPTIONS.includes(opt.name));

  if (options.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            No options configured for this product.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conditional Options Section */}
      {conditionalOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Conditional Options
              {showPricing && (
                <Badge variant="secondary">
                  {Object.values(conditionalOptionsValues).reduce((sum, val) => 
                    sum + (val?.totalCost || 0), 0
                  ).toFixed(2)} total
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conditionalOptions.map((option) => (
                <ConditionalOptionRenderer
                  key={option.id}
                  optionName={option.name}
                  value={conditionalOptionsValues[option.name]}
                  onChange={(value) => handleConditionalOptionChange(option.name, value)}
                  productDimensions={productDimensions}
                  showPricing={showPricing}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Standard Options Section */}
      {standardOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Standard Options
              {showPricing && (
                <Badge variant="outline">
                  {selectedOptions.reduce((sum, selected) => {
                    const option = standardOptions.find(opt => opt.id === selected.optionId);
                    if (!option) return sum;
                    
                    if (selected.priceOverride !== undefined) {
                      return sum + selected.priceOverride;
                    }
                    
                    if (option.type === 'toggle' && selected.value) {
                      return sum + (option.price_modifier || 0);
                    } else if (option.type === 'dropdown' || option.type === 'radio') {
                      const selectedValue = option.values?.find(v => v.value === selected.value);
                      if (selectedValue) {
                        return sum + (selectedValue.price_modifier || 0);
                      }
                    } else if (option.type === 'numeric' && selected.value) {
                      return sum + ((option.price_modifier || 0) * selected.value);
                    }
                    
                    return sum;
                  }, 0).toFixed(2)} total
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {standardOptions.map((option) => (
                <div key={option.id} className="space-y-2">
                  <ProductOptionRenderer
                    option={option}
                    value={getSelectedValue(option.id)}
                    onChange={(value) => handleStandardOptionChange(option.id, value)}
                    showPricing={showPricing}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Total Pricing Summary */}
      {showPricing && (options.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pricing Summary
              <Badge variant={totalPriceImpact >= 0 ? 'default' : 'destructive'} className="text-lg">
                {totalPriceImpact >= 0 ? '+' : ''}${totalPriceImpact.toFixed(2)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {/* Conditional options breakdown */}
              {Object.entries(conditionalOptionsValues).map(([optionName, value]) => {
                if (value?.totalCost > 0) {
                  return (
                    <div key={optionName} className="flex justify-between">
                      <span>{optionName}:</span>
                      <span>+${value.totalCost.toFixed(2)}</span>
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Standard options breakdown */}
              {selectedOptions.map(selected => {
                const option = standardOptions.find(opt => opt.id === selected.optionId);
                if (!option || !selected.value) return null;
                
                let cost = 0;
                if (selected.priceOverride !== undefined) {
                  cost = selected.priceOverride;
                } else if (option.type === 'toggle' && selected.value) {
                  cost = option.price_modifier || 0;
                } else if (option.type === 'dropdown' || option.type === 'radio') {
                  const selectedValue = option.values?.find(v => v.value === selected.value);
                  cost = selectedValue?.price_modifier || 0;
                } else if (option.type === 'numeric' && selected.value) {
                  cost = (option.price_modifier || 0) * selected.value;
                }
                
                if (cost !== 0) {
                  return (
                    <div key={selected.optionId} className="flex justify-between">
                      <span>{option.name}:</span>
                      <span>{cost >= 0 ? '+' : ''}${cost.toFixed(2)}</span>
                    </div>
                  );
                }
                return null;
              })}
              
              {totalPriceImpact === 0 && (
                <div className="text-center text-gray-500 py-2">
                  No pricing impact from current selections
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};