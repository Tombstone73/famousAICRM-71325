import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProducts, Product } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { ProductDetailsTab } from './ProductDetailsTab';
import { ProductOptionsTab } from './ProductOptionsTab';
import { ProductPricingTab } from './ProductPricingTab';
import { ProductTestTab } from './ProductTestTab';
import { ProductFilesTab } from './ProductFilesTab';

interface NewProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editProduct?: Product | null;
}

export const NewProductForm: React.FC<NewProductFormProps> = ({
  open,
  onOpenChange,
  editProduct
}) => {
  const { addProduct, updateProduct } = useProducts();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [saving, setSaving] = useState(false);
  
  const [product, setProduct] = useState<Partial<Product>>(() => ({
    name: '',
    sku: '',
    description: '',
    category: '',
    price: 0,
    cost: 0,
    stock_quantity: 0,
    width: 0,
    height: 0,
    unit_of_measure: 'inches',
    image_urls: [],
    low_stock_threshold: 10,
    is_active: true,
    ...editProduct
  }));
  
  const [options, setOptions] = useState<any[]>([]);

  const handleProductChange = (updates: Partial<Product>) => {
    setProduct(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (!product.name?.trim()) {
      toast({
        title: 'Error',
        description: 'Product name is required',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, product);
        toast({
          title: 'Success',
          description: 'Product updated successfully'
        });
      } else {
        await addProduct(product);
        toast({
          title: 'Success',
          description: 'Product created successfully'
        });
      }
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setProduct({
      name: '',
      sku: '',
      description: '',
      category: '',
      price: 0,
      cost: 0,
      stock_quantity: 0,
      width: 0,
      height: 0,
      unit_of_measure: 'inches',
      image_urls: [],
      low_stock_threshold: 10,
      is_active: true
    });
    setOptions([]);
    setActiveTab('details');
  };

  const handleClose = () => {
    onOpenChange(false);
    if (!editProduct) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {editProduct ? 'Edit Product' : 'Create New Product'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="flex-shrink-0">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="test">Test Formula</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="details" className="mt-0">
              <ProductDetailsTab
                product={product}
                onChange={handleProductChange}
              />
            </TabsContent>
            
            <TabsContent value="options" className="mt-0">
              <ProductOptionsTab
                productId={product.id}
                options={options}
                onChange={setOptions}
              />
            </TabsContent>
            
            <TabsContent value="pricing" className="mt-0">
              <ProductPricingTab
                product={product}
                onChange={handleProductChange}
              />
            </TabsContent>
            
            <TabsContent value="test" className="mt-0">
              <ProductTestTab
                product={product}
                options={options}
              />
            </TabsContent>
            
            <TabsContent value="files" className="mt-0">
              <ProductFilesTab
                product={product}
                onChange={handleProductChange}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};