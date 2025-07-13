import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DimensionSectionProps {
  data: {
    minWidth?: number;
    minHeight?: number;
    defaultWidth?: number;
    defaultHeight?: number;
    unitOfMeasure?: 'inches' | 'feet' | 'mm';
    pricingMode?: 'sqft' | 'sheet' | 'flatrate';
    standardSheetSize?: { width: number; height: number };
  };
  onChange: (updates: any) => void;
}

export const DimensionSectionWithUnits: React.FC<DimensionSectionProps> = ({ data, onChange }) => {
  const unitLabel = data.unitOfMeasure === 'inches' ? 'in' : 
                   data.unitOfMeasure === 'feet' ? 'ft' : 'mm';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dimensions & Material</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
          <Select 
            value={data.unitOfMeasure || 'inches'} 
            onValueChange={(value: 'inches' | 'feet' | 'mm') => onChange({ unitOfMeasure: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inches">Inches (in)</SelectItem>
              <SelectItem value="feet">Feet (ft)</SelectItem>
              <SelectItem value="mm">Millimeters (mm)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="pricingMode">Pricing Mode</Label>
          <Select 
            value={data.pricingMode || 'sqft'} 
            onValueChange={(value: 'sqft' | 'sheet' | 'flatrate') => onChange({ pricingMode: value })}
          >
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
            <Label htmlFor="minWidth">Minimum Width ({unitLabel})</Label>
            <Input
              id="minWidth"
              type="number"
              step="0.01"
              value={data.minWidth || ''}
              onChange={(e) => onChange({ minWidth: parseFloat(e.target.value) || 0 })}
              placeholder={`Enter width in ${data.unitOfMeasure || 'inches'}`}
            />
          </div>
          <div>
            <Label htmlFor="minHeight">Minimum Height ({unitLabel})</Label>
            <Input
              id="minHeight"
              type="number"
              step="0.01"
              value={data.minHeight || ''}
              onChange={(e) => onChange({ minHeight: parseFloat(e.target.value) || 0 })}
              placeholder={`Enter height in ${data.unitOfMeasure || 'inches'}`}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="defaultWidth">Default Width ({unitLabel})</Label>
            <Input
              id="defaultWidth"
              type="number"
              step="0.01"
              value={data.defaultWidth || ''}
              onChange={(e) => onChange({ defaultWidth: parseFloat(e.target.value) || 0 })}
              placeholder={`Enter width in ${data.unitOfMeasure || 'inches'}`}
            />
          </div>
          <div>
            <Label htmlFor="defaultHeight">Default Height ({unitLabel})</Label>
            <Input
              id="defaultHeight"
              type="number"
              step="0.01"
              value={data.defaultHeight || ''}
              onChange={(e) => onChange({ defaultHeight: parseFloat(e.target.value) || 0 })}
              placeholder={`Enter height in ${data.unitOfMeasure || 'inches'}`}
            />
          </div>
        </div>
        
        {data.pricingMode === 'sheet' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sheetWidth">Standard Sheet Width ({unitLabel})</Label>
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
                placeholder={`48 ${unitLabel}`}
              />
            </div>
            <div>
              <Label htmlFor="sheetHeight">Standard Sheet Height ({unitLabel})</Label>
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
                placeholder={`96 ${unitLabel}`}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};