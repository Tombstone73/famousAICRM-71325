import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface APIIntegration {
  id: string;
  name: string;
  type: 'python' | 'rest' | 'webhook';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body?: string;
  enabled: boolean;
  description?: string;
}

export const useAPIIntegrations = () => {
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      // Fallback to default integration
      setIntegrations([{
        id: '1',
        name: 'Python Hotfolder Scanner',
        type: 'python',
        endpoint: 'http://localhost:8000/scan-hotfolder',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '{folder_path}' }),
        enabled: true,
        description: 'Python service for scanning hotfolders'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const addIntegration = async (integration: Omit<APIIntegration, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .insert([integration])
        .select()
        .single();

      if (error) throw error;
      setIntegrations(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding integration:', error);
      throw error;
    }
  };

  const updateIntegration = async (id: string, updates: Partial<APIIntegration>) => {
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setIntegrations(prev => prev.map(integration => 
        integration.id === id ? data : integration
      ));
      return data;
    } catch (error) {
      console.error('Error updating integration:', error);
      throw error;
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setIntegrations(prev => prev.filter(integration => integration.id !== id));
    } catch (error) {
      console.error('Error deleting integration:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  return {
    integrations,
    loading,
    addIntegration,
    updateIntegration,
    deleteIntegration,
    refetch: fetchIntegrations
  };
};