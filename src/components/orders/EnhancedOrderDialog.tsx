import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types/products';
import { supabase } from '@/lib/supabase';
import SheetUsageCalculator from './SheetUsageCalculator';
import { FileImage, Upload } from 'lucide-react';

interface ProductOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_required: boolean;
  option_type: 'checkbox' | 'select' | 'input';
  option_values?: string[];
  selected?: boolean;
  value?: string;
}

interface EnhancedOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onConfirm: (data: {
    customWidth?: number;
    customHeight?: number;
    quantity: number;
    selectedOptions: ProductOption[];
    totalPrice: number;
  }) => void;
}

const EnhancedOrderDialog: React.FC<EnhancedOrderDialogProps> = ({
  open,
  onOpenChange,
  product,
  onConfirm
}) => {
  const [customWidth, setCustomWidth] = useState<number>(product.default_width || 24);
  const [customHeight, setCustomHeight] = useState<number>(product.default_height || 18);
  const [quantity, setQuantity] = useState(1);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSides, setSelectedSides] = useState<'single' | 'double'>('single');

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

  const updateOption = (optionId: string, field: string, value: any) => {
    setProductOptions(prev => 
      prev.map(opt => 
        opt.id === optionId ? { ...opt, [field]: value } : opt
      )
    );
  };

  const calculatePrice = () => {
    let basePrice = 0;
    
    if (product.pricing_mode === 'by_sqft' && product.price_per_sqft) {
      const sqft = (customWidth * customHeight) / 144;
      basePrice = sqft * product.price_per_sqft;
    } else if (product.pricing_mode === 'by_sheet' && product.price_per_sheet) {
      basePrice = product.price_per_sheet;
    } else if (product.base_price) {
      basePrice = product.base_price;
    }
    
    if (selectedSides === 'double') {
      basePrice *= 1.5;
    }
    
    const optionsPrice = productOptions
      .filter(opt => opt.selected)
      .reduce((sum, opt) => sum + opt.price, 0);
    
    return (basePrice + optionsPrice) * quantity;
  };

  const handleConfirm = () => {
    onConfirm({
      customWidth,
      customHeight,
      quantity,
      selectedOptions: productOptions.filter(opt => opt.selected),
      totalPrice: calculatePrice()
    });
    onOpenChange(false);
  };

  const totalPrice = calculatePrice();
  const unitPrice = totalPrice / quantity;
  const hasGrommets = productOptions.find(opt => opt.name.toLowerCase().includes('grommet') && opt.selected);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
          <div className="col-span-8 overflow-y-auto pr-2">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="artwork">Artwork</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Size Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label>Width (inches)</Label>
                        <Input
                          type="number"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(Number(e.target.value))}
                          min={product.min_width || 1}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height (inches)</Label>
                        <Input
                          type="number"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(Number(e.target.value))}
                          min={product.min_height || 1}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          min={1}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label>Print Sides</Label>
                      <Select value={selectedSides} onValueChange={(value: 'single' | 'double') => setSelectedSides(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single-Sided</SelectItem>
                          <SelectItem value="double">Double-Sided (+50%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {product.sheet_width && product.sheet_height && (
                      <SheetUsageCalculator
                        itemWidth={customWidth}
                        itemHeight={customHeight}
                        sheetWidth={product.sheet_width}
                        sheetHeight={product.sheet_height}
                        quantity={quantity}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="options" className="space-y-4 mt-4">
                {productOptions.length > 0 ? (
                  <div className="space-y-4">
                    {productOptions.map(option => (
                      <Card key={option.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium">{option.name}</Label>
                                {option.is_required && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                              </div>
                              {option.description && (
                                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {option.price > 0 && (
                                <span className="text-sm font-medium">+${option.price}</span>
                              )}
                              <Checkbox
                                checked={option.selected || false}
                                onCheckedChange={(checked) => updateOption(option.id, 'selected', checked)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">No options available for this product</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="artwork" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Artwork Upload</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-2">Upload your artwork files</p>
                      <Button variant="outline">Choose Files</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: PDF, AI, EPS, PNG, JPG. Maximum file size: 50MB
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="col-span-4 border-l pl-6 overflow-y-auto">
            <div className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold text-green-600">
                    ${totalPrice.toFixed(2)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {quantity} {quantity === 1 ? 'sheet' : 'sheets'} / 24 Hours Production
                  </p>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pricing Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Single-Sided:</span>
                      <span>${unitPrice.toFixed(2)} per sheet</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Double-Sided:</span>
                      <span>${(unitPrice * 1.5).toFixed(2)} per sheet</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium">
                    <span>Quantity: {quantity}</span>
                    <span>Total: ${totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  <Badge variant="outline" className="justify-center py-2 text-xs">
                    SIZE: {customWidth}" × {customHeight}"
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2 text-xs">
                    MATERIAL: {product.material_type || '4mm'}
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2 text-xs">
                    PRINT SIDES: {selectedSides.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2 text-xs">
                    GROMMETS: {hasGrommets ? 'YES' : 'NO'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={handleConfirm} className="w-full bg-blue-500 hover:bg-blue-600">
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedOrderDialog;