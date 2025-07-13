import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { usePricingModels } from '@/hooks/usePricingModels';
import { useProductOptions } from '@/hooks/useProductOptions';
import { AddOptionDialog } from './AddOptionDialog';
import { DimensionSectionWithUnits } from './DimensionSectionWithUnits';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  productId?: string;
  onClose: () => void;
}

export const ProductFormWithUnits: React.FC<ProductFormProps> = ({ productId, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    pricing_model_id: '',
    image_urls: [] as string[],
    minWidth: 0,
    minHeight: 0,
    defaultWidth: 0,
    defaultHeight: 0,
    unitOfMeasure: 'inches' as 'inches' | 'feet' | 'mm',
    pricingMode: 'sqft' as 'sqft' | 'sheet' | 'flatrate',
    standardSheetSize: { width: 0, height: 0 }
  });
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const { addProduct, updateProduct, getProduct, uploadProductImage } = useProducts();
  const { pricingModels } = usePricingModels();
  const { productOptions, addProductOptionMapping, getProductOptionMappings, refetch: refetchOptions } = useProductOptions();
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
        image_urls: product.image_urls || [],
        minWidth: product.minWidth || 0,
        minHeight: product.minHeight || 0,
        defaultWidth: product.defaultWidth || 0,
        defaultHeight: product.defaultHeight || 0,
        unitOfMeasure: product.unitOfMeasure || 'inches',
        pricingMode: product.pricingMode || 'sqft',
        standardSheetSize: product.standardSheetSize || { width: 0, height: 0 }
      });
      
      const mappings = await getProductOptionMappings(productId);
      setSelectedOptions(mappings.map(m => m.option_id));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => 
        uploadProductImage(file, productId || 'temp')
      );
      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, ...urls]
      }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
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
      onClose();
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
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{productId ? 'Edit Product' : 'Add Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="options">Options</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
              </TabsContent>
              
              <TabsContent value="dimensions">
                <DimensionSectionWithUnits
                  data={formData}
                  onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
                />
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4">
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
                {formData.pricing_model_id && (
                  <div className="p-4 bg-gray-50 rounded">
                    {(() => {
                      const model = pricingModels.find(m => m.id === formData.pricing_model_id);
                      return model ? (
                        <div>
                          <p><strong>Formula:</strong> {model.formula}</p>
                          <p><strong>Variables:</strong> {JSON.stringify(model.variables)}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="options" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Available Options</Label>
                  <AddOptionDialog onOptionAdded={refetchOptions} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {productOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedOptions(prev => [...prev, option.id]);
                          } else {
                            setSelectedOptions(prev => prev.filter(id => id !== option.id));
                          }
                        }}
                      />
                      <Label htmlFor={option.id}>{option.name}</Label>
                      <Badge variant="outline">{option.type}</Badge>
                    </div>
                  ))}
                </div>
                {productOptions.length === 0 && (
                  <p className="text-gray-500 text-sm">No options available. Add some options to get started.</p>
                )}
              </TabsContent>
              
              <TabsContent value="images" className="space-y-4">
                <div>
                  <Label>Product Images</Label>
                  <div className="mt-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {formData.image_urls.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded" />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              image_urls: prev.image_urls.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Product</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};