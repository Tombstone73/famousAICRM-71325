import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductEntryForm, ProductFormData } from './ProductEntryForm';
import { useProducts } from '@/hooks/useProducts';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddProductDialog: React.FC<AddProductDialogProps> = ({ open, onOpenChange }) => {
  const { addProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  const handleSubmit = async (formData: ProductFormData) => {
    setLoading(true);
    try {
      const product = await addProduct(formData);
      setCreatedProductId(product.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to add product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setCreatedProductId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <ProductEntryForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          productId={createdProductId}
          isSubmitting={loading}
        />
      </DialogContent>
    </Dialog>
  );
};