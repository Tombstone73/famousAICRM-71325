import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import InvoiceItemRow, { InvoiceItemData } from './InvoiceItemRow';
import { useInvoices } from '@/hooks/useInvoices';
import { useCompanies } from '@/hooks/useCompanies';
import { useOrders } from '@/hooks/useOrders';

interface EnhancedCreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EnhancedCreateInvoiceDialog: React.FC<EnhancedCreateInvoiceDialogProps> = ({ open, onOpenChange }) => {
  const { createInvoice } = useInvoices();
  const { companies } = useCompanies();
  const { orders } = useOrders();
  
  const [customerId, setCustomerId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('amount');
  const [items, setItems] = useState<InvoiceItemData[]>([
    { id: '1', description: '', quantity: 1, rate: 0, line_discount_amount: 0, line_discount_type: 'amount', amount: 0 }
  ]);
  const [saving, setSaving] = useState(false);

  const addItem = () => {
    const newItem: InvoiceItemData = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      line_discount_amount: 0,
      line_discount_type: 'amount',
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItemData, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const invoiceDiscountAmount = discountType === 'percentage' ? subtotal * (discountAmount / 100) : discountAmount;
  const discountedSubtotal = Math.max(0, subtotal - invoiceDiscountAmount);
  const taxAmount = discountedSubtotal * 0.1;
  const total = discountedSubtotal + taxAmount;

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const handleSave = async () => {
    if (!customerId || items.length === 0) return;
    
    setSaving(true);
    try {
      const invoiceData = {
        invoice_number: generateInvoiceNumber(),
        customer_id: customerId,
        order_id: orderId || null,
        invoice_date: invoiceDate,
        due_date: dueDate || null,
        subtotal,
        discount_amount: invoiceDiscountAmount,
        discount_type: discountType,
        tax_amount: taxAmount,
        total_amount: total,
        notes: notes || null
      };

      const itemsData = items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        line_discount_amount: item.line_discount_amount,
        line_discount_type: item.line_discount_type,
        amount: item.amount
      }));

      await createInvoice(invoiceData, itemsData);
      onOpenChange(false);
      
      // Reset form
      setCustomerId('');
      setOrderId('');
      setInvoiceDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
      setNotes('');
      setDiscountAmount(0);
      setItems([{ id: '1', description: '', quantity: 1, rate: 0, line_discount_amount: 0, line_discount_type: 'amount', amount: 0 }]);
    } catch (error) {
      console.error('Failed to create invoice:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="customer">Customer *</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="order">Related Order</Label>
              <Select value={orderId} onValueChange={setOrderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {orders.map(order => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.order_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="invoice-date">Invoice Date</Label>
              <Input
                id="invoice-date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Invoice Items
                <Button onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <InvoiceItemRow
                    key={item.id}
                    item={item}
                    onUpdate={updateItem}
                    onRemove={removeItem}
                    canRemove={items.length > 1}
                  />
                ))}
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-4 gap-4 items-end">
                  <div className="col-span-2">
                    <Label>Invoice Discount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Discount Type</Label>
                    <Select value={discountType} onValueChange={setDiscountType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amount">Dollar Amount</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {invoiceDiscountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount ({discountType === 'percentage' ? `${discountAmount}%` : '$' + discountAmount.toFixed(2)}):</span>
                      <span>-${invoiceDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !customerId}>
              {saving ? 'Creating...' : 'Create Invoice'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedCreateInvoiceDialog;