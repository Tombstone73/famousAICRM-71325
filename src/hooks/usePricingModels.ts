import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface PricingModel {
  id: string;
  name: string;
  formula: string;
  variables: Record<string, any>;
  unit: string;
  created_at: string;
  updated_at: string;
}

export const usePricingModels = () => {
  const [pricingModels, setPricingModels] = useState<PricingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPricingModels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pricing_models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPricingModels(data || []);
    } catch (error) {
      console.error('Error fetching pricing models:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pricing models',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addPricingModel = async (model: Omit<PricingModel, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('pricing_models')
        .insert([model])
        .select()
        .single();

      if (error) throw error;
      
      await fetchPricingModels();
      toast({
        title: 'Success',
        description: 'Pricing model added successfully'
      });
      return data;
    } catch (error: any) {
      console.error('Error adding pricing model:', error);
      toast({
        title: 'Error',
        description: `Failed to add pricing model: ${error.message}`,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updatePricingModel = async (id: string, updates: Partial<PricingModel>) => {
    try {
      const { error } = await supabase
        .from('pricing_models')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      await fetchPricingModels();
      toast({
        title: 'Success',
        description: 'Pricing model updated successfully'
      });
    } catch (error) {
      console.error('Error updating pricing model:', error);
      toast({
        title: 'Error',
        description: 'Failed to update pricing model',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deletePricingModel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pricing_models')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchPricingModels();
      toast({
        title: 'Success',
        description: 'Pricing model deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting pricing model:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete pricing model',
        variant: 'destructive'
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPricingModels();
  }, []);

  return {
    pricingModels,
    loading,
    addPricingModel,
    updatePricingModel,
    deletePricingModel,
    refetch: fetchPricingModels
  };
};