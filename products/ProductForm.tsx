import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types/products';
import { usePricingModels } from '@/hooks/useProducts';
import { FormulaEngine } from '@/lib/formulaEngine';
import { MultiImageUpload } from './MultiImageUpload';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  category: string;
  pricing_model_id: string;
  width: number;
  height: number;
  quantity: number;
  calculated_price: number;
  image_urls: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const { pricingModels } = usePricingModels();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      category: product?.category || '',
      pricing_model_id: product?.pricing_model_id || '',
      width: 0,
      height: 0,
      quantity: 1,
      calculated_price: 0,
      image_urls: (product as any)?.image_urls || []
    }
  });

  const watchedFields = watch();

  const calculatePrice = () => {
    const model = pricingModels.find(m => m.id === watchedFields.pricing_model_id);
    if (!model) return;

    try {
      const formula = JSON.parse(model.formula);
      const context = {
        width: watchedFields.width,
        height: watchedFields.height,
        quantity: watchedFields.quantity,
        base_rate: formula.base_rate || 2.5,
        setup_fee: model.setup_fee || 0,
        min_price: model.min_price || 0,
        max_price: model.max_price || 0
      };

      let price = 0;
      if (formula.calculation) {
        price = FormulaEngine.evaluateFormula(formula.calculation, context);
      } else {
        price = formula.base_rate || 0;
        if (formula.width_enabled && formula.height_enabled && watchedFields.width && watchedFields.height) {
          price = Math.ceil(watchedFields.width * watchedFields.height * (formula.base_rate || 1));
        }
      }
      
      if (model.min_price && price < model.min_price) price = model.min_price;
      if (model.max_price && price > model.max_price) price = model.max_price;
      
      price += model.setup_fee || 0;
      
      setValue('calculated_price', Math.ceil(price * 100) / 100);
    } catch (e) {
      console.error('Error calculating price:', e);
    }
  };

  useEffect(() => {
    if (watchedFields.pricing_model_id) {
      calculatePrice();
    }
  }, [watchedFields.width, watchedFields.height, watchedFields.quantity, watchedFields.pricing_model_id]);

  const onFormSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await onSubmit({
        ...data,
        base_price: data.calculated_price
      });
      toast({
        title: 'Success',
        description: product ? 'Product updated successfully' : 'Product created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedModel = pricingModels.find(m => m.id === watchedFields.pricing_model_id);
  const modelFormula = selectedModel ? JSON.parse(selectedModel.formula || '{}') : {};

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Product name is required' })}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <MultiImageUpload
            imageUrls={watchedFields.image_urls}
            onImagesChange={(urls) => setValue('image_urls', urls)}
            productId={product?.id}
          />

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              {...register('category')}
              placeholder="Enter product category"
            />
          </div>

          <div>
            <Label htmlFor="pricing_model">Pricing Model</Label>
            <Select
              value={watchedFields.pricing_model_id}
              onValueChange={(value) => setValue('pricing_model_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pricing model" />
              </SelectTrigger>
              <SelectContent>
                {pricingModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedModel && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium">Size & Pricing Calculator</h3>
              
              <div className="grid grid-cols-3 gap-4">
                {modelFormula.width_enabled && (
                  <div>
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      min="0"
                      {...register('width', { valueAsNumber: true })}
                      placeholder="0.0"
                    />
                  </div>
                )}
                
                {modelFormula.height_enabled && (
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      min="0"
                      {...register('height', { valueAsNumber: true })}
                      placeholder="0.0"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    {...register('quantity', { valueAsNumber: true })}
                    placeholder="1"
                  />
                </div>
              </div>
              
              {watchedFields.calculated_price > 0 && (
                <div className="text-lg font-semibold text-green-600">
                  Calculated Price: ${watchedFields.calculated_price.toFixed(2)}
                  {selectedModel.setup_fee > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      (includes ${selectedModel.setup_fee.toFixed(2)} setup fee)
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading || !watchedFields.name.trim()}>
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
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

export default ProductForm;