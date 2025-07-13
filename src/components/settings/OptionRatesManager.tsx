import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, X, Plus } from 'lucide-react';
import { useOptionRates, OptionRate } from '@/hooks/useOptionRates';
import { useToast } from '@/hooks/use-toast';

const RATE_TYPES = [
  { value: 'per_unit', label: 'Per Unit' },
  { value: 'per_sqft', label: 'Per Square Foot' },
  { value: 'per_linear_ft', label: 'Per Linear Foot' },
  { value: 'flat_fee', label: 'Flat Fee' },
  { value: 'setup_fee', label: 'Setup Fee' }
];

export const OptionRatesManager: React.FC = () => {
  const { rates, loading, updateRate, createRate } = useOptionRates();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState<Partial<OptionRate>>({});
  const [newRate, setNewRate] = useState<Omit<OptionRate, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    rate_type: 'per_unit',
    base_rate: 0,
    minimum_charge: 0,
    unit_label: '',
    is_active: true
  });

  const handleEdit = (rate: OptionRate) => {
    setEditingId(rate.id);
    setEditForm(rate);
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;
    
    try {
      await updateRate(editingId, editForm);
      setEditingId(null);
      setEditForm({});
      toast({ title: 'Success', description: 'Rate updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update rate', variant: 'destructive' });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleCreate = async () => {
    try {
      await createRate(newRate);
      setShowAddForm(false);
      setNewRate({
        name: '',
        description: '',
        rate_type: 'per_unit',
        base_rate: 0,
        minimum_charge: 0,
        unit_label: '',
        is_active: true
      });
      toast({ title: 'Success', description: 'Rate created successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create rate', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="p-4">Loading rates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Option Rates Management</h2>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Rate
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-name">Name</Label>
                <Input
                  id="new-name"
                  value={newRate.name}
                  onChange={(e) => setNewRate({ ...newRate, name: e.target.value })}
                  placeholder="e.g., grommet_rate"
                />
              </div>
              <div>
                <Label htmlFor="new-unit-label">Unit Label</Label>
                <Input
                  id="new-unit-label"
                  value={newRate.unit_label}
                  onChange={(e) => setNewRate({ ...newRate, unit_label: e.target.value })}
                  placeholder="e.g., grommet"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                value={newRate.description}
                onChange={(e) => setNewRate({ ...newRate, description: e.target.value })}
                placeholder="Description of this rate"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-rate-type">Rate Type</Label>
                <Select value={newRate.rate_type} onValueChange={(value: any) => setNewRate({ ...newRate, rate_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RATE_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-base-rate">Base Rate ($)</Label>
                <Input
                  id="new-base-rate"
                  type="number"
                  step="0.01"
                  value={newRate.base_rate}
                  onChange={(e) => setNewRate({ ...newRate, base_rate: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="new-minimum-charge">Minimum Charge ($)</Label>
                <Input
                  id="new-minimum-charge"
                  type="number"
                  step="0.01"
                  value={newRate.minimum_charge}
                  onChange={(e) => setNewRate({ ...newRate, minimum_charge: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>Create Rate</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {rates.map((rate) => (
          <Card key={rate.id}>
            <CardContent className="p-4">
              {editingId === rate.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-name">Name</Label>
                      <Input
                        id="edit-name"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-unit-label">Unit Label</Label>
                      <Input
                        id="edit-unit-label"
                        value={editForm.unit_label || ''}
                        onChange={(e) => setEditForm({ ...editForm, unit_label: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit-rate-type">Rate Type</Label>
                      <Select value={editForm.rate_type} onValueChange={(value: any) => setEditForm({ ...editForm, rate_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RATE_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-base-rate">Base Rate ($)</Label>
                      <Input
                        id="edit-base-rate"
                        type="number"
                        step="0.01"
                        value={editForm.base_rate || 0}
                        onChange={(e) => setEditForm({ ...editForm, base_rate: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-minimum-charge">Minimum Charge ($)</Label>
                      <Input
                        id="edit-minimum-charge"
                        type="number"
                        step="0.01"
                        value={editForm.minimum_charge || 0}
                        onChange={(e) => setEditForm({ ...editForm, minimum_charge: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{rate.name}</h3>
                      <Badge variant={rate.is_active ? 'default' : 'secondary'}>
                        {rate.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rate.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span><strong>Type:</strong> {RATE_TYPES.find(t => t.value === rate.rate_type)?.label}</span>
                      <span><strong>Rate:</strong> ${rate.base_rate.toFixed(2)}</span>
                      {rate.minimum_charge && rate.minimum_charge > 0 && (
                        <span><strong>Min:</strong> ${rate.minimum_charge.toFixed(2)}</span>
                      )}
                      {rate.unit_label && <span><strong>Unit:</strong> {rate.unit_label}</span>}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(rate)} className="flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};