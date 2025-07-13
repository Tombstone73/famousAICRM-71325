import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface OptionRate {
  id: string;
  name: string;
  description?: string;
  rate_type: 'per_unit' | 'per_sqft' | 'per_linear_ft' | 'flat_fee' | 'setup_fee';
  base_rate: number;
  minimum_charge?: number;
  unit_label?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useOptionRates = () => {
  const [rates, setRates] = useState<OptionRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('option_rates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setRates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rates');
    } finally {
      setLoading(false);
    }
  };

  const updateRate = async (id: string, updates: Partial<OptionRate>) => {
    try {
      const { error } = await supabase
        .from('option_rates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      await fetchRates();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update rate');
    }
  };

  const createRate = async (rate: Omit<OptionRate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('option_rates')
        .insert([rate]);
      
      if (error) throw error;
      await fetchRates();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create rate');
    }
  };

  const getRateByName = (name: string): OptionRate | undefined => {
    return rates.find(rate => rate.name === name);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return {
    rates,
    loading,
    error,
    updateRate,
    createRate,
    getRateByName,
    refetch: fetchRates
  };
};