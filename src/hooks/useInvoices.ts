import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logInvoiceCreated, logInvoiceStatusChange, logInvoicePayment, logInvoiceSent } from '@/lib/invoiceHistoryLogger';
import { useToast } from '@/hooks/use-toast';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  order_id?: string;
  invoice_date: string;
  due_date?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  discount_type: 'percentage' | 'dollar';
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_type: 'percentage' | 'dollar';
  discount_amount: number;
  line_total: number;
  created_at: string;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInvoices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Validate user authentication
      if (!user?.id) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to create an invoice.',
          variant: 'destructive'
        });
        throw new Error('User not authenticated');
      }
      
      const invoiceWithUser = {
        ...invoiceData,
        created_by: user.id // Use actual user UUID
      };
      
      console.log('Creating invoice with data:', invoiceWithUser);
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceWithUser])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Log invoice creation
      await logInvoiceCreated(data.id, data.invoice_number);
      
      await fetchInvoices();
      return data;
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      toast({
        title: 'Error',
        description: `Failed to create invoice: ${err?.message}`,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['status']) => {
    try {
      // Get current invoice for logging
      const currentInvoice = invoices.find(inv => inv.id === id);
      const oldStatus = currentInvoice?.status;
      
      const { error } = await supabase
        .from('invoices')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      // Log status change
      if (oldStatus && oldStatus !== status) {
        await logInvoiceStatusChange(id, oldStatus, status);
        
        // Log specific events
        if (status === 'sent') {
          await logInvoiceSent(id);
        } else if (status === 'paid' && currentInvoice) {
          await logInvoicePayment(id, currentInvoice.total_amount);
        }
      }
      
      await fetchInvoices();
    } catch (err: any) {
      console.error('Error updating invoice status:', err);
      toast({
        title: 'Error',
        description: `Failed to update invoice: ${err?.message}`,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await fetchInvoices();
    } catch (err: any) {
      console.error('Error deleting invoice:', err);
      toast({
        title: 'Error',
        description: `Failed to delete invoice: ${err?.message}`,
        variant: 'destructive'
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    refetch: fetchInvoices
  };
};