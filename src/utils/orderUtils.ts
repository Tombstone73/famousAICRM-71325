import { ParsedOrder } from '@/hooks/useParsedOrders';

export const formatParsedOrderForEntry = (parsedOrder: ParsedOrder) => {
  return {
    customer_name: parsedOrder.customer_name,
    customer_email: parsedOrder.customer_email,
    due_date: parsedOrder.due_date,
    total: parsedOrder.estimated_total,
    status: 'pending' as const,
    items: parsedOrder.parsed_items.map(item => ({
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price || 0,
      total_price: (item.price || 0) * item.quantity,
      notes: `Media: ${item.media_type}`,
    })),
    notes: `Approved from email: ${parsedOrder.email_subject}`,
  };
};