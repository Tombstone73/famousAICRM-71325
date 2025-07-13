export interface Product {
  id: string;
  name: string;
  description?: string;
  invoice_description?: string;
  category_id?: string;
  sku?: string;
  media_type_id?: string;
  active?: boolean;
  created_at: string;
  updated_at: string;
  pricing_model_id?: string;
  automation_enabled?: boolean;
  width?: number;
  height?: number;
  // Unit and dimension fields
  unitOfMeasure?: 'inches' | 'feet' | 'mm';
  minWidth?: number;
  minHeight?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  pricingMode?: 'sqft' | 'sheet' | 'flatrate';
  standardSheetSize?: { width: number; height: number };
  image_urls?: string[];
  // Inventory fields
  inventory_enabled?: boolean;
  current_stock?: number;
  reorder_point?: number;
  // Product options
  product_options?: ProductOption[];
  // Legacy fields for backward compatibility
  category?: 'small-format' | 'flatbed' | 'roll' | 'other';
  pricing_model?: PricingModel;
  base_price?: number;
  is_active?: boolean;
  media_type?: string;
  min_stock_threshold?: number;
  lead_time?: string;
  customer_instructions?: string;
  display_order?: number;
  spot_color_detection?: boolean;
  w2p_visibility?: boolean;
  pricing_mode?: string;
  min_width?: number;
  min_height?: number;
  default_width?: number;
  default_height?: number;
  unit_of_measure?: string;
  price_per_sqft?: number;
  price_per_sheet?: number;
  minimum_charge?: number;
  rounding_increment?: number;
  use_math_ceil?: boolean;
  allow_partial_sheet_billing?: boolean;
  min_reusable_waste_area?: number;
  charge_for_reusable_waste?: boolean;
  track_reusable_cutoffs?: boolean;
  add_grommets?: boolean;
  grommet_price?: number;
  add_pole_pockets?: boolean;
  pole_pocket_price?: number;
  add_laminate?: boolean;
  laminate_price?: number;
  material_type?: string;
  print_method?: string;
  printer_eligibility?: string[];
  image_url?: string;
  formula_variables?: FormulaVariable[];
  pricing_formulas?: PricingFormula[];
}

export interface ProductCategory {
  id: string;
  name: string;
  sku_prefix: string;
  created_at: string;
  updated_at: string;
}

export interface ProductOption {
  id: string;
  product_id: string;
  name: string;
  description?: string;
  price_delta?: number;
  price_modifier?: number;
  price?: number;
  required?: boolean;
  is_required?: boolean;
  conditional_media_type_id?: string;
  is_default?: boolean;
  option_type?: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductInventory {
  id: string;
  product_id: string;
  current_stock: number;
  reorder_point: number;
  last_updated: string;
}

export interface FormulaVariable {
  id: string;
  product_id: string;
  name: string;
  type: 'numeric' | 'boolean' | 'string';
  default_value?: string;
}

export interface PricingModel {
  id: string;
  name: string;
  formula: string;
  variables?: Record<string, any>;
  unit?: string;
  created_at: string;
  updated_at: string;
}

export interface PricingFormula {
  id: string;
  name: string;
  formula: string;
  order: number;
  isActive: boolean;
}

export interface QuantityBreakpoint {
  quantity: number;
  price: number;
}

export const PRODUCT_CATEGORIES = [
  { value: 'small-format', label: 'Small Format' },
  { value: 'flatbed', label: 'Flatbed' },
  { value: 'roll', label: 'Roll' },
  { value: 'other', label: 'Other' }
] as const;

export const PRICING_TYPES = [
  { value: 'square-feet', label: 'Square Feet' },
  { value: 'linear-feet', label: 'Linear Feet' },
  { value: 'sheet-size', label: 'Sheet Size' },
  { value: 'square-inches', label: 'Square Inches' },
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'per-sheet', label: 'Per Sheet' },
  { value: 'per-item', label: 'Per Item' },
  { value: 'hybrid', label: 'Hybrid' }
] as const;

export const MEDIA_TYPES = [
  'Vinyl',
  'Paper',
  'Canvas',
  'Fabric',
  'Aluminum',
  'Coroplast',
  'Foam Board',
  'Acrylic',
  'Magnetic',
  'Static Cling'
] as const;

export const OPTION_PRICING_TYPES = [
  { value: 'flat', label: 'Flat Fee' },
  { value: 'linear_foot', label: 'Per Linear Foot' },
  { value: 'square_foot', label: 'Per Square Foot' },
  { value: 'each', label: 'Per Each' }
] as const;

export const UNIT_OPTIONS = [
  { value: 'inches', label: 'Inches (in)', shortLabel: 'in' },
  { value: 'feet', label: 'Feet (ft)', shortLabel: 'ft' },
  { value: 'mm', label: 'Millimeters (mm)', shortLabel: 'mm' }
] as const;