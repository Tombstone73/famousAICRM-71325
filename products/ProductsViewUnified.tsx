import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductEntryForm } from './ProductEntryForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const ProductsViewUnified: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | undefined>();
  const { products, loading, deleteProduct } = useProducts();

  const handleEdit = (productId: string) => {
    setEditingProduct(productId);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(undefined);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-600">Manage your product catalog with options and pricing</p>
        </div>
        <Button onClick={handleAdd} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first product to get started with your catalog
              </p>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                    {product.category && (
                      <Badge variant="secondary" className="mb-2">
                        {product.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product.id)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {product.image_urls && product.image_urls.length > 0 && (
                  <div className="mb-3">
                    <img
                      src={product.image_urls[0]}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {product.pricing_models && (
                    <Badge variant="outline" className="text-xs">
                      {product.pricing_models.name}
                    </Badge>
                  )}
                  
                  {product.product_option_mappings && product.product_option_mappings.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {product.product_option_mappings.length} option{product.product_option_mappings.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <ProductEntryForm
            productId={editingProduct}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};