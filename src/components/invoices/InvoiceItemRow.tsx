import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

export interface InvoiceItemData {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  line_discount_amount: number;
  line_discount_type: 'amount' | 'percentage';
  amount: number;
}

interface InvoiceItemRowProps {
  item: InvoiceItemData;
  onUpdate: (id: string, field: keyof InvoiceItemData, value: any) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const InvoiceItemRow: React.FC<InvoiceItemRowProps> = ({ item, onUpdate, onRemove, canRemove }) => {
  const calculateAmount = () => {
    const baseAmount = item.quantity * item.rate;
    let discountAmount = 0;
    
    if (item.line_discount_type === 'percentage') {
      discountAmount = baseAmount * (item.line_discount_amount / 100);
    } else {
      discountAmount = item.line_discount_amount;
    }
    
    return Math.max(0, baseAmount - discountAmount);
  };

  const handleFieldChange = (field: keyof InvoiceItemData, value: any) => {
    onUpdate(item.id, field, value);
    
    if (field === 'quantity' || field === 'rate' || field === 'line_discount_amount' || field === 'line_discount_type') {
      setTimeout(() => {
        const newAmount = calculateAmount();
        onUpdate(item.id, 'amount', newAmount);
      }, 0);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-end">
      <div className="col-span-3">
        <Label>Description</Label>
        <Input
          value={item.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Item description"
        />
      </div>
      <div className="col-span-1">
        <Label>Qty</Label>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleFieldChange('quantity', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="col-span-2">
        <Label>Rate</Label>
        <Input
          type="number"
          step="0.01"
          value={item.rate}
          onChange={(e) => handleFieldChange('rate', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="col-span-1">
        <Label>Disc.</Label>
        <Input
          type="number"
          step="0.01"
          value={item.line_discount_amount}
          onChange={(e) => handleFieldChange('line_discount_amount', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="col-span-1">
        <Label>Type</Label>
        <Select value={item.line_discount_type} onValueChange={(value) => handleFieldChange('line_discount_type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="amount">$</SelectItem>
            <SelectItem value="percentage">%</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2">
        <Label>Amount</Label>
        <Input
          value={`$${item.amount.toFixed(2)}`}
          readOnly
          className="bg-gray-50"
        />
      </div>
      <div className="col-span-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(item.id)}
          disabled={!canRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default InvoiceItemRow;