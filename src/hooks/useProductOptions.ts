import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface ProductOption {
  id: string;
  name: string;
  type: 'dropdown' | 'toggle' | 'multiselect' | 'numeric';
  settings?: Record<string, any>;
  price_impact_formula?: string;
  inventory_tracking: boolean;
  created_at: string;
}

export interface ProductOptionMapping {
  id: string;
  product_id: string;
  option_id: string;
  pricing_adjustment_formula?: string;
  required: boolean;
  created_at: string;
  product_options?: ProductOption;
}

export const useProductOptions = () => {
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProductOptions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_options')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProductOptions(data || []);
    } catch (error) {
      console.error('Error fetching product options:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch product options',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addProductOption = async (option: Omit<ProductOption, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('product_options')
        .insert([option])
        .select()
        .single();

      if (error) throw error;
      
      await fetchProductOptions();
      toast({
        title: 'Success',
        description: 'Product option added successfully'
      });
      return data;
    } catch (error: any) {
      console.error('Error adding product option:', error);
      toast({
        title: 'Error',
        description: `Failed to add product option: ${error.message}`,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateProductOption = async (id: string, updates: Partial<ProductOption>) => {
    try {
      const { error } = await supabase
        .from('product_options')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchProductOptions();
      toast({
        title: 'Success',
        description: 'Product option updated successfully'
      });
    } catch (error) {
      console.error('Error updating product option:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product option',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteProductOption = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_options')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchProductOptions();
      toast({
        title: 'Success',
        description: 'Product option deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting product option:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product option',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const getProductOptionMappings = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_option_mappings')
        .select(`
          *,
          product_options (*)
        `)
        .eq('product_id', productId);

      if (error) throw error;
      return data as ProductOptionMapping[];
    } catch (error) {
      console.error('Error fetching product option mappings:', error);
      return [];
    }
  };

  const addProductOptionMapping = async (mapping: Omit<ProductOptionMapping, 'id' | 'created_at' | 'product_options'>) => {
    try {
      const { data, error } = await supabase
        .from('product_option_mappings')
        .insert([mapping])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error adding product option mapping:', error);
      throw error;
    }
  };

  const deleteProductOptionMapping = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_option_mappings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product option mapping:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProductOptions();
  }, []);

  return {
    productOptions,
    loading,
    addProductOption,
    updateProductOption,
    deleteProductOption,
    getProductOptionMappings,
    addProductOptionMapping,
    deleteProductOptionMapping,
    refetch: fetchProductOptions
  };
};