// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'employee' | 'admin';
}

// Company types
export interface Company {
  id: string;
  name: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  industry?: string;
  company_size?: string;
  annual_revenue?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Contact types
export interface Contact {
  id: string;
  company_id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  role?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  company?: Company;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  sku?: string;
  price?: number;
  cost?: number;
  stock_quantity?: number;
  min_stock_level?: number;
  max_stock_level?: number;
  unit?: string;
  weight?: number;
  dimensions?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Order types
export interface OrderItem {
  id?: string;
  product_id?: string;
  product_name?: string;
  quantity: number;
  unit_price?: number;
  total_price?: number;
  notes?: string;
}

export interface Order {
  id: string;
  order_number?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  order_date?: string;
  due_date?: string;
  ship_date?: string;
  delivery_date?: string;
  subtotal?: number;
  tax_amount?: number;
  shipping_cost?: number;
  total: number;
  notes?: string;
  items?: OrderItem[];
  shipping_address?: ShippingAddress;
  billing_address?: BillingAddress;
  created_at?: string;
  updated_at?: string;
}

// Parsed Order types
export interface ParsedOrderItem {
  name: string;
  media_type: string;
  quantity: number;
  price?: number;
}

export interface ParsedOrder {
  id: string;
  email_subject: string;
  email_body: string;
  customer_name: string;
  customer_email: string;
  due_date: string;
  parsed_items: ParsedOrderItem[];
  estimated_total: number;
  confidence_score: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// Address types
export interface ShippingAddress {
  name?: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface BillingAddress {
  name?: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

// Invoice types
export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  order_id?: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_rate?: number;
  tax_amount: number;
  total: number;
  notes?: string;
  items: InvoiceItem[];
  billing_address?: BillingAddress;
  created_at?: string;
  updated_at?: string;
}

// Settings types
export interface SystemSettings {
  id?: string;
  company_name?: string;
  company_logo?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  tax_rate?: number;
  currency?: string;
  date_format?: string;
  time_zone?: string;
  order_number_prefix?: string;
  invoice_number_prefix?: string;
  default_payment_terms?: number;
  created_at?: string;
  updated_at?: string;
}

// Media types
export interface MediaType {
  id: string;
  name: string;
  category: string;
  width?: number;
  height?: number;
  thickness?: number;
  weight_per_sqft?: number;
  cost_per_sqft?: number;
  stock_quantity?: number;
  min_stock_level?: number;
  unit: string;
  supplier?: string;
  notes?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Production types
export interface ProductionJob {
  id: string;
  order_id: string;
  order_number?: string;
  customer_name?: string;
  product_name?: string;
  quantity: number;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  printer_id?: string;
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Common utility types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}