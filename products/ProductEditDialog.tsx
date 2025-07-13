import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductFormFixed } from './ProductFormFixed';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/products';

interface ProductEditDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductUpdated: () => void;
}

export const ProductEditDialog: React.FC<ProductEditDialogProps> = ({
  product,
  open,
  onOpenChange,
  onProductUpdated
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: any) => {
    if (!product) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          pricing_model_id: formData.pricing_model_id,
          default_width: formData.default_width,
          default_height: formData.default_height,
          status: formData.status,
          image_urls: formData.image_urls,
          thumbnail_url: formData.image_urls[0] || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (error) throw error;

      // Handle product options
      if (formData.selected_options?.length > 0) {
        // Delete existing mappings
        await supabase
          .from('product_option_mappings')
          .delete()
          .eq('product_id', product.id);

        // Insert new mappings
        const mappings = formData.selected_options.map((optionId: string) => ({
          product_id: product.id,
          option_id: optionId
        }));

        await supabase
          .from('product_option_mappings')
          .insert(mappings);
      }

      toast({
        title: 'Success',
        description: 'Product updated successfully'
      });

      onProductUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          {product && (
            <ProductFormFixed
              product={product}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              isSubmitting={submitting}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};