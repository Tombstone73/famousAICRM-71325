import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface OrderHistoryEvent {
  id: string;
  order_id: string;
  timestamp: string;
  user_name: string;
  event_type: 'edit' | 'status_change' | 'payment' | 'job_started' | 'job_completed' | 'note' | 'pricing_change' | 'upload' | 'created';
  description: string;
  metadata: any;
}

export const useOrderHistory = (orderId?: string) => {
  const [history, setHistory] = useState<OrderHistoryEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_history')
        .select('*')
        .eq('order_id', id)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHistoryEvent = async (event: Omit<OrderHistoryEvent, 'id' | 'timestamp'>) => {
    try {
      const { error } = await supabase
        .from('order_history')
        .insert([event]);
      
      if (error) throw error;
      
      if (orderId) {
        fetchHistory(orderId);
      }
    } catch (error) {
      console.error('Error adding history event:', error);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchHistory(orderId);
    }
  }, [orderId]);

  return {
    history,
    loading,
    fetchHistory,
    addHistoryEvent
  };
};