import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logOrderCreated, logOrderEdit, logStatusChange } from '@/lib/orderHistoryLogger';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  order_number?: string;
  customer_id: string;
  contact_id?: string;
  product_id: string;
  quantity: number;
  status: string;
  due_date: string;
  total_price?: number;
  notes?: string;
  rush?: boolean;
  instructions?: string;
  custom_dimensions?: any;
  product_options?: any[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Validate user authentication
      if (!user?.id) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to create an order.',
          variant: 'destructive'
        });
        throw new Error('User not authenticated');
      }
      
      const orderWithUser = {
        ...orderData,
        created_by: user.id // Use actual user UUID
      };
      
      console.log('Creating order with data:', orderWithUser);
      
      const { data, error } = await supabase
        .from('orders')
        .insert([orderWithUser])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      await logOrderCreated(data.id, { ...orderWithUser, product_name: 'Product' });
      await fetchOrders();
      return data;
    } catch (error: any) {
      console.error('Error adding order:', error);
      toast({
        title: 'Error',
        description: `Failed to create order: ${error?.message}`,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const oldOrder = orders.find(o => o.id === id);
      
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Log changes
      if (oldOrder) {
        const changes = [];
        if (updates.status && updates.status !== oldOrder.status) {
          await logStatusChange(id, oldOrder.status, updates.status);
        }
        if (updates.quantity && updates.quantity !== oldOrder.quantity) {
          changes.push(`Quantity changed from ${oldOrder.quantity} to ${updates.quantity}`);
        }
        if (updates.total_price && updates.total_price !== oldOrder.total_price) {
          changes.push(`Price changed from $${oldOrder.total_price || 0} to $${updates.total_price}`);
        }
        if (changes.length > 0) {
          await logOrderEdit(id, changes.join(', '));
        }
      }
      
      await fetchOrders();
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: `Failed to update order: ${error?.message}`,
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await fetchOrders();
    } catch (error: any) {
      console.error('Error deleting order:', error);
      toast({
        title: 'Error',
        description: `Failed to delete order: ${error?.message}`,
        variant: 'destructive'
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    addOrder,
    updateOrder,
    deleteOrder,
    refetch: fetchOrders
  };
};