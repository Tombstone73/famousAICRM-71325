import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  category?: string;
  price?: number;
  cost?: number;
  stock_quantity?: number;
  pricing_model_id?: string;
  created_by?: string;
  width?: number;
  height?: number;
  unit_of_measure?: string;
  image_urls?: string[];
  low_stock_threshold?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  pricing_models?: {
    id: string;
    name: string;
    formula: string;
    variables: Record<string, any>;
    unit: string;
  };
  product_option_mappings?: any[];
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          pricing_models (
            id,
            name,
            formula,
            variables,
            unit
          ),
          product_option_mappings (
            id,
            option_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'pricing_models'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to create a product.',
          variant: 'destructive'
        });
        throw new Error('User not authenticated');
      }
      
      const productData = {
        ...product,
        created_by: user.id,
        image_urls: product.image_urls || [],
        is_active: product.is_active ?? true,
        low_stock_threshold: product.low_stock_threshold || 10
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchProducts();
      return data;
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: `Failed to add product: ${error?.message}`,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: `Failed to update product: ${error?.message}`,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const getProduct = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          pricing_models (
            id,
            name,
            formula,
            variables,
            unit
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  const uploadProductImage = async (file: File, productId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    uploadProductImage,
    refetch: fetchProducts
  };
};