import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer } from '@/hooks/usePrinters';

interface PrinterEditDialogProps {
  printer: Printer | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (printerId: string, updates: Partial<Printer>) => void;
}

const PrinterEditDialog: React.FC<PrinterEditDialogProps> = ({
  printer,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    display_name: '',
    printer_type: 'roll' as 'roll' | 'flatbed' | 'both'
  });

  useEffect(() => {
    if (printer) {
      let printerType: 'roll' | 'flatbed' | 'both' = 'roll';
      if (printer.is_roll && printer.is_flatbed) {
        printerType = 'both';
      } else if (printer.is_flatbed) {
        printerType = 'flatbed';
      } else {
        printerType = 'roll';
      }
      
      setFormData({
        display_name: printer.display_name,
        printer_type: printerType
      });
    }
  }, [printer]);

  const handleSave = () => {
    if (printer) {
      const updates = {
        display_name: formData.display_name,
        is_roll: formData.printer_type === 'roll' || formData.printer_type === 'both',
        is_flatbed: formData.printer_type === 'flatbed' || formData.printer_type === 'both'
      };
      onSave(printer.id, updates);
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
    if (printer) {
      let printerType: 'roll' | 'flatbed' | 'both' = 'roll';
      if (printer.is_roll && printer.is_flatbed) {
        printerType = 'both';
      } else if (printer.is_flatbed) {
        printerType = 'flatbed';
      } else {
        printerType = 'roll';
      }
      
      setFormData({
        display_name: printer.display_name,
        printer_type: printerType
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Printer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="Enter printer display name"
            />
          </div>
          
          <div>
            <Label htmlFor="printer_type">Printer Type</Label>
            <Select
              value={formData.printer_type}
              onValueChange={(value: 'roll' | 'flatbed' | 'both') => 
                setFormData(prev => ({ ...prev, printer_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select printer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roll">Roll</SelectItem>
                <SelectItem value="flatbed">Flatbed</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrinterEditDialog;