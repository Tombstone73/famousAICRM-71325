import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShippingAddress {
  ship_to_name?: string;
  ship_to_company?: string;
  ship_to_address_line1?: string;
  ship_to_address_line2?: string;
  ship_to_city?: string;
  ship_to_state?: string;
  ship_to_postal_code?: string;
  ship_to_country?: string;
}

interface ShippingAddressFormProps {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({ address, onChange }) => {
  const handleChange = (field: keyof ShippingAddress, value: string) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ship_to_name">Contact Name</Label>
            <Input
              id="ship_to_name"
              value={address.ship_to_name || ''}
              onChange={(e) => handleChange('ship_to_name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="ship_to_company">Company</Label>
            <Input
              id="ship_to_company"
              value={address.ship_to_company || ''}
              onChange={(e) => handleChange('ship_to_company', e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="ship_to_address_line1">Address Line 1</Label>
          <Input
            id="ship_to_address_line1"
            value={address.ship_to_address_line1 || ''}
            onChange={(e) => handleChange('ship_to_address_line1', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="ship_to_address_line2">Address Line 2</Label>
          <Input
            id="ship_to_address_line2"
            value={address.ship_to_address_line2 || ''}
            onChange={(e) => handleChange('ship_to_address_line2', e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="ship_to_city">City</Label>
            <Input
              id="ship_to_city"
              value={address.ship_to_city || ''}
              onChange={(e) => handleChange('ship_to_city', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="ship_to_state">State</Label>
            <Select value={address.ship_to_state || ''} onValueChange={(value) => handleChange('ship_to_state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select-state">Select State</SelectItem>
                {US_STATES.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ship_to_postal_code">ZIP Code</Label>
            <Input
              id="ship_to_postal_code"
              value={address.ship_to_postal_code || ''}
              onChange={(e) => handleChange('ship_to_postal_code', e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="ship_to_country">Country</Label>
          <Select value={address.ship_to_country || 'US'} onValueChange={(value) => handleChange('ship_to_country', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};