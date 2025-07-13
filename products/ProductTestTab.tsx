import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Play, RotateCcw } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { usePricingModels } from '@/hooks/usePricingModels';

interface ProductTestTabProps {
  product: Partial<Product>;
  options: any[];
}

export const ProductTestTab: React.FC<ProductTestTabProps> = ({ product, options }) => {
  const { pricingModels } = usePricingModels();
  const [testInputs, setTestInputs] = useState({
    quantity: 1,
    width: product.width || 0,
    height: product.height || 0,
    selectedOptions: {} as Record<string, string>
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [calculationDetails, setCalculationDetails] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const selectedPricingModel = pricingModels.find(m => m.id === product.pricing_model_id);

  const handleInputChange = (field: string, value: any) => {
    setTestInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (optionId: string, value: string) => {
    setTestInputs(prev => ({
      ...prev,
      selectedOptions: { ...prev.selectedOptions, [optionId]: value }
    }));
  };

  const calculatePrice = async () => {
    setIsCalculating(true);
    
    try {
      // Basic calculation logic
      let basePrice = product.price || 0;
      let totalPrice = basePrice;
      
      // Apply quantity
      totalPrice *= testInputs.quantity;
      
      // Apply dimensions if pricing model uses area
      if (selectedPricingModel && selectedPricingModel.unit === 'sqft') {
        const area = (testInputs.width * testInputs.height) / 144; // Convert to sq ft
        totalPrice = basePrice * area * testInputs.quantity;
      }
      
      // Apply option pricing (simplified)
      const optionUpcharges = Object.entries(testInputs.selectedOptions).reduce((total, [optionId, value]) => {
        // In a real implementation, you'd look up option pricing
        return total + 5; // $5 upcharge per option for demo
      }, 0);
      
      totalPrice += optionUpcharges * testInputs.quantity;
      
      setCalculatedPrice(totalPrice);
      setCalculationDetails({
        basePrice,
        quantity: testInputs.quantity,
        area: selectedPricingModel?.unit === 'sqft' ? (testInputs.width * testInputs.height) / 144 : null,
        optionUpcharges,
        totalPrice
      });
    } catch (error) {
      console.error('Error calculating price:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const resetInputs = () => {
    setTestInputs({
      quantity: 1,
      width: product.width || 0,
      height: product.height || 0,
      selectedOptions: {}
    });
    setCalculatedPrice(0);
    setCalculationDetails(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Formula Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="test-quantity">Quantity</Label>
              <Input
                id="test-quantity"
                type="number"
                min="1"
                value={testInputs.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label htmlFor="test-width">Width</Label>
              <Input
                id="test-width"
                type="number"
                step="0.01"
                value={testInputs.width}
                onChange={(e) => handleInputChange('width', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="test-height">Height</Label>
              <Input
                id="test-height"
                type="number"
                step="0.01"
                value={testInputs.height}
                onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {options.length > 0 && (
            <div>
              <Label>Product Options</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {options.map((option) => (
                  <div key={option.id}>
                    <Label className="text-sm">{option.name}</Label>
                    {option.type === 'select' ? (
                      <Select
                        value={testInputs.selectedOptions[option.id] || ''}
                        onValueChange={(value) => handleOptionChange(option.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          {option.values.map((value: string) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={option.type === 'number' ? 'number' : 'text'}
                        value={testInputs.selectedOptions[option.id] || ''}
                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        placeholder={`Enter ${option.name.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={calculatePrice} 
              disabled={isCalculating}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isCalculating ? 'Calculating...' : 'Calculate Price'}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetInputs}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {calculationDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  ${calculatedPrice.toFixed(2)}
                </div>
                <p className="text-muted-foreground">Total Price</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Calculation Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>${calculationDetails.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{calculationDetails.quantity}</span>
                  </div>
                  {calculationDetails.area && (
                    <div className="flex justify-between">
                      <span>Area (sq ft):</span>
                      <span>{calculationDetails.area.toFixed(2)}</span>
                    </div>
                  )}
                  {calculationDetails.optionUpcharges > 0 && (
                    <div className="flex justify-between">
                      <span>Option Upcharges:</span>
                      <span>${calculationDetails.optionUpcharges.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total:</span>
                    <span>${calculationDetails.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedPricingModel && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Pricing Model Used</h4>
                  <div className="flex items-center gap-2">
                    <Badge>{selectedPricingModel.name}</Badge>
                    <Badge variant="outline">{selectedPricingModel.unit}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Formula: {selectedPricingModel.formula}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};