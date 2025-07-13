import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductFormData } from './ProductEntryForm';

interface AutomationSectionProps {
  data: ProductFormData;
  onChange: (updates: Partial<ProductFormData>) => void;
}

const printMethods = [
  'UV Flatbed',
  'EcoSolvent Roll',
  'Latex Roll',
  'Dye Sublimation',
  'Digital Cut Vinyl',
  'Screen Print'
];

const availablePrinters = [
  'Jetson UV Flatbed',
  'Canon Colorado',
  'HP Latex 570',
  'Roland VersaCAMM',
  'Mimaki CJV300',
  'Epson SureColor S60'
];

export const AutomationSection: React.FC<AutomationSectionProps> = ({ data, onChange }) => {
  const handlePrinterToggle = (printer: string, checked: boolean) => {
    const updatedPrinters = checked
      ? [...data.printerEligibility, printer]
      : data.printerEligibility.filter(p => p !== printer);
    onChange({ printerEligibility: updatedPrinters });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation & Routing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="materialType">Associated Material Type</Label>
          <Input
            id="materialType"
            value={data.materialType}
            onChange={(e) => onChange({ materialType: e.target.value })}
            placeholder="e.g., Coroplast, Vinyl, Canvas"
          />
        </div>
        
        <div>
          <Label htmlFor="printMethod">Print Method</Label>
          <Select value={data.printMethod} onValueChange={(value) => onChange({ printMethod: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select print method" />
            </SelectTrigger>
            <SelectContent>
              {printMethods.map((method) => (
                <SelectItem key={method} value={method}>{method}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Printer Eligibility</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availablePrinters.map((printer) => (
              <div key={printer} className="flex items-center space-x-2">
                <Checkbox
                  id={printer}
                  checked={data.printerEligibility.includes(printer)}
                  onCheckedChange={(checked) => handlePrinterToggle(printer, !!checked)}
                />
                <Label htmlFor={printer} className="text-sm">{printer}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};