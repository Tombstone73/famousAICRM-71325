export interface ShippingAddress {
  name: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface ShippingDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  units: 'IN' | 'CM';
  weightUnits: 'LBS' | 'KG';
}

export interface ShippingService {
  code: string;
  name: string;
  description: string;
  estimatedCost: number;
  estimatedDays: string;
}

export interface ShippingLabel {
  id: string;
  orderId: string;
  trackingNumber: string;
  service: ShippingService;
  cost: number;
  labelUrl: string;
  createdAt: string;
}