import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface ProductCategory {
  id: string;
  name: string;
  sku_prefix: string;
  created_at: string;
  updated_at: string;
}

export const useProductCategories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch product categories',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name: string, skuPrefix: string) => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .insert([{ name, sku_prefix: skuPrefix }])
        .select()
        .single();

      if (error) throw error;
      
      await fetchCategories();
      toast({
        title: 'Success',
        description: 'Category added successfully'
      });
      return data;
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<ProductCategory>) => {
    try {
      const { error } = await supabase
        .from('product_categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      await fetchCategories();
      toast({
        title: 'Success',
        description: 'Category updated successfully'
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive'
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    refetch: fetchCategories
  };
};