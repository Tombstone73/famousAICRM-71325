import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface SKUSettings {
  id: string;
  category: string;
  prefix: string;
  counter_reset_type: 'category' | 'monthly';
  date_format: 'YYMM' | 'YYYYMM' | 'none';
  current_counter: number;
  last_reset_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSKUSettings = () => {
  const [skuSettings, setSKUSettings] = useState<SKUSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSKUSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sku_settings')
        .select('*')
        .order('category');

      if (error) throw error;
      setSKUSettings(data || []);
    } catch (error) {
      console.error('Error fetching SKU settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch SKU settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSKUSettings = async (category: string, updates: Partial<SKUSettings>) => {
    try {
      const { error } = await supabase
        .from('sku_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('category', category);

      if (error) throw error;
      
      await fetchSKUSettings();
      toast({
        title: 'Success',
        description: 'SKU settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating SKU settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update SKU settings',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const generateSKU = async (category: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .rpc('generate_sku', { p_category: category });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating SKU:', error);
      throw error;
    }
  };

  const checkSKUExists = async (sku: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .eq('sku', sku)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking SKU existence:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchSKUSettings();
  }, []);

  return {
    skuSettings,
    loading,
    updateSKUSettings,
    generateSKU,
    checkSKUExists,
    refetch: fetchSKUSettings
  };
};