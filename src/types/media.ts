export interface MediaType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaGroup {
  id: string;
  media_type_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaVariant {
  id: string;
  media_group_id: string;
  name: string;
  sku?: string;
  price_per_sqft?: number;
  price_per_sheet?: number;
  base_minimum_charge: number;
  inventory_quantity?: number;
  track_inventory: boolean;
  description?: string;
  client_pricing_overrides?: Record<string, number>;
  default_printer?: string;
  quickset_association?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaInventoryData {
  types: MediaType[];
  groups: MediaGroup[];
  variants: MediaVariant[];
}

export interface MediaFormData {
  name: string;
  description?: string;
}

export interface MediaVariantFormData {
  name: string;
  sku?: string;
  price_per_sqft?: number;
  price_per_sheet?: number;
  base_minimum_charge: number;
  inventory_quantity?: number;
  track_inventory: boolean;
  description?: string;
  default_printer?: string;
  quickset_association?: string;
}