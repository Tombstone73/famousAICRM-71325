import { supabase } from '@/lib/supabase';

export interface InvoiceHistoryEvent {
  invoice_id: string;
  timestamp: string;
  user_name: string;
  event_type: 'created' | 'edited' | 'status_change' | 'payment' | 'sent' | 'note_added' | 'discount_applied';
  description: string;
  metadata?: any;
}

export const logInvoiceEvent = async (event: InvoiceHistoryEvent) => {
  try {
    const { error } = await supabase
      .from('invoice_history')
      .insert([{
        ...event,
        timestamp: event.timestamp || new Date().toISOString()
      }]);
    
    if (error) {
      console.error('Failed to log invoice event:', error);
    }
  } catch (err) {
    console.error('Error logging invoice event:', err);
  }
};

export const logInvoiceCreated = (invoiceId: string, invoiceNumber: string, userName: string = 'System') => {
  logInvoiceEvent({
    invoice_id: invoiceId,
    timestamp: new Date().toISOString(),
    user_name: userName,
    event_type: 'created',
    description: `Invoice ${invoiceNumber} created`,
    metadata: { invoice_number: invoiceNumber }
  });
};

export const logInvoiceStatusChange = (invoiceId: string, oldStatus: string, newStatus: string, userName: string = 'System') => {
  logInvoiceEvent({
    invoice_id: invoiceId,
    timestamp: new Date().toISOString(),
    user_name: userName,
    event_type: 'status_change',
    description: `Status changed from '${oldStatus}' to '${newStatus}'`,
    metadata: { old_status: oldStatus, new_status: newStatus }
  });
};

export const logInvoicePayment = (invoiceId: string, amount: number, userName: string = 'System') => {
  logInvoiceEvent({
    invoice_id: invoiceId,
    timestamp: new Date().toISOString(),
    user_name: userName,
    event_type: 'payment',
    description: `Payment of $${amount.toFixed(2)} received`,
    metadata: { amount }
  });
};

export const logInvoiceSent = (invoiceId: string, userName: string = 'System') => {
  logInvoiceEvent({
    invoice_id: invoiceId,
    timestamp: new Date().toISOString(),
    user_name: userName,
    event_type: 'sent',
    description: 'Invoice sent to customer',
    metadata: {}
  });
};