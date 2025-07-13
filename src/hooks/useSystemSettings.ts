import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');
      
      if (error) throw error;
      setSettings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ setting_key: key, setting_value: value }, {
          onConflict: 'setting_key'
        });
      
      if (error) throw error;
      await fetchSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update setting');
    }
  };

  const getSetting = (key: string): string | null => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || null;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateSetting,
    getSetting,
    refetch: fetchSettings
  };
}