import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Product } from '@/types/products';
import EnhancedProductOptionsManager from '../products/EnhancedProductOptionsManager';

interface ProductOption {
  id: string;
  name: string;
  value: string;
  price?: number;
}

interface ProductOptionsSectionProps {
  product: Product | null;
  selectedOptions: ProductOption[];
  onOptionsChange: (options: ProductOption[]) => void;
  customWidth?: number;
  customHeight?: number;
  onDimensionsChange?: (width: number, height: number) => void;
}

const ProductOptionsSection: React.FC<ProductOptionsSectionProps> = ({
  product,
  selectedOptions,
  onOptionsChange,
  customWidth,
  customHeight,
  onDimensionsChange
}) => {
  const addCustomOption = () => {
    const newOption: ProductOption = {
      id: Date.now().toString(),
      name: '',
      value: '',
      price: 0
    };
    onOptionsChange([...selectedOptions, newOption]);
  };

  const updateOption = (id: string, field: keyof ProductOption, value: any) => {
    const updated = selectedOptions.map(opt => 
      opt.id === id ? { ...opt, [field]: value } : opt
    );
    onOptionsChange(updated);
  };

  const removeOption = (id: string) => {
    onOptionsChange(selectedOptions.filter(opt => opt.id !== id));
  };

  const toggleProductOption = (optionName: string, price: number) => {
    const existing = selectedOptions.find(opt => opt.name === optionName);
    if (existing) {
      onOptionsChange(selectedOptions.filter(opt => opt.name !== optionName));
    } else {
      const newOption: ProductOption = {
        id: Date.now().toString(),
        name: optionName,
        value: 'Yes',
        price
      };
      onOptionsChange([...selectedOptions, newOption]);
    }
  };

  const handleEnhancedOptionsChange = (enhancedOptions: any[]) => {
    // Convert enhanced options to legacy format for compatibility
    const legacyOptions: ProductOption[] = enhancedOptions.map(opt => ({
      id: opt.optionId,
      name: opt.optionName,
      value: opt.selectedLabel,
      price: opt.totalPrice
    }));
    
    // Keep existing legacy options that aren't enhanced
    const existingLegacy = selectedOptions.filter(opt => 
      !enhancedOptions.some(eOpt => eOpt.optionId === opt.id)
    );
    
    onOptionsChange([...existingLegacy, ...legacyOptions]);
  };

  if (!product) return null;

  const dimensions = customWidth && customHeight ? {
    width: customWidth,
    height: customHeight
  } : undefined;

  return (
    <div className="space-y-6">
      {/* Dimensions */}
      {(product.min_width || product.min_height) && (
        <Card>
          <CardHeader>
            <CardTitle>Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {product.min_width && (
                <div>
                  <Label htmlFor="width" className="text-xs">Width</Label>
                  <Input
                    id="width"
                    type="number"
                    value={customWidth || product.default_width || ''}
                    onChange={(e) => onDimensionsChange?.(Number(e.target.value), customHeight || product.default_height || 0)}
                    min={product.min_width}
                    placeholder={`Min: ${product.min_width}`}
                  />
                </div>
              )}
              {product.min_height && (
                <div>
                  <Label htmlFor="height" className="text-xs">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    value={customHeight || product.default_height || ''}
                    onChange={(e) => onDimensionsChange?.(customWidth || product.default_width || 0, Number(e.target.value))}
                    min={product.min_height}
                    placeholder={`Min: ${product.min_height}`}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Product Options */}
      <EnhancedProductOptionsManager
        productId={product.id}
        dimensions={dimensions}
        mode="select"
        onOptionsChange={handleEnhancedOptionsChange}
      />

      {/* Legacy Built-in Options */}
      <Card>
        <CardHeader>
          <CardTitle>Built-in Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {product.add_grommets && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="grommets"
                checked={selectedOptions.some(opt => opt.name === 'Grommets')}
                onCheckedChange={() => toggleProductOption('Grommets', product.grommet_price || 0)}
              />
              <Label htmlFor="grommets" className="text-sm">
                Add Grommets {product.grommet_price ? `(+$${product.grommet_price})` : ''}
              </Label>
            </div>
          )}
          
          {product.add_pole_pockets && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pole-pockets"
                checked={selectedOptions.some(opt => opt.name === 'Pole Pockets')}
                onCheckedChange={() => toggleProductOption('Pole Pockets', product.pole_pocket_price || 0)}
              />
              <Label htmlFor="pole-pockets" className="text-sm">
                Add Pole Pockets {product.pole_pocket_price ? `(+$${product.pole_pocket_price})` : ''}
              </Label>
            </div>
          )}
          
          {product.add_laminate && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="laminate"
                checked={selectedOptions.some(opt => opt.name === 'Laminate')}
                onCheckedChange={() => toggleProductOption('Laminate', product.laminate_price || 0)}
              />
              <Label htmlFor="laminate" className="text-sm">
                Add Laminate {product.laminate_price ? `(+$${product.laminate_price})` : ''}
              </Label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Manual Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manual Options</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addCustomOption}>
              <Plus className="w-4 h-4 mr-1" />
              Add Manual Option
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {selectedOptions.filter(opt => !['Grommets', 'Pole Pockets', 'Laminate'].includes(opt.name)).map(option => (
            <div key={option.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                <Label className="text-xs">Option Name</Label>
                <Input
                  value={option.name}
                  onChange={(e) => updateOption(option.id, 'name', e.target.value)}
                  placeholder="e.g., Finishing"
                  className="text-sm"
                />
              </div>
              <div className="col-span-4">
                <Label className="text-xs">Value</Label>
                <Input
                  value={option.value}
                  onChange={(e) => updateOption(option.id, 'value', e.target.value)}
                  placeholder="e.g., Matte"
                  className="text-sm"
                />
              </div>
              <div className="col-span-3">
                <Label className="text-xs">Price (+$)</Label>
                <Input
                  type="number"
                  value={option.price || ''}
                  onChange={(e) => updateOption(option.id, 'price', Number(e.target.value))}
                  placeholder="0.00"
                  className="text-sm"
                  step="0.01"
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(option.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {selectedOptions.filter(opt => !['Grommets', 'Pole Pockets', 'Laminate'].includes(opt.name)).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No manual options added
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductOptionsSection;