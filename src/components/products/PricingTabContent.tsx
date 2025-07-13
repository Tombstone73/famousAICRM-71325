import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePricingModels } from '@/hooks/usePricingModels';

interface PricingTabContentProps {
  pricingModelId?: string;
  onPricingModelChange: (value: string) => void;
}

export const PricingTabContent: React.FC<PricingTabContentProps> = ({
  pricingModelId,
  onPricingModelChange
}) => {
  const { pricingModels } = usePricingModels();
  const selectedModel = pricingModels.find(m => m.id === pricingModelId);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pricing_model">Pricing Model *</Label>
        <Select
          value={pricingModelId || ''}
          onValueChange={onPricingModelChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select pricing model" />
          </SelectTrigger>
          <SelectContent>
            {pricingModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedModel && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Selected Pricing Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>Name:</strong> {selectedModel.name}</div>
              <div><strong>Formula:</strong> {selectedModel.formula}</div>
              {selectedModel.description && (
                <div><strong>Description:</strong> {selectedModel.description}</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};