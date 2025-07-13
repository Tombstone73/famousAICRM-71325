import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, DollarSign } from 'lucide-react';
import { ShippingAddress, ShippingDimensions, ShippingService } from '@/types/shipping';

interface ShippingFormProps {
  orderId: string;
  prefilledAddress?: Partial<ShippingAddress>;
  onCreateLabel: (data: any) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ orderId, prefilledAddress, onCreateLabel }) => {
  const [address, setAddress] = useState<ShippingAddress>({
    name: prefilledAddress?.name || '',
    company: prefilledAddress?.company || '',
    addressLine1: prefilledAddress?.addressLine1 || '',
    addressLine2: prefilledAddress?.addressLine2 || '',
    city: prefilledAddress?.city || '',
    state: prefilledAddress?.state || '',
    postalCode: prefilledAddress?.postalCode || '',
    country: prefilledAddress?.country || 'US',
    phone: prefilledAddress?.phone || ''
  });

  const [dimensions, setDimensions] = useState<ShippingDimensions>({
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    units: 'IN',
    weightUnits: 'LBS'
  });

  const [selectedService, setSelectedService] = useState<string>('');
  const [services] = useState<ShippingService[]>([
    { code: 'UPS_GROUND', name: 'UPS Ground', description: '1-5 business days', estimatedCost: 12.50, estimatedDays: '3-5' },
    { code: 'UPS_3DAY', name: 'UPS 3 Day Select', description: '3 business days', estimatedCost: 25.75, estimatedDays: '3' },
    { code: 'UPS_2DAY', name: 'UPS 2nd Day Air', description: '2 business days', estimatedCost: 35.25, estimatedDays: '2' },
    { code: 'UPS_NEXT_DAY', name: 'UPS Next Day Air', description: '1 business day', estimatedCost: 65.50, estimatedDays: '1' }
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={address.name}
                onChange={(e) => setAddress({...address, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={address.company}
                onChange={(e) => setAddress({...address, company: e.target.value})}
                placeholder="Company Name"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address1">Address Line 1 *</Label>
            <Input
              id="address1"
              value={address.addressLine1}
              onChange={(e) => setAddress({...address, addressLine1: e.target.value})}
              placeholder="123 Main Street"
            />
          </div>
          
          <div>
            <Label htmlFor="address2">Address Line 2</Label>
            <Input
              id="address2"
              value={address.addressLine2}
              onChange={(e) => setAddress({...address, addressLine2: e.target.value})}
              placeholder="Apt, Suite, etc."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => setAddress({...address, city: e.target.value})}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={address.state}
                onChange={(e) => setAddress({...address, state: e.target.value})}
                placeholder="State"
              />
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input
                id="zip"
                value={address.postalCode}
                onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                placeholder="12345"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={address.phone}
              onChange={(e) => setAddress({...address, phone: e.target.value})}
              placeholder="(555) 123-4567"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Package Dimensions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="length">Length *</Label>
              <Input
                id="length"
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({...dimensions, length: parseFloat(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="width">Width *</Label>
              <Input
                id="width"
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({...dimensions, width: parseFloat(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="height">Height *</Label>
              <Input
                id="height"
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: parseFloat(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight *</Label>
              <Input
                id="weight"
                type="number"
                value={dimensions.weight}
                onChange={(e) => setDimensions({...dimensions, weight: parseFloat(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Dimension Units</Label>
              <Select value={dimensions.units} onValueChange={(value: 'IN' | 'CM') => setDimensions({...dimensions, units: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">Inches</SelectItem>
                  <SelectItem value="CM">Centimeters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Weight Units</Label>
              <Select value={dimensions.weightUnits} onValueChange={(value: 'LBS' | 'KG') => setDimensions({...dimensions, weightUnits: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LBS">Pounds</SelectItem>
                  <SelectItem value="KG">Kilograms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Shipping Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {services.map((service) => (
              <div
                key={service.code}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedService === service.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedService(service.code)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${service.estimatedCost.toFixed(2)}</p>
                    <Badge variant="outline">{service.estimatedDays} days</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            className="w-full" 
            size="lg"
            disabled={!selectedService || !address.name || !address.addressLine1 || !dimensions.weight}
            onClick={() => onCreateLabel({ address, dimensions, service: services.find(s => s.code === selectedService) })}
          >
            Create Shipping Label
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingForm;