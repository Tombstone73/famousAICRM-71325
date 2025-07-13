import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductEntryForm, ProductFormData } from './ProductEntryForm';
import { Product } from '@/types/products';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

interface ProductCloneDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductCloneDialog: React.FC<ProductCloneDialogProps> = ({
  product,
  open,
  onOpenChange
}) => {
  const { addProduct } = useProducts();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await addProduct({
        name: data.name,
        category: data.category,
        description: data.description,
        is_active: data.isActive,
        pricing_mode: data.pricingMode,
        min_width: data.minWidth,
        min_height: data.minHeight,
        default_width: data.defaultWidth,
        default_height: data.defaultHeight,
        unit_of_measure: data.unitOfMeasure,
        price_per_sqft: data.pricePerSqFt,
        price_per_sheet: data.pricePerSheet,
        minimum_charge: data.minimumCharge,
        rounding_increment: data.roundingIncrement,
        use_math_ceil: data.useMathCeil,
        allow_partial_sheet_billing: data.allowPartialSheetBilling,
        min_reusable_waste_area: data.minReusableWasteArea,
        charge_for_reusable_waste: data.chargeForReusableWaste,
        track_reusable_cutoffs: data.trackReusableCutoffs,
        add_grommets: data.addGrommets,
        grommet_price: data.grommetPrice,
        add_pole_pockets: data.addPolePockets,
        pole_pocket_price: data.polePocketPrice,
        add_laminate: data.addLaminate,
        laminate_price: data.laminatePrice,
        material_type: data.materialType,
        print_method: data.printMethod,
        printer_eligibility: data.printerEligibility
      });
      
      toast({ title: 'Product cloned successfully' });
      onOpenChange(false);
    } catch (error) {
      toast({ title: 'Error cloning product', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCloneData = (): Partial<ProductFormData> => {
    if (!product) return {};
    
    return {
      name: `${product.name} (Copy)`,
      category: product.category || '',
      description: product.description || '',
      isActive: product.is_active ?? true,
      pricingMode: (product.pricing_mode as any) || 'sqft',
      minWidth: product.min_width || 1,
      minHeight: product.min_height || 1,
      defaultWidth: product.default_width || 12,
      defaultHeight: product.default_height || 12,
      unitOfMeasure: (product.unit_of_measure as any) || 'inches',
      pricePerSqFt: product.price_per_sqft,
      pricePerSheet: product.price_per_sheet,
      minimumCharge: product.minimum_charge,
      roundingIncrement: (product.rounding_increment as any) || 1,
      useMathCeil: product.use_math_ceil || false,
      allowPartialSheetBilling: product.allow_partial_sheet_billing || false,
      minReusableWasteArea: product.min_reusable_waste_area || 432,
      chargeForReusableWaste: product.charge_for_reusable_waste || false,
      trackReusableCutoffs: product.track_reusable_cutoffs || false,
      addGrommets: product.add_grommets || false,
      grommetPrice: product.grommet_price,
      addPolePockets: product.add_pole_pockets || false,
      polePocketPrice: product.pole_pocket_price,
      addLaminate: product.add_laminate || false,
      laminatePrice: product.laminate_price,
      materialType: product.material_type || '',
      printMethod: product.print_method || '',
      printerEligibility: product.printer_eligibility || []
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Clone Product: {product?.name}</DialogTitle>
        </DialogHeader>
        {product && (
          <ProductEntryForm
            initialData={getCloneData()}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};