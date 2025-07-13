import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface InvoiceHistoryEvent {
  id: string;
  invoice_id: string;
  timestamp: string;
  user_name: string;
  event_type: 'created' | 'edited' | 'status_change' | 'payment' | 'sent' | 'note_added' | 'discount_applied';
  description: string;
  metadata?: any;
  created_at: string;
}

export const useInvoiceHistory = (invoiceId?: string) => {
  const [history, setHistory] = useState<InvoiceHistoryEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async (id?: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('invoice_history')
        .select('*')
        .eq('invoice_id', id)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const addHistoryEvent = async (event: Omit<InvoiceHistoryEvent, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('invoice_history')
        .insert([event]);
      
      if (error) throw error;
      
      if (event.invoice_id === invoiceId) {
        await fetchHistory(invoiceId);
      }
    } catch (err) {
      console.error('Failed to add history event:', err);
    }
  };

  useEffect(() => {
    if (invoiceId) {
      fetchHistory(invoiceId);
    }
  }, [invoiceId]);

  return {
    history,
    loading,
    error,
    addHistoryEvent,
    refetch: () => fetchHistory(invoiceId)
  };
};