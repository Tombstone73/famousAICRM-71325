import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Part {
  id: string;
  name: string;
  unitType: 'inch' | 'each' | 'sq_ft' | 'linear_ft';
  defaultPrice: number;
  category: string;
  usageCount: number;
  bulkPricing?: BulkPricingTier[];
}

interface BulkPricingTier {
  minQuantity: number;
  price: number;
}

interface PartsLibraryManagerProps {
  onPricingUpdate: (updateData: any) => void;
}

export const PartsLibraryManager: React.FC<PartsLibraryManagerProps> = ({ onPricingUpdate }) => {
  const [parts, setParts] = useState<Part[]>([
    {
      id: '1',
      name: 'Grommets',
      unitType: 'each',
      defaultPrice: 0.50,
      category: 'finishing',
      usageCount: 25,
      bulkPricing: [
        { minQuantity: 50, price: 0.45 },
        { minQuantity: 100, price: 0.40 }
      ]
    },
    {
      id: '2',
      name: 'Hem Tape',
      unitType: 'linear_ft',
      defaultPrice: 0.25,
      category: 'finishing',
      usageCount: 18
    },
    {
      id: '3',
      name: 'Pole Pocket Material',
      unitType: 'linear_ft',
      defaultPrice: 0.75,
      category: 'finishing',
      usageCount: 12
    }
  ]);
  
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    unitType: 'each' as const,
    defaultPrice: 0,
    category: ''
  });
  const [bulkTiers, setBulkTiers] = useState<BulkPricingTier[]>([]);

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    setFormData({
      name: part.name,
      unitType: part.unitType,
      defaultPrice: part.defaultPrice,
      category: part.category
    });
    setBulkTiers(part.bulkPricing || []);
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingPart(null);
    setFormData({ name: '', unitType: 'each', defaultPrice: 0, category: '' });
    setBulkTiers([]);
    setShowDialog(true);
  };

  const handleSave = () => {
    if (editingPart) {
      const updatedParts = parts.map(p => 
        p.id === editingPart.id 
          ? { ...p, ...formData, bulkPricing: bulkTiers }
          : p
      );
      setParts(updatedParts);
      
      // Trigger pricing update check
      onPricingUpdate({
        type: 'part_update',
        partId: editingPart.id,
        oldPrice: editingPart.defaultPrice,
        newPrice: formData.defaultPrice
      });
    } else {
      const newPart: Part = {
        id: Date.now().toString(),
        ...formData,
        usageCount: 0,
        bulkPricing: bulkTiers.length > 0 ? bulkTiers : undefined
      };
      setParts([...parts, newPart]);
    }
    
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    const part = parts.find(p => p.id === id);
    if (part && part.usageCount > 0) {
      if (!confirm(`This part is used by ${part.usageCount} products. Are you sure you want to delete it?`)) {
        return;
      }
    }
    setParts(parts.filter(p => p.id !== id));
  };

  const addBulkTier = () => {
    setBulkTiers([...bulkTiers, { minQuantity: 0, price: 0 }]);
  };

  const updateBulkTier = (index: number, field: keyof BulkPricingTier, value: number) => {
    const updated = [...bulkTiers];
    updated[index] = { ...updated[index], [field]: value };
    setBulkTiers(updated);
  };

  const removeBulkTier = (index: number) => {
    setBulkTiers(bulkTiers.filter((_, i) => i !== index));
  };

  const formatUnitType = (unitType: string) => {
    return unitType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Parts Library</h3>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Part
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Name</TableHead>
                <TableHead>Unit Type</TableHead>
                <TableHead>Default Price</TableHead>
                <TableHead>Bulk Pricing</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{part.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {part.category}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatUnitType(part.unitType)}</TableCell>
                  <TableCell>${part.defaultPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    {part.bulkPricing && part.bulkPricing.length > 0 ? (
                      <div className="space-y-1">
                        {part.bulkPricing.map((tier, index) => (
                          <div key={index} className="text-xs">
                            {tier.minQuantity}+ = ${tier.price.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={part.usageCount > 0 ? 'default' : 'secondary'}>
                      {part.usageCount} products
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(part)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(part.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPart ? 'Edit Part' : 'Add New Part'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Part Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Grommets, Hem Tape"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g., finishing, hardware"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Unit Type</Label>
                <Select
                  value={formData.unitType}
                  onValueChange={(value: any) => setFormData({...formData, unitType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="each">Each</SelectItem>
                    <SelectItem value="inch">Inch</SelectItem>
                    <SelectItem value="linear_ft">Linear Foot</SelectItem>
                    <SelectItem value="sq_ft">Square Foot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Default Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.defaultPrice}
                  onChange={(e) => setFormData({...formData, defaultPrice: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Bulk Pricing Tiers (Optional)</Label>
                <Button size="sm" variant="outline" onClick={addBulkTier}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Tier
                </Button>
              </div>
              
              {bulkTiers.map((tier, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    type="number"
                    placeholder="Min Qty"
                    value={tier.minQuantity}
                    onChange={(e) => updateBulkTier(index, 'minQuantity', parseInt(e.target.value) || 0)}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">+</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={tier.price}
                    onChange={(e) => updateBulkTier(index, 'price', parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                  <Button size="sm" variant="outline" onClick={() => removeBulkTier(index)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingPart ? 'Update' : 'Add'} Part
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};