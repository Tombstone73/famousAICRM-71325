import { supabase } from './supabase';

export interface LogEventParams {
  orderId: string;
  eventType: 'edit' | 'status_change' | 'payment' | 'job_started' | 'job_completed' | 'note' | 'pricing_change' | 'upload' | 'created';
  description: string;
  userName?: string;
  metadata?: any;
}

export const logOrderEvent = async (params: LogEventParams) => {
  try {
    const { error } = await supabase
      .from('order_history')
      .insert({
        order_id: params.orderId,
        event_type: params.eventType,
        description: params.description,
        user_name: params.userName || 'System',
        metadata: params.metadata || {}
      });
    
    if (error) {
      console.error('Error logging order event:', error);
    }
  } catch (error) {
    console.error('Error logging order event:', error);
  }
};

export const logOrderCreated = (orderId: string, orderData: any, userName = 'System') => {
  return logOrderEvent({
    orderId,
    eventType: 'created',
    description: `Order created with ${orderData.quantity} units of ${orderData.product_name || 'product'}`,
    userName,
    metadata: { orderData }
  });
};

export const logOrderEdit = (orderId: string, changes: string, userName = 'System') => {
  return logOrderEvent({
    orderId,
    eventType: 'edit',
    description: changes,
    userName
  });
};

export const logStatusChange = (orderId: string, oldStatus: string, newStatus: string, userName = 'System') => {
  return logOrderEvent({
    orderId,
    eventType: 'status_change',
    description: `Status changed from '${oldStatus}' to '${newStatus}'`,
    userName,
    metadata: { oldStatus, newStatus }
  });
};

export const logPayment = (orderId: string, amount: number, method: string, userName = 'System') => {
  return logOrderEvent({
    orderId,
    eventType: 'payment',
    description: `Payment of $${amount.toFixed(2)} received via ${method}`,
    userName,
    metadata: { amount, method }
  });
};