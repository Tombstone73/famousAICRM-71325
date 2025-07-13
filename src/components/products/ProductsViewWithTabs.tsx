import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { ProductFormFixed } from './ProductFormFixed';
import { ProductList } from './ProductList';
import { ProductEditDialog } from './ProductEditDialog';
import { PricingModelsManagerFixed } from './PricingModelsManagerFixed';
import { ProductOptionsTab } from './ProductOptionsTab';
import { supabase } from '@/lib/supabase';
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

const ProductsViewWithTabs: React.FC = () => {
  const { products, loading: productsLoading, refetch } = useProducts();
  const { toast } = useToast();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleAddProduct = async (formData: ProductFormData) => {
    setSubmitting(true);
    try {
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

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditDialog(true);
  };

  const handleProductUpdated = () => {
    refetch();
    toast({
      title: 'Success',
      description: 'Product updated successfully'
    });
  };

  const handleManageOptions = (productId: string) => {
    setSelectedProductId(productId);
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

  if (selectedProductId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Product Options</h1>
          <Button variant="outline" onClick={() => setSelectedProductId(null)}>
            Back to Products
          </Button>
        </div>
        <ProductOptionsTab productId={selectedProductId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog and pricing</p>
        </div>
        <Button onClick={() => setShowProductForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Formulas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-6">
          {productsLoading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : products.length > 0 ? (
            <ProductList 
              products={products} 
              onEdit={handleEditProduct}
              onView={handleEditProduct}
              onManageOptions={handleManageOptions}
            />
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
          <PricingModelsManagerFixed />
        </TabsContent>
      </Tabs>

      <ProductEditDialog
        product={editingProduct}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
};

export default ProductsViewWithTabs;
