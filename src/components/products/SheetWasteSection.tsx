import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProductFormData } from './ProductEntryForm';

interface SheetWasteSectionProps {
  data: ProductFormData;
  onChange: (updates: Partial<ProductFormData>) => void;
}

export const SheetWasteSection: React.FC<SheetWasteSectionProps> = ({ data, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sheet Usage & Waste Logic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Allow Partial Sheet Billing?</Label>
          <RadioGroup 
            value={data.allowPartialSheetBilling ? 'yes' : 'no'}
            onValueChange={(value) => onChange({ allowPartialSheetBilling: value === 'yes' })}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="partial-yes" />
              <Label htmlFor="partial-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="partial-no" />
              <Label htmlFor="partial-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="minReusableWaste">Minimum Reusable Waste Area (sq in)</Label>
          <Input
            id="minReusableWaste"
            type="number"
            step="0.01"
            value={data.minReusableWasteArea}
            onChange={(e) => onChange({ minReusableWasteArea: parseFloat(e.target.value) || 0 })}
            placeholder="432"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Example: 432 sq in = 36" x 12" cutoff
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="chargeForWaste"
            checked={data.chargeForReusableWaste}
            onCheckedChange={(checked) => onChange({ chargeForReusableWaste: !!checked })}
          />
          <Label htmlFor="chargeForWaste">Charge for Reusable Waste</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="trackCutoffs"
            checked={data.trackReusableCutoffs}
            onCheckedChange={(checked) => onChange({ trackReusableCutoffs: !!checked })}
          />
          <Label htmlFor="trackCutoffs">Track Reusable Cutoffs (for inventory)</Label>
        </div>
      </CardContent>
    </Card>
  );
};