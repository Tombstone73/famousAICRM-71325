import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/hooks/useOrders';
import { useCompanies } from '@/hooks/useCompanies';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

const OrderFormEnhanced: React.FC = () => {
  const { addOrder } = useOrders();
  const { companies } = useCompanies();
  const { products } = useProducts();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    customer_id: '',
    product_id: '',
    quantity: 1,
    due_date: '',
    status: 'Pending',
    rush: false,
    notes: '',
    ship_to_name: '',
    ship_to_company: '',
    ship_to_address_line1: '',
    ship_to_address_line2: '',
    ship_to_city: '',
    ship_to_state: '',
    ship_to_postal_code: '',
    ship_to_country: 'US'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addOrder(formData);
      toast({ title: 'Success', description: 'Order created successfully' });
      setFormData({
        customer_id: '',
        product_id: '',
        quantity: 1,
        due_date: '',
        status: 'Pending',
        rush: false,
        notes: '',
        ship_to_name: '',
        ship_to_company: '',
        ship_to_address_line1: '',
        ship_to_address_line2: '',
        ship_to_city: '',
        ship_to_state: '',
        ship_to_postal_code: '',
        ship_to_country: 'US'
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create order', variant: 'destructive' });
    }
  };

  const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company</Label>
                <Select value={formData.customer_id} onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Product</Label>
                <Select value={formData.product_id} onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantity</Label>
                <Input type="number" value={formData.quantity} onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))} />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={formData.due_date} onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))} />
              </div>
            </div>
            
            <div>
              <Checkbox checked={formData.rush} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rush: checked as boolean }))} />
              <Label className="ml-2">Rush Order</Label>
            </div>
            
            <div>
              <Label>Notes</Label>
              <Textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Name</Label>
                    <Input value={formData.ship_to_name} onChange={(e) => setFormData(prev => ({ ...prev, ship_to_name: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input value={formData.ship_to_company} onChange={(e) => setFormData(prev => ({ ...prev, ship_to_company: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label>Address Line 1</Label>
                  <Input value={formData.ship_to_address_line1} onChange={(e) => setFormData(prev => ({ ...prev, ship_to_address_line1: e.target.value }))} />
                </div>
                <div>
                  <Label>Address Line 2</Label>
                  <Input value={formData.ship_to_address_line2} onChange={(e) => setFormData(prev => ({ ...prev, ship_to_address_line2: e.target.value }))} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input value={formData.ship_to_city} onChange={(e) => setFormData(prev => ({ ...prev, ship_to_city: e.target.value }))} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Select value={formData.ship_to_state} onValueChange={(value) => setFormData(prev => ({ ...prev, ship_to_state: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>ZIP Code</Label>
                    <Input value={formData.ship_to_postal_code} onChange={(e) => setFormData(prev => ({ ...prev, ship_to_postal_code: e.target.value }))} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button type="submit" className="w-full">Create Order</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderFormEnhanced;