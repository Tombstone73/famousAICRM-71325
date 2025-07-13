import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface QuickBooksToken {
  id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export function useQuickBooks() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<QuickBooksToken | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('quickbooks_tokens')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setToken(data);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking QuickBooks connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connect = async () => {
    try {
      const response = await fetch(
        'https://zeawvnnkvyicyokpuvkk.supabase.co/functions/v1/96b700b1-94ca-4248-b3c9-4c91e8c9708c',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'auth_url' }),
        }
      );

      const data = await response.json();
      if (data.auth_url) {
        window.open(data.auth_url, '_blank');
      }
    } catch (error) {
      console.error('Error connecting to QuickBooks:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to QuickBooks',
        variant: 'destructive',
      });
    }
  };

  const disconnect = async () => {
    try {
      const { error } = await supabase
        .from('quickbooks_tokens')
        .delete()
        .eq('id', token?.id);

      if (error) throw error;

      setToken(null);
      setIsConnected(false);
      toast({
        title: 'Disconnected',
        description: 'QuickBooks account disconnected successfully',
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect QuickBooks account',
        variant: 'destructive',
      });
    }
  };

  const syncData = async () => {
    if (!isConnected) return;

    try {
      const response = await fetch(
        'https://zeawvnnkvyicyokpuvkk.supabase.co/functions/v1/9e5eef95-a5a7-4406-a495-1941d924ba82',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'sync' }),
        }
      );

      const data = await response.json();
      toast({
        title: 'Sync Complete',
        description: data.message || 'Data synchronized successfully',
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      toast({
        title: 'Sync Error',
        description: 'Failed to sync data with QuickBooks',
        variant: 'destructive',
      });
    }
  };

  return {
    isConnected,
    isLoading,
    token,
    connect,
    disconnect,
    syncData,
    checkConnection,
  };
}