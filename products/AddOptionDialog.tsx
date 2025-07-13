import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { useProductOptions } from '@/hooks/useProductOptions';
import { useToast } from '@/hooks/use-toast';

interface AddOptionDialogProps {
  onOptionAdded?: () => void;
}

export const AddOptionDialog: React.FC<AddOptionDialogProps> = ({ onOptionAdded }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dropdown' as 'dropdown' | 'toggle' | 'multiselect' | 'numeric',
    settings: {} as Record<string, any>,
    price_impact_formula: '',
    inventory_tracking: false
  });
  const [dropdownOptions, setDropdownOptions] = useState<string[]>(['']);
  
  const { addProductOption } = useProductOptions();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const settings = { ...formData.settings };
      
      if (formData.type === 'dropdown' || formData.type === 'multiselect') {
        settings.options = dropdownOptions.filter(opt => opt.trim() !== '');
      }
      
      await addProductOption({
        ...formData,
        settings
      });
      
      setOpen(false);
      setFormData({
        name: '',
        type: 'dropdown',
        settings: {},
        price_impact_formula: '',
        inventory_tracking: false
      });
      setDropdownOptions(['']);
      
      if (onOptionAdded) {
        onOptionAdded();
      }
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  const addDropdownOption = () => {
    setDropdownOptions([...dropdownOptions, '']);
  };

  const removeDropdownOption = (index: number) => {
    setDropdownOptions(dropdownOptions.filter((_, i) => i !== index));
  };

  const updateDropdownOption = (index: number, value: string) => {
    const newOptions = [...dropdownOptions];
    newOptions[index] = value;
    setDropdownOptions(newOptions);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Product Option</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Option Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Grommets, Hemming"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="type">Option Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="toggle">Toggle</SelectItem>
                <SelectItem value="multiselect">Multi-select</SelectItem>
                <SelectItem value="numeric">Numeric</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(formData.type === 'dropdown' || formData.type === 'multiselect') && (
            <div>
              <Label>Options</Label>
              <div className="space-y-2">
                {dropdownOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateDropdownOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {dropdownOptions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDropdownOption(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDropdownOption}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="formula">Price Impact Formula (Optional)</Label>
            <Input
              id="formula"
              value={formData.price_impact_formula}
              onChange={(e) => setFormData(prev => ({ ...prev, price_impact_formula: e.target.value }))}
              placeholder="e.g., subtotal * 0.10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inventory"
              checked={formData.inventory_tracking}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, inventory_tracking: !!checked }))
              }
            />
            <Label htmlFor="inventory">Track Inventory</Label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Option</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};