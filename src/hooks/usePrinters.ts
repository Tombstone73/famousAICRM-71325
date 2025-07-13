import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Printer {
  id: string;
  folder_name: string;
  display_name: string;
  is_roll: boolean;
  is_flatbed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScannedPrinter {
  folderName: string;
  displayName: string;
  isRoll: boolean;
  isFlatbed: boolean;
}

export const usePrinters = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrinters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('printers')
        .select('*')
        .order('display_name');
      
      if (error) throw error;
      setPrinters(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch printers');
    } finally {
      setLoading(false);
    }
  };

  const scanPrinters = async (hotfolderPath: string): Promise<ScannedPrinter[]> => {
    try {
      // Get the session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplYXd2bm5rdnlpY3lva3B1dmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjc1NTQsImV4cCI6MjA2NjYwMzU1NH0.iWVxUlauH8-y4RruXqU6ZG_6NASsoDU1zjB1zi9P56M'
      };
      
      // Add authorization header if we have a session
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      const response = await fetch(
        'https://zeawvnnkvyicyokpuvkk.supabase.co/functions/v1/d793f372-b2bc-446e-8f1d-ef2bc4453ece',
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ hotfolderPath })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Scan printers error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.message || data.error);
      }
      
      return data.printers || [];
    } catch (err) {
      console.error('Scan printers error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to scan printers');
    }
  };

  const addPrinter = async (printer: Omit<Printer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('printers')
        .insert([printer])
        .select()
        .single();
      
      if (error) throw error;
      setPrinters(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add printer');
    }
  };

  const updatePrinter = async (id: string, updates: Partial<Printer>) => {
    try {
      const { data, error } = await supabase
        .from('printers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setPrinters(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update printer');
    }
  };

  const deletePrinter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('printers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setPrinters(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete printer');
    }
  };

  useEffect(() => {
    fetchPrinters();
  }, []);

  return {
    printers,
    loading,
    error,
    scanPrinters,
    addPrinter,
    updatePrinter,
    deletePrinter,
    refetch: fetchPrinters
  };
};