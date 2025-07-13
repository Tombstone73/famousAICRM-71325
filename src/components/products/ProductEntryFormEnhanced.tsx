import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModularProductConfiguration } from './ModularProductConfiguration';
import { useProducts } from '@/hooks/useProducts';
import { usePricingModels } from '@/hooks/usePricingModels';
import { useToast } from '@/hooks/use-toast';

interface ProductFormData {
  name: string;
  description?: string;
  category?: string;
  pricing_model_id?: string;
  image_urls?: string[];
}

interface ProductEntryFormEnhancedProps {
  productId?: string;
  onClose?: () => void;
}

export const ProductEntryFormEnhanced: React.FC<ProductEntryFormEnhancedProps> = ({ 
  productId, 
  onClose
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    pricing_model_id: '',
    image_urls: []
  });
  const [productConfig, setProductConfig] = useState({});
  
  const { addProduct, updateProduct, getProduct } = useProducts();
  const { pricingModels } = usePricingModels();
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

    try {
      if (productId) {
        await updateProduct(productId, formData);
      } else {
        await addProduct(formData);
      }

      toast({
        title: 'Success',
        description: `Product ${productId ? 'updated' : 'created'} successfully`
      });
      onClose?.();
    } catch (error) {
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
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="options">Options & Pricing</TabsTrigger>
              <TabsTrigger value="test">Test Formula</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
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
                  <div>
                    <Label>Pricing Model</Label>
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
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Product
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="options">
              <ModularProductConfiguration
                productId={productId}
                onConfigurationChange={setProductConfig}
              />
            </TabsContent>
            
            <TabsContent value="test">
              <div className="text-center py-8 text-gray-500">
                Formula testing will be available after selecting options
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};