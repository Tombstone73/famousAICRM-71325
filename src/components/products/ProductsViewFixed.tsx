import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { ProductFormFixed } from './ProductFormFixed';
import { PricingModelsManager } from './PricingModelsManager';
import { ProductList } from './ProductList';
import { supabase } from '@/lib/supabase';

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

const ProductsViewFixed: React.FC = () => {
  const { products, loading: productsLoading, refetch } = useProducts();
  const { toast } = useToast();
  const [showProductForm, setShowProductForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAddProduct = async (formData: ProductFormData) => {
    setSubmitting(true);
    try {
      // Insert product into Supabase
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          description: formData.description,
          category: formData.category,
          pricing_model_id: formData.pricing_model_id,
          default_width: formData.default_width,
          default_height: formData.default_height,
          status: formData.status,
          thumbnail_url: formData.image_urls[0] || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (productError) throw productError;

      // Insert product images
      if (formData.image_urls.length > 0) {
        const imageInserts = formData.image_urls.map(url => ({
          product_id: product.id,
          image_url: url
        }));

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imageError) {
          console.error('Error inserting images:', imageError);
        }
      }

      // Insert product options relationships
      if (formData.selected_options.length > 0) {
        const optionInserts = formData.selected_options.map(optionId => ({
          product_id: product.id,
          name: `Option ${optionId}`,
          type: 'toggle',
          affects_pricing: false,
          affects_inventory: false,
          config_json: {}
        }));

        const { error: optionsError } = await supabase
          .from('product_options')
          .insert(optionInserts);

        if (optionsError) {
          console.error('Error inserting options:', optionsError);
        }
      }

      toast({
        title: 'Success',
        description: 'Product created successfully'
      });

      setShowProductForm(false);
      refetch();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (showProductForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        </div>
        <ProductFormFixed
          onSubmit={handleAddProduct}
          onCancel={() => setShowProductForm(false)}
          isSubmitting={submitting}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your product catalog and pricing models
          </p>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Models</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Product Catalog</h2>
              <p className="text-gray-600">Manage your products and their categories</p>
            </div>
            <Button onClick={() => setShowProductForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {productsLoading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : products.length > 0 ? (
            <ProductList products={products} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 text-center mb-4">Create your first product to get started.</p>
                <Button onClick={() => setShowProductForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <PricingModelsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsViewFixed;