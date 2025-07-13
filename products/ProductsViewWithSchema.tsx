import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductFormWithSchema } from './ProductFormWithSchema';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const ProductsViewWithSchema: React.FC = () => {
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
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  {product.category && (
                    <Badge variant="secondary" className="mt-1">
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
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {product.image_urls && product.image_urls.length > 0 && (
                <img
                  src={product.image_urls[0]}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              {product.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {product.description.substring(0, 100)}...
                </p>
              )}
              {product.pricing_models && (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {product.pricing_models.name}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {product.pricing_models.unit}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No products found</p>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <ProductFormWithSchema
            productId={editingProduct}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};