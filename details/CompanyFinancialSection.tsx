import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface CompanyFinancialSectionProps {
  company: any;
  isEditing: boolean;
  editData: any;
  handleInputChange: (field: string, value: any) => void;
}

export const CompanyFinancialSection: React.FC<CompanyFinancialSectionProps> = ({
  company,
  isEditing,
  editData,
  handleInputChange
}) => {
  // Mock order history data
  const orderHistory = [
    { id: '1', date: '2024-01-15', amount: 250.00, status: 'Completed' },
    { id: '2', date: '2024-01-20', amount: 450.00, status: 'In Progress' },
    { id: '3', date: '2024-01-25', amount: 175.00, status: 'Pending' }
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <Label>Default Payment Terms</Label>
                <Select value={editData.payment_terms} onValueChange={(value) => handleInputChange('payment_terms', value)}>
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
                  checked={editData.tax_exempt}
                  onCheckedChange={(checked) => handleInputChange('tax_exempt', checked)}
                />
                <Label htmlFor="tax_exempt">Tax Exempt</Label>
              </div>
              <div>
                <Label htmlFor="tax_id">Tax ID Number</Label>
                <Input
                  id="tax_id"
                  value={editData.tax_id || ''}
                  onChange={(e) => handleInputChange('tax_id', e.target.value)}
                  placeholder="Enter tax ID number"
                />
              </div>
              <div>
                <Label htmlFor="default_discount_percent">Default Discount/Markup %</Label>
                <Input
                  id="default_discount_percent"
                  type="number"
                  step="0.01"
                  value={editData.default_discount_percent || ''}
                  onChange={(e) => handleInputChange('default_discount_percent', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="custom_pricing_rules"
                  checked={editData.custom_pricing_rules}
                  onCheckedChange={(checked) => handleInputChange('custom_pricing_rules', checked)}
                />
                <Label htmlFor="custom_pricing_rules">Custom Pricing Rules Attached</Label>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[140px]">Payment Terms:</span>
                <span>{company.payment_terms || 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[140px]">Tax Exempt:</span>
                <span>{company.tax_exempt ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[140px]">Tax ID:</span>
                <span>{company.tax_id || 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[140px]">Default Discount:</span>
                <span>{company.default_discount_percent ? `${company.default_discount_percent}%` : 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[140px]">Custom Pricing:</span>
                <span>{company.custom_pricing_rules ? 'Yes' : 'No'}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {orderHistory.length === 0 ? (
            <p className="text-muted-foreground">No orders found</p>
          ) : (
            <div className="space-y-3">
              {orderHistory.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Link 
                      to={`/orders/${order.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      ORD-{order.id.padStart(3, '0')}
                    </Link>
                    <span className="text-sm text-muted-foreground">{order.date}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">${order.amount.toFixed(2)}</span>
                    <Badge variant={order.status === 'Completed' ? 'default' : order.status === 'In Progress' ? 'secondary' : 'outline'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};