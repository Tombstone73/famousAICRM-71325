import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Truck } from 'lucide-react';

interface ShippingRate {
  service: string;
  cost: string;
  deliveryTime: string;
  serviceCode: string;
}

interface ShippingEstimateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  shippingAddress: any;
  onSelectRate: (rate: ShippingRate) => void;
}

export const ShippingEstimateDialog: React.FC<ShippingEstimateDialogProps> = ({
  open,
  onOpenChange,
  orderId,
  shippingAddress,
  onSelectRate
}) => {
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '', weight: '' });
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [creatingLabel, setCreatingLabel] = useState(false);

  const getRates = async () => {
    if (!dimensions.length || !dimensions.width || !dimensions.height || !dimensions.weight) {
      alert('Please fill in all dimensions and weight');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://zeawvnnkvyicyokpuvkk.supabase.co/functions/v1/49e70fb1-39eb-49c9-9cec-0d4e56b52a24', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getRates',
          shipTo: shippingAddress,
          package: {
            length: parseFloat(dimensions.length),
            width: parseFloat(dimensions.width),
            height: parseFloat(dimensions.height),
            weight: parseFloat(dimensions.weight)
          }
        })
      });
      
      const data = await response.json();
      if (data.rates) {
        setRates(data.rates);
      }
    } catch (error) {
      console.error('Error getting rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLabel = async () => {
    if (!selectedRate) return;
    
    setCreatingLabel(true);
    try {
      const response = await fetch('https://zeawvnnkvyicyokpuvkk.supabase.co/functions/v1/49e70fb1-39eb-49c9-9cec-0d4e56b52a24', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createLabel',
          shipTo: shippingAddress,
          package: {
            length: parseFloat(dimensions.length),
            width: parseFloat(dimensions.width),
            height: parseFloat(dimensions.height),
            weight: parseFloat(dimensions.weight)
          },
          serviceCode: selectedRate.serviceCode
        })
      });
      
      const data = await response.json();
      if (data.success) {
        onSelectRate(selectedRate);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error creating label:', error);
    } finally {
      setCreatingLabel(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shipping Estimate
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Package Dimensions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Length (in)</Label>
                  <Input
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => setDimensions(prev => ({ ...prev, length: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Width (in)</Label>
                  <Input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions(prev => ({ ...prev, width: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Height (in)</Label>
                  <Input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => setDimensions(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Weight (lbs)</Label>
                  <Input
                    type="number"
                    value={dimensions.weight}
                    onChange={(e) => setDimensions(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
              </div>
              
              <Button onClick={getRates} disabled={loading} className="mt-4">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Get Shipping Rates
              </Button>
            </CardContent>
          </Card>

          {rates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Available Shipping Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rates.map((rate, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRate?.serviceCode === rate.serviceCode
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRate(rate)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{rate.service}</h4>
                        <p className="text-sm text-gray-600">{rate.deliveryTime}</p>
                      </div>
                      <Badge variant="outline" className="text-lg font-semibold">
                        ${rate.cost}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {selectedRate && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={createLabel} disabled={creatingLabel}>
                {creatingLabel ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Shipping Label
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};