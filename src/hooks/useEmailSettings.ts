import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface EmailSettings {
  id?: string;
  provider: string;
  smtp_host: string;
  smtp_port: number;
  username: string;
  password_encrypted: string;
  from_email: string;
  from_name: string;
  enable_tls: boolean;
  enable_ssl: boolean;
  is_active: boolean;
}

export const useEmailSettings = () => {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSettings(data);
    } catch (error) {
      console.error('Error fetching email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Omit<EmailSettings, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Deactivate existing settings
      await supabase
        .from('email_settings')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Insert new settings
      const { data, error } = await supabase
        .from('email_settings')
        .insert({
          ...newSettings,
          user_id: user.id,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      toast({
        title: 'Success',
        description: 'Email settings saved successfully'
      });

      return data;
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save email settings',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const testConnection = async (testSettings: Omit<EmailSettings, 'id'>) => {
    try {
      const { data, error } = await supabase.functions.invoke('test-email-connection', {
        body: {
          smtp_host: testSettings.smtp_host,
          smtp_port: testSettings.smtp_port,
          username: testSettings.username,
          password_encrypted: testSettings.password_encrypted,
          from_email: testSettings.from_email,
          enable_tls: testSettings.enable_tls,
          enable_ssl: testSettings.enable_ssl
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: 'Connection Test Successful',
          description: data.message || 'Email configuration is working correctly'
        });
        return true;
      } else {
        throw new Error(data?.error || 'Connection test failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection test failed';
      toast({
        title: 'Connection Test Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    saveSettings,
    testConnection,
    refetch: fetchSettings
  };
};