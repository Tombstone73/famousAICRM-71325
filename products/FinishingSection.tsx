import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import EnhancedProductOptionsManager from './EnhancedProductOptionsManager';
import { ProductFormData } from './ProductEntryForm';

interface FinishingSectionProps {
  data: ProductFormData;
  onChange: (updates: Partial<ProductFormData>) => void;
  productId?: string;
}

export const FinishingSection: React.FC<FinishingSectionProps> = ({ data, onChange, productId }) => {
  const handleOptionsChange = (options: any[]) => {
    onChange({ customOptions: options });
  };

  return (
    <div className="space-y-6">
      {/* Legacy Options - Keep for backward compatibility */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Finishing Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="addGrommets"
                checked={data.addGrommets}
                onCheckedChange={(checked) => onChange({ addGrommets: !!checked })}
              />
              <Label htmlFor="addGrommets">Add Grommets</Label>
            </div>
            {data.addGrommets && (
              <div className="ml-6">
                <Label htmlFor="grommetPrice">Price per Grommet</Label>
                <Input
                  id="grommetPrice"
                  type="number"
                  step="0.01"
                  value={data.grommetPrice || ''}
                  onChange={(e) => onChange({ grommetPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="0.25"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="addPolePockets"
                checked={data.addPolePockets}
                onCheckedChange={(checked) => onChange({ addPolePockets: !!checked })}
              />
              <Label htmlFor="addPolePockets">Add Pole Pockets</Label>
            </div>
            {data.addPolePockets && (
              <div className="ml-6">
                <Label htmlFor="polePocketPrice">Price per Side</Label>
                <Input
                  id="polePocketPrice"
                  type="number"
                  step="0.01"
                  value={data.polePocketPrice || ''}
                  onChange={(e) => onChange({ polePocketPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="4.00"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="addLaminate"
                checked={data.addLaminate}
                onCheckedChange={(checked) => onChange({ addLaminate: !!checked })}
              />
              <Label htmlFor="addLaminate">Add Laminate</Label>
            </div>
            {data.addLaminate && (
              <div className="ml-6">
                <Label htmlFor="laminatePrice">Price per Square Foot</Label>
                <Input
                  id="laminatePrice"
                  type="number"
                  step="0.01"
                  value={data.laminatePrice || ''}
                  onChange={(e) => onChange({ laminatePrice: parseFloat(e.target.value) || 0 })}
                  placeholder="1.00"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Options Manager */}
      <EnhancedProductOptionsManager
        productId={productId}
        mode="manage"
        onOptionsChange={handleOptionsChange}
      />
    </div>
  );
};