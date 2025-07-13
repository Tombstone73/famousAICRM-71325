import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@/hooks/useProducts';
import { usePricingModels } from '@/hooks/usePricingModels';
import { useProductOptions } from '@/hooks/useProductOptions';
import { ProductOptionsManager } from './ProductOptionsManager';
import { ProductImageUpload } from './ProductImageUpload';
import { PriceTestSection } from './PriceTestSection';
import { useToast } from '@/hooks/use-toast';

export interface ProductFormData {
  name: string;
  description?: string;
  category?: string;
  pricing_model_id?: string;
  image_urls?: string[];
  isActive?: boolean;
  materialType?: string;
  pricePerSqFt?: number;
  pricePerSheet?: number;
  minimumCharge?: number;
}

interface ProductEntryFormProps {
  productId?: string;
  onClose?: () => void;
  onSubmit?: (data: ProductFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export const ProductEntryForm: React.FC<ProductEntryFormProps> = ({ 
  productId, 
  onClose, 
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    pricing_model_id: '',
    image_urls: []
  });
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  const { addProduct, updateProduct, getProduct } = useProducts();
  const { pricingModels } = usePricingModels();
  const { getProductOptionMappings, addProductOptionMapping } = useProductOptions();
  const { toast } = useToast();

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    if (!productId) return;
    const product = await getProduct(productId);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category || '',
        pricing_model_id: product.pricing_model_id || '',
        image_urls: product.image_urls || []
      });
      
      const mappings = await getProductOptionMappings(productId);
      setSelectedOptions(mappings.map(m => m.option_id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Product name is required',
        variant: 'destructive'
      });
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
      return;
    }

    try {
      let savedProduct;
      if (productId) {
        await updateProduct(productId, formData);
        savedProduct = { id: productId };
      } else {
        savedProduct = await addProduct(formData);
      }

      if (savedProduct?.id) {
        const existingMappings = await getProductOptionMappings(savedProduct.id);
        const existingOptionIds = existingMappings.map(m => m.option_id);
        
        for (const optionId of selectedOptions) {
          if (!existingOptionIds.includes(optionId)) {
            await addProductOptionMapping({
              product_id: savedProduct.id,
              option_id: optionId,
              required: false
            });
          }
        }
      }

      toast({
        title: 'Success',
        description: `Product ${productId ? 'updated' : 'created'} successfully`
      });
      onClose?.();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{productId ? 'Edit Product' : 'Add Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="main">Product Details</TabsTrigger>
              <TabsTrigger value="test">Price Testing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="main">
              <ScrollArea className="h-[600px] pr-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pricing Model</h3>
                    <div>
                      <Label>Select Pricing Model</Label>
                      <Select
                        value={formData.pricing_model_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, pricing_model_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing model" />
                        </SelectTrigger>
                        <SelectContent>
                          {pricingModels.map(model => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name} ({model.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-6">
                    <Button type="button" variant="outline" onClick={onCancel || onClose} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Product'}
                    </Button>
                  </div>
                </form>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="test">
              <ScrollArea className="h-[600px] pr-4">
                <PriceTestSection
                  productId={productId}
                  pricingModelId={formData.pricing_model_id}
                  selectedOptions={selectedOptions}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};