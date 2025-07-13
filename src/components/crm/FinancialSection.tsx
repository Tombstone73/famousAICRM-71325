import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

interface FinancialSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const FinancialSection: React.FC<FinancialSectionProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Default Payment Terms</Label>
        <Select value={formData.payment_terms} onValueChange={(value) => setFormData({ ...formData, payment_terms: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Net 15">Net 15</SelectItem>
            <SelectItem value="Net 30">Net 30</SelectItem>
            <SelectItem value="Net 60">Net 60</SelectItem>
            <SelectItem value="COD">COD</SelectItem>
            <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
            <SelectItem value="Prepaid">Prepaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="tax_exempt"
          checked={formData.tax_exempt}
          onCheckedChange={(checked) => setFormData({ ...formData, tax_exempt: checked })}
        />
        <Label htmlFor="tax_exempt">Tax Exempt</Label>
      </div>

      <div>
        <Label htmlFor="tax_id">Tax ID Number</Label>
        <Input
          id="tax_id"
          value={formData.tax_id}
          onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
          placeholder="Enter tax ID number"
        />
      </div>

      <div>
        <Label htmlFor="default_discount_percent">Default Discount/Markup %</Label>
        <Input
          id="default_discount_percent"
          type="number"
          step="0.01"
          value={formData.default_discount_percent}
          onChange={(e) => setFormData({ ...formData, default_discount_percent: e.target.value })}
          placeholder="0.00"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="custom_pricing_rules"
          checked={formData.custom_pricing_rules}
          onCheckedChange={(checked) => setFormData({ ...formData, custom_pricing_rules: checked })}
        />
        <Label htmlFor="custom_pricing_rules">Custom Pricing Rules Attached</Label>
      </div>
    </div>
  );
};