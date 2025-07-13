import { useState } from 'react';
import { ShippingAddress, ShippingDimensions, ShippingService, ShippingLabel } from '@/types/shipping';
import { useToast } from '@/hooks/use-toast';

interface UseShippingReturn {
  loading: boolean;
  getRates: (address: ShippingAddress, dimensions: ShippingDimensions) => Promise<ShippingService[]>;
  createLabel: (orderId: string, address: ShippingAddress, dimensions: ShippingDimensions, service: ShippingService) => Promise<ShippingLabel>;
}

export const useShipping = (): UseShippingReturn => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getRates = async (address: ShippingAddress, dimensions: ShippingDimensions): Promise<ShippingService[]> => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://vdnvpolivbxtdtyaldan.supabase.co/functions/v1/21f1039f-4ca3-4dfe-b6d5-63d979df52c6',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'getRates',
            data: { address, dimensions }
          })
        }
      );

      const result = await response.json();
      if (result.success) {
        return result.rates;
      } else {
        throw new Error(result.error || 'Failed to get shipping rates');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get shipping rates. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createLabel = async (
    orderId: string, 
    address: ShippingAddress, 
    dimensions: ShippingDimensions, 
    service: ShippingService
  ): Promise<ShippingLabel> => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://vdnvpolivbxtdtyaldan.supabase.co/functions/v1/21f1039f-4ca3-4dfe-b6d5-63d979df52c6',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'createLabel',
            data: { orderId, address, dimensions, service }
          })
        }
      );

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Shipping Label Created",
          description: `Label created successfully. Tracking: ${result.label.trackingNumber}`,
        });
        return result.label;
      } else {
        throw new Error(result.error || 'Failed to create shipping label');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create shipping label. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getRates,
    createLabel
  };
};