import React, { useState } from 'react';
import { ProductEntryForm, ProductFormData } from './ProductEntryForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export const ProductEntryView: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!data.name || !data.category) {
        toast({
          title: 'Validation Error',
          description: 'Product name and category are required.',
          variant: 'destructive'
        });
        return;
      }

      // Transform form data to match database schema
      const productData = {
        name: data.name,
        description: data.description || null,
        category: data.category,
        is_active: data.isActive ?? true,
        base_price: data.pricePerSqFt || data.pricePerSheet || data.minimumCharge || 0,
        price_per_unit: data.pricePerSqFt || data.pricePerSheet || 0,
        min_quantity: 1,
        allow_custom_pricing: true,
        w2p_visibility: true,
        spot_color_detection: false,
        display_order: 0,
        current_stock: 0,
        min_stock_threshold: 0,
        lead_time: '1-2 business days',
        media_type: data.materialType || null,
        sku: `${data.category.toUpperCase()}-${Date.now()}`,
        customer_instructions: null
      };

      console.log('Submitting product data:', productData);

      const { data: result, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Product created successfully:', result);

      toast({
        title: 'Success',
        description: 'Product created successfully!'
      });

      setShowForm(false);
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  if (showForm) {
    return (
      <ScrollArea className="h-[90vh] pr-4">
        <ProductEntryForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </ScrollArea>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Entry System</CardTitle>
          <p className="text-gray-600">
            Create and manage products for your web-to-print CRM system.
            Support for square foot pricing, sheet-based pricing, and flat rate products.
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowForm(true)} size="lg">
            Create New Product
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};