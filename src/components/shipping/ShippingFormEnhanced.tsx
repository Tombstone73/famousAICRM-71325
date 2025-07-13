import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, DollarSign, Loader2 } from 'lucide-react';
import { ShippingAddress, ShippingDimensions, ShippingService } from '@/types/shipping';
import { useShipping } from '@/hooks/useShipping';

interface ShippingFormEnhancedProps {
  orderId: string;
  prefilledAddress?: Partial<ShippingAddress>;
  onLabelCreated: (label: any) => void;
}

const ShippingFormEnhanced: React.FC<ShippingFormEnhancedProps> = ({ orderId, prefilledAddress, onLabelCreated }) => {
  const { loading, getRates, createLabel } = useShipping();
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

  const [services, setServices] = useState<ShippingService[]>([]);
  const [selectedService, setSelectedService] = useState<ShippingService | null>(null);
  const [ratesLoaded, setRatesLoaded] = useState(false);

  const canGetRates = address.postalCode && address.city && address.state && dimensions.weight > 0;

  const handleGetRates = async () => {
    if (!canGetRates) return;
    
    try {
      const rates = await getRates(address, dimensions);
      setServices(rates);
      setRatesLoaded(true);
    } catch (error) {
      console.error('Failed to get rates:', error);
    }
  };

  const handleCreateLabel = async () => {
    if (!selectedService) return;
    
    try {
      const label = await createLabel(orderId, address, dimensions, selectedService);
      onLabelCreated(label);
    } catch (error) {
      console.error('Failed to create label:', error);
    }
  };

  useEffect(() => {
    if (canGetRates && !ratesLoaded) {
      const timer = setTimeout(() => {
        handleGetRates();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [address.postalCode, address.city, address.state, dimensions.weight]);

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => {
                  setAddress({...address, city: e.target.value});
                  setRatesLoaded(false);
                }}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={address.state}
                onChange={(e) => {
                  setAddress({...address, state: e.target.value});
                  setRatesLoaded(false);
                }}
                placeholder="State"
              />
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input
                id="zip"
                value={address.postalCode}
                onChange={(e) => {
                  setAddress({...address, postalCode: e.target.value});
                  setRatesLoaded(false);
                }}
                placeholder="12345"
              />
            </div>
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
                onChange={(e) => {
                  setDimensions({...dimensions, weight: parseFloat(e.target.value) || 0});
                  setRatesLoaded(false);
                }}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Shipping Service
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!canGetRates ? (
            <p className="text-gray-500 text-center py-8">
              Please fill in the address and package weight to see shipping options.
            </p>
          ) : !ratesLoaded ? (
            <div className="text-center py-8">
              <Button onClick={handleGetRates} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Get Shipping Rates
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {services.map((service) => (
                <div
                  key={service.code}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedService?.code === service.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedService(service)}
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
          )}
          
          {selectedService && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCreateLabel}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create Shipping Label - ${selectedService.estimatedCost.toFixed(2)}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingFormEnhanced;