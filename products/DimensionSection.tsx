import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductFormData } from './ProductEntryForm';

interface DimensionSectionProps {
  data: ProductFormData;
  onChange: (updates: Partial<ProductFormData>) => void;
}

export const DimensionSection: React.FC<DimensionSectionProps> = ({ data, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dimensions & Material</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pricingMode">Pricing Mode</Label>
          <Select value={data.pricingMode} onValueChange={(value: 'sqft' | 'sheet' | 'flatrate') => onChange({ pricingMode: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqft">By Square Foot</SelectItem>
              <SelectItem value="sheet">By Sheet</SelectItem>
              <SelectItem value="flatrate">Flat Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minWidth">Minimum Width</Label>
            <Input
              id="minWidth"
              type="number"
              step="0.01"
              value={data.minWidth}
              onChange={(e) => onChange({ minWidth: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="minHeight">Minimum Height</Label>
            <Input
              id="minHeight"
              type="number"
              step="0.01"
              value={data.minHeight}
              onChange={(e) => onChange({ minHeight: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="defaultWidth">Default Width</Label>
            <Input
              id="defaultWidth"
              type="number"
              step="0.01"
              value={data.defaultWidth}
              onChange={(e) => onChange({ defaultWidth: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="defaultHeight">Default Height</Label>
            <Input
              id="defaultHeight"
              type="number"
              step="0.01"
              value={data.defaultHeight}
              onChange={(e) => onChange({ defaultHeight: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
          <Select value={data.unitOfMeasure} onValueChange={(value: 'inches' | 'feet' | 'mm') => onChange({ unitOfMeasure: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inches">Inches</SelectItem>
              <SelectItem value="feet">Feet</SelectItem>
              <SelectItem value="mm">Millimeters</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {data.pricingMode === 'sheet' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sheetWidth">Standard Sheet Width</Label>
              <Input
                id="sheetWidth"
                type="number"
                step="0.01"
                value={data.standardSheetSize?.width || ''}
                onChange={(e) => onChange({ 
                  standardSheetSize: { 
                    ...data.standardSheetSize, 
                    width: parseFloat(e.target.value) || 0,
                    height: data.standardSheetSize?.height || 0
                  } 
                })}
                placeholder="48"
              />
            </div>
            <div>
              <Label htmlFor="sheetHeight">Standard Sheet Height</Label>
              <Input
                id="sheetHeight"
                type="number"
                step="0.01"
                value={data.standardSheetSize?.height || ''}
                onChange={(e) => onChange({ 
                  standardSheetSize: { 
                    ...data.standardSheetSize, 
                    height: parseFloat(e.target.value) || 0,
                    width: data.standardSheetSize?.width || 0
                  } 
                })}
                placeholder="96"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};