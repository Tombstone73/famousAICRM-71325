import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface PaymentSettings {
  id?: string;
  gateway: 'stripe' | 'square' | '';
  stripePublishableKey: string;
  stripeSecretKey: string;
  squareApplicationId: string;
  squareAccessToken: string;
  squareEnvironment: 'sandbox' | 'production';
  enabled: boolean;
}

export const usePaymentSettings = () => {
  const [settings, setSettings] = useState<PaymentSettings>({
    gateway: '',
    stripePublishableKey: '',
    stripeSecretKey: '',
    squareApplicationId: '',
    squareAccessToken: '',
    squareEnvironment: 'sandbox',
    enabled: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('payment_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        setSettings({
          id: data.id,
          gateway: data.gateway || '',
          stripePublishableKey: data.stripe_publishable_key || '',
          stripeSecretKey: data.stripe_secret_key || '',
          squareApplicationId: data.square_application_id || '',
          squareAccessToken: data.square_access_token || '',
          squareEnvironment: data.square_environment || 'sandbox',
          enabled: data.enabled || false
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: PaymentSettings) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const settingsData = {
        user_id: user.id,
        gateway: newSettings.gateway || null,
        stripe_publishable_key: newSettings.stripePublishableKey || null,
        stripe_secret_key: newSettings.stripeSecretKey || null,
        square_application_id: newSettings.squareApplicationId || null,
        square_access_token: newSettings.squareAccessToken || null,
        square_environment: newSettings.squareEnvironment,
        enabled: newSettings.enabled,
        updated_at: new Date().toISOString()
      };

      const { data, error: saveError } = await supabase
        .from('payment_settings')
        .upsert(settingsData, { onConflict: 'user_id' })
        .select()
        .single();

      if (saveError) {
        throw saveError;
      }

      setSettings({
        id: data.id,
        gateway: data.gateway || '',
        stripePublishableKey: data.stripe_publishable_key || '',
        stripeSecretKey: data.stripe_secret_key || '',
        squareApplicationId: data.square_application_id || '',
        squareAccessToken: data.square_access_token || '',
        squareEnvironment: data.square_environment || 'sandbox',
        enabled: data.enabled || false
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    setSettings,
    saveSettings,
    loading,
    error,
    refetch: fetchSettings
  };
};