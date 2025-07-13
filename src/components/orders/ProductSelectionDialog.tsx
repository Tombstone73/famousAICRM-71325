import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types/products';
import { supabase } from '@/lib/supabase';
import { Plus, X } from 'lucide-react';

interface ProductOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_required: boolean;
  selected?: boolean;
}

interface CustomOption {
  id: string;
  name: string;
  value: string;
  price: number;
}

interface ProductSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onConfirm: (data: {
    customWidth?: number;
    customHeight?: number;
    selectedOptions: ProductOption[];
    customOptions: CustomOption[];
  }) => void;
}

const ProductSelectionDialog: React.FC<ProductSelectionDialogProps> = ({
  open,
  onOpenChange,
  product,
  onConfirm
}) => {
  const [customWidth, setCustomWidth] = useState<number>();
  const [customHeight, setCustomHeight] = useState<number>();
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product.id) {
      loadProductOptions();
    }
  }, [open, product.id]);

  const loadProductOptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_options')
        .select('*')
        .eq('product_id', product.id)
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      setProductOptions(data || []);
    } catch (error) {
      console.error('Error loading product options:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOption = (optionId: string) => {
    setProductOptions(prev => 
      prev.map(opt => 
        opt.id === optionId ? { ...opt, selected: !opt.selected } : opt
      )
    );
  };

  const addCustomOption = () => {
    const newOption: CustomOption = {
      id: Date.now().toString(),
      name: '',
      value: '',
      price: 0
    };
    setCustomOptions([...customOptions, newOption]);
  };

  const updateCustomOption = (id: string, field: keyof CustomOption, value: any) => {
    setCustomOptions(prev => 
      prev.map(opt => 
        opt.id === id ? { ...opt, [field]: value } : opt
      )
    );
  };

  const removeCustomOption = (id: string) => {
    setCustomOptions(prev => prev.filter(opt => opt.id !== id));
  };

  const handleConfirm = () => {
    onConfirm({
      customWidth,
      customHeight,
      selectedOptions: productOptions.filter(opt => opt.selected),
      customOptions: customOptions.filter(opt => opt.name.trim())
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Product: {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Sizing Section */}
          {(product.min_width || product.min_height) && (
            <Card>
              <CardHeader>
                <CardTitle>Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {product.min_width && (
                    <div className="space-y-2">
                      <Label>Width (inches)</Label>
                      <Input
                        type="number"
                        value={customWidth || product.default_width || ''}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        min={product.min_width}
                        placeholder={`Min: ${product.min_width}`}
                      />
                    </div>
                  )}
                  {product.min_height && (
                    <div className="space-y-2">
                      <Label>Height (inches)</Label>
                      <Input
                        type="number"
                        value={customHeight || product.default_height || ''}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        min={product.min_height}
                        placeholder={`Min: ${product.min_height}`}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Options */}
          {productOptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Available Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {productOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={option.selected || false}
                      onCheckedChange={() => toggleOption(option.id)}
                    />
                    <div className="flex-1">
                      <Label className="font-medium">{option.name}</Label>
                      {option.description && (
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      )}
                    </div>
                    {option.price > 0 && (
                      <span className="text-sm font-medium">+${option.price}</span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Custom Options */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Custom Options</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addCustomOption}>
                  <Plus className="w-4 h-4 mr-1" />Add Option
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {customOptions.map(option => (
                <div key={option.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4">
                    <Input
                      value={option.name}
                      onChange={(e) => updateCustomOption(option.id, 'name', e.target.value)}
                      placeholder="Option Name"
                    />
                  </div>
                  <div className="col-span-4">
                    <Input
                      value={option.value}
                      onChange={(e) => updateCustomOption(option.id, 'value', e.target.value)}
                      placeholder="Value"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      value={option.price || ''}
                      onChange={(e) => updateCustomOption(option.id, 'price', Number(e.target.value))}
                      placeholder="Price"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomOption(option.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Add to Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectionDialog;