import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePricingModels } from '@/hooks/usePricingModels';
import { Product } from '@/hooks/useProducts';

interface ProductDetailsTabProps {
  product: Partial<Product>;
  onChange: (updates: Partial<Product>) => void;
}

export const ProductDetailsTab: React.FC<ProductDetailsTabProps> = ({ product, onChange }) => {
  const { pricingModels, loading } = usePricingModels();

  // Debug logging for pricing models
  React.useEffect(() => {
    console.log('ProductDetailsTab - Pricing models:', pricingModels);
    console.log('ProductDetailsTab - Loading state:', loading);
    
    if (!loading && (!pricingModels || pricingModels.length === 0)) {
      console.error('Pricing models failed to load or are empty:', pricingModels);
    }
  }, [pricingModels, loading]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={product.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={product.sku || ''}
                onChange={(e) => onChange({ sku: e.target.value })}
                placeholder="Enter SKU"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={product.description || ''}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Enter product description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={product.category || ''}
                onChange={(e) => onChange({ category: e.target.value })}
                placeholder="Enter category"
              />
            </div>
            <div>
              <Label htmlFor="unit_of_measure">Unit of Measure</Label>
              <Select
                value={product.unit_of_measure || 'inches'}
                onValueChange={(value) => onChange({ unit_of_measure: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inches">Inches</SelectItem>
                  <SelectItem value="feet">Feet</SelectItem>
                  <SelectItem value="mm">Millimeters</SelectItem>
                  <SelectItem value="cm">Centimeters</SelectItem>
                  <SelectItem value="each">Each</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dimensions & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                value={product.width || ''}
                onChange={(e) => onChange({ width: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                value={product.height || ''}
                onChange={(e) => onChange({ height: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={product.price || ''}
                onChange={(e) => onChange({ price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={product.cost || ''}
                onChange={(e) => onChange({ cost: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="pricing_model">Pricing Model</Label>
              {loading ? (
                <div className="text-sm text-gray-500 p-2 border rounded">Loading pricing models...</div>
              ) : pricingModels && pricingModels.length > 0 ? (
                <Select
                  value={product.pricing_model_id || 'none'}
                  onValueChange={(value) => onChange({ pricing_model_id: value === 'none' ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Pricing Model</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={product.stock_quantity || ''}
                onChange={(e) => onChange({ stock_quantity: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
              <Input
                id="low_stock_threshold"
                type="number"
                value={product.low_stock_threshold || ''}
                onChange={(e) => onChange({ low_stock_threshold: parseInt(e.target.value) || 10 })}
                placeholder="10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={product.is_active ?? true}
              onCheckedChange={(checked) => onChange({ is_active: checked })}
            />
            <Label htmlFor="is_active">Active Product</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};