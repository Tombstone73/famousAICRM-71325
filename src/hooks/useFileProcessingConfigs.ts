import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface FileProcessingConfig {
  id: string;
  name: string;
  hotfolder_path: string;
  company_folder_path: string;
  processing_mode: 'webapp' | 'python' | 'hybrid';
  python_service_url?: string;
  enable_file_copy: boolean;
  enable_routing: boolean;
  host_locally: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const useFileProcessingConfigs = () => {
  const [configs, setConfigs] = useState<FileProcessingConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('file_processing_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch configs');
    } finally {
      setLoading(false);
    }
  };

  const createConfig = async (config: Omit<FileProcessingConfig, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('file_processing_configs')
        .insert([config])
        .select()
        .single();

      if (error) throw error;
      setConfigs(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create config');
      throw err;
    }
  };

  const updateConfig = async (id: string, updates: Partial<FileProcessingConfig>) => {
    try {
      const { data, error } = await supabase
        .from('file_processing_configs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setConfigs(prev => prev.map(config => config.id === id ? data : config));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update config');
      throw err;
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      const { error } = await supabase
        .from('file_processing_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setConfigs(prev => prev.filter(config => config.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete config');
      throw err;
    }
  };

  const testPythonService = async (serviceUrl: string) => {
    try {
      const response = await fetch(`${serviceUrl}/health`);
      if (!response.ok) {
        throw new Error(`Service responded with status ${response.status}`);
      }
      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to connect to service' 
      };
    }
  };

  const processFiles = async (configId: string, sourcePath: string, companyFolder: string) => {
    const config = configs.find(c => c.id === configId);
    if (!config) {
      throw new Error('Configuration not found');
    }

    if (config.processing_mode === 'python' && config.python_service_url) {
      try {
        const response = await fetch(`${config.python_service_url}/process-hotfolder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source_path: sourcePath,
            company_folder: companyFolder,
            routing_rules: {}
          })
        });

        if (!response.ok) {
          throw new Error(`Processing failed with status ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Failed to process files');
      }
    } else {
      throw new Error('Python service processing not configured');
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return {
    configs,
    loading,
    error,
    createConfig,
    updateConfig,
    deleteConfig,
    testPythonService,
    processFiles,
    refetch: fetchConfigs
  };
};