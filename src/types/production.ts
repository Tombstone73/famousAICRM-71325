export interface ProductionJob {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  quantity: number;
  status: 'Queue' | 'Printing' | 'Finishing' | 'Quality Check' | 'Ready';
  priority: 'Normal' | 'Rush' | 'Urgent';
  dueDate: string;
  progress: number;
  estimatedTime: string;
  assignedTo?: string;
  media: string;
  printer: string;
  printType: 'roll' | 'flatbed';
  deliveryMethod: 'pickup' | 'shipping';
}

export interface Printer {
  id: string;
  name: string;
  type: 'roll' | 'flatbed';
  status: 'Available' | 'Busy' | 'Maintenance';
  printTimePerSqFt: number; // minutes per square foot
  setupTime: number; // minutes for setup
  cleanupTime: number; // minutes for cleanup
}

export interface Media {
  id: string;
  name: string;
  type: string;
  width?: number;
  length?: number;
  thickness?: number;
}

export interface PrinterSettings {
  id: string;
  printerId: string;
  mediaType: string;
  printTimePerSqFt: number;
  setupTime: number;
  cleanupTime: number;
  qualityLevel: 'draft' | 'standard' | 'high';
}