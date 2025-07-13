import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductFormData } from './ProductEntryForm';

interface PricingSectionProps {
  data: ProductFormData;
  onChange: (updates: Partial<ProductFormData>) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ data, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.pricingMode === 'sqft' && (
          <div>
            <Label htmlFor="pricePerSqFt">Price Per Square Foot</Label>
            <Input
              id="pricePerSqFt"
              type="number"
              step="0.01"
              value={data.pricePerSqFt || ''}
              onChange={(e) => onChange({ pricePerSqFt: parseFloat(e.target.value) || 0 })}
              placeholder="6.25"
            />
          </div>
        )}
        
        {data.pricingMode === 'sheet' && (
          <div>
            <Label htmlFor="pricePerSheet">Price Per Full Sheet</Label>
            <Input
              id="pricePerSheet"
              type="number"
              step="0.01"
              value={data.pricePerSheet || ''}
              onChange={(e) => onChange({ pricePerSheet: parseFloat(e.target.value) || 0 })}
              placeholder="75.00"
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="minimumCharge">Minimum Charge (Optional)</Label>
          <Input
            id="minimumCharge"
            type="number"
            step="0.01"
            value={data.minimumCharge || ''}
            onChange={(e) => onChange({ minimumCharge: parseFloat(e.target.value) || undefined })}
            placeholder="20.00"
          />
        </div>
        
        <div>
          <Label htmlFor="roundingIncrement">Rounding Increment</Label>
          <Select 
            value={data.roundingIncrement.toString()} 
            onValueChange={(value) => onChange({ roundingIncrement: parseInt(value) as 0 | 1 | 6 | 12 })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No Rounding</SelectItem>
              <SelectItem value="1">1 inch</SelectItem>
              <SelectItem value="6">6 inches</SelectItem>
              <SelectItem value="12">12 inches</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useMathCeil"
            checked={data.useMathCeil}
            onCheckedChange={(checked) => onChange({ useMathCeil: !!checked })}
          />
          <Label htmlFor="useMathCeil">Use Math.ceil Logic</Label>
        </div>
      </CardContent>
    </Card>
  );
};