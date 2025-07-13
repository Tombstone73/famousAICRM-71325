import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, DollarSign } from 'lucide-react';
import { usePricingModels } from '@/hooks/usePricingModels';
import { Product } from '@/hooks/useProducts';

interface ProductPricingTabProps {
  product: Partial<Product>;
  onChange: (updates: Partial<Product>) => void;
}

export const ProductPricingTab: React.FC<ProductPricingTabProps> = ({ product, onChange }) => {
  const { pricingModels, loading } = usePricingModels();
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [customFormula, setCustomFormula] = useState('');
  const [basePrice, setBasePrice] = useState(product.price || 0);
  const [baseCost, setBaseCost] = useState(product.cost || 0);

  // Debug logging
  console.log('ProductPricingTab - Pricing models:', pricingModels);
  console.log('ProductPricingTab - Loading state:', loading);

  useEffect(() => {
    if (product.pricing_model_id && pricingModels && pricingModels.length > 0) {
      const model = pricingModels.find(m => m.id === product.pricing_model_id);
      setSelectedModel(model);
    }
  }, [product.pricing_model_id, pricingModels]);

  const handlePricingModelChange = (modelId: string) => {
    if (modelId === 'none') {
      setSelectedModel(null);
      onChange({ pricing_model_id: null });
      return;
    }
    
    const model = pricingModels.find(m => m.id === modelId);
    setSelectedModel(model);
    onChange({ pricing_model_id: modelId });
  };

  const calculateMargin = () => {
    if (basePrice && baseCost) {
      const margin = ((basePrice - baseCost) / basePrice) * 100;
      return margin.toFixed(1);
    }
    return '0';
  };

  const handlePriceChange = (price: number) => {
    setBasePrice(price);
    onChange({ price });
  };

  const handleCostChange = (cost: number) => {
    setBaseCost(cost);
    onChange({ cost });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Base Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="base-price">Base Price</Label>
              <Input
                id="base-price"
                type="number"
                step="0.01"
                value={basePrice}
                onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="base-cost">Base Cost</Label>
              <Input
                id="base-cost"
                type="number"
                step="0.01"
                value={baseCost}
                onChange={(e) => handleCostChange(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Margin</Label>
              <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                <Badge variant={parseFloat(calculateMargin()) > 0 ? 'default' : 'destructive'}>
                  {calculateMargin()}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pricing Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pricing-model">Select Pricing Model</Label>
            {loading ? (
              <div className="text-sm text-gray-500 p-2 border rounded">Loading pricing models...</div>
            ) : pricingModels && pricingModels.length > 0 ? (
              <Select
                value={product.pricing_model_id || 'none'}
                onValueChange={handlePricingModelChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a pricing model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No pricing model</SelectItem>
                  {pricingModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Alert>
                <AlertDescription>
                  No pricing models available. Please create a pricing model first.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {selectedModel && (
            <div className="space-y-3">
              <div>
                <Label>Model Details</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{selectedModel.name}</span>
                    <Badge>{selectedModel.unit}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Formula:</strong> {selectedModel.formula}
                  </div>
                </div>
              </div>

              {selectedModel.variables && Object.keys(selectedModel.variables).length > 0 && (
                <div>
                  <Label>Variables</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {Object.entries(selectedModel.variables).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm font-medium">{key}:</span>
                        <span className="text-sm">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Formula Override</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="custom-formula">Custom Formula</Label>
            <Textarea
              id="custom-formula"
              value={customFormula}
              onChange={(e) => setCustomFormula(e.target.value)}
              placeholder="Enter custom pricing formula (optional)"
              rows={3}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Use variables like: width, height, quantity, material_cost
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Validate Formula
            </Button>
            <Button variant="outline" size="sm">
              Test Formula
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span className="font-medium">${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Base Cost:</span>
                <span className="font-medium">${baseCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Margin:</span>
                <span className="font-medium">{calculateMargin()}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Pricing Model:</span>
                <span className="font-medium">
                  {selectedModel ? selectedModel.name : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Unit:</span>
                <span className="font-medium">
                  {selectedModel ? selectedModel.unit : product.unit_of_measure || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};