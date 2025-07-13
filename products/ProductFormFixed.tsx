import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { MultiImageUpload } from './MultiImageUpload';
import { ProductOptionsTab } from './ProductOptionsTab';
import { PricingTabContent } from './PricingTabContent';
import { TestTabContent } from './TestTabContent';
import { usePricingModels } from '@/hooks/usePricingModels';
import { useProductOptions } from '@/hooks/useProductOptions';
import { Product } from '@/types/products';

interface ProductFormData {
  name: string;
  description?: string;
  category?: string;
  pricing_model_id?: string;
  default_width?: number;
  default_height?: number;
  status: 'active' | 'archived';
  image_urls: string[];
  selected_options: string[];
}

interface ProductFormFixedProps {
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  product?: Product;
  productId?: string;
}

export const ProductFormFixed: React.FC<ProductFormFixedProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  product,
  productId
}) => {
  const { pricingModels } = usePricingModels();
  const { refetch: refetchOptions } = useProductOptions();
  const { toast } = useToast();
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      category: product?.category || '',
      pricing_model_id: product?.pricing_model_id || '',
      default_width: product?.default_width || 48,
      default_height: product?.default_height || 24,
      status: product?.status || 'active',
      image_urls: [],
      selected_options: []
    }
  });

  const watchedFields = watch();
  const selectedPricingModel = pricingModels.find(m => m.id === watchedFields.pricing_model_id);
  
  // Get product dimensions for conditional options
  const productDimensions = {
    width: watchedFields.default_width || 48,
    height: watchedFields.default_height || 24
  };

  const onFormSubmit = async (data: ProductFormData) => {
    if (!data.name.trim()) {
      toast({ title: 'Error', description: 'Product name is required', variant: 'destructive' });
      return;
    }
    onSubmit(data);
  };

  const handleOptionToggle = (optionId: string, checked: boolean) => {
    const current = watchedFields.selected_options || [];
    if (checked) {
      setValue('selected_options', [...current, optionId]);
    } else {
      setValue('selected_options', current.filter(id => id !== optionId));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'Product name is required' })}
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Product description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      {...register('category')}
                      placeholder="Product category"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="default_width">Default Width (inches)</Label>
                      <Input
                        id="default_width"
                        type="number"
                        step="0.01"
                        {...register('default_width', { valueAsNumber: true })}
                        placeholder="48"
                      />
                    </div>
                    <div>
                      <Label htmlFor="default_height">Default Height (inches)</Label>
                      <Input
                        id="default_height"
                        type="number"
                        step="0.01"
                        {...register('default_height', { valueAsNumber: true })}
                        placeholder="24"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={watchedFields.status}
                      onValueChange={(value: 'active' | 'archived') => setValue('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="pricing">
              <ScrollArea className="h-[500px] pr-4">
                <PricingTabContent
                  pricingModelId={watchedFields.pricing_model_id}
                  onPricingModelChange={(value) => setValue('pricing_model_id', value)}
                />
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="options">
              <ScrollArea className="h-[500px] pr-4">
                <ProductOptionsTab
                  productId={productId || product?.id || 'temp'}
                  productDimensions={productDimensions}
                  readOnly={false}
                />
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="images">
              <ScrollArea className="h-[500px] pr-4">
                <MultiImageUpload
                  imageUrls={watchedFields.image_urls}
                  onImagesChange={(urls) => setValue('image_urls', urls)}
                  productId={productId || product?.id || 'temp'}
                />
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="test">
              <ScrollArea className="h-[500px] pr-4">
                <TestTabContent
                  formula={selectedPricingModel?.formula}
                  pricingModel={selectedPricingModel}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
          
          <div className="flex gap-2 pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};