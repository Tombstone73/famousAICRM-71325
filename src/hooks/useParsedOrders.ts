import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface ParsedOrderItem {
  name: string;
  media_type: string;
  quantity: number;
  price?: number;
}

export interface ParsedOrder {
  id: string;
  email_subject: string;
  email_body: string;
  customer_name: string;
  customer_email: string;
  due_date: string;
  parsed_items: ParsedOrderItem[];
  estimated_total: number;
  confidence_score: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export const useParsedOrders = () => {
  const [parsedOrders, setParsedOrders] = useState<ParsedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchParsedOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('parsed_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParsedOrders(data || []);
    } catch (error) {
      console.error('Error fetching parsed orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch parsed orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const approveParsedOrder = async (parsedOrder: ParsedOrder) => {
    try {
      // Update status to approved
      const { error: updateError } = await supabase
        .from('parsed_orders')
        .update({ status: 'approved' })
        .eq('id', parsedOrder.id);

      if (updateError) throw updateError;

      // Create order in main orders table
      const orderData = {
        customer_name: parsedOrder.customer_name,
        customer_email: parsedOrder.customer_email,
        due_date: parsedOrder.due_date,
        total: parsedOrder.estimated_total,
        status: 'pending',
        items: parsedOrder.parsed_items,
        notes: `Approved from email: ${parsedOrder.email_subject}`,
      };

      const { error: orderError } = await supabase
        .from('orders')
        .insert([orderData]);

      if (orderError) throw orderError;

      toast({
        title: 'Success',
        description: 'Order approved and added to orders',
      });

      fetchParsedOrders();
    } catch (error) {
      console.error('Error approving order:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve order',
        variant: 'destructive',
      });
    }
  };

  const rejectParsedOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('parsed_orders')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order rejected',
      });

      fetchParsedOrders();
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject order',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchParsedOrders();
  }, []);

  return {
    parsedOrders,
    loading,
    fetchParsedOrders,
    approveParsedOrder,
    rejectParsedOrder,
  };
};