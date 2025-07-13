import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductFormWithUnits } from './ProductFormWithUnits';
import { useToast } from '@/hooks/use-toast';

export const ProductsViewWithUnits: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const { products, deleteProduct, loading } = useProducts();
  const { toast } = useToast();

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        toast({
          title: 'Success',
          description: 'Product deleted successfully'
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete product',
          variant: 'destructive'
        });
      }
    }
  };

  const handleEdit = (productId: string) => {
    setSelectedProduct(productId);
    setShowEditDialog(true);
  };

  const closeDialogs = () => {
    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductFormWithUnits onClose={closeDialogs} />
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first product</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const unitLabel = product.unitOfMeasure === 'inches' ? 'in' : 
                             product.unitOfMeasure === 'feet' ? 'ft' : 'mm';
            
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
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
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  )}
                  
                  {product.image_urls && product.image_urls.length > 0 && (
                    <div className="mb-3">
                      <img 
                        src={product.image_urls[0]} 
                        alt={product.name}
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    {product.unitOfMeasure && (
                      <div className="flex justify-between">
                        <span className="font-medium">Unit:</span>
                        <span>{product.unitOfMeasure} ({unitLabel})</span>
                      </div>
                    )}
                    
                    {(product.defaultWidth || product.defaultHeight) && (
                      <div className="flex justify-between">
                        <span className="font-medium">Default Size:</span>
                        <span>
                          {product.defaultWidth || 0} × {product.defaultHeight || 0} {unitLabel}
                        </span>
                      </div>
                    )}
                    
                    {(product.minWidth || product.minHeight) && (
                      <div className="flex justify-between">
                        <span className="font-medium">Min Size:</span>
                        <span>
                          {product.minWidth || 0} × {product.minHeight || 0} {unitLabel}
                        </span>
                      </div>
                    )}
                    
                    {product.pricingMode && (
                      <div className="flex justify-between">
                        <span className="font-medium">Pricing:</span>
                        <Badge variant="outline">
                          {product.pricingMode === 'sqft' ? 'Square Foot' :
                           product.pricingMode === 'sheet' ? 'By Sheet' : 'Flat Rate'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductFormWithUnits 
              productId={selectedProduct} 
              onClose={closeDialogs} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};